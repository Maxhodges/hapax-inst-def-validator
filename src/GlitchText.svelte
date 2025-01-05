<!-- GlitchText.svelte -->
<script>
  export let intensity = 1;
  export let className = "";

  let offset = { x: 0, y: 0 };
  let active = false;

  function glitchEffect() {
    active = true;
    offset = {
      x: (Math.random() * 10 - 5) * intensity,
      y: (Math.random() * 6 - 3) * intensity,
    };

    setTimeout(() => {
      active = false;
      offset = { x: 0, y: 0 };
    }, 150);
  }

  setInterval(glitchEffect, 2000 + Math.random() * 1000);
</script>

<div class="relative">
  <slot />
  <span
    class="absolute top-0 left-0 opacity-50 {className}"
    style:transform="translate({offset.x}px, {offset.y}px)"
    style:transition="transform 0.1s ease-out"
    style:clip-path="inset(0 0 0 0)"
    style:color="#FF003C"
  >
    <slot />
  </span>
  <span
    class="absolute top-0 left-0 opacity-50 {className}"
    style:transform="translate({-offset.x}px, {-offset.y}px)"
    style:transition="transform 0.1s ease-out"
    style:clip-path="inset(0 0 0 0)"
    style:color="#00F0FF"
  >
    <slot />
  </span>
</div>
