<script lang="ts">
  export let title: string | URL = 'Cisco';
</script>

<img class="is-brand-logo" src={title} alt={'brand-alt'} on:load />

<style>
  .is-brand-logo {
    height: 3.75rem;
  }
</style>
