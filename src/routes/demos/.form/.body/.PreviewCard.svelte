<script lang="ts">
  import tooltip from '$lib/actions/tooltip';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let queue;
  export let index: number;

  let displayEditButton = false;
</script>

<button
  on:mouseenter={() => (displayEditButton = true)}
  on:mouseleave={() => (displayEditButton = false)}
  class:zoom={displayEditButton}
  on:click={() => dispatch('showModal')}
  class="column is-2-tablet is-2-desktop is-2-mobile preview is-clickable is-translucent-black is-borderless p-2"
  type="button"
>
  <div class="edit mr-1" class:is-hidden={!displayEditButton} use:tooltip={'Edit call button'}>
    <span class="icon has-text-light">
      <i class="mdi mdi-18px mdi-pencil" />
    </span>
  </div>
  <div class="is-justify-content-center mt-1">
    <figure class="image is-2by1 mb-2">
      <img src={queue.sipImage.bits} alt="support-figure" class="is-fullwidth" />
    </figure>
    <div class="content my-2">
      <button disabled class="button is-size-7 is-primary is-centered is-fullwidth">{queue.sipTitle} </button>
    </div>
  </div>
</button>

<style>
  .edit {
    position: absolute;
    right: 0;
  }
  .preview button {
    white-space: nowrap;
    display: block;
    text-overflow: ellipsis;
    overflow: auto;
  }
</style>
