<script lang="ts">
  import Brand from '$components/Brand/Brand.svelte';
  import tooltip from '$lib/actions/tooltip';
  import { formStore, formIsChangedStore } from '$lib/store';

  export let brandLogo: FileList | null = '';

  let acceptedFileTypes: string = '.png, .svg, .gif, .webp, .avif, .apng, .jpg, .jpeg';
  let maxFileSize: number = 200000;

  let displayDeleteButton = false;
  let displayFileSizeError = false;

  const handleLogoUpload = async (ev: Event) => {
    const file = ev.target?.files?.[0];
    if (file?.size > maxFileSize) {
      displayFileSizeError = true;
      brandLogo = null;
      ev.target.setCustomValidity('File size is too large.');
    } else {
      displayFileSizeError = false;
      brandLogo = ev.target?.files;
      displayDeleteButton = false;
      ev.target.setCustomValidity('');
    }

    $formStore['brandLogo'] = brandLogo[0];
  };
</script>

<div class="headerLogo">
  {#if brandLogo?.[0]}
    <div
      class="logoButtons is-fullheight"
      on:mouseenter={() => (displayDeleteButton = true)}
      on:mouseleave={() => (displayDeleteButton = false)}
      use:tooltip={'Replace logo'}
    >
      <Brand title={window.URL.createObjectURL(brandLogo[0])} />
      <button
        class="button is-small is-light deleteIcon"
        class:is-hidden={!displayDeleteButton}
        on:click={() => {
          brandLogo = null;
          $formIsChangedStore = true;
        }}
      >
        <span class="icon is-small">
          <i class="mdi mdi-24px mdi-pencil" />
        </span>
      </button>
    </div>
  {:else}
    <button class="button is-rounded is-align-self-flex-start is-small is-info is-outlined">
      <input
        name="brandLogo"
        id="brandLogo"
        class="file-input"
        type="file"
        accept={acceptedFileTypes}
        on:input={handleLogoUpload}
        required
      />
      <span class="mr-2 is-hidden-mobile">Upload a Logo</span>
      <span class="icon is-small">
        <i class="mdi mdi-24px mdi-upload" on:click={() => (brandLogo = null)} />
      </span>
    </button>
    <div
      class:has-text-grey-light={!displayFileSizeError}
      class:has-text-danger={displayFileSizeError}
      class="icon is-hidden-mobile is-align-self-flex-end informationIcon is-small "
    >
      <i class="mdi mdi-18px mdi-information-outline" />
      <p class="is-size-7 pl-1">
        {displayFileSizeError ? 'File size is too large' : `File must not exceed ${maxFileSize / 1000}KB in size`}
      </p>
    </div>
  {/if}
</div>

<style>
  .deleteIcon {
    top: 0;
    right: 0;
    position: absolute;
  }

  .headerLogo {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 75%;
  }

  .logoButtons {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .informationIcon {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
</style>
