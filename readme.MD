# Hapax Definition File Validator

A Svelte-based web app for validating Hapax instrument definition files.

Try it now at [hapax-validator.maxhodges.com](https://hapax-validator.maxhodges.com).

## Features

- Upload `.txt` files or paste text directly for validation.
- Provides detailed validation results for:
  - Version
  - Track Name
  - Port Configurations (Outport/Inport)
  - Channels
  - Drum Lanes
  - CCs and NRPNs
- Copy validation results to the clipboard.
- Dark mode enabled by default.

# Hapax Instrument Definition File Validator

## Overview

The Hapax Instrument Definition File Validator helps ensure your instrument definition files are correctly formatted. This guide outlines common mistakes and how to avoid them.

---

## Common Mistakes to Avoid

### 1. VERSION Declaration

- **Issue**: `VERSION` is commented out or missing.
- **Fix**: Ensure the `VERSION` line is present and not commented. The line must look like this:

  ```
  VERSION 1
  ```

---

### 2. DRUMLANES Format

- **Issue**: Drum lanes are incomplete or not properly formatted.
- **Fix**: Each drum lane must be a single line with all fields: `ROW:TRIG:CHAN:NOTENUMBER NAME`.

  ```
  [DRUMLANES]
  1:NULL:7:36 Kick
  2:NULL:7:38 Snare
  [/DRUMLANES]
  ```

---

### 3. Invalid Characters

- **Issue**: Names contain unsupported characters.
- **Fix**: Use only alphanumeric characters, spaces, `_`, `-`, `+`, `.`, `/`, `(`, `)`, `[`, `]`.

  ```
  Valid: PORTA_ON_OFF
  Invalid: PORTA ON/OFF
  ```

---

### 4. Empty or Unnecessary Sections

- **Issue**: Empty sections like `[CC]` or `[NRPN]` are left in the file.
- **Fix**: Remove sections if not used.

  ```
  [CC]
  [/CC]
  ```

  Becomes:
  _Omit the entire section._

---

### 5. Commenting Out Lines

- **Issue**: Important lines are accidentally commented out with `#`.
- **Fix**: Only use `#` for comments, and ensure required lines (e.g., `VERSION`, `TRACKNAME`) are not preceded by `#`.

---

### 6. Missing or Invalid NOTENUMBER

- **Issue**: `NOTENUMBER` is missing or not within the valid range (0–127).
- **Fix**: Ensure all drum lanes include a valid `NOTENUMBER`.

  ```
  Valid: 1:NULL:7:36 Kick
  Invalid: 1:NULL:7:NULL Kick
  ```

---

## Quick Validation Checklist

Before saving your file, verify:

1. `VERSION` is present and not commented out.
2. `[DRUMLANES]` are formatted as `ROW:TRIG:CHAN:NOTENUMBER NAME`.
3. Names use valid characters.
4. Remove unused sections like `[CC]`, `[NRPN]`, etc.
5. No required lines are commented out.

---

## Example of a Valid File

```
VERSION 1

TRACKNAME TR-909

TYPE DRUM

OUTPORT A
OUTCHAN 7
INPORT NULL
INCHAN NULL
MAXRATE NULL

[DRUMLANES]
1:NULL:7:36 Kick
2:NULL:7:38 Snare
3:NULL:7:39 Clap
4:NULL:7:40 Rim
5:NULL:7:41 Chat
6:NULL:7:42 Ohat
7:NULL:7:43 Ride
8:NULL:7:44 Crash
[/DRUMLANES]

[COMMENT]
TR-909 instrument definition file
[/COMMENT]
```

---

This guide will help you avoid common mistakes and ensure your instrument definition files are correctly validated. Let us know if you have any questions or feedback!

## Disclaimer

This tool is provided as-is, with no guarantees about the correctness or completeness of its validation results. Use it at your own discretion, and always double-check critical configurations manually.

## Questions or Feedback?

Have questions, suggestions, or feedback? Visit the [GitHub repository](https://github.com/Maxhodges/hapax-inst-def-validator) to open an issue or contribute.

## Contributing

1. Fork the repo.
2. Create a feature branch:

   ```bash
   git checkout -b feature-name
