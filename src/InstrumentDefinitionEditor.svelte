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

    if (formData.trackType === "DRUM" && formData.drumLanes.length > 0) {
      lines.push("[DRUMLANES]");
      formData.drumLanes.forEach((lane) => {
        lines.push(
          `${lane.row}:${lane.trig ?? "NULL"}:${lane.channel ?? "NULL"}:${lane.note ?? "NULL"} ${lane.name}`
        );
      });
      lines.push("[/DRUMLANES]", "");
    }

    if (formData.midicc.length > 0) {
      lines.push("[CC]");
      formData.midicc.forEach((cc) => {
        if (cc.number === null || cc.number < 0 || cc.number > 127) return;
        const ccDef =
          cc.defaultValue !== null
            ? `${cc.number}:DEFAULT=${cc.defaultValue} ${cc.name}`
            : `${cc.number} ${cc.name}`;
        lines.push(ccDef);
      });
      lines.push("[/CC]", "");
    }

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

    if (formData.comment) {
      lines.push("[COMMENT]", formData.comment, "[/COMMENT]", "");
    }

    return lines.join("\n");
  };

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
      { number: null, name: "", defaultValue: null },
    ];
  };

  const removeCC = (index) => {
    formData.midicc = formData.midicc.filter((_, i) => i !== index);
  };

  const addCCPair = () => {
    formData.ccPairs = [
      ...formData.ccPairs,
      { msb: null, lsb: null, name: "", defaultValue: null },
    ];
  };

  const removeCCPair = (index) => {
    formData.ccPairs = formData.ccPairs.filter((_, i) => i !== index);
  };

  const addNRPN = () => {
    formData.nrpns = [
      ...formData.nrpns,
      { msb: null, lsb: null, depth: 7, name: "", defaultValue: null },
    ];
  };

  const removeNRPN = (index) => {
    formData.nrpns = formData.nrpns.filter((_, i) => i !== index);
  };

  const handleGenerate = () => {
    generatedContent = generateDefinitionFile();
  };
</script>

<div
  class="p-6 border rounded-lg shadow-xl bg-[var(--color-background)]-50 backdrop-blur-sm border-[var(--color-secondary)/20]"
