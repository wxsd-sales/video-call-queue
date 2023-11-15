<script lang="ts">
  import Card from '$components/Card/Card.svelte';

  import customerSupportSVG from '$lib/static/img/customer-support.svg';

  export let demo: JSON;
  export let isDevice: boolean;

  const { isSIP, isSDK, isIC, uuid, sipQueues } = demo;
  const queues = sipQueues ?? [{ title: 'Looking for Assistance?', extensionNumber: 1111, img: null }];

  let displaySIPErrorNotification = false;
  let displayNewSIPErrorNotification = false;
  let timer = 8;
</script>

<div class="prompts is-flex is-justify-content-space-evenly">
  {#each queues as { extensionNumber, title, img }, index}
    <Card {isDevice} {extensionNumber} {title} img={img || customerSupportSVG} />
  {/each}
</div>
