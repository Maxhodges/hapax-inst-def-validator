export const validateDrumLanes = (lines) => {
  const startIdx = lines.findIndex((line) => line.trim() === "[DRUMLANES]");
  const endIdx = lines.findIndex((line) => line.trim() === "[/DRUMLANES]");

  if (startIdx === -1 || endIdx === -1) {
    return { valid: true }; // Optional section
  }

  const drumLines = lines
    .slice(startIdx + 1, endIdx)
    .filter((line) => line.trim() !== ""); // Remove empty lines
  const usedRows = new Set();

  for (const line of drumLines) {
    const parts = line.split("#")[0].trim().split(" ");
    const rowSpec = parts[0];

    if (!rowSpec || !rowSpec.includes(":")) {
      return {
        valid: false,
        error: `Invalid or missing drum lane specification: ${line}`,
      };
    }

    const [row, trig, chan, note] = rowSpec.split(":");

    // Validate row number and uniqueness
    if (isNaN(row) || row < 1 || row > 8) {
      return {
        valid: false,
        error: `Invalid row number in drum lane: ${line}`,
      };
    }
    if (usedRows.has(row)) {
      return {
        valid: false,
        error: `Duplicate row number ${row} in drum lanes`,
      };
    }
    usedRows.add(row);

    // Validate trigger
    if (trig !== "NULL" && (isNaN(trig) || trig < 0 || trig > 127)) {
      return {
        valid: false,
        error: `Invalid trigger value in drum lane: ${line}`,
      };
    }

    // Validate channel
    if (chan !== "NULL") {
      if (
        chan.startsWith("G") ||
        chan.startsWith("CV") ||
        chan.startsWith("CVG")
      ) {
        const num = chan.replace(/[^0-9]/g, "");
        if (isNaN(num) || num < 1 || num > 4) {
          return {
            valid: false,
            error: `Invalid special channel in drum lane: ${line}`,
          };
        }
      } else if (isNaN(chan) || chan < 1 || chan > 16) {
        return {
          valid: false,
          error: `Invalid MIDI channel in drum lane: ${line}`,
        };
      }
    }

    // Validate note number
    if (note !== "NULL" && (isNaN(note) || note < 0 || note > 127)) {
      return {
        valid: false,
        error: `Invalid note number in drum lane: ${line}`,
      };
    }

    // Validate name if present
    if (parts[1]) {
      const name = parts.slice(1).join(" ");
      const validNameRegex = /^[a-zA-Z0-9\s_\-+]+$/;
      if (!validNameRegex.test(name)) {
        return {
          valid: false,
          error: `Invalid characters in drum lane name: ${name}`,
        };
      }
    }
  }

  return { valid: true };
};
