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

  const range = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const ccValues = range(0, 127); // For MIDI CC values (0-127)
  const fourteenBitValues = range(0, 16383); // For 14-bit values (0-16383)

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
      { number: 0, name: "", defaultValue: null },
    ];
  };

  const removeCC = (index) => {
    formData.midicc = formData.midicc.filter((_, i) => i !== index);
  };

  const addCCPair = () => {
    formData.ccPairs = [
      ...formData.ccPairs,
      { msb: 0, lsb: 0, name: "", defaultValue: null }, // Set msb to 0 by default
    ];
  };

  const removeCCPair = (index) => {
    formData.ccPairs = formData.ccPairs.filter((_, i) => i !== index);
  };

  const addNRPN = () => {
    formData.nrpns = [
      ...formData.nrpns,
      { msb: 0, lsb: 0, depth: 7, name: "", defaultValue: null },
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
        // Basic Configuration //
      </h3>
      <div class="space-y-2">
        <label for="track-name" class="block text-sm font-medium"
          >Track Name</label
        >
        <input
          id="track-name"
          type="text"
          bind:value={formData.trackName}
          required
          class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
          placeholder="Enter track name"
        />
      </div>

      <div class="space-y-2">
        <label for="track_type" class="block text-sm font-medium"
          >Track Type</label
        >
        <select
          id="track-type"
          bind:value={formData.trackType}
          class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
        >
          <option value="NULL">NULL</option>
          <option value="POLY">Polyphonic MIDI</option>
          <option value="DRUM">Drum Sequencer</option>
          <option value="MPE">MIDI Polyphonic Expression</option>
        </select>
      </div>

      <div class="space-y-2">
        <label for="output-port" class="block text-sm font-medium">
          Output Port
          <span class="text-xs /70"
            >(A/B/C/D: MIDI, USBD/USBH: USB, CVG1-4/CV1-4/G1-4: CV)</span
          >
        </label>
        <select
          id="output-port"
          bind:value={formData.outPort}
          class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
        >
          <option value="NULL">NULL</option>
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
        <label for="output-channel" class="block text-sm font-medium">
          Output Channel
          <span class="text-xs /70">(1-16, or NULL for non-MIDI ports)</span>
        </label>
        <select
          id="output-channel"
          bind:value={formData.outChannel}
          class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
        >
          <option value={null}>NULL</option>
          {#each Array(16) as _, i}
            <option value={i + 1}>{i + 1}</option>
          {/each}
        </select>
      </div>

      <div class="space-y-2">
        <label for="input-port" class="block text-sm font-medium">
          Input Port
          <span class="text-xs /70"
            >(NONE, ALLACTIVE, A/B: MIDI, USBD/USBH: USB, CVG)</span
          >
        </label>
        <select
          id="input-port"
          bind:value={formData.inPort}
          class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
        >
          <option value="NULL">NULL</option>
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
        <label class="block text-sm font-medium">
          Input Channel
          <span class="text-xs /70"
            >(1-16, ALL, or NULL; ignored for NONE/ALLACTIVE/CVG)</span
          >
        </label>
        <select
          bind:value={formData.inChannel}
          class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
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
        <h3 class="text-xl font-semibold text-theme-accent">
          // Drum Lanes //
        </h3>
        {#each formData.drumLanes as lane, i}
          <div
            class="grid gap-4"
            style="grid-template-columns: 80px 120px 120px 120px 1fr 100px;"
          >
            <div class="space-y-1">
              <label for="drum-row-{i}" class="text-xs">Row</label>
              <select
                id="drum-row-{i}"
                bind:value={lane.row}
                class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
              >
                {#each Array(8) as _, idx}
                  <option value={idx + 1}>{idx + 1}</option>
                {/each}
              </select>
            </div>

            <div class="space-y-1">
              <label for="drum-trig-{i}" class="text-xs">Trig</label>
              <select
                id="drum-trig-{i}"
                bind:value={lane.trig}
                class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
              >
                <option value={null}>NULL</option>
                {#each ccValues as value}
                  <option {value}>{value}</option>
                {/each}
              </select>
            </div>

            <div class="space-y-1">
              <label for="drum-channel-{i}" class="text-xs">Channel</label>
              <select
                id="drum-channel-{i}"
                bind:value={lane.channel}
                class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
              >
                <option value={null}>NULL</option>
                {#each Array(16) as _, idx}
                  <option value={idx + 1}>{idx + 1}</option>
                {/each}
                <!-- CV/Gate options -->
                <option value="G1">G1</option>
                <option value="G2">G2</option>
                <option value="G3">G3</option>
                <option value="G4">G4</option>
                <option value="CV1">CV1</option>
                <option value="CV2">CV2</option>
                <option value="CV3">CV3</option>
                <option value="CV4">CV4</option>
                <option value="CVG1">CVG1</option>
                <option value="CVG2">CVG2</option>
                <option value="CVG3">CVG3</option>
                <option value="CVG4">CVG4</option>
              </select>
            </div>

            <div class="space-y-1">
              <label for="drum-note-{i}" class="text-xs">Note</label>
              <select
                id="drum-note-{i}"
                bind:value={lane.note}
                class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
              >
                <option value={null}>NULL</option>
                {#each ccValues as value}
                  <option {value}>{value}</option>
                {/each}
              </select>
            </div>

            <div class="space-y-1">
              <label for="drum-name-{i}" class="text-xs">Name</label>
              <input
                id="drum-name-{i}"
                type="text"
                bind:value={lane.name}
                placeholder="KICK"
                class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
              />
            </div>

            <div>
              <label for="remove-drum-lane-{i}" class="invisible text-xs"
                >Remove</label
              >
              <button
                id="remove-drum-lane-{i}"
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
          class="px-4 py-2 text-white transition-colors rounded-md bg-theme-accent hover:bg-opacity-90"
          disabled={formData.drumLanes.length >= 8}
        >
          Add Drum Lane
        </button>
      </section>
    {/if}

    <!-- CC Section -->
    <section class="space-y-4">
      <h3 class="text-xl font-semibold text-theme-accent">// MIDI CC //</h3>
      {#each formData.midicc as cc, i}
        <div
          class="grid gap-4"
          style="grid-template-columns: 120px 1fr 120px 100px;"
        >
          <div class="space-y-1">
            <label for="cc-number-{i}" class="text-xs">CC Number</label>
            <select
              id="cc-number-{i}"
              bind:value={cc.number}
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
            >
              {#each ccValues as value}
                <option {value}>{value}</option>
              {/each}
            </select>
          </div>

          <div class="space-y-1">
            <label for="cc-name-{i}" class="text-xs">Name</label>
            <input
              id="cc-name-{i}"
              type="text"
              bind:value={cc.name}
              placeholder="CC Name"
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
            />
          </div>

          <div class="space-y-1">
            <label for="cc-default-{i}" class="text-xs">Default Value</label>
            <select
              id="cc-default-{i}"
              bind:value={cc.defaultValue}
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
            >
              <option value={null}>NULL</option>
              {#each ccValues as value}
                <option {value}>{value}</option>
              {/each}
            </select>
          </div>

          <div>
            <label for="remove-cc-{i}" class="invisible text-xs">Remove</label>
            <button
              id="remove-cc-{i}"
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
        class="px-4 py-2 text-white transition-colors rounded-md bg-theme-accent hover:bg-opacity-90"
      >
        Add CC
      </button>
    </section>

    <!-- CC Pairs Section -->
    <section class="space-y-4">
      <h3 class="text-xl font-semibold text-theme-accent">
        // CC Pairs (14-bit) //
      </h3>
      {#each formData.ccPairs as pair, i}
        <div
          class="grid gap-4"
          style="grid-template-columns: 120px 120px 1fr 120px 100px;"
        >
          <div class="space-y-1">
            <label for="ccpair-msb-{i}" class="text-xs"> MSB (0-127) </label>
            <select
              id="ccpair-msb-{i}"
              bind:value={pair.msb}
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
            >
              {#each ccValues as value}
                <option {value}>{value}</option>
              {/each}
            </select>
          </div>

          <div class="space-y-1">
            <label for="ccpair-lsb-{i}" class="text-xs">LSB (0-127)</label>
            <select
              id="ccpair-lsb-{i}"
              bind:value={pair.lsb}
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
            >
              <option value={null}>NULL</option>
              {#each ccValues as value}
                <option {value}>{value}</option>
              {/each}
            </select>
          </div>

          <div class="space-y-1">
            <label for="ccpair-name-{i}" class="text-xs">Name</label>
            <input
              id="ccpair-name-{i}"
              type="text"
              bind:value={pair.name}
              placeholder="CC Pair Name"
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
            />
          </div>

          <div class="space-y-1">
            <label for="ccpair-default-{i}" class="text-xs"
              >Default (0-16383)</label
            >
            <input
              id="ccpair-default-{i}"
              type="number"
              bind:value={pair.defaultValue}
              min="0"
              max="16383"
              placeholder="0-16383"
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
            />
          </div>

          <div>
            <label for="remove-ccpair-{i}" class="invisible text-xs"
              >Remove</label
            >
            <button
              id="remove-ccpair-{i}"
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
        class="px-4 py-2 text-white transition-colors rounded-md bg-theme-accent hover:bg-opacity-90"
      >
        Add CC Pair
      </button>
    </section>

    <!-- NRPN Section -->
    <section class="space-y-4">
      <h3 class="text-xl font-semibold text-theme-accent">// NRPN //</h3>
      {#each formData.nrpns as nrpn, i}
        <div
          class="grid gap-4"
          style="grid-template-columns: 120px 120px 120px 1fr 120px 100px;"
        >
          <div class="space-y-1">
            <label for="nrpn-msb-{i}" class="text-xs">MSB (0-127)</label>
            <select
              id="nrpn-msb-{i}"
              bind:value={nrpn.msb}
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
            >
              <option value={null}>NULL</option>
              {#each ccValues as value}
                <option {value}>{value}</option>
              {/each}
            </select>
          </div>

          <div class="space-y-1">
            <label for="nrpn-lsb-{i}" class="text-xs">LSB (0-127)</label>
            <select
              id="nrpn-lsb-{i}"
              bind:value={nrpn.lsb}
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
            >
              <option value={null}>NULL</option>
              {#each ccValues as value}
                <option {value}>{value}</option>
              {/each}
            </select>
          </div>

          <div class="space-y-1">
            <label for="nrpn-depth-{i}" class="text-xs">Depth</label>
            <select
              id="nrpn-depth-{i}"
              bind:value={nrpn.depth}
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
            >
              <option value="7">7-bit</option>
              <option value="14">14-bit</option>
            </select>
          </div>

          <div class="space-y-1">
            <label for="nrpn-name-{i}" class="text-xs">Name</label>
            <input
              id="nrpn-name-{i}"
              type="text"
              bind:value={nrpn.name}
              placeholder="NRPN Name"
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
            />
          </div>

          <div class="space-y-1">
            <label for="nrpn-default-{i}" class="text-xs">Default Value</label>
            <input
              id="nrpn-default-{i}"
              type="number"
              bind:value={nrpn.defaultValue}
              min="0"
              max={nrpn.depth === 7 ? 127 : 16383}
              placeholder={nrpn.depth === 7 ? "0-127" : "0-16383"}
              class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
            />
          </div>

          <div>
            <label for="remove-nrpn-{i}" class="invisible text-xs">Remove</label
            >
            <button
              id="remove-nrpn-{i}"
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
        class="px-4 py-2 text-white transition-colors rounded-md bg-theme-accent hover:bg-opacity-90"
      >
        Add NRPN
      </button>
    </section>

    <!-- Comment Section -->
    <section class="space-y-4">
      <h3 class="text-xl font-semibold uppercase text-theme-accent">
        // Tactical Notes //
      </h3>
      <div class="space-y-2">
        <label for="user-comments" class="block text-sm font-medium">
          Field Report
          <span class="text-xs /70">(Accessible via HAPAX Terminal)</span>
        </label>
        <textarea
          id="user-comments"
          bind:value={formData.comment}
          rows="4"
          class="w-full p-2 border rounded-md bg-theme-alt1 border-theme-alt2"
          placeholder="Input mission-critical data regarding this instrument configuration..."
        />
      </div>
    </section>

    <!-- Generate Button -->
    <section class="flex flex-col items-center w-full mt-8">
      <button
        type="button"
        on:click={handleGenerate}
        class="px-6 py-3 text-lg font-semibold transition-colors rounded-md bg-theme-accent hover:bg-opacity-90"
      >
        Generate Definition File
      </button>

      {#if generatedContent}
        <div class="w-full mt-8 space-y-2">
          <h4 class="text-lg font-semibold text-theme-accent">
            Generated Definition:
          </h4>
          <pre
            class="w-full p-4 overflow-x-auto font-mono text-sm whitespace-pre-wrap border rounded-md bg-theme-alt1 border-theme-alt2">{generatedContent}</pre>
        </div>
      {/if}
    </section>
  </form>
</div>
