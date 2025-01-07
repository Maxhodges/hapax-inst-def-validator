export const validatePCs = (lines) => {
  const startIdx = lines.findIndex((line) => line.trim() === "[PC]");
  const endIdx = lines.findIndex((line) => line.trim() === "[/PC]");

  if (startIdx === -1 || endIdx === -1) {
    return { valid: true }; // Optional section
  }

  const pcLines = lines
    .slice(startIdx + 1, endIdx)
    .filter((line) => line.trim() !== "" && !line.trim().startsWith("#"));

  for (const line of pcLines) {
    const parts = line.split("#")[0].trim().split(" ");
    const [pcSpec] = parts;

    if (pcSpec.includes(":")) {
      // Extended PC format (PC:MSB:LSB)
      const [pc, msb, lsb] = pcSpec.split(":");

      // Validate PC number
      if (isNaN(pc) || pc < 1 || pc > 128) {
        return {
          valid: false,
          error: `Invalid PC number: ${pc}. Must be between 1-128`,
        };
      }

      // Validate MSB/LSB if present
      if (msb !== "NULL" && (isNaN(msb) || msb < 0 || msb > 127)) {
        return { valid: false, error: `Invalid MSB value: ${msb}` };
      }
      if (lsb !== "NULL" && (isNaN(lsb) || lsb < 0 || lsb > 127)) {
        return { valid: false, error: `Invalid LSB value: ${lsb}` };
      }
    } else {
      // Simple PC format
      const pcNum = parseInt(pcSpec);
      if (isNaN(pcNum) || pcNum < 1 || pcNum > 128) {
        return {
          valid: false,
          error: `Invalid PC number: ${pcSpec}. Must be between 1-128`,
        };
      }
    }

    // Validate name if present
    if (parts[1]) {
      const name = parts.slice(1).join(" ");
      const validNameRegex = /^[a-zA-Z0-9\s_\-+\/()'"*,.!:=<>?@$]+$/;
      if (!validNameRegex.test(name)) {
        return {
          valid: false,
          error:
            "PC name contains invalid characters. Allowed: alphanumeric ASCII and special characters: space, _, -, +, /, (, ), ', \", *, ,, ., !, :, =, <, >, ?, @, $",
        };
      }
    }
  }

  return { valid: true };
};
