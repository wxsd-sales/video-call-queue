<script lang="ts">
  import Brand from '$components/Brand/Brand.svelte';
  import { previewedDemoStore } from '$lib/store';
  import { onMount } from 'svelte';

  export let logo: FileList = undefined;
  export let acceptedFileTypes: string = '.png, .svg, .gif, .webp, .avif, .apng';
  export let maxFileSize: number = 200000;

  let logoInput: HTMLInputElement;
  let clientHeight: number;
  let clientWidth: number;
  let naturalHeight: number;
  let naturalWidth: number;

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  export const handleLogoUpload = async (ev: Event) => {
    clientHeight = clientWidth = naturalHeight = naturalWidth = undefined;
    const file = (ev.target as HTMLInputElement)?.files?.[0];
    if (file?.size > maxFileSize) {
      (ev.target as HTMLInputElement).setCustomValidity('File size is too large.');
    } else if (file) {
      (ev.target as HTMLInputElement).setCustomValidity('');
      const payload = {
        file: { bits: await toBase64(file), name: file?.name, type: file?.type, lastModified: file?.lastModified }
      };

      $previewedDemoStore.brandLogo = payload.file;
    }
    (ev.target as HTMLInputElement).reportValidity();
  };

  export const handleLogoLoad = (ev: Event) => {
    const image = ev.target as HTMLImageElement;
    ({ clientHeight, clientWidth, naturalHeight, naturalWidth } = image);
  };

  onMount(() => (logo?.[0] != null ? (logoInput.files = logo) : null));
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">Brand</h2>
  </div>
  <div class="column is-full content mb-0">
    <p>
      Set a custom image to appear in the top portion of the device's display. For best results, choose an off-white
      image that is wide and has transparent background.
    </p>
  </div>
  <div class="column is-12">
    <label class="label" for="logo">Logo <sup class="has-text-danger" title="required">*</sup></label>
    <div class="file has-name is-fullwidth">
      <label class="file-label">
        <input
          name="brandLogo"
          id="brandLogo"
          class="file-input"
          type="file"
          accept={acceptedFileTypes}
          bind:this={logoInput}
          bind:files={logo}
          on:input={handleLogoUpload}
          required
        />
        <span class="file-cta">
          <span class="file-icon">
            <i class="mdi mdi-image-plus" />
          </span>
        </span>
        <span class="file-name">{logo?.[0]?.name || 'No file selected'}</span>
      </label>
    </div>
    <p class="help">Minimum recommended image resolution is 320W &#10005; 70H</p>
    <p class="help">Accepted file types are {acceptedFileTypes}</p>
    <p class="help">File must not exceed {maxFileSize / 1000}KB in size</p>
  </div>
  <div
    id="logo-preview"
    class="column is-flex is-flex-direction-column is-justify-content-space-around  is-two-fifth ml-1"
  >
    {#if logo?.[0]}
      <div class=" help is-mobile mb-1">
        <p class=" label mb-0">Preview</p>
      </div>
      <Brand title={window.URL.createObjectURL(logo[0])} on:load={handleLogoLoad} />
      <p class="help">
        Dimensions:
        {clientWidth}W &#10005; {clientHeight}H (scaled); {naturalWidth}W &#10005; {naturalHeight}H (original)
      </p>
    {:else}
      <div class="level is-mobile help">
        <p class="level-left label mb-0">Preview</p>
        <p class="level-right">Not available</p>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  #logo-preview :global(img.is-brand-logo) {
    background: repeating-conic-gradient(hsl(0deg, 0%, 71%) 0% 25%, transparent 0% 50%) 50% / 10px 10px;
    width: fit-content;
  }
</style>