>
  <h2 class="mb-6 text-2xl font-bold text-theme-secondary">
    Create Instrument Definition
  </h2>

  <form class="space-y-6">
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

      <div class="space-y-2">
        <label class="block text-sm font-medium text-theme-text">
          Output Port
          <span class="text-xs text-theme-text/70"
            >(A/B/C/D: MIDI, USBD/USBH: USB, CVG1-4/CV1-4/G1-4: CV)</span
          >
        </label>
        <select
          bind:value={formData.outPort}
          class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
        >
          <option value="NULL">Select Port...</option>
          <!-- MIDI Ports -->
          <option value="A">A (MIDI)</option>
          <option value="B">B (MIDI)</option>
          <option value="C">C (MIDI)</option>
          <option value="D">D (MIDI)</option>
          <!-- USB Ports -->
          <option value="USBD">USBD (Device)</option>
          <option value="USBH">USBH (Host)</option>
          <!-- CV/Gate Group Ports -->
          <option value="CVG1">CVG1</option>
          <option value="CVG2">CVG2</option>
          <option value="CVG3">CVG3</option>
          <option value="CVG4">CVG4</option>
          <!-- CV Ports -->
          <option value="CV1">CV1</option>
          <option value="CV2">CV2</option>
          <option value="CV3">CV3</option>
          <option value="CV4">CV4</option>
          <!-- Gate Ports -->
          <option value="G1">G1</option>
          <option value="G2">G2</option>
          <option value="G3">G3</option>
          <option value="G4">G4</option>
        </select>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-theme-text">
          Output Channel
          <span class="text-xs text-theme-text/70"
            >(1-16, or NULL for non-MIDI ports)</span
          >
        </label>
        <select
          bind:value={formData.outChannel}
          class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
        >
          <option value={null}>NULL</option>
          {#each Array(16) as _, i}
            <option value={i + 1}>{i + 1}</option>
          {/each}
        </select>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-theme-text">
          Input Port
          <span class="text-xs text-theme-text/70"
            >(NONE, ALLACTIVE, A/B: MIDI, USBD/USBH: USB, CVG)</span
          >
        </label>
        <select
          bind:value={formData.inPort}
          class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
        >
          <option value="NULL">Select Port...</option>
          <option value="NONE">NONE</option>
          <option value="ALLACTIVE">ALLACTIVE</option>
          <option value="A">A (MIDI)</option>
          <option value="B">B (MIDI)</option>
          <option value="USBD">USBD (Device)</option>
          <option value="USBH">USBH (Host)</option>
          <option value="CVG">CVG</option>
        </select>
      </div>

      <div class="space-y-2">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="block text-sm font-medium text-theme-text">
          Input Channel
          <span class="text-xs text-theme-text/70"
            >(1-16, ALL, or NULL; ignored for NONE/ALLACTIVE/CVG)</span
          >
        </label>
        <select
          bind:value={formData.inChannel}
          class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
        >
          <option value={null}>NULL</option>
          <option value="ALL">ALL</option>
          {#each Array(16) as _, i}
            <option value={i + 1}>{i + 1}</option>
          {/each}
        </select>
      </div>
    </section>

    {#if formData.trackType === "DRUM"}
      <section class="space-y-4">
        <h3 class="text-xl font-semibold text-theme-accent">Drum Lanes</h3>
        {#each formData.drumLanes as lane, i}
          <div
            class="grid gap-4"
            style="grid-template-columns: 120px 1fr 100px;"
          >
            <div class="space-y-1">
              <label class="text-xs text-theme-text">Note</label>
              <input
                type="number"
                bind:value={lane.note}
                min="0"
                max="127"
                placeholder="0-127"
                class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
              />
            </div>

            <div class="space-y-1">
              <label class="text-xs text-theme-text">Name</label>
              <input
                type="text"
                bind:value={lane.name}
                placeholder="e.g., Kick"
                class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
              />
            </div>

            <div>
              <label class="invisible text-xs">Remove</label>
              <button
                type="button"
                on:click={() =>
                  (formData.drumLanes = formData.drumLanes.filter(
                    (_, index) => index !== i
                  ))}
                class="w-full p-2 text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        {/each}

        <button
          type="button"
          on:click={addDrumLane}
          class="w-full px-4 py-2 text-white transition-colors rounded-md bg-theme-accent hover:bg-opacity-90"
        >
          Add Drum Lane
        </button>
      </section>
    {/if}

    <!-- CC Section -->
    <section class="space-y-4">
      <h3 class="text-xl font-semibold text-theme-accent">MIDI CC</h3>
      {#each formData.midicc as cc, i}
        <div
          class="grid gap-4"
          style="grid-template-columns: 120px 1fr 120px 100px;"
        >
          <div class="space-y-1">
            <label for="cc-number-{i}" class="text-xs text-theme-text"
              >CC Number</label
            >
            <input
              id="cc-number-{i}"
              type="number"
              bind:value={cc.number}
              min="0"
              max="127"
              placeholder="0-127"
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
              placeholder="CC Name"
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
            />
          </div>

          <div class="space-y-1">
            <label for="cc-default-{i}" class="text-xs text-theme-text"
              >Default Value</label
            >
            <input
              id="cc-default-{i}"
              type="number"
              bind:value={cc.defaultValue}
              min="0"
              max="127"
              placeholder="0-127"
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
            />
          </div>

          <div>
            <label class="invisible text-xs">Remove</label>
            <button
              type="button"
              on:click={() => removeCC(i)}
              class="w-full p-2 text-white bg-red-500 rounded-md hover:bg-red-600"
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
        Add CC
      </button>
    </section>

    <!-- CC Pairs Section -->
    <section class="space-y-4">
      <h3 class="text-xl font-semibold text-theme-accent">CC Pairs (14-bit)</h3>
      {#each formData.ccPairs as pair, i}
        <div
          class="grid gap-4"
          style="grid-template-columns: 120px 120px 1fr 120px 100px;"
        >
          <div class="space-y-1">
            <label for="ccpair-msb-{i}" class="text-xs text-theme-text"
              >MSB (0-127)</label
            >
            <input
              id="ccpair-msb-{i}"
              type="number"
              bind:value={pair.msb}
              min="0"
              max="127"
              placeholder="MSB"
            />
          </div>

          <div class="space-y-1">
            <label for="ccpair-lsb-{i}" class="text-xs text-theme-text"
              >LSB (0-127)</label
            >
            <input
              id="ccpair-lsb-{i}"
              type="number"
              bind:value={pair.lsb}
              min="0"
              max="127"
              placeholder="LSB"
            />
          </div>

          <div class="space-y-1">
            <label for="ccpair-name-{i}" class="text-xs text-theme-text"
              >Name</label
            >
            <input
              id="ccpair-name-{i}"
              type="text"
              bind:value={pair.name}
              placeholder="CC Pair Name"
            />
          </div>

          <div class="space-y-1">
            <label for="ccpair-default-{i}" class="text-xs text-theme-text"
              >Default (0-16383)</label
            >
            <input
              id="ccpair-default-{i}"
              type="number"
              bind:value={pair.defaultValue}
              min="0"
              max="16383"
              placeholder="0-16383"
            />
          </div>

          <div>
            <label for="ccpair-remove-{i}" class="invisible text-xs"
              >Remove</label
            >
            <button
              id="ccpair-remove-{i}"
              type="button"
              on:click={() => removeCCPair(i)}
              class="w-full p-2 text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      {/each}

      <button
        type="button"
        on:click={addCCPair}
        class="w-full px-4 py-2 text-white transition-colors rounded-md bg-theme-accent hover:bg-opacity-90"
      >
        Add CC Pair
      </button>
    </section>

    <!-- NRPN Section -->
    <section class="space-y-4">
      <h3 class="text-xl font-semibold text-theme-accent">NRPN</h3>
      {#each formData.nrpns as nrpn, i}
        <div
          class="grid gap-4"
          style="grid-template-columns: 120px 120px 120px 1fr 120px 100px;"
        >
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
              <option value="7">7-bit</option>
              <option value="14">14-bit</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-xs text-theme-text">Name</label>
            <input
              type="text"
              bind:value={nrpn.name}
              placeholder="NRPN Name"
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs text-theme-text">Default Value</label>
            <input
              type="number"
              bind:value={nrpn.defaultValue}
              min="0"
              max={nrpn.depth === 7 ? 127 : 16383}
              placeholder={nrpn.depth === 7 ? "0-127" : "0-16383"}
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
            />
          </div>

          <div>
            <label class="invisible text-xs">Remove</label>
            <button
              type="button"
              on:click={() => removeNRPN(i)}
              class="w-full p-2 text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      {/each}

      <button
        type="button"
        on:click={addNRPN}
        class="w-full px-4 py-2 text-white transition-colors rounded-md bg-theme-accent hover:bg-opacity-90"
      >
        Add NRPN
      </button>
    </section>

    <!-- Comment Section -->
    <section class="space-y-4">
      <h3 class="text-xl font-semibold text-theme-accent">Comments</h3>
      <div class="space-y-2">
        <label
          for="user-comments"
          class="block text-sm font-medium text-theme-text"
        >
          User Comments
          <span class="text-xs text-theme-text/70"
            >(Will be readable from Hapax)</span
          >
        </label>
        <textarea
          id="user-comments"
          bind:value={formData.comment}
          rows="4"
          class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2 text-theme-text"
          placeholder="Enter any comments about this instrument definition..."
        />
      </div>
    </section>

    <!-- Generate Button -->
    <section class="mt-8">
      <button
        type="button"
        on:click={handleGenerate}
        class="w-full px-6 py-3 text-lg font-semibold text-white transition-colors rounded-md bg-theme-primary hover:bg-opacity-90"
      >
        Generate Definition File
      </button>

      {#if generatedContent}
        <div class="mt-4 space-y-2">
          <h4 class="text-lg font-semibold text-theme-accent">
            Generated Definition:
          </h4>
          <pre
            class="p-4 overflow-x-auto font-mono text-sm rounded-md bg-theme-alt1 border-theme-alt2">{generatedContent}</pre>
        </div>
      {/if}
    </section>
  </form>
</div>
