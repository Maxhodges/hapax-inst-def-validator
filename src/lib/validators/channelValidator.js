export const validateOutChannel = (lines) => {
  const chanLine = lines.find((line) => line.trim().startsWith("OUTCHAN"));
  if (!chanLine) return { valid: false, error: "Missing OUTCHAN declaration" };

  const chan = chanLine.split("#")[0].trim().split(" ")[1];
  if (chan === "NULL") return { valid: true };

  const chanNum = parseInt(chan);
  return !isNaN(chanNum) && chanNum >= 1 && chanNum <= 16
    ? { valid: true }
    : { valid: false, error: "OUTCHAN must be NULL or between 1-16" };
};

export const validateInChannel = (lines) => {
  const inportLine = lines.find((line) => line.trim().startsWith("INPORT"));
  const inchanLine = lines.find((line) => line.trim().startsWith("INCHAN"));

  // Validate only if INPORT is not NONE, ALLACTIVE, or CVG
  if (inportLine) {
    const inportValue = inportLine.split("#")[0].trim().split(" ")[1];
    if (["NONE", "ALLACTIVE", "CVG"].includes(inportValue)) {
      return { valid: true }; // INCHAN is ignored
    }
  }

  if (!inchanLine) {
    return { valid: false, error: "Missing INCHAN declaration" };
  }

  const inchan = inchanLine.split("#")[0].trim().split(" ")[1];
  if (inchan === "NULL" || inchan === "ALL") {
    return { valid: true };
  }

  const chanNum = parseInt(inchan, 10);
  return !isNaN(chanNum) && chanNum >= 1 && chanNum <= 16
    ? { valid: true }
    : { valid: false, error: "INCHAN must be NULL, ALL, or between 1-16" };
};
