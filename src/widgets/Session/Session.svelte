<script lang="ts">
  import Card from '$components/Card/Card.svelte';

  import customerSupportSVG from '$lib/static/img/customer-support.svg';

  export let demo: JSON;
  export let isDevice: boolean;

  const queues = demo.queues ?? [{ title: 'Looking for Assistance?', extensionNumber: 1111, img: null }];
</script>

{#each queues as { extensionNumber, title, img }, index}
  <Card {index} {isDevice} {extensionNumber} {title} img={img || customerSupportSVG} />
{/each}
