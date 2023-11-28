<script lang="ts">
  import { CONTROL_HUB_URL } from '$lib/constants.js';
  import { createEventDispatcher, onMount } from 'svelte';
  import { slide } from 'svelte/transition';

  import { urlEncodedRequest } from '../../../lib/shared/urlencoded-request';
  import customerSupport from '$lib/static/img/customer-support.svg';

  export let extensionNumber: number;
  export let videoLink: string;
  export let sipTitle: string;
  export let sipImage: any;
  export let index: number;

  let extensionNumberError: string;
  let videoLinkError: string;
  let sipTitleError: string;
  let formIsValid: boolean;
  let sipImageInput: HTMLInputElement;

  let acceptedFileTypes: string = '.jpg, .jpeg, .png, .svg, .gif, .webp, .avif, .apng';
  let maxFileSize: number = 200000;
  let imageFile: FileList | null;

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const dispatch = createEventDispatcher();
  const handleInputs = () => {
    const extensionNumberRegex = new RegExp('^[0-9]{0,6}$');
    const nullErrorMsgTemplate = (type: string) => `Please provide a valid ${type}`;

    extensionNumberError = !extensionNumber
      ? nullErrorMsgTemplate('extension number')
      : !extensionNumberRegex.test(String(extensionNumber))
      ? 'The input may consist of up to six numerical digits'
      : '';
    videoLinkError = !videoLink ? nullErrorMsgTemplate('video link') : '';
    sipTitleError = !sipTitle ? nullErrorMsgTemplate('title') : '';

    formIsValid = !extensionNumberError && !videoLinkError && !sipTitleError;
    dispatch('queueIsValid', formIsValid);
    dispatch('sipQs', { event: 'update', payload: { videoLink, sipTitle, extensionNumber, index, sipImage } });
  };

  const pathToFilelist = async (url: string) => {
    const response = await urlEncodedRequest(customerSupport).get();
    const blob = await response.blob();
    const file = new File([blob], 'customer-support.svg', { lastModified: new Date(), type: 'image/svg+xml' });
    const container = new DataTransfer();
    container.items.add(file);

    return container.files;
  };

  const bitsToFileList = (file: { bits: string; name: string; lastModified: number; type: string }) => {
    return file != null
      ? urlEncodedRequest(file.bits)
          .get()
          .then((r) => r.blob())
          .then((r) => new File([r], file.name, { lastModified: file.lastModified, type: file.type }))
          .then((r) => {
            const container = new DataTransfer();
            container.items.add(r);
            return container.files;
          })
      : Promise.resolve(null);
  };

  const handleSIPImageUpload = async (ev: Event) => {
    const file = sipImageInput.files?.[0];

    if (file?.size > maxFileSize) {
      sipImageInput.setCustomValidity('File size is too large');
    } else if (file) {
      sipImageInput.setCustomValidity('');
      sipImage = { bits: await toBase64(file), name: file?.name, type: file?.type, lastModified: file?.lastModified };
      handleInputs();
    } else {
      sipImage = null;
    }

    sipImageInput.reportValidity();
  };

  onMount(async () => {
    if (sipImage) {
      imageFile = await bitsToFileList(sipImage);
    } else {
      imageFile = await pathToFilelist(sipImage);
    }

    imageFile?.[0] != null ? (sipImageInput.files = imageFile) : null;
  });
</script>

<div transition:slide={{ duration: index != 0 ? 500 : 0 }} class="columns is-multiline">
  <div class="column is-flex is-justify-content-space-between is-full py-0 my-4">
    <h3 class="title mb-0 is-size-5">
      SIP Queue Number {index + 1}
    </h3>
    {#if index != 0}
      <button
        on:click={() => {
          dispatch('sipQs', { event: 'remove', payload: { index } });
          imageFile = null;
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
  <div class="column pt-0 is-one-quarter">
    <label class="label" for="extention-number"
      >Extension Number<sup class="has-text-danger" title="required">*</sup></label
    >
    <div class="control has-icons-left">
      <input
        name="extensionNumber{index + 1}"
        id="extensionNumber{index + 1}"
        class="input"
        class:is-danger={extensionNumberError}
        type="number"
        placeholder={String(extensionNumber)}
        bind:value={extensionNumber}
        required
        on:input={handleInputs}
      />
      <span class="icon is-left">
        <i class="mdi mdi-phone" />
      </span>
    </div>
    <div class="help">
      <div class="help">
        {#if extensionNumberError}
          <p class="has-text-danger">{extensionNumberError}</p>
        {:else}
          <p>
            Configurable number in
            <a href={CONTROL_HUB_URL} target="_blank">CH</a>
          </p>
        {/if}
      </div>
    </div>
  </div>
  <div class="column pt-0 is-one-quarter">
    <label class="label" for="city-id"
      >Video Commercial Source <sup class="has-text-danger" title="required">*</sup></label
    >
    <div class="control has-icons-left">
      <input
        name="videoLink{index + 1}"
        id="videoLink{index + 1}"
        class="input"
        class:is-danger={videoLinkError}
        type="url"
        placeholder={videoLink}
        bind:value={videoLink}
        required
        on:input={handleInputs}
      />
      <span class="icon is-left">
        <i class="mdi mdi-play" />
      </span>
    </div>
    <div class="help">
      {#if videoLinkError}
        <p class="has-text-danger">{videoLinkError}</p>
      {:else}
        <p>Video source to play while holding in queue</p>
      {/if}
    </div>
  </div>
  <div class="column pt-0 is-one-quarter">
    <label class="label" for="city-id">Button Label <sup class="has-text-danger" title="required">*</sup></label>
    <div class="control has-icons-left">
      <input
        name="sipTitle{index + 1}"
        id="sipTitle{index + 1}"
        class="input"
        class:is-danger={sipTitleError}
        placeholder={sipTitle}
        bind:value={sipTitle}
        maxlength="24"
        required
        on:input={handleInputs}
      />
      <span class="icon is-left">
        <i class="mdi mdi-format-header-1" />
      </span>
    </div>
    <div class="help">
      {#if sipTitleError}
        <p class="has-text-danger">{sipTitleError}</p>
      {:else}
        <p>To be displayed on the card, max. 24 characters</p>
      {/if}
    </div>
  </div>
  <div class="column pt-0 is-one-quarter">
    <label class="label" for="sipImage{index + 1}">Image <sup class="has-text-danger" title="required">*</sup></label>
    <div class="file has-name is-fullwidth">
      <label class="file-label">
        <input
          id="sipImage{index + 1}"
          name="sipImage{index + 1}"
          type="file"
          class="file-input"
          accept={acceptedFileTypes}
          bind:this={sipImageInput}
          bind:files={imageFile}
          on:input={handleSIPImageUpload}
          required
        />
        <span class="file-cta">
          <span class="file-icon">
            <i class="mdi mdi-image-plus" />
          </span>
        </span>
        <span class="file-name">{imageFile?.[0]?.name || sipImage?.name || 'No File Selected'}</span>
      </label>
    </div>
    <div class="help">
      <p class="help">File must not exceed {maxFileSize / 1000}KB in size</p>
    </div>
  </div>
</div>
