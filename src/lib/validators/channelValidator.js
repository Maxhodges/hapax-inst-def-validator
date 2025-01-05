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
