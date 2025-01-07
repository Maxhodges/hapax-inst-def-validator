<script>
  const version = import.meta.env.PACKAGE_VERSION || "0.1.0";
</script>

<footer class="footer">
  <div class="container px-4 py-6 mx-auto space-y-4 font-mono text-sm">
    <!-- Feedback Section -->
    <p class="text-[var(--color-secondary)]">
      &gt;&gt; feedback.submit() &#123;
      <a
        href="https://github.com/Maxhodges/hapax-inst-def-validator"
        target="_blank"
        rel="noopener noreferrer"
        class="underline text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 decoration-dotted"
      >
        repository.open()
      </a>
      &#125;
    </p>

    <!-- Related Projects Section -->
    <p class="text-[var(--color-secondary)]">
      &gt;&gt; related.projects &#123;
      <a
        href="https://github.com/Maxhodges/noise-engineering-firmware-index"
        target="_blank"
        rel="noopener noreferrer"
        class="underline text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 decoration-dotted"
      >
        NE_Firmware_Index
      </a>
      &#125;
    </p>
    <!-- Version Number -->
    <p class="text-[var(--color-secondary)]">
      &gt;&gt; app.version &#123; v{version} &#125;
    </p>
    <!-- Creator Info Section -->
    <p class="text-[var(--color-secondary)]">
      &gt;&gt; creator.info &#123;
      <a
        href="https://maxhodges.com"
        target="_blank"
        rel="noopener noreferrer"
        class="underline text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 decoration-dotted"
      >
        Max Hodges
      </a>
      &#125; :: location(JP)
    </p>
  </div>
</footer>

<style>
  footer {
    position: sticky;
    bottom: 0;
    background-color: rgba(
      4,
      10,
      14,
      0.9
    ); /* Matches your theme's background */
    backdrop-filter: blur(8px);
    box-shadow: 0px -2px 6px rgba(0, 0, 0, 0.4);
    text-align: center;
    z-index: 10;
  }

  .container {
    max-width: 640px;
    line-height: 1.5;
  }
</style>
