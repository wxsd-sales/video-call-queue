<script lang="ts">
  export let showModal = false;
  export let handleClickOutside = () => false;

  const clickOutside = () => {
    const active = handleClickOutside();
    if (!active) showModal = false;
  };
</script>

<div class="modal" class:is-active={showModal}>
  <div class="modal-background" on:click={clickOutside} />
  <section>
    <slot />
  </section>
</div>
