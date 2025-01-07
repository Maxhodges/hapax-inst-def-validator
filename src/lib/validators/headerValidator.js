export const validateVersion = (lines) => {
  const versionLine = lines.find((line) => line.trim().startsWith("VERSION"));
  if (!versionLine)
    return {
      valid: false,
      error:
        "Missing VERSION. Make sure it’s not preceded by a '#' (e.g., VERSION 1).",
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
  const validNameRegex = /^[a-zA-Z0-9\s_\-+\/()'"*,.!:=<>?@$]+$/;
  return validNameRegex.test(name)
    ? { valid: true }
    : { valid: false, error: "TRACKNAME contains invalid characters" };
};

export const validateTrackType = (lines) => {
  const line = lines.find((line) => line.trim().startsWith("TYPE"));
  if (!line) return { valid: false, error: "Missing TYPE declaration" };

  const type = line.split("#")[0].trim().split(" ")[1];
  const validTypes = ["POLY", "DRUM", "MPE", "NULL"];

  return validTypes.includes(type)
    ? { valid: true }
    : { valid: false, error: "TYPE must be one of: POLY, DRUM, MPE, NULL" };
};

export const validateName = (lines) => {
  const line = lines.find((line) => line.trim().startsWith("NAME"));
  if (!line) return { valid: false, error: "Missing NAME declaration" };

  const name = line.split("#")[0].trim().split(" ").slice(1).join(" ");
  if (name === "NULL") return { valid: true };

  const validNameRegex = /^[a-zA-Z0-9\s_\-+\/()'"*,.!:=<>?@$]+$/;
  return validNameRegex.test(name)
    ? { valid: true }
    : {
        valid: false,
        error:
          "NAME contains invalid characters. Allowed: alphanumeric ASCII and special characters: space, _, -, +, /, (, ), ', \", *, ,, ., !, :, =, <, >, ?, @, $",
      };
};

export const validateComment = (lines) => {
  const line = lines.find((line) => line.trim().startsWith("COMMENT"));
  if (!line) return { valid: true }; // Optional field

  const comment = line.split("#")[0].trim().split(" ").slice(1).join(" ");
  if (comment === "NULL") return { valid: true };

  const validCommentRegex = /^[a-zA-Z0-9\s_\-+\/()'"*,.!:=<>?@$]+$/;
  return validCommentRegex.test(comment)
    ? { valid: true }
    : {
        valid: false,
        error:
          "COMMENT contains invalid characters. Allowed: alphanumeric ASCII and special characters: space, _, -, +, /, (, ), ', \", *, ,, ., !, :, =, <, >, ?, @, $",
      };
};

export const validateColor = (lines) => {
  const line = lines.find((line) => line.trim().startsWith("COLOR"));
  if (!line) return { valid: true }; // Optional field

  const color = line.split("#")[0].trim().split(" ")[1];
  if (color === "NULL") return { valid: true };

  const validColors = [
    "RED",
    "GREEN",
    "BLUE",
    "YELLOW",
    "CYAN",
    "MAGENTA",
    "WHITE",
    "ORANGE",
    "LIME",
    "PINK",
    "VIOLET",
    "GREY",
  ];

  return validColors.includes(color)
    ? { valid: true }
    : {
        valid: false,
        error: `Invalid COLOR. Must be one of: ${validColors.join(
          ", "
        )}, or NULL`,
      };
};

export const validateLength = (lines) => {
  const line = lines.find((line) => line.trim().startsWith("LENGTH"));
  if (!line) return { valid: false, error: "Missing LENGTH declaration" };

  const length = line.split("#")[0].trim().split(" ")[1];
  if (length === "NULL") return { valid: true };

  const lengthNum = parseInt(length);
  return !isNaN(lengthNum) && lengthNum >= 1 && lengthNum <= 64
    ? { valid: true }
    : { valid: false, error: "LENGTH must be NULL or between 1-64" };
};

export const validateQuantize = (lines) => {
  const line = lines.find((line) => line.trim().startsWith("QUANTIZE"));
  if (!line) return { valid: true }; // Optional field

  const quantize = line.split("#")[0].trim().split(" ")[1];
  if (quantize === "NULL") return { valid: true };

  const validQuantizeValues = ["1", "2", "4", "8", "16", "32", "64"];
  return validQuantizeValues.includes(quantize)
    ? { valid: true }
    : {
        valid: false,
        error: "QUANTIZE must be NULL or one of: 1, 2, 4, 8, 16, 32, 64",
      };
};

export const validateScale = (lines) => {
  const line = lines.find((line) => line.trim().startsWith("SCALE"));
  if (!line) return { valid: true }; // Optional field

  const scale = line.split("#")[0].trim().split(" ")[1];
  if (scale === "NULL") return { valid: true };

  const scaleNum = parseInt(scale);
  return !isNaN(scaleNum) && scaleNum >= 1 && scaleNum <= 8
    ? { valid: true }
    : { valid: false, error: "SCALE must be NULL or between 1-8" };
};

export const validateBasenote = (lines) => {
  const line = lines.find((line) => line.trim().startsWith("BASENOTE"));
  if (!line) return { valid: true }; // Optional field

  const basenote = line.split("#")[0].trim().split(" ")[1];
  if (basenote === "NULL") return { valid: true };

  const basenoteNum = parseInt(basenote);
  return !isNaN(basenoteNum) && basenoteNum >= 0 && basenoteNum <= 127
    ? { valid: true }
    : { valid: false, error: "BASENOTE must be NULL or between 0-127" };
};

export const validateMaxRate = (lines) => {
  const line = lines.find((line) => line.trim().startsWith("MAXRATE"));
  if (!line) return { valid: true }; // Optional field

  const rate = line.split("#")[0].trim().split(" ")[1];
  if (rate === "NULL") return { valid: true };

  const validRates = [
    "192",
    "96",
    "64",
    "48",
    "32",
    "24",
    "16",
    "12",
    "8",
    "6",
    "4",
    "3",
    "2",
    "1",
  ];
  return validRates.includes(rate)
    ? { valid: true }
    : {
        valid: false,
        error: `MAXRATE must be NULL or one of: ${validRates.join(", ")}`,
      };
};
