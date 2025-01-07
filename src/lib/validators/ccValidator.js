export const validateCCs = (lines) => {
  const startIdx = lines.findIndex((line) => line.trim() === "[CC]");
  const endIdx = lines.findIndex((line) => line.trim() === "[/CC]");

  if (startIdx === -1 || endIdx === -1) {
    return { valid: true }; // Optional section
  }

  const ccLines = lines
    .slice(startIdx + 1, endIdx)
    .filter((line) => line.trim() !== "" && !line.trim().startsWith("#"));

  const usedCCs = new Set();

  for (const line of ccLines) {
    const parts = line.split("#")[0].trim().split(" ");
    const [ccSpec] = parts;

    if (ccSpec.includes(":")) {
      // Handle CC with default value
      const [num, defaultSpec] = ccSpec.split(":");

      if (isNaN(num) || num < 0 || num > 127) {
        return {
          valid: false,
          error: `Invalid CC number: ${num}. Must be between 0-127.`,
        };
      }
      if (defaultSpec && !defaultSpec.startsWith("DEFAULT=")) {
        return {
          valid: false,
          error: `Invalid default specifier: '${defaultSpec}'. 'DEFAULT' must be uppercase.`,
        };
      }

      const defaultValue = defaultSpec?.split("=")[1];
      if (
        defaultValue &&
        (isNaN(defaultValue) || defaultValue < 0 || defaultValue > 127)
      ) {
        return {
          valid: false,
          error: `Invalid default value for CC ${num}: ${defaultValue}. Must be 0-127.`,
        };
      }

      if (usedCCs.has(num)) {
        return { valid: false, error: `Duplicate CC number: ${num}` };
      }
      usedCCs.add(num);
    } else {
      // Handle CC without default value
      if (isNaN(ccSpec) || ccSpec < 0 || ccSpec > 127) {
        return {
          valid: false,
          error: `Invalid CC number: ${ccSpec}. Must be between 0-127.`,
        };
      }
      if (usedCCs.has(ccSpec)) {
        return { valid: false, error: `Duplicate CC number: ${ccSpec}` };
      }
      usedCCs.add(ccSpec);
    }

    // Validate name if present
    if (parts[1]) {
      const name = parts.slice(1).join(" ");
      const validNameRegex = /^[a-zA-Z0-9\s_\-+\/()'"*,.!:=<>?@$]+$/;
      if (!validNameRegex.test(name)) {
        return {
          valid: false,
          error: `Invalid characters in CC name: '${name}'. Allowed: letters, numbers, spaces, _, -, +, ., /, (, ), [, ].`,
        };
      }
    }
  }

  return { valid: true };
};
