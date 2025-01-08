<script>
  const initialFormData = {
    trackName: "",
    trackType: "NULL",
    outPort: "NULL",
    outChannel: null,
    inPort: "NULL",
    inChannel: null,
    maxRate: null,
    drumLanes: [],
    midicc: [],
    ccPairs: [],
    programChanges: [],
    nrpns: [],
    potAssignments: [],
    automationLanes: [],
    comment: "",
  };

  let formData = { ...initialFormData };

  let generatedContent = "";

  const generateDefinitionFile = () => {
    // Validate required fields
    if (!formData.trackName?.trim()) {
      alert("Track name is required");
      return;
    }

    const lines = [
      "VERSION 1",
      `TRACKNAME ${formData.trackName}`,
      `TYPE ${formData.trackType}`,
      `OUTPORT ${formData.outPort}`,
      `OUTCHAN ${formData.outChannel ?? "NULL"}`,
      `INPORT ${formData.inPort}`,
      `INCHAN ${formData.inChannel ?? "NULL"}`,
      `MAXRATE ${formData.maxRate ?? "NULL"}`,
      "",
    ];

    // Add drum lanes section
    if (formData.trackType === "DRUM" && formData.drumLanes.length > 0) {
      lines.push("[DRUMLANES]");
      formData.drumLanes.forEach((lane) => {
        lines.push(
          `${lane.row}:${lane.trig ?? "NULL"}:${lane.channel ?? "NULL"}:${lane.note ?? "NULL"} ${lane.name}`
        );
      });
      lines.push("[/DRUMLANES]", "");
    }

    // Add program changes section
    if (formData.programChanges.length > 0) {
      lines.push("[PC]");
      formData.programChanges.forEach((pc) => {
        const pcNum = pc.msb
          ? `${pc.number}:${pc.msb}:${pc.lsb ?? "NULL"}`
          : pc.number;
        lines.push(`${pcNum} ${pc.name}`);
      });
      lines.push("[/PC]", "");
    }

    // Add CC definitions
    if (formData.midicc.length > 0) {
      lines.push("[CC]");
      formData.midicc.forEach((cc) => {
        if (cc.number === null || cc.number < 0 || cc.number > 127) return;
        if (
          cc.defaultValue !== null &&
          (cc.defaultValue < 0 || cc.defaultValue > 127)
        )
          return;

        const ccDef =
          cc.defaultValue !== null
            ? `${cc.number}:DEFAULT=${cc.defaultValue} ${cc.name}`
            : `${cc.number} ${cc.name}`;
        lines.push(ccDef);
      });
      lines.push("[/CC]", "");
    }

    // Add CC pairs
    if (formData.ccPairs.length > 0) {
      lines.push("[CC_PAIR]");
      formData.ccPairs.forEach((pair) => {
        const pairDef =
          pair.defaultValue !== null
            ? `${pair.msb}:${pair.lsb}:DEFAULT=${pair.defaultValue} ${pair.name}`
            : `${pair.msb}:${pair.lsb} ${pair.name}`;
        lines.push(pairDef);
      });
      lines.push("[/CC_PAIR]", "");
    }

    // Add NRPN definitions
    if (formData.nrpns.length > 0) {
      lines.push("[NRPN]");
      formData.nrpns.forEach((nrpn) => {
        const nrpnDef =
          nrpn.defaultValue !== null
            ? `${nrpn.msb}:${nrpn.lsb}:${nrpn.depth}:DEFAULT=${nrpn.defaultValue} ${nrpn.name}`
            : `${nrpn.msb}:${nrpn.lsb}:${nrpn.depth} ${nrpn.name}`;
        lines.push(nrpnDef);
      });
      lines.push("[/NRPN]", "");
    }

    // Add pot assignments
    if (formData.potAssignments.length > 0) {
      lines.push("[ASSIGN]");
      formData.potAssignments.forEach((pot) => {
        const potDef =
          pot.defaultValue !== null
            ? `${pot.number} ${pot.type}:${pot.value} DEFAULT=${pot.defaultValue}`
            : `${pot.number} ${pot.type}:${pot.value}`;
        lines.push(potDef);
      });
      lines.push("[/ASSIGN]", "");
    }

    // Add automation lanes
    if (formData.automationLanes.length > 0) {
      lines.push("[AUTOMATION]");
      formData.automationLanes.forEach((lane) => {
        lines.push(`${lane.type}:${lane.value}`);
      });
      lines.push("[/AUTOMATION]", "");
    }

    // Add comment section if present
    if (formData.comment) {
      lines.push("[COMMENT]", formData.comment, "[/COMMENT]", "");
    }

    return lines.join("\n");
  };

  // Helper functions for adding/removing items
  const addDrumLane = () => {
    formData.drumLanes = [
      ...formData.drumLanes,
      {
        row: formData.drumLanes.length + 1,
        trig: null,
        channel: null,
        note: null,
        name: "",
      },
    ];
  };

  const addCC = () => {
    formData.midicc = [
      ...formData.midicc,
      {
        number: null,
        name: "",
        defaultValue: null,
      },
    ];
  };

  const removeCC = (index) => {
    formData.midicc = formData.midicc.filter((_, i) => i !== index);
  };

  // Helper functions for CC Pairs
  const addCCPair = () => {
    formData.ccPairs = [
      ...formData.ccPairs,
      {
        msb: null,
        lsb: null,
        name: "",
        defaultValue: null,
      },
    ];
  };

  const removeCCPair = (index) => {
    formData.ccPairs = formData.ccPairs.filter((_, i) => i !== index);
  };

  // Helper functions for NRPNs
  const addNRPN = () => {
    formData.nrpns = [
      ...formData.nrpns,
      {
        msb: null,
        lsb: null,
        depth: 7,
        name: "",
        defaultValue: null,
      },
    ];
  };

  const removeNRPN = (index) => {
    formData.nrpns = formData.nrpns.filter((_, i) => i !== index);
  };

  const handleGenerate = () => {
    generatedContent = generateDefinitionFile();
  };

  // Similar helper functions for other arrays...
