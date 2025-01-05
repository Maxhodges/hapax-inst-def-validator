<script>
  import {
    validateVersion,
    validateTrackName,
  } from "./lib/validators/headerValidator";

  import {
    validateOutport,
    validateInport,
  } from "./lib/validators/portConfigValidator";

  import { validateOutChannel } from "./lib/validators/channelValidator";
  import { validateDrumLanes } from "./lib/validators/drumLaneValidator";
  import { validateCCs } from "./lib/validators/ccValidator";
  import { validateNRPNs } from "./lib/validators/nrpnValidator";

  let validationResults = null;
  let error = null;
  let fileContent = null;
  let showFileContent = false;

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      fileContent = text;
      const lines = text.split("\n");

      validationResults = {
        version: validateVersion(lines),
        trackName: validateTrackName(lines),
        outport: validateOutport(lines),
        inport: validateInport(lines),
        outChannel: validateOutChannel(lines),
        drumLanes: validateDrumLanes(lines),
        ccs: validateCCs(lines),
        nrpns: validateNRPNs(lines),
      };
      error = null;
    } catch (err) {
      error = "Error reading file: " + err.message;
      validationResults = null;
      fileContent = null;
    }
  };

  const toggleFileContent = () => {
    showFileContent = !showFileContent;
  };

  $: hasErrors =
    validationResults &&
    Object.values(validationResults).some((result) => !result.valid);
</script>

<main class="container mx-auto p-4 max-w-4xl">
  <div class="bg-white shadow-lg rounded-lg p-6">
    <h1 class="text-2xl font-bold mb-6">Hapax Definition File Validator</h1>

    <div class="space-y-4">
      <!-- File Upload Area -->
      <div class="flex items-center justify-center w-full">
        <label
          class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              class="w-8 h-8 mb-2 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p class="mb-2 text-sm text-gray-500">
              <span class="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p class="text-xs text-gray-500">Hapax definition file (.txt)</p>
          </div>
          <input
            type="file"
            class="hidden"
            accept=".txt"
            on:change={handleFileUpload}
          />
        </label>
      </div>

      <!-- Error Display -->
      {#if error}
        <div
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
        >
          <strong class="font-bold">Error:</strong>
          <span class="block">{error}</span>
        </div>
      {/if}

      <!-- Overall Status -->
      {#if validationResults}
        <div
          class="p-4 rounded-lg {hasErrors
            ? 'bg-red-100'
            : 'bg-green-100'} mb-4"
        >
          <h2
            class="text-xl font-bold {hasErrors
              ? 'text-red-700'
              : 'text-green-700'}"
          >
            {hasErrors ? "Validation Failed" : "All Checks Passed"}
          </h2>
        </div>
      {/if}

      <!-- Validation Results -->
      {#if validationResults}
        <div class="space-y-2">
          {#each Object.entries(validationResults) as [check, result]}
            <div
              class="p-4 rounded-lg {result.valid
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'}"
            >
              <h3 class="font-bold capitalize">
                {check.replace(/([A-Z])/g, " $1").trim()}
              </h3>
              <p>{result.valid ? "✓ Valid" : `✗ ${result.error}`}</p>
            </div>
          {/each}
        </div>
      {/if}

      <!-- File Content Preview -->
      {#if fileContent}
        <div class="mt-6">
          <button
            on:click={toggleFileContent}
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 mb-2"
          >
            {showFileContent ? "Hide" : "Show"} File Content
          </button>

          {#if showFileContent}
            <pre
              class="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm border border-gray-200">
                {fileContent}
              </pre>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</main>

<style>
  :global(body) {
    background-color: #f3f4f6;
  }

  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>
