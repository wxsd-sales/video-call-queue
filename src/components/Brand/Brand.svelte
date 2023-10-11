<script lang="ts">
  export let title: string | URL = 'Cisco';
  export let subtitle = 'Bridge to possible.';
</script>

<img class="is-brand-logo" src={title} alt={subtitle} on:load />

<style>
  .is-brand-logo {
    height: 3.75rem;
  }
</style>
