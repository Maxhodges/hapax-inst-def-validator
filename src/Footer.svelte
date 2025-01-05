<script>
  export let creatorUrl = "https://maxhodges.com";
  export let creatorName = "Max Hodges";
  export let repoUrl = "https://github.com/Maxhodges/hapax-inst-def-validator";
  export let guideUrl = `${repoUrl}/blob/main/README.md#common-mistakes-guide`; // Link to guide
  export let indexUrl =
    "https://github.com/Maxhodges/noise-engineering-firmware-index"; // Sister project link
</script>

<footer class="footer">
  <div class="container px-4 py-6 mx-auto space-y-2 text-sm text-gray-300">
    <p>
      Sister project:
      <a href={indexUrl} class="font-medium text-blue-400 hover:text-blue-300">
        Noise Engineering Firmware Index
      </a>
    </p>
    <p>
      Have questions or feedback?
      <a href={repoUrl} class="font-medium text-blue-400 hover:text-blue-300">
        Visit the GitHub repository
      </a>.
    </p>
    <p>
      Created by
      <a
        href={creatorUrl}
        class="font-medium text-blue-400 hover:text-blue-300"
      >
        {creatorName}
      </a>
      · Made in Japan
    </p>
  </div>
</footer>

<style>
  footer {
    position: sticky;
    bottom: 0;
    background-color: rgba(31, 41, 55, 0.9); /* Dark, semi-transparent */
    backdrop-filter: blur(8px); /* Subtle blur */
    box-shadow: 0px -2px 6px rgba(0, 0, 0, 0.4); /* Elevated shadow */
    text-align: center;
    z-index: 10;
  }

  .container {
    max-width: 640px; /* Keep it compact and centered */
    line-height: 1.5;
  }
</style>
