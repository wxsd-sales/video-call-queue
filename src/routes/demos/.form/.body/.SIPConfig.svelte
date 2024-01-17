<script lang="ts">
  import { CONTROL_HUB_URL } from '$lib/constants.js';
  import { createEventDispatcher } from 'svelte';

  export let extensionNumber: number;
  export let videoLink: string;
  export let sipTitle: string;
  export let sipImage: any;
  export let index: number;

  let extensionNumberError: string;
  let videoLinkError: string;
  let sipTitleError: string;

  let acceptedFileTypes: string = '.jpg, .jpeg, .png, .svg, .gif, .webp, .avif, .apng';
  let maxFileSize: number = 200000;
  let displayFileSizeError = false;

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const dispatch = createEventDispatcher();

  const dispatchConfigUpdates = (formIsValid: boolean) => {
    dispatch('queueIsValid', { formIsValid, index });

    if (formIsValid)
      dispatch('sipQs', { event: 'update', payload: { videoLink, sipTitle, extensionNumber, index, sipImage } });
  };

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

    const formIsValid = !extensionNumberError && !videoLinkError && !sipTitleError;
    dispatchConfigUpdates(formIsValid);
  };

  const handleSIPImageUpload = async (ev: Event) => {
    const file = ev.target?.files?.[0];
    let validFileInput = false;

    if (file?.size > maxFileSize) {
      displayFileSizeError = true;
      sipImage = null;
    } else {
      validFileInput = true;
      displayFileSizeError = false;
      sipImage = { bits: await toBase64(file), name: file?.name, type: file?.type, lastModified: file?.lastModified };
    }

    dispatchConfigUpdates(validFileInput);
  };
</script>

<form name="sip">
  <div class="mx-1 mb-4">
    <label class="label" for="extention-number"
      >Extension Number<sup class="has-text-danger" title="required">*</sup></label
    >
    <div class="control has-icons-left">
      <input
        name="extensionNumber{index}"
        id="extensionNumber{index}"
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
  <div class="mx-1 mb-4">
    <label class="label" for="city-id"
      >Video Commercial Source <sup class="has-text-danger" title="required">*</sup></label
    >
    <div class="control has-icons-left">
      <input
        name="videoLink{index}"
        id="videoLink{index}"
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
  <div class="mx-1 mb-4">
    <label class="label" for="city-id">Button Label <sup class="has-text-danger" title="required">*</sup></label>
    <div class="control has-icons-left">
      <input
        name="sipTitle{index}"
        id="sipTitle{index}"
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
  <div class="mx-1 mb-4">
    <label class="label" for="sipImage{index}">Image <sup class="has-text-danger" title="required">*</sup></label>
    <div class="file has-name is-fullwidth">
      <label class="file-label">
        <input
          id="sipImage{index}"
          name="sipImage{index}"
          type="file"
          class="file-input"
          accept={acceptedFileTypes}
          on:input={handleSIPImageUpload}
          required
        />
        <span class="file-cta">
          <span class="file-icon">
            <i class="mdi mdi-image-plus" />
          </span>
        </span>
        <span class="file-name has-text-dark">{sipImage?.name || 'No File Selected'}</span>
      </label>
    </div>
    <div class:has-text-grey-white={!displayFileSizeError} class:has-text-danger={displayFileSizeError} class="help ">
      <p class="is-size-7 pl-1 ">
        {displayFileSizeError ? 'File size is too large' : `File must not exceed ${maxFileSize / 1000}KB in size`}
      </p>
    </div>
  </div>
</form>
