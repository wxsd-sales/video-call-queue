<script lang="ts">
  export let isActive = true;

  const onKeyDown = (e: KeyboardEvent) => {
    if (isActive && e.key === 'Escape') isActive = false;
  };
</script>

<div class="modal" class:is-active={isActive}>
  <div class="modal-background" on:click={() => (isActive = false)} />
  <section>
    <slot />
  </section>
</div>

<svelte:window on:keydown={onKeyDown} />
