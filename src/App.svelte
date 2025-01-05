<script>
  import Footer from "./Footer.svelte";
  import Header from "./Header.svelte";

  import FileUploader from "./FileUploader.svelte";
  import ValidationResults from "./ValidationResults.svelte";
  import {
    validateVersion,
    validateTrackName,
  } from "./lib/validators/headerValidator";
  import {
    validateOutport,
    validateInport,
  } from "./lib/validators/portConfigValidator";
  import {
    validateOutChannel,
    validateInChannel,
  } from "./lib/validators/channelValidator";
  import { validateDrumLanes } from "./lib/validators/drumLaneValidator";
  import { validateCCs } from "./lib/validators/ccValidator";
  import { validateNRPNs } from "./lib/validators/nrpnValidator";

  let validationResults = null;
  let error = null;
  let fileContent = null;
  let userInput = "";
  let showFileContent = false;

  const validateContent = (text) => {
    try {
      const lines = text.split("\n");
      validationResults = {
        version: validateVersion(lines),
        trackName: validateTrackName(lines),
        outport: validateOutport(lines),
        inport: validateInport(lines),
        outChannel: validateOutChannel(lines),
        inchan: validateInChannel(lines),
        drumLanes: validateDrumLanes(lines),
        midicc: validateCCs(lines),
        nrpns: validateNRPNs(lines),
      };
      error = null;
    } catch (err) {
      error = "Validation error: " + err.message;
      validationResults = null;
    }
  };

  const handleFileLoaded = (event) => {
    const { text } = event.detail;
    userInput = text;
    fileContent = text;
    validateContent(text);
  };

  const handleValidate = (event) => {
    validateContent(event.detail.text);
  };

  const handleError = (event) => {
    error = event.detail.message;
    validationResults = null;
  };

  const handleClear = () => {
    userInput = "";
    fileContent = null;
    error = null;
    validationResults = null;
  };

  const copyResultsToClipboard = () => {
    if (!validationResults) return;

    const resultsText = Object.entries(validationResults)
      .map(
        ([check, result]) =>
          `### ${check.replace(/([A-Z])/g, " $1").trim()}\n\n${result.valid ? "✓ Valid" : `✗ ${result.error}`}`
      )
      .join("\n\n");

    const fullText = `## ${hasErrors ? "Validation Failed" : "All Checks Passed"}\n\n${resultsText}\n\nCourtesy of hapax-validator.maxhodges.com`;

    navigator.clipboard.writeText(fullText).catch((err) => {
      console.error("Failed to copy results to clipboard:", err);
    });
  };

  $: hasErrors =
    validationResults &&
    Object.values(validationResults).some((result) => !result.valid);
</script>

<main
  class="app-content min-h-screen bg-[var(--color-background)] bg-cyber-grid"
>
  <!-- Debug: Show themes -->

  <div class="container max-w-4xl p-4 pb-16 mx-auto">
    <div
      class="p-6 border rounded-lg shadow-xl bg-[var(--color-background)]-50 backdrop-blur-sm border-[var(--color-secondary)/20]"
    >
      <Header />

      <FileUploader
        bind:userInput
        on:fileLoaded={handleFileLoaded}
        on:validate={handleValidate}
        on:error={handleError}
        on:clear={handleClear}
      />
      <ValidationResults {validationResults} {error} />
    </div>
  </div>
</main>

<Footer />

<style>
  .app-content {
    min-height: calc(100vh - 4rem); /* Adjust for footer height */
  }
</style>
