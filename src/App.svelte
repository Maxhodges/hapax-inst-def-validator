<script>
  import Footer from "./Footer.svelte";
  import Header from "./Header.svelte";
  import FileUploader from "./FileUploader.svelte";
  import ValidationResults from "./ValidationResults.svelte";
  import InstrumentDefinitionEditor from "./InstrumentDefinitionEditor.svelte";

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
  import { validateCCPairs } from "./lib/validators/ccPairValidator";
  import { validatePCs } from "./lib/validators/pcValidator";
  import { validateMaxRate } from "./lib/validators/headerValidator";
  import { onMount } from "svelte";

  let validationResults = null;
  let error = null;
  let fileContent = null;
  let userInput = "";
  let showFileContent = false;
  let activeTab = window.location.hash.slice(1) || "validate";

  onMount(() => {
    window.addEventListener("hashchange", () => {
      activeTab = window.location.hash.slice(1) || "validate";
    });
  });

  const handleTabClick = (tab) => {
    window.location.hash = tab;
    activeTab = tab;
  };

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
        maxRate: validateMaxRate(lines),
        drumLanes: validateDrumLanes(lines),
        midicc: validateCCs(lines),
        ccPairs: validateCCPairs(lines),
        programChanges: validatePCs(lines),
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

<main class="app-content min-h-screen bg-[var(--color-background)] bg-eva-hex">
  <!-- Debug: Show themes -->

  <div class="container max-w-4xl p-4 pb-16 mx-auto">
    <!-- Tab Navigation -->
    <div class="flex mb-4 space-x-4">
      <button
        class="px-4 py-2 rounded-t-lg {activeTab === 'validate'
          ? 'bg-theme-secondary text-white'
          : 'bg-theme-alt1 text-theme-text'}"
        on:click={() => handleTabClick("validate")}
      >
        Validate Definition
      </button>
      <button
        class="px-4 py-2 rounded-t-lg {activeTab === 'create'
          ? 'bg-theme-secondary text-white'
          : 'bg-theme-alt1 text-theme-text'}"
        on:click={() => handleTabClick("create")}
      >
        Create Definition
      </button>
    </div>

    {#if activeTab === "validate"}
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
    {:else if activeTab === "create"}
      <InstrumentDefinitionEditor />
    {/if}
  </div>
</main>

<Footer />

<style>
  .app-content {
    min-height: calc(100vh - 4rem); /* Adjust for footer height */
  }
</style>
