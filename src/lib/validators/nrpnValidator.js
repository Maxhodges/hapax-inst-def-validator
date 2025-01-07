export const validateNRPNs = (lines) => {
  const startIdx = lines.findIndex((line) => line.trim() === "[NRPN]");
  const endIdx = lines.findIndex((line) => line.trim() === "[/NRPN]");

  if (startIdx === -1 || endIdx === -1) {
    return { valid: true }; // Optional section
  }

  const nrpnLines = lines
    .slice(startIdx + 1, endIdx)
    .filter((line) => line.trim() !== "" && !line.trim().startsWith("#"));

  const usedNRPNs = new Set();

  for (const line of nrpnLines) {
    const parts = line.split("#")[0].trim().split(" ");
    const [nrpnSpec] = parts;

    // Split NRPN specification (MSB:LSB:DEPTH or MSB:LSB:DEPTH:DEFAULT=xx)
    const specParts = nrpnSpec.split(":");

    if (specParts.length < 3 || specParts.length > 4) {
      return { valid: false, error: `Invalid NRPN format: ${line}` };
    }

    const [msb, lsb, depth, defaultSpec] = specParts;

    // Validate MSB (can be omitted with leading colon)
    if (msb !== "" && (isNaN(msb) || msb < 0 || msb > 127)) {
      return { valid: false, error: `Invalid NRPN MSB: ${line}` };
    }

    // Validate LSB
    if (isNaN(lsb)) {
      return { valid: false, error: `Invalid NRPN LSB: ${line}` };
    }

    // Handle special case where LSB > 127
    if (msb === "" || msb === "0") {
      const lsbNum = parseInt(lsb);
      if (isNaN(lsbNum) || lsbNum < 0 || lsbNum > 16383) {
        return {
          valid: false,
          error: `Invalid extended NRPN LSB: ${line}. When MSB is 0 or omitted, LSB can be up to 16383`,
        };
      }
    } else {
      const lsbNum = parseInt(lsb);
      if (isNaN(lsbNum) || lsbNum < 0 || lsbNum > 127) {
        return {
          valid: false,
          error: `Invalid NRPN LSB: ${line}. Must be between 0-127 when MSB is specified`,
        };
      }
    }

    // Validate depth
    if (!["7", "14"].includes(depth)) {
      return {
        valid: false,
        error: `Invalid NRPN depth (must be 7 or 14): ${line}`,
      };
    }

    // Check for duplicates
    const nrpnKey = `${msb}:${lsb}`;
    if (usedNRPNs.has(nrpnKey)) {
      return { valid: false, error: `Duplicate NRPN ${nrpnKey}` };
    }
    usedNRPNs.add(nrpnKey);

    // Validate default value if present
    if (defaultSpec) {
      if (!defaultSpec.startsWith("DEFAULT=")) {
        return { valid: false, error: `Invalid default value format: ${line}` };
      }
      const defaultValue = defaultSpec.split("=")[1];
      const maxValue = depth === "7" ? 127 : 16383;
      if (isNaN(defaultValue) || defaultValue < 0 || defaultValue > maxValue) {
        return {
          valid: false,
          error: `Invalid default value for NRPN: ${line}`,
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
          error: `Invalid characters in NRPN name: ${name}`,
        };
      }
    }
  }

  return { valid: true };
};
