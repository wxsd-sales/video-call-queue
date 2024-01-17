<!-- svelte-ignore a11y-missing-attribute -->
<script lang="ts">
  import PreviewCard from './.body/.PreviewCard.svelte';
  import SIPConfigModal from './.body/.SIPConfigModal.svelte';
  import { formStore } from '$lib/store';
  import { toFileList } from '../.helpers';

  export let SIPQueues: Array<any>;

  let showModal = false;
</script>

<div class="columns formBody">
  {#each SIPQueues as queue, index}
    <PreviewCard
      {queue}
      {index}
      on:showModal={() => {
        showModal = true;
      }}
    />
  {/each}
</div>

{#key showModal}
  <SIPConfigModal
    bind:showModal
    {SIPQueues}
    on:queuesUpdate={async ({
      detail: {
        payload: { newSIPQueues }
      }
    }) => {
      for (let i = 0; i < SIPQueues.length; i++) {
        $formStore[`extensionNumber${i + 1}`] = null;
        $formStore[`videoLink${i + 1}`] = null;
        $formStore[`sipTitle${i + 1}`] = null;
        $formStore[`sipImage${i + 1}`] = null;
      }

      SIPQueues = newSIPQueues;
      for (let index = 0; index < SIPQueues.length; index++) {
        $formStore[`extensionNumber${index + 1}`] = SIPQueues[index].extensionNumber;
        $formStore[`videoLink${index + 1}`] = SIPQueues[index].videoLink;
        $formStore[`sipTitle${index + 1}`] = SIPQueues[index].sipTitle;
        $formStore[`sipImage${index + 1}`] =
          SIPQueues[index].sipImage instanceof File
            ? SIPQueues[index].sipImage
            : (await toFileList(SIPQueues[index].sipImage))[0];
      }
    }}
  />
{/key}

<style>
  .formBody {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    z-index: 2;
  }
</style>
