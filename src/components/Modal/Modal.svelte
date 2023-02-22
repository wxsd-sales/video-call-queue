<script lang="ts">
  import { showModalStore } from '$lib/store';

  const onKeyDown = (e: KeyboardEvent) => {
    if ($showModalStore && e.key === 'Escape') $showModalStore = false;
  };
</script>

<div class="modal" class:is-active={$showModalStore}>
  <div class="modal-background" on:click={() => ($showModalStore = false)} />
  <section>
    <slot />
  </section>
</div>

<svelte:window on:keydown={onKeyDown} />
