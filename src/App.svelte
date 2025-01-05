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
  let userInput = ""; // New state for user-pasted input
  let showFileContent = false;

  import { onMount } from "svelte";
  onMount(() => {
    document.documentElement.classList.add("dark");
  });

  const validateContent = (text) => {
    try {
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
      error = "Validation error: " + err.message;
      validationResults = null;
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      fileContent = text;
      validateContent(text);
    } catch (err) {
      error = "Error reading file: " + err.message;
      validationResults = null;
    }
  };

  const handleTextareaValidation = () => {
    if (!userInput.trim()) {
      error = "Input cannot be empty.";
      return;
    }
    fileContent = userInput;
    validateContent(userInput);
  };

  const toggleFileContent = () => {
    showFileContent = !showFileContent;
  };

  $: hasErrors =
    validationResults &&
    Object.values(validationResults).some((result) => !result.valid);
</script>

<main class="container max-w-4xl min-h-screen p-4 mx-auto bg-gray-900">
  <div class="p-6 bg-gray-800 rounded-lg shadow-xl">
    <h1 class="mb-6 text-2xl font-bold text-white">
      Hapax Definition File Validator
    </h1>

    <div class="space-y-4">
      <!-- File Upload Area -->
      <div class="flex items-center justify-center w-full">
        <label
          class="flex flex-col items-center justify-center w-full h-32 bg-gray-700 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-600"
        >
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              class="w-8 h-8 mb-2 text-gray-400"
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
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p class="mb-2 text-sm text-gray-300">
              <span class="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p class="text-xs text-gray-400">Hapax definition file (.txt)</p>
          </div>
          <input
            type="file"
            class="hidden"
            accept=".txt"
            on:change={handleFileUpload}
          />
        </label>
      </div>

      <!-- OR Text Input Area -->
      <div>
        <textarea
          class="w-full p-4 text-sm text-gray-200 bg-gray-700 border border-gray-600 rounded-lg"
          rows="10"
          placeholder="Paste your text here..."
          bind:value={userInput}
        ></textarea>
        <button
          class="px-4 py-2 mt-2 text-gray-200 bg-blue-600 rounded-lg hover:bg-blue-500"
          on:click={handleTextareaValidation}
        >
          Validate Text
        </button>
      </div>

      <!-- Error Display -->
      {#if error}
        <div
          class="px-4 py-3 text-red-200 border border-red-700 rounded bg-red-900/50"
        >
          <strong class="font-bold">Error:</strong>
          <span class="block">{error}</span>
        </div>
      {/if}

      <!-- Overall Status -->
      {#if validationResults}
        <div
          class="p-4 rounded-lg mb-4 {hasErrors
            ? 'bg-red-900/30 text-red-200'
            : 'bg-green-900/30 text-green-200'}"
        >
          <h2 class="text-xl font-bold">
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
                ? 'bg-green-900/20 text-green-200 border border-green-800'
                : 'bg-red-900/20 text-red-200 border border-red-800'}"
            >
              <h3 class="font-bold capitalize">
                {check.replace(/([A-Z])/g, " $1").trim()}
              </h3>
              <p>{result.valid ? "✓ Valid" : `✗ ${result.error}`}</p>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</main>
