#include <SPI.h>
#include <MFRC522.h>

// The RC522's SDA pin is used as the SPI chip-select pin.
const byte SS_PIN = 10;
const byte RST_PIN = 9;

// Create the MFRC522 reader using its chip-select and reset pins.
MFRC522 reader(SS_PIN, RST_PIN);

void setup() {
  // Start Serial so the UID can be viewed in the Serial Monitor.
  Serial.begin(115200);

  // Start the SPI connection used to communicate with the RC522.
  SPI.begin();

  // Initialize the RC522 reader.
  reader.PCD_Init();

  Serial.println("RC522 ready - tap a card");
}

void loop() {
  // Wait until a new card is placed near the reader.
  if (!reader.PICC_IsNewCardPresent()) {
    return;
  }

  // Read the card's UID. Try again on the next loop if the read fails.
  if (!reader.PICC_ReadCardSerial()) {
    return;
  }

  // Print every UID byte as two hexadecimal digits.
  // The UID length depends on the card; it is not always four bytes.
  Serial.print("Card UID: ");
  for (byte index = 0; index < reader.uid.size; index++) {
    if (reader.uid.uidByte[index] < 0x10) {
      Serial.print("0");
    }
    Serial.print(reader.uid.uidByte[index], HEX);
    if (index < reader.uid.size - 1) {
      Serial.print(" ");
    }
  }
  Serial.println();

  // Finish this card session so the reader is ready for the next tap.
  reader.PICC_HaltA();
  reader.PCD_StopCrypto1();
}
