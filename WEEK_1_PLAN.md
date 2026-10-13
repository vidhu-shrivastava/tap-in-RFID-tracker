# Week 1 Plan — Hardware (Kathleen)

**Branch:** `branch-hardware`  
**Owner:** Kathleen (CompE)  
**Vibe:** One clear win — get a card tap to print a UID.

---

## 1. The Goal

Get the **Arduino UNO R4 WiFi** to read an RFID card using the **RC522** module and print the **hex UID** to the Serial Monitor.

When a card taps the reader, you should see something like:

```text
Card UID: A1 B2 C3 D4
```

---

## 2. File to Edit

Only edit this sketch (stay in `/hardware/`):

```text
hardware/tap_in_scanner/tap_in_scanner.ino
```

Do **not** push to `main`. Stay on `branch-hardware`.

---

## 3. Step-by-Step Tasks

Use this as a checklist. Check items off as you go.

### Wiring (SPI)

- [ ] Power the RC522: **3.3V** and **GND** to the UNO R4 WiFi (do **not** use 5V for VCC on the RC522)
- [ ] Wire SPI pins (typical RC522 → UNO R4 WiFi mapping):
  - [ ] **SDA / SS** → **D10**
  - [ ] **SCK** → **D13**
  - [ ] **MOSI** → **D11**
  - [ ] **MISO** → **D12**
  - [ ] **RST** → **D9**
- [ ] Double-check every connection before plugging USB in

### Library

- [ ] In Arduino IDE: **Sketch → Include Library → Manage Libraries…**
- [ ] Install **MFRC522** (by GithubCommunity / miguelbalboa)
- [ ] `#include <SPI.h>` and `#include <MFRC522.h>` in the sketch
- [ ] Define `SS_PIN` (10) and `RST_PIN` (9), then create an `MFRC522` instance

### `setup()`

- [ ] `Serial.begin(115200);`
- [ ] `SPI.begin();`
- [ ] `mfrc522.PCD_Init();`
- [ ] Print a short “RC522 ready — tap a card” message so you know Serial is working

### `loop()` — detect card & print UID

- [ ] If no new card (`!PICC_IsNewCardPresent()`), return
- [ ] If read fails (`!PICC_ReadCardSerial()`), return
- [ ] Print the **4-byte UID** in **hex** (space-separated is fine)
- [ ] Halt the PICC / stop crypto when done so the next tap works cleanly
- [ ] Upload, open Serial Monitor at **115200**, tap a card, confirm the UID prints

---

## 4. AI Prompt to Use (GitHub Copilot)

Copy everything in the box below into Copilot Chat. Keep the `@` tags so Copilot follows team rules.

```text
@docs/AI_CODING_SKILLS.md @docs/progress/hardware.md @hardware/tap_in_scanner/tap_in_scanner.ino

I am on the branch hardware. Replace the placeholder in tap_in_scanner.ino with Arduino C++ for an Arduino UNO R4 WiFi + MFRC522 (RC522) RFID reader.

Requirements:
1. Use SPI + MFRC522 library (SS_PIN = 10, RST_PIN = 9).
2. In setup(): Serial at 115200, SPI.begin(), PCD_Init(), and a ready message.
3. In loop(): detect a new card, read the serial, print the UID as 4 hex bytes to Serial Monitor, then halt the PICC so the next tap works.
4. Keep code simple, heavily commented, and beginner-friendly — no WiFi, OLED, or buzzer yet (Week 1 only).
5. After writing the code, remind me what to log in docs/progress/hardware.md.

Follow @docs/AI_CODING_SKILLS.md. Do not edit files outside /hardware/ except my progress log.
```

---

## 5. End of Session

Before you close the laptop, ship your work and leave a trail.

### Git (in order)

```bash
git branch
git status
git add .
git commit -m "Week 1: RC522 UID read + Serial print"
git push origin branch-hardware
```

Confirm `*` is on **`branch-hardware`** before you push. Never push to `main`.

### Progress log

- [ ] Append a timestamped entry in **`docs/progress/hardware.md`** (not the index — see `@docs/PROGRESS_TRACKER.md` for which file is yours)
- [ ] Tag Copilot with `@docs/progress/hardware.md` if you ask it to draft the log bullet
- [ ] Include: files touched, what you built, and a one-line “how it works”

Example log bullet:

```markdown
- **2026-10-13 18:00** — Files: `hardware/tap_in_scanner/tap_in_scanner.ino`.
  Built: RC522 UID read + hex print to Serial. How it works: SPI + MFRC522 poll in `loop()`, prints 4-byte UID.
```

---

**Week 1 success = one reliable UID print.** Everything else (OLED, buzzer, WiFi) can wait. Tap a card. See hex. Commit. Done.

Make sure to check off boxes in this WEEK_1_PLAN File once they are complete.