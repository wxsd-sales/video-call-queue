<script lang="ts">
  import { slide } from 'svelte/transition';
  import { MEETING_TYPE_OPTIONS } from '$lib/enums';
  import CodeSnippet from '$components/CodeSnippet/CodeSnippet.svelte';
  import Modal from '$components/Modal/Modal.svelte';

  import { generateMacro } from '$lib/static/macro/WxCQ.js';

  import { isFormValid, form as formInput } from './utils/form';
  import { CONTROL_HUB_URL, DEVICE_CALL_QUEUE_SETUP_GUIDE, DEVICE_CALL_QUEUE_VIDCAST } from '$lib/constants.js';
  import SIPQueueField from './.Part3.5MeetingTypesOptionsSIPFields.svelte';
  import { SIPQueuesStore } from '$lib/store';

  export let isSDK: boolean;
  export let isIC: boolean;
  export let isSIP: boolean;
  export let SIPQueues = [
    {
      videoLink: 'https://wxsd-sales.github.io/video-queue-macro/example-content',
      extensionNumber: 1111,
      sipTitle: 'Looking For Assistance?'
    }
  ];

  let isNotRequired = isSDK || isIC || isSIP;
  let SDKCheckBoxElement: HTMLInputElement;
  let ICCheckBoxElement: HTMLInputElement;
  let SIPCheckBoxElement: HTMLInputElement;
  let generateIsLoading = false;
  let code = generateMacro(SIPQueues);
  let showModal = false;

  // validity.subscribe((x) => console.log(x));
  /**
   * All checkboxes required statues may disable if only one checkbox is checked.
   *
   * @returns {void}
   */
  const handleCheckboxesRequiredStatus = () => {
    isNotRequired = SDKCheckBoxElement.checked || ICCheckBoxElement.checked || SIPCheckBoxElement.checked;
  };

  //IC & SDK option will be disabled if multiple SIP queues is enabled
  $: isIC = SIPQueues.length > 1 ? false : isIC;
  $: isSDK = SIPQueues.length > 1 ? false : isSDK;
  $: if (!isSIP)
    SIPQueues = [
      {
        videoLink: 'https://wxsd-sales.github.io/video-queue-macro/example-content',
        extensionNumber: 1111,
        sipTitle: 'Looking For Assistance?'
      }
    ];
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">Video Call Options</h2>
  </div>
  <div class="column is-full content mb-0">
    <p>Provide a list of video call options for a requester to choose from.</p>
  </div>
  <!-- A -->
  <div class="column is-one-third">
    <label class="label" for="subtitle">Options <sup class="has-text-danger" title="required">*</sup></label>
    <label class="checkbox">
      <input
        type="checkbox"
        bind:checked={isSDK}
        id={MEETING_TYPE_OPTIONS.BROWSER_SDK}
        name={MEETING_TYPE_OPTIONS.BROWSER_SDK}
        bind:this={SDKCheckBoxElement}
        on:input={handleCheckboxesRequiredStatus}
        required={!isNotRequired}
        disabled={SIPQueues.length > 1}
      />
      <span class:has-text-grey-light={SIPQueues.length > 1}> Meeting Browser SDK </span>
    </label>
    <div class="help">
      <p>
        For more information click <a target="_blank" href={import.meta.env.PUBLIC_BROWSER_SDK_GETTING_STARTED_URL}
          >here</a
        >
      </p>
    </div>
  </div>
  <div class="column is-one-third is-flex is-flex-direction-column is-justify-content-flex-end">
    <label class="checkbox">
      <label class="label" for="subtitle"> <sup class="has-text-danger" title="required" /> </label>
      <input
        type="checkbox"
        bind:checked={isIC}
        id={MEETING_TYPE_OPTIONS.INSTANT_CONNECT}
        name={MEETING_TYPE_OPTIONS.INSTANT_CONNECT}
        bind:this={ICCheckBoxElement}
        on:input={handleCheckboxesRequiredStatus}
        required={!isNotRequired}
        disabled={SIPQueues.length > 1}
      />
      <span class:has-text-grey-light={SIPQueues.length > 1}> Instant Connect </span>
    </label>
    <div class="help">
      <p>
        For more information click <a target="_blank" href={import.meta.env.PUBLIC_INSTANT_CONNECT_GETTING_STARTED_URL}
          >here</a
        >
      </p>
    </div>
  </div>
  <div class="column is-one-third is-flex is-flex-direction-column is-justify-content-flex-end">
    <label class="checkbox">
      <input
        type="checkbox"
        bind:checked={isSIP}
        id={MEETING_TYPE_OPTIONS.SIP_URI_DIALING}
        name={MEETING_TYPE_OPTIONS.SIP_URI_DIALING}
        bind:this={SIPCheckBoxElement}
        on:input={handleCheckboxesRequiredStatus}
        required={!isNotRequired}
      />
      SIP URI Dialing
    </label>
    <div class="help">
      <p>
        For more information click <a
          target="_blank"
          href="https://community.cisco.com/t5/collaboration-knowledge-base/sip-uri-dialing/ta-p/3157406">here</a
        >
      </p>
    </div>
  </div>

  {#if isSIP}
    <div use:formInput transition:slide class="columns ml-4 mr-4 is-multiline">
      <div class="column is-full ">
        <h3 class="mt-6 title is-size-5">Video SIP Call Queue Macro Builder</h3>
      </div>
      <div class="column is-full content mb-3">
        <p>
          <span class="is-italic"> SIP URI Dialing</span> feature will only be available on Cisco roomOS devices. This
          feature also requires users to create a call queue under
          <a target="_blank" href={`${CONTROL_HUB_URL}/calling/features/callQueue`}>Webex control hub call management</a
          >
          section, and enable a macro - which could be auto generated here - on their devices*. Please also note that
          <code>SipUrlHandler</code> toggle must be enabled for this flow. For more information on how to enable this
          toggle please click <a href="https://roomos.cisco.com/doc/TechDocs/KioskMode#placing-a-call">here</a>.
        </p>

        <p class="help">
          * If you are not familiar with video call queue feature on devices powered by Webex Calling, we highly
          recommend you to watch this <a target="_blank" href={DEVICE_CALL_QUEUE_VIDCAST}>vidcast</a>
          and follow the steps mentioned in our
          <a target="_blank" href={DEVICE_CALL_QUEUE_SETUP_GUIDE}>setup guide</a>.
        </p>
      </div>
      <div class="column is-full is-flex is-align-items-center is-justify-content-center p-0 ">
        <hr class="column is-three-quarters p-0" />
      </div>
      <div class="column is-full is-flex  is-justify-content-flex-end is-align-items-center">
        <button
          class="button is-rounded is-success is-outlined"
          type="button"
          disabled={SIPQueues.length >= 4}
          on:click={() => {
            SIPQueues = [
              ...SIPQueues,
              $SIPQueuesStore[SIPQueues.length] || {
                videoLink: 'https://wxsd-sales.github.io/video-queue-macro/example-content',
                extensionNumber: 1111,
                sipTitle: 'Looking For Assistance?'
              }
            ];
          }}
        >
          <span class="icon">
            <i class="mdi mdi-plus" />
          </span>
          <span>Add More SIP URIs</span>
        </button>
      </div>
      {#each SIPQueues as { videoLink, extensionNumber, sipTitle }, i}
        <SIPQueueField
          {extensionNumber}
          {videoLink}
          index={i}
          {sipTitle}
          on:sipQs={({ detail: { event, payload } }) => {
            switch (event) {
              case 'update':
                const { index, videoLink, sipTitle, extensionNumber } = payload;
                SIPQueues[index] = { videoLink, sipTitle, extensionNumber };
                $SIPQueuesStore = SIPQueues;
                break;
              case 'remove':
                SIPQueues = [
                  ...SIPQueues.slice(0, payload.index),
                  ...SIPQueues.slice(payload.index + 1, SIPQueues.length)
                ];
                break;
            }
          }}
        />
      {/each}
      <div class="column is-full is-flex is-align-items-center is-justify-content-center p-0 ">
        <hr class="column is-three-quarters p-0" />
      </div>
      <div class="column is-flex p-0 is-justify-content-space-between is-align-items-center">
        <div class="mb-0 has-text-dark title is-size-7">Total number of Queues: {SIPQueues.length} / 4</div>
        <button
          disabled={!$isFormValid}
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
  {/if}
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
