/*
 * Tap-In scanner — Arduino UNO R4 WiFi + RC522 + OLED
 * Owner: Kathleen / hardware path (main-temp OneCard work)
 *
 * WHAT THIS DOES
 * --------------
 * Reads a UGA OneCard (or any ISO14443-A tag) UID from the RC522,
 * prints continuous uppercase hex to Serial, shows OLED feedback,
 * and POSTs JSON { "uid": "<HEX>" } to backend/receive_scan.py.
 *
 * Captured OneCard examples (7-byte / 14 hex chars):
 *   04692602CD1590
 *   04B1BBDAAF1890
 *
 * SETUP (hotspot live check-in)
 * -----------------------------
 * 1. Copy arduino_secrets.h.example → arduino_secrets.h.
 * 2. Put hotspot SSID/password in secrets. Set TAP_IN_HOST to the LAPTOP's
 *    hotspot/LAN IP (e.g. 192.168.43.10) — NOT 127.0.0.1.
 * 3. Libraries: MFRC522, Adafruit GFX, Adafruit SSD1306, WiFiS3 (R4 built-in).
 * 4. On the laptop: cd backend && python3 receive_scan.py  (binds 0.0.0.0:8787).
 * 5. USB = power + Serial Monitor (9600). Data path is WiFi POST /scan.
 * 6. Activate one event in Admin, then tap a bound OneCard.
 *
 * See docs/HARDWARE_TAP_PATH.md for the full attendance path.
 */

#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <WiFiS3.h>
#include "arduino_secrets.h"

// RFID Pins (RC522)
#define RST_PIN 9
#define SS_PIN 10
MFRC522 mfrc522(SS_PIN, RST_PIN);

// OLED (SSD1306 128x64, I2C 0x3C)
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

WiFiClient client;

void showReadyScreen(const char *line1) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 10);
  display.println(line1);
  display.println("");
  display.println("Tap UGA OneCard...");
  display.display();
}

void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for USB serial on native USB boards
  }

  SPI.begin();
  mfrc522.PCD_Init();
  // Stronger field helps OneCards in wallets / cases.
  mfrc522.PCD_SetAntennaGain(mfrc522.RxGain_max);

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED allocation failed. Check wiring.");
    for (;;) {
      ;
    }
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 10);
  display.println("Connecting to");
  display.println(SECRET_WIFI_SSID);
  display.display();

  Serial.print("Connecting to WiFi: ");
  Serial.println(SECRET_WIFI_SSID);
  WiFi.begin(SECRET_WIFI_SSID, SECRET_WIFI_PASS);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.print("Tap-In host: ");
  Serial.print(TAP_IN_HOST);
  Serial.print(":");
  Serial.println(TAP_IN_PORT);

  showReadyScreen("System Ready.");
}

void loop() {
  if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  // Continuous uppercase hex — matches frontend normalize + handle_rfid_scan.
  String scannedID = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if (mfrc522.uid.uidByte[i] < 0x10) {
      scannedID += "0";
    }
    scannedID += String(mfrc522.uid.uidByte[i], HEX);
  }
  scannedID.toUpperCase();

  Serial.print("UID Captured: ");
  Serial.println(scannedID);

  // Instant OLED feedback before the network call.
  display.clearDisplay();
  display.setTextSize(2);
  display.setCursor(15, 15);
  display.println("RECORDED");
  display.setTextSize(1);
  display.setCursor(0, 45);
  display.print("ID: ");
  display.println(scannedID);
  display.display();

  sendDataToServer(scannedID);

  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
  delay(2000);

  showReadyScreen("Ready for next ID...");
}

void sendDataToServer(String uid) {
  if (!client.connect(TAP_IN_HOST, TAP_IN_PORT)) {
    Serial.println("Server connection failed.");
    return;
  }

  String postData = "{\"uid\":\"" + uid + "\"}";

  client.print("POST ");
  client.print(TAP_IN_PATH);
  client.println(" HTTP/1.1");
  client.print("Host: ");
  client.println(TAP_IN_HOST);
  client.println("Content-Type: application/json");
  client.print("Content-Length: ");
  client.println(postData.length());
  client.println("Connection: close");
  client.println();
  client.print(postData);

  Serial.println("JSON uid posted to /scan.");
  client.stop();
}
