<script lang="ts">
  import Card from '$components/Card/Card.svelte';
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
  class="column is-2-tablet is-2-desktop is-2-mobile preview is-clickable is-translucent-black is-borderless pt-4 pb-2 px-2"
>
  <div class="is-justify-content-center">
    <figure class="image is-2by1 mb-2">
      <img src={queue.sipImage.bits} alt="support-figure" class="is-fullwidth" />
    </figure>
    <div class="content my-2">
      <button disabled class="button is-size-7 is-primary is-centered is-fullwidth">{queue.sipTitle} </button>
    </div>
  </div>
</button>

<style>
  .preview button {
    white-space: nowrap;
    display: block;
    text-overflow: ellipsis;
    overflow: auto;
  }
</style>
