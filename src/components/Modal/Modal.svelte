<script lang="ts">
  export let showModal = false;

  const onKeyDown = (e: KeyboardEvent) => {
    if (showModal && e.key === 'Escape') showModal = false;
  };
</script>

<div class="modal" class:is-active={showModal}>
  <div class="modal-background" on:click={() => (showModal = false)} />
  <section>
    <slot />
  </section>
</div>

<svelte:window on:keydown={onKeyDown} />
