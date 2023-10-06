<script lang="ts">
  import { CONTROL_HUB_URL } from '$lib/constants.js';
  import { createEventDispatcher, onMount } from 'svelte';
  import { slide } from 'svelte/transition';

  import { urlEncodedRequest } from '../../../lib/shared/urlencoded-request';
  import defaultSupportImage from '$lib/static/img/customer-support.png';

  export let extensionNumber: number;
  export let videoLink: string;
  export let sipTitle: string;
  export let sipImage: any;
  export let index: number;

  let extensionNumberIsValid = true;
  let videoLinkIsValid = true;
  let sipTitleIsValid = true;
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
    extensionNumberIsValid = !extensionNumber ? false : true;
    videoLinkIsValid = !videoLink ? false : true;
    sipTitleIsValid = !sipTitle ? false : true;
    formIsValid = extensionNumberIsValid && videoLinkIsValid && sipTitleIsValid;

    dispatch('queueIsValid', formIsValid);
    dispatch('sipQs', { event: 'update', payload: { videoLink, sipTitle, extensionNumber, index, sipImage } });
  };

  const pathToFilelist = async (url: string) => {
    const response = await urlEncodedRequest(defaultSupportImage).get();
    const blob = await response.blob();
    const file = new File([blob], 'default-support.png', { lastModified: new Date(), type: 'image/png' });
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

  const handlePosterUpload = async (ev: Event) => {
    const file = sipImageInput.files?.[0];

    if (file?.size > maxFileSize) {
      sipImageInput.setCustomValidity('File size is too large.');
    } else if (file) {
      sipImageInput.setCustomValidity('');
      sipImage = { bits: await toBase64(file), name: file?.name, type: file?.type, lastModified: file?.lastModified };
      handleInputs();
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
    sipImageInput.name = `sipImage${index === 0 ? '' : index}`;
  });
</script>

<div transition:slide={{ duration: index != 0 ? 500 : 0 }} class="sipField columns is-multiline" style="width: 100%">
  <div class="column is-flex is-justify-content-space-between is-full py-0 mb-4 mt-5">
    <h3 class="title is-size-5">
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
        name="extensionNumber{index === 0 ? '' : index}"
        id="extensionNumber{index === 0 ? '' : index}"
        class="input"
        class:is-danger={!extensionNumberIsValid}
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
        {#if !extensionNumberIsValid}
          <p class="has-text-danger">Please provide a valid extension Number.</p>
        {:else}
          <p>
            Configurable number in
            <a href={CONTROL_HUB_URL} target="_blank">CH</a>.
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
        name="videoLink{index === 0 ? '' : index}"
        id="videolinK{index === 0 ? '' : index}"
        class="input"
        class:is-danger={!videoLinkIsValid}
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
      {#if !videoLinkIsValid}
        <p class="has-text-danger">Please provide a valid URL.</p>
      {:else}
        <p>Video source to play while holding in queue.</p>
      {/if}
    </div>
  </div>
  <div class="column pt-0 is-one-quarter">
    <label class="label" for="city-id">Button Label <sup class="has-text-danger" title="required">*</sup></label>
    <div class="control has-icons-left">
      <input
        name="sipTitle{index === 0 ? '' : index}"
        id="sipTitle{index === 0 ? '' : index}"
        class="input"
        class:is-danger={!sipTitleIsValid}
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
      {#if !sipTitleIsValid}
        <p class="has-text-danger">Please provide a title</p>
      {:else}
        <p>To be displayed on the card, max. 24 characters</p>
      {/if}
    </div>
  </div>
  <div class="column pt-0 is-one-quarter">
    <label class="label" for="sipImage{index === 0 ? '' : index}"
      >Image <sup class="has-text-danger" title="required">*</sup></label
    >
    <div class="file has-name is-fullwidth">
      <label class="file-label">
        <input
          id="sipImage{index === 0 ? '' : index}"
          type="file"
          class="file-input"
          accept={acceptedFileTypes}
          bind:this={sipImageInput}
          bind:files={imageFile}
          on:input={handlePosterUpload}
          required
        />
        <span class="file-cta">
          <span class="file-icon">
            <i class="mdi mdi-image-plus" />
          </span>
        </span>
        <span class="file-name">{imageFile?.[0].name || sipImage?.name || 'default-support.png'}</span>
      </label>
    </div>
    <div class="help">
      <p class="help">File must not exceed {maxFileSize / 1000}KB in size</p>
    </div>
  </div>
</div>
