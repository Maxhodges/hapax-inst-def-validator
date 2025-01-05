export const validateVersion = (lines) => {
  const versionLine = lines.find((line) => line.trim().startsWith("VERSION"));
  if (!versionLine)
    return {
      valid: false,
      error: "Missing VERSION. Make sure it's not commented (e.g., VERSION 1).",
    };

  const version = versionLine.split("#")[0].trim().split(" ")[1];
  return version === "1"
    ? { valid: true }
    : { valid: false, error: "Version must be 1" };
};

export const validateTrackName = (lines) => {
  const line = lines.find((line) => line.trim().startsWith("TRACKNAME"));
  if (!line) return { valid: false, error: "Missing TRACKNAME declaration" };

  const name = line.split("#")[0].trim().split(" ")[1];
  if (name === "NULL") return { valid: true };

  // Check if name contains only allowed characters
  const validNameRegex = /^[a-zA-Z0-9\s_\-+]+$/;
  return validNameRegex.test(name)
    ? { valid: true }
    : { valid: false, error: "TRACKNAME contains invalid characters" };
};
