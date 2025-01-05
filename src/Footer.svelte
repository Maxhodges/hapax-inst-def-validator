<script>
  export let creatorUrl = "https://maxhodges.com";
  export let creatorName = "Max Hodges";
  export let repoUrl = "https://github.com/Maxhodges/hapax-inst-def-validator";
</script>

<footer class="footer">
  <div class="container px-4 py-3 mx-auto text-sm text-center text-gray-300">
    <p>
      Created by <a href={creatorUrl} class="text-blue-400 hover:text-blue-300"
        >{creatorName}</a
      >
      · Made in Japan · See also:
      <a
        href="https://github.com/Maxhodges/noise-engineering-firmware-index"
        class="text-blue-400 hover:text-blue-300"
        >Noise Engineering Firmware Index</a
      >
    </p>
    <p>
      Have questions or feedback? Visit the
      <a href={repoUrl} class="text-blue-400 hover:text-blue-300"
        >GitHub repository</a
      >.
    </p>
  </div>
</footer>

<style>
  footer {
    position: sticky;
    bottom: 0;
    background-color: rgba(31, 41, 55, 0.8); /* bg-gray-800/80 */
    backdrop-filter: blur(10px); /* backdrop-blur-sm */
    box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.2); /* shadow-lg */
    text-align: center;
    z-index: 10;
  }
</style>
