<script lang="ts">
  import { slide } from 'svelte/transition';
  import type { NOTIFICATION_TYPES } from './enums';

  export let type: NOTIFICATION_TYPES;
  export let display = false;
</script>

{#if display}
  <div in:slide out:slide class={`notif  notification is-${type}`}>
    <button
      class="delete"
      on:click={() => {
        display = false;
      }}
    />
    <slot />
  </div>
{/if}

<style>
  .notif {
    display: block;
    position: fixed;
    bottom: 0;
    margin: 1rem;
    width: 25%;
    right: 0;
    z-index: 1;
  }
  @media screen and (max-width: 767px) {
    .notif {
      margin: 0.5rem;
      width: 80%;
    }
  }
</style>
