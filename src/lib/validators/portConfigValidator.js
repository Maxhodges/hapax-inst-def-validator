export const validateOutport = (lines) => {
  const portLine = lines.find((line) => line.trim().startsWith("OUTPORT"));
  if (!portLine) return { valid: false, error: "Missing OUTPORT declaration" };

  const port = portLine.split("#")[0].trim().split(" ")[1];
  const validPorts = [
    "A",
    "B",
    "C",
    "D",
    "USBD",
    "USBH",
    "CVG1",
    "CVG2",
    "CVG3",
    "CVG4",
    "CV1",
    "CV2",
    "CV3",
    "CV4",
    "G1",
    "G2",
    "G3",
    "G4",
    "NULL",
  ];

  return validPorts.includes(port)
    ? { valid: true }
    : { valid: false, error: `Invalid OUTPORT: ${port}` };
};

export const validateInport = (lines) => {
  const portLine = lines.find((line) => line.trim().startsWith("INPORT"));
  if (!portLine) return { valid: false, error: "Missing INPORT declaration" };

  const port = portLine.split("#")[0].trim().split(" ")[1];
  const validPorts = [
    "NONE",
    "ALLACTIVE",
    "A",
    "B",
    "USBH",
    "USBD",
    "CVG",
    "NULL",
  ];

  return validPorts.includes(port)
    ? { valid: true }
    : { valid: false, error: `Invalid INPORT: ${port}` };
};
