<script lang="ts">
  import { slide } from 'svelte/transition';
  import { MEETING_TYPE_OPTIONS } from '$lib/enums';
  import CodeSnippet from '$components/CodeSnippet/CodeSnippet.svelte';
  import Modal from '$components/Modal/Modal.svelte';

  import { generateMacro } from '../../../static/macros/WxCQ.js';

  import { touched, isFormValid, validity, form as formInput } from './utils/form';

  export let isSDK: boolean;
  export let isIC: boolean;
  export let isSIP: boolean;
  export let videoLink = 'https://wxsd-sales.github.io/video-queue-macro/example-content';
  export let extensionNumber: number;

  let isNotRequired = isSDK || isIC || isSIP;
  let SDKCheckBoxElement: HTMLInputElement;
  let ICCheckBoxElement: HTMLInputElement;
  let SIPCheckBoxElement: HTMLInputElement;
  let showModal = false;
  let generateIsLoading = false;

  $: code = generateMacro(videoLink, extensionNumber);
  /**
   * All checkboxes required statues may disable if only one checkbox is checked.
   *
   * @returns {void}
   */
  const handleCheckboxesRequiredStatus = () => {
    isNotRequired = SDKCheckBoxElement.checked || ICCheckBoxElement.checked || SIPCheckBoxElement.checked;
  };
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
      />
      Meeting Browser SDK
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
      />
      Instant Connect
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
        <hr />
        <h3 class="title is-size-5">Video SIP Call Queue Macro Builder</h3>
      </div>
      <div class="column is-full content mb-3">
        <p>
          <span class="is-italic"> SIP URI Dialing</span> feature will only be available on Cisco roomOS devices. This
          feature also requires users to create a call queue under
          <a target="_blank" href="https://admin.webex.com/calling/features/callQueue"
            >Webex Control Hub Call Management</a
          > section, and enable a macro - which could be auto generated here - on their devices.
        </p>

        <p class="help">
          * If you are not familiar with video call queue feature on devices powered by Webex Calling, we highly
          recommend you to watch this <a
            target="_blank"
            href="https://app.vidcast.io/share/05285d39-75a7-429e-81d0-61911a931973">vidcast</a
          >
          and follow the steps mentioned in our
          <a
            target="_blank"
            href="https://cisco.sharepoint.com/sites/WXSD-WebexSolutionsDevelopment/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FWXSD%2DWebexSolutionsDevelopment%2FShared%20Documents%2FDemos%2FVideo%20Device%20Kisosk%20on%20WxC%2FOld%20version%2FCisco%20Device%20Kiosk%20using%20Macros%20%26%20Webex%20Calling%20Group%20Call%20Management%2Epdf&parent=%2Fsites%2FWXSD%2DWebexSolutionsDevelopment%2FShared%20Documents%2FDemos%2FVideo%20Device%20Kisosk%20on%20WxC%2FOld%20version&p=true&ga=1"
            >setup guide</a
          >.
        </p>
      </div>

      <div class="column is-half">
        <label class="label" for="city-id">Extension Number<sup class="has-text-danger" title="required">*</sup></label>
        <div class="control has-icons-left">
          <input
            name="extensionNumber"
            id="extensionNumber"
            class="input"
            type="number"
            placeholder="1111"
            bind:value={extensionNumber}
            required
          />
          <span class="icon is-left">
            <i class="mdi mdi-phone" />
          </span>
        </div>
        <div class="help">
          <p>
            Extension number to call the queue. This number must be be configured inside
            <a href="https://admin.webex.com" target="_blank">Control hub</a>.
          </p>
        </div>
      </div>
      <div class="column is-half">
        <label class="label" for="city-id"
          >Video Commercial Source <sup class="has-text-danger" title="required">*</sup></label
        >
        <div class="control has-icons-left">
          <input
            name="videoLink"
            id="extensionNumber"
            class="input"
            class:is-danger={$touched?.videoLink && $validity.videoLink?.invalid}
            type="url"
            placeholder="https://wxsd-sales.github.io/video-queue-macro/example-content"
            bind:value={videoLink}
            required
          />
          <span class="icon is-left">
            <i class="mdi mdi-play" />
          </span>
        </div>
        <div class="help">
          {#if $touched?.videoLink && $validity.videoLink?.invalid}
            <p class="has-text-danger">Please provide a valid URL.</p>
          {:else}
            <p>Commercial video source to play while holding in queue.</p>
          {/if}
        </div>
      </div>
      <div class="column is-flex p-0 is-justify-content-flex-end">
        <button
          disabled={!$isFormValid}
          class:is-loading={generateIsLoading}
          type="button"
          class="button is-small is-rounded is-primary is-light m-2 "
          on:click={() => {
            generateIsLoading = true;
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

<Modal bind:isActive={showModal}>
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
