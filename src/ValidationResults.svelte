<script>
  export let validationResults = null;
  export let error = null;

  const labelMap = {
    version: "VERSION",
    trackName: "TRACKNAME",
    outport: "OUTPORT",
    inport: "INPORT",
    outChannel: "OUTCHAN",
    inChannel: "INCHAN",
    maxRate: "MAXRATE",
    drumLanes: "DRUMLANES",
    midicc: "(MIDI) CC",
    ccPairs: "CC PAIRS",
    programChanges: "PROGRAM CHANGES",
    nrpns: "NRPN",
  };

  const copyResultsToClipboard = () => {
    if (!validationResults) return;

    const resultsText = Object.entries(validationResults)
      .map(
        ([check, result]) =>
          `### ${check.replace(/([A-Z])/g, " $1").trim()}\n\n${result.valid ? "✓ Valid" : `✗ ${result.error}`}`
      )
      .join("\n\n");

    const fullText = `## ${hasErrors ? "Validation Failed" : "All Checks Passed"}\n\n${resultsText}`;

    navigator.clipboard.writeText(fullText).catch((err) => {
      console.error("Failed to copy results:", err);
    });
  };

  $: hasErrors =
    validationResults &&
    Object.values(validationResults).some((result) => !result.valid);
</script>

<!-- Error Display -->
{#if error}
  <div
    class="px-4 py-3 mt-4 border rounded border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-background)]"
  >
    <strong class="font-mono">ERROR_DETECTED &gt;&gt;</strong>
    <span class="block mt-1">{error}</span>
  </div>
{/if}

<!-- Validation Results -->
{#if validationResults}
  <div
    class="p-4 mt-4 rounded-lg mb-4 font-mono border bg-[var(--color-background)] {hasErrors
      ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
      : 'border-[var(--color-secondary)] text-[var(--color-text)]'}"
  >
    <h2 class="text-xl font-bold animate-glitch">
      {hasErrors ? "VALIDATION_FAILED" : "ALL_CHECKS_PASSED"}
    </h2>
  </div>

  <div class="space-y-2">
    {#each Object.entries(validationResults) as [check, result]}
      <div
        class="p-4 rounded-lg font-mono transition-all border bg-[var(--color-background)] hover:translate-x-1 {result.valid
          ? 'border-[var(--color-secondary)] text-[var(--color-text)]'
          : 'border-[var(--color-accent)] text-[var(--color-accent)]'}"
      >
        <h3 class="font-bold">
          {labelMap[check] || check}_
        </h3>
        <p>{result.valid ? "✓ Valid" : `✗ ${result.error}`}</p>
      </div>
    {/each}
  </div>

  <button
    class="px-4 py-2 mt-4 font-mono transition-all rounded-lg bg-[var(--color-secondary)] text-[var(--color-background)] hover:scale-105 active:scale-95"
    on:click={copyResultsToClipboard}
  >
    COPY_RESULTS_
  </button>
{/if}