</script>

<div
  class="p-6 border rounded-lg shadow-xl bg-[var(--color-background)]-50 backdrop-blur-sm border-[var(--color-secondary)/20]"
>
  <h2 class="mb-6 text-2xl font-bold text-theme-secondary">
    Create Instrument Definition
  </h2>

  <form class="space-y-6">
    <!-- Basic Track Info -->
    <section class="space-y-4">
      <h3 class="text-xl font-semibold text-theme-accent">
        Basic Configuration
      </h3>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-theme-text"
          >Track Name</label
        >
        <input
          type="text"
          bind:value={formData.trackName}
          required
          class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
          placeholder="Enter track name"
        />
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-theme-text"
          >Track Type</label
        >
        <select
          bind:value={formData.trackType}
          class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
        >
          <option value="NULL">Select Type...</option>
          <option value="POLY">Polyphonic MIDI</option>
          <option value="DRUM">Drum Sequencer</option>
          <option value="MPE">MIDI Polyphonic Expression</option>
        </select>
      </div>
    </section>

    <!-- MIDI Configuration -->
    <section class="space-y-4">
      <h3 class="text-xl font-semibold text-theme-accent">
        MIDI Configuration
      </h3>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-theme-text"
            >Output Port</label
          >
          <input
            type="text"
            bind:value={formData.outPort}
            class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
            placeholder="e.g., 'NULL' or port name"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-theme-text"
            >Output Channel</label
          >
          <input
            type="number"
            bind:value={formData.outChannel}
            min="1"
            max="16"
            class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
            placeholder="1-16 or empty for NULL"
          />
        </div>
      </div>
    </section>

    <!-- Drum Lanes (only show if track type is DRUM) -->
    {#if formData.trackType === "DRUM"}
      <section class="space-y-4">
        <h3 class="text-xl font-semibold text-theme-accent">Drum Lanes</h3>

        {#each formData.drumLanes as lane, i}
          <div class="grid grid-cols-5 gap-2">
            <div class="space-y-1">
              <label for="drum-note-{i}" class="text-xs text-theme-text"
                >Note</label
              >
              <input
                id="drum-note-{i}"
                type="number"
                bind:value={lane.note}
                placeholder="Note"
                class="p-2 border rounded-md bg-theme-alt1"
              />
            </div>
            <div class="col-span-3 space-y-1">
              <label for="drum-name-{i}" class="text-xs text-theme-text"
                >Name</label
              >
              <input
                id="drum-name-{i}"
                type="text"
                bind:value={lane.name}
                placeholder="Name"
                class="w-full p-2 border rounded-md bg-theme-alt1"
              />
            </div>
            <button
              type="button"
              on:click={() =>
                (formData.drumLanes = formData.drumLanes.filter(
                  (_, index) => index !== i
                ))}
              class="px-2 text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        {/each}

        <button
          type="button"
          on:click={addDrumLane}
          class="w-full px-4 py-2 text-white rounded-md bg-theme-accent hover:bg-opacity-90"
        >
          Add Drum Lane
        </button>
      </section>
    {/if}

    <!-- CC Mappings -->
    <section class="space-y-4">
      <h3 class="text-xl font-semibold text-theme-accent">
        MIDI Control Change (CC) Mappings
      </h3>

      {#each formData.midicc as cc, i}
        <div class="grid grid-cols-4 gap-2">
          <div class="space-y-1">
            <label for="cc-number-{i}" class="text-xs text-theme-text"
              >CC Number (0-127)</label
            >
            <input
              id="cc-number-{i}"
              type="number"
              bind:value={cc.number}
              min="0"
              max="127"
              required
              on:input={(e) => {
                const val = parseInt(e.target.value);
                if (val > 127) e.target.value = "127";
                if (val < 0) e.target.value = "0";
              }}
              placeholder="CC#"
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
            />
          </div>

          <div class="space-y-1">
            <label for="cc-default-{i}" class="text-xs text-theme-text"
              >Default Value (Optional)</label
            >
            <input
              id="cc-default-{i}"
              type="number"
              bind:value={cc.defaultValue}
              min="0"
              max="127"
              placeholder="0-127 (Optional)"
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
            />
          </div>

          <div class="space-y-1">
            <label for="cc-name-{i}" class="text-xs text-theme-text">Name</label
            >
            <input
              id="cc-name-{i}"
              type="text"
              bind:value={cc.name}
              placeholder="Control name"
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
            />
          </div>

          <div class="flex items-end">
            <button
              type="button"
              on:click={() => removeCC(i)}
              class="w-full px-2 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      {/each}

      <button
        type="button"
        on:click={addCC}
        class="w-full px-4 py-2 text-white transition-colors rounded-md bg-theme-accent hover:bg-opacity-90"
      >
        Add CC Mapping
      </button>
    </section>

    <!-- CC Pairs Section -->
    <section class="space-y-4">
      <div class="space-y-2">
        <h3 class="text-xl font-semibold text-theme-accent">
          CC Pairs (14-bit)
        </h3>
        <p class="text-sm italic text-theme-text/80">
          CC Pairs combine two MIDI CCs for high-resolution control (16,384
          steps instead of 128). Common pairs: Volume (7:39), Modulation (1:33),
          Expression (11:43).
        </p>
      </div>

      {#each formData.ccPairs as pair, i}
        <div class="grid grid-cols-5 gap-2">
          <div class="space-y-1">
            <label class="text-xs text-theme-text">MSB (0-127)</label>
            <input
              type="number"
              bind:value={pair.msb}
              min="0"
              max="127"
              placeholder="MSB"
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs text-theme-text">LSB (0-127)</label>
            <input
              type="number"
              bind:value={pair.lsb}
              min="0"
              max="127"
              placeholder="LSB"
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs text-theme-text">Default (0-16383)</label>
            <input
              type="number"
              bind:value={pair.defaultValue}
              min="0"
              max="16383"
              placeholder="Optional"
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs text-theme-text">Name</label>
            <input
              type="text"
              bind:value={pair.name}
              placeholder="e.g., Volume, Filter"
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
            />
          </div>

          <div class="flex items-end">
            <button
              type="button"
              on:click={() => removeCCPair(i)}
              class="w-full px-2 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      {/each}

      <div class="space-y-2">
        <button
          type="button"
          on:click={addCCPair}
          class="w-full px-4 py-2 text-white transition-colors rounded-md bg-theme-accent hover:bg-opacity-90"
        >
          Add CC Pair
        </button>

        <div class="p-4 text-sm rounded-md bg-theme-alt1/50">
          <h4 class="mb-2 font-semibold">Common CC Pairs:</h4>
          <ul class="space-y-1 list-disc list-inside">
            <li>Volume: MSB=7, LSB=39</li>
            <li>Modulation: MSB=1, LSB=33</li>
            <li>Expression: MSB=11, LSB=43</li>
            <li>Pan: MSB=10, LSB=42</li>
            <li>Filter Cutoff: MSB=74, LSB=106</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- NRPN Section -->
    <section class="space-y-4">
      <div class="space-y-2">
        <h3 class="text-xl font-semibold text-theme-accent">NRPN Controls</h3>
        <p class="text-sm italic text-theme-text/80">
          NRPNs (Non-Registered Parameter Numbers) allow for more precise
          control and many more parameters than standard MIDI CCs. They're
          commonly used for synthesizer-specific parameters like envelope times,
          filter resonance, or oscillator settings.
        </p>
      </div>

      {#each formData.nrpns as nrpn, i}
        <div class="grid grid-cols-6 gap-2">
          <div class="space-y-1">
            <label class="text-xs text-theme-text">MSB (0-127)</label>
            <input
              type="number"
              bind:value={nrpn.msb}
              min="0"
              max="127"
              placeholder="MSB"
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs text-theme-text">LSB (0-127)</label>
            <input
              type="number"
              bind:value={nrpn.lsb}
              min="0"
              max="127"
              placeholder="LSB"
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs text-theme-text">Depth</label>
            <select
              bind:value={nrpn.depth}
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
            >
              <option value={7}>7-bit (0-127)</option>
              <option value={14}>14-bit (0-16383)</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-xs text-theme-text">Default Value</label>
            <input
              type="number"
              bind:value={nrpn.defaultValue}
              min="0"
              max={nrpn.depth === 7 ? 127 : 16383}
              placeholder="Optional"
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs text-theme-text">Name</label>
            <input
              type="text"
              bind:value={nrpn.name}
              placeholder="e.g., Filter Res"
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
            />
          </div>

          <div class="flex items-end">
            <button
              type="button"
              on:click={() => removeNRPN(i)}
              class="w-full px-2 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      {/each}

      <div class="space-y-2">
        <button
          type="button"
          on:click={addNRPN}
          class="w-full px-4 py-2 text-white transition-colors rounded-md bg-theme-accent hover:bg-opacity-90"
        >
          Add NRPN Control
        </button>

        <div class="p-4 text-sm rounded-md bg-theme-alt1/50">
          <h4 class="mb-2 font-semibold">About NRPNs:</h4>
          <ul class="space-y-1 list-disc list-inside">
            <li>Uses 4 MIDI messages to send a single value</li>
            <li>Allows for up to 16,384 different parameters</li>
            <li>
              Can have 7-bit (128 values) or 14-bit (16,384 values) resolution
            </li>
            <li>
              Often used for device-specific parameters not covered by standard
              MIDI CCs
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Comments Section -->
    <div class="space-y-2">
      <h3 class="text-xl font-semibold text-theme-accent">Comments</h3>
      <p class="text-sm italic text-theme-text/80">
        Comment will be displayed on Hapax
      </p>
      <label for="comments" class="sr-only">Comments</label>
      <textarea
        id="comments"
        bind:value={formData.comment}
        rows="4"
        class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
        placeholder="Add your comments here..."
      />
    </div>

    <!-- Generate Section -->
    <section class="space-y-4">
      <button
        type="button"
        on:click={handleGenerate}
        class="w-full px-4 py-2 text-white transition-colors rounded-md bg-theme-primary hover:bg-opacity-90"
      >
        Generate Definition File
      </button>

      {#if generatedContent}
        <div class="space-y-2">
          <textarea
            readonly
            rows="20"
            class="w-full p-2 font-mono text-sm border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
            value={generatedContent}
          />
          <button
            type="button"
            on:click={() => navigator.clipboard.writeText(generatedContent)}
            class="px-4 py-2 mt-4 font-mono transition-all rounded-lg bg-[var(--color-secondary)] text-[var(--color-background)] hover:scale-105 active:scale-95"
          >
            Copy to Clipboard
          </button>
        </div>
      {/if}
    </section>
  </form>
</div>
