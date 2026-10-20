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

This is an example for a card with a 4-byte UID. Other cards may have a different UID length.

---

## 2. File to Edit

Only edit this sketch (stay in `/hardware/`):

```text
hardware/tap_in_scanner/tap_in_scanner.ino
```

Do **not** push to `main`. Stay on `branch-hardware`.

---

## 3. Step-by-Step Tasks

Use this as a checklist. Check off software implementation items when the code is present, and check off physical setup and test items only after completing them on real hardware.

### A. Arduino IDE and library setup

- [ ] Install/select the **Arduino UNO R4 WiFi** board package in Arduino IDE's Boards Manager
- [ ] In Arduino IDE: **Sketch → Include Library → Manage Libraries…**
- [ ] Install **MFRC522** (by GithubCommunity / miguelbalboa)
- [ ] Select **Arduino UNO R4 WiFi** and the board's connected port in the IDE

### B. Sketch implementation

The requested Week 1 code is present in `hardware/tap_in_scanner/tap_in_scanner.ino`. These checks confirm the implementation is in the sketch; they do not replace compiling or testing it.

- [x] Include `SPI.h` and `MFRC522.h`; define `SS_PIN` (10) and `RST_PIN` (9) and create the reader
- [x] In `setup()`, start Serial at **115200**, call `SPI.begin()` and `PCD_Init()`, and print a ready message
- [x] In `loop()`, check for a new card and return if the UID read fails
- [x] Print each UID byte in hex with two digits; UID length can vary by card
- [x] Halt the PICC and stop Crypto1 after printing the UID

### C. Physical wiring and verification

- [ ] Connect RC522 **3.3V** and **GND** to the UNO R4 WiFi (**do not use 5V** for RC522 VCC)
- [ ] Wire the RC522 SPI pins to the UNO R4 WiFi:
  - [ ] **SDA / SS** → **D10**
  - [ ] **SCK** → **D13**
  - [ ] **MOSI** → **D11**
  - [ ] **MISO** → **D12**
  - [ ] **RST** → **D9**
- [ ] Double-check every connection before plugging USB in
- [ ] Compile the sketch in Arduino IDE for the selected UNO R4 WiFi
- [ ] Upload the sketch; open Serial Monitor at **115200** and confirm the ready message appears
- [ ] Tap a card and confirm its UID prints as space-separated, two-digit hex bytes
- [ ] Remove the card from the reader, then tap it again and confirm another UID prints

---

## 4. AI Prompt to Use (GitHub Copilot)

Copy everything in the box below into Copilot Chat. Keep the `@` tags so Copilot follows team rules.

```text
@docs/AI_CODING_SKILLS.md @docs/progress/hardware.md @hardware/tap_in_scanner/tap_in_scanner.ino

I am on the branch hardware. Replace the placeholder in tap_in_scanner.ino with Arduino C++ for an Arduino UNO R4 WiFi + MFRC522 (RC522) RFID reader.

Requirements:
1. Use SPI + MFRC522 library (SS_PIN = 10, RST_PIN = 9).
2. In setup(): Serial at 115200, SPI.begin(), PCD_Init(), and a ready message.
3. In loop(): detect a new card, read its UID, print every UID byte as two-digit hex to Serial Monitor, then halt the PICC and stop crypto. UID lengths can vary by card.
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

---

## 6. Extra AI-Suggested Improvements

These additions were suggested by AI after reviewing the Week 1 sketch and plan, then incorporated to make the checklist more accurate and easier to use:

- **UID length:** The 4-byte output above is an example, not a requirement for every card. The sketch prints each byte reported by the MFRC522, and the checklist and Copilot prompt now say so.
- **Remove the card between reads:** After a successful read, remove the card before tapping again. A real-card repeat-read check is included in the physical verification checklist.
- **Board setup and compile check:** Install/select the UNO R4 WiFi board package and port, and compile the sketch before treating hardware verification as complete.
- **Separate implementation from physical testing:** Sketch implementation items are checked because the code is present. Library installation, wiring, compilation, upload, and card-read checks remain unchecked until someone performs them.
- **Respect shared-document ownership:** This plan is a shared project document. Its updates require the plan owner's approval; that approval was provided for this update.