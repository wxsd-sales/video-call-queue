<script lang="ts">
  import { CONTROL_HUB_URL, DEVICE_CALL_QUEUE_SETUP_GUIDE, DEVICE_CALL_QUEUE_VIDCAST } from '$lib/constants.js';
  import { touched, isFormValid, validity, form as formInput } from './utils/form';
  import { createEventDispatcher } from 'svelte';
  import { slide } from 'svelte/transition';

  export let extensionNumber: number;
  export let videoLink: string;
  export let sipTitle: string;
  export let index: number;

  const dispatch = createEventDispatcher();
  $: dispatch('sipQs', { event: 'update', payload: { videoLink, sipTitle, extensionNumber, index } });
</script>

<div use:formInput transition:slide class="sipField columns is-multiline" style="width: 100%">
  <div class="column is-flex is-justify-content-space-between is-full py-0 mb-4 mt-5">
    <h3 class="title is-size-5">
      SIP Queue Number {index + 1}
    </h3>
    {#if index != 0}
      <button
        on:click={() => {
          dispatch('sipQs', { event: 'remove', payload: { index } });
        }}
        type="button"
        class="button is-danger is-rounded is-outlined is-small"
      >
        <span class="icon">
          <i class="mdi mdi-close" />
        </span>
      </button>
    {/if}
  </div>
  <div class="column pt-0 is-third">
    <label class="label" for="extention-number"
      >Extension Number<sup class="has-text-danger" title="required">*</sup></label
    >
    <div class="control has-icons-left">
      <input
        name="extensionNumber{index === 0 ? '' : index}"
        id="extensionNumber{index === 0 ? '' : index}"
        class="input"
        class:is-danger={$touched[`extensionNumber${index ? index : ''}`] &&
          $validity[`extensionNumber${index ? index : ''}`]?.invalid}
        type="number"
        placeholder={String(extensionNumber)}
        bind:value={extensionNumber}
        required
        on:input={() => {}}
      />
      <span class="icon is-left">
        <i class="mdi mdi-phone" />
      </span>
    </div>
    <div class="help">
      <div class="help">
        {#if $touched[`extensionNumber${index ? index : ''}`] && $validity[`extensionNumber${index ? index : ''}`]?.invalid}
          <p class="has-text-danger">Please provide a valid extension Number.</p>
        {:else}
          <p>
            This number must be be configured inside
            <a href={CONTROL_HUB_URL} target="_blank">Control hub</a>.
          </p>
        {/if}
      </div>
    </div>
  </div>
  <div class="column pt-0 is-third">
    <label class="label" for="city-id"
      >Video Commercial Source <sup class="has-text-danger" title="required">*</sup></label
    >
    <div class="control has-icons-left">
      <input
        name="videoLink{index === 0 ? '' : index}"
        id="videolinK{index === 0 ? '' : index}"
        class="input"
        class:is-danger={$touched[`videoLink${index ? index : ''}`] &&
          $validity[`videoLink${index ? index : ''}`]?.invalid}
        type="url"
        placeholder={videoLink}
        bind:value={videoLink}
        required
        on:input={() => {}}
      />
      <span class="icon is-left">
        <i class="mdi mdi-play" />
      </span>
    </div>
    <div class="help">
      {#if $touched[`videoLink${index ? index : ''}`] && $validity[`videoLink${index ? index : ''}`]?.invalid}
        <p class="has-text-danger">Please provide a valid URL.</p>
      {:else}
        <p>Commercial video source to play while holding in queue.</p>
      {/if}
    </div>
  </div>
  <div class="column pt-0 is-third">
    <label class="label" for="city-id">Title <sup class="has-text-danger" title="required">*</sup></label>
    <div class="control has-icons-left">
      <input
        name="sipTitle{index === 0 ? '' : index}"
        id="sipTitle{index === 0 ? '' : index}"
        class="input"
        class:is-danger={$touched[`sipTitle${index ? index : ''}`] &&
          $validity[`sipTitle${index ? index : ''}`]?.invalid}
        placeholder={sipTitle}
        bind:value={sipTitle}
        maxlength="24"
        required
      />
      <span class="icon is-left">
        <i class="mdi mdi-format-header-1" />
      </span>
    </div>
    <div class="help">
      {#if $touched[`sipTitle${index ? index : ''}`] && $validity[`sipTitle${index ? index : ''}`]?.invalid}
        <p class="has-text-danger">Please provide a title</p>
      {:else}
        <p>To be displayed on the card, max. 24 characters</p>
      {/if}
    </div>
  </div>
</div>
