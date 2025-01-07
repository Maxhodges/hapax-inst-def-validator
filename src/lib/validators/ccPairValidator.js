export const validateCCPairs = (lines) => {
  const startIdx = lines.findIndex((line) => line.trim() === "[CC_PAIR]");
  const endIdx = lines.findIndex((line) => line.trim() === "[/CC_PAIR]");

  if (startIdx === -1 || endIdx === -1) {
    return { valid: true }; // Optional section
  }

  const ccPairLines = lines
    .slice(startIdx + 1, endIdx)
    .filter((line) => line.trim() !== "" && !line.trim().startsWith("#"));

  const usedCCs = new Set();

  for (const line of ccPairLines) {
    const parts = line.split("#")[0].trim().split(" ");
    const [ccSpec] = parts;
    const specParts = ccSpec.split(":");

    // Validate format
    if (specParts.length < 2 || specParts.length > 3) {
      return { valid: false, error: `Invalid CC pair format: ${line}` };
    }

    const [ccMsb, ccLsb, defaultSpec] = specParts;

    // Validate MSB and LSB
    if (isNaN(ccMsb) || ccMsb < 0 || ccMsb > 127) {
      return { valid: false, error: `Invalid CC MSB: ${ccMsb}` };
    }
    if (isNaN(ccLsb) || ccLsb < 0 || ccLsb > 127) {
      return { valid: false, error: `Invalid CC LSB: ${ccLsb}` };
    }

    // Check for duplicate CCs
    if (usedCCs.has(ccMsb) || usedCCs.has(ccLsb)) {
      return {
        valid: false,
        error: `Duplicate CC number in pair: ${ccMsb}:${ccLsb}`,
      };
    }
    usedCCs.add(ccMsb);
    usedCCs.add(ccLsb);

    // Validate default value if present
    if (defaultSpec) {
      if (!defaultSpec.startsWith("DEFAULT=")) {
        return { valid: false, error: `Invalid default value format: ${line}` };
      }
      const defaultValue = defaultSpec.split("=")[1];
      if (isNaN(defaultValue) || defaultValue < 0 || defaultValue > 16383) {
        return {
          valid: false,
          error: `Invalid default value for CC pair: ${line}. Must be 0-16383`,
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
            "CC pair name contains invalid characters. Allowed: alphanumeric ASCII and special characters: space, _, -, +, /, (, ), ', \", *, ,, ., !, :, =, <, >, ?, @, $",
        };
      }
    }
  }

  return { valid: true };
};
