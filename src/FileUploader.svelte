<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let userInput = "";
  let dragActive = false;

  const handleDragEnter = (e) => {
    e.preventDefault();
    dragActive = true;
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragActive = false;
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    dragActive = false;
    const file = e.dataTransfer?.files[0];
    if (file) {
      try {
        const text = await file.text();
        dispatch("fileLoaded", { text });
      } catch (err) {
        dispatch("error", { message: "Error reading file: " + err.message });
      }
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      dispatch("fileLoaded", { text });
    } catch (err) {
      dispatch("error", { message: "Error reading file: " + err.message });
    }
  };

  const handleTextareaValidation = () => {
    if (!userInput.trim()) {
      dispatch("error", { message: "Input cannot be empty." });
      return;
    }
    dispatch("validate", { text: userInput });
  };
</script>

<div class="space-y-4">
  <div
    role="application"
    class="flex items-center justify-center w-full"
    on:dragenter={handleDragEnter}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
    on:dragover|preventDefault
  >
    <label
      class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 bg-[var(--color-background)] {dragActive
        ? 'border-cyberpunk-cyan'
        : 'border-[var(--color-secondary)/50]'}"
    >
      <div class="flex flex-col items-center justify-center pt-5 pb-6">
        <p class="mb-2 font-mono text-[var(--color-secondary)]">
          <span class="font-semibold">&gt; DROP_FILE</span> || click.upload()
        </p>
        <p class="text-xs text-[var(--color-primary)]">format: .TXT</p>
      </div>
      <input
        type="file"
        class="hidden"
        accept=".txt"
        on:change={handleFileUpload}
      />
    </label>
  </div>

  <!-- Text Input Area -->
  <div class="space-y-2">
    <textarea
      class="w-full p-4 font-mono text-sm border rounded-lg bg-[var(--color-background)] text-[var(--color-secondary)] border-[var(--color-secondary)/50] focus:border-cyberpunk-cyan focus:ring-1 focus:ring-cyberpunk-cyan"
      rows="10"
      placeholder="// Paste your definition here..."
      bind:value={userInput}
    />
    <div class="flex items-center space-x-2">
      <button
        class="px-4 py-2 font-mono transition-all rounded-lg text-[var(--color-background)] bg-[var(--color-secondary)] hover:bg-opacity-90 active:scale-95"
        on:click={handleTextareaValidation}
      >
        VALIDATE_
      </button>
      <button
        class="px-4 py-2 font-mono transition-all rounded-lg text-[var(--color-background)] bg-[var(--color-accent)] hover:bg-opacity-90 active:scale-95"
        on:click={() => {
          userInput = "";
          dispatch("clear");
        }}
      >
        CLEAR_
      </button>
    </div>
  </div>
</div>
