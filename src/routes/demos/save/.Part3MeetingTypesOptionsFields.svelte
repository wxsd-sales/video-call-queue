<script lang="ts">
  import { slide } from 'svelte/transition';
  import CodeSnippet from '$components/CodeSnippet/CodeSnippet.svelte';
  import Modal from '$components/Modal/Modal.svelte';
  import SIPQueueField from './.Part3.5MeetingTypesOptionsSIPFields.svelte';

  import { generateMacro } from '$lib/webex/macro/WxCQ.js';
  import { previewedDemoStore } from '$lib/store';
  import { CONTROL_HUB_URL, DEVICE_CALL_QUEUE_SETUP_GUIDE, DEVICE_CALL_QUEUE_VIDCAST } from '$lib/constants.js';

  import { onMount } from 'svelte';

  export let id: string;
  export let SIPQueues = [];

  let generateIsLoading = false;
  let macroButtonIsDisabled = false;
  let code = generateMacro(SIPQueues);
  let showModal = false;
</script>

<div class="columns is-multiline">
  <div class="column ">
    <h2 class="title">Video SIP Call Configuration</h2>
  </div>
  <div class="column is-flex  is-justify-content-flex-end is-align-items-center">
    <button
      class="button is-rounded is-success is-outlined"
      type="button"
      disabled={SIPQueues.length >= 4}
      on:click={() => {
        SIPQueues = [
          ...SIPQueues,
          {
            videoLink: 'https://wxsd-sales.github.io/video-queue-macro/example-content',
            extensionNumber: 1111,
            sipTitle: 'Looking For Assistance?',
            sipImage: null
          }
        ];
        $previewedDemoStore.SIPQueues = SIPQueues;
      }}
    >
      <span class="icon">
        <i class="mdi mdi-plus" />
      </span>
      <span>Add More SIP URIs</span>
    </button>
  </div>
  <div transition:slide class="columns m-2 is-multiline">
    <div class="column is-full content ">
      <p>
        <span class="is-italic"> SIP URI Dialing</span> feature will only be available on Cisco roomOS devices. This
        feature also requires users to create a call queue under
        <a target="_blank" href={`${CONTROL_HUB_URL}/calling/features/callQueue`}>Webex control hub call management</a>
        section, and enable a macro - which could be auto generated here - on their devices*. Please also note that
        <code>SipUrlHandler</code> toggle must be enabled for this flow. For more information on how to enable this
        toggle please click <a href="https://roomos.cisco.com/doc/TechDocs/KioskMode#placing-a-call">here</a>.
      </p>

      <p class="help">
        * If you are not familiar with video call queue feature on devices powered by Webex Calling, we highly recommend
        you to watch this <a target="_blank" href={DEVICE_CALL_QUEUE_VIDCAST}>vidcast</a>
        and follow the steps mentioned in our
        <a target="_blank" href={DEVICE_CALL_QUEUE_SETUP_GUIDE}>setup guide</a>.
      </p>
    </div>
    <div class="column is-full">
      {#each SIPQueues as { videoLink, extensionNumber, sipTitle, sipImage }, i (i)}
        <SIPQueueField
          {extensionNumber}
          {videoLink}
          index={i}
          {sipTitle}
          {sipImage}
          on:queueIsValid={({ detail: formIsValid }) => (macroButtonIsDisabled = !formIsValid)}
          on:sipQs={({ detail: { event, payload } }) => {
            switch (event) {
              case 'update':
                const { index, videoLink, sipTitle, extensionNumber, sipImage } = payload;
                SIPQueues[index] = {
                  videoLink,
                  sipTitle,
                  extensionNumber,
                  sipImage
                };
                break;
              case 'remove':
                SIPQueues = [...SIPQueues.slice(0, payload.index), ...SIPQueues.slice(payload.index + 1)];
                break;
            }
            $previewedDemoStore.SIPQueues = SIPQueues;
          }}
        />
      {/each}
    </div>

    <div class="column is-full is-flex is-align-items-center is-justify-content-center p-0 ">
      <hr class="column is-three-quarters p-0" />
    </div>
    <div class="column is-flex p-0 is-justify-content-space-between is-align-items-center">
      <div class="mb-0 has-text-dark title is-size-7">Total number of Queues: {SIPQueues.length} / 4</div>
      <button
        disabled={macroButtonIsDisabled}
        class:is-loading={generateIsLoading}
        type="button"
        class="button is-small is-rounded is-primary is-light m-2 "
        on:click={() => {
          generateIsLoading = true;
          code = generateMacro(SIPQueues);
          setTimeout(() => {
            generateIsLoading = false;
            showModal = true;
          }, 1000);
        }}
      >
        <span class="icon">
          <i class="mdi mdi-cog" />
        </span>
        <span> Generate Macro </span>
      </button>
    </div>
  </div>
</div>

<Modal bind:showModal>
  <div class="modal-content snippet is-translucent-black">
    <CodeSnippet {code} language="javascript" filename="VCQMacro.js" />
  </div>
</Modal>

<style>
  .snippet {
    height: 50rem;
    padding: 1.5rem;
    width: 100%;
    border-radius: 1rem;
  }
</style>
