<script lang="ts">
  export let title: string | URL | Buffer = 'Cisco';
</script>

<img class="is-brand-logo" src={title} alt={'brand-alt'} on:load on:mouseenter on:mouseleave />

<style>
  .is-brand-logo {
    height: 3.75rem;
  }
</style>
