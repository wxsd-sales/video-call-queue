<script lang="ts">
  import Background from '$components/Background/Background.svelte';
  import EmptyImage from '$lib/static/img/empty-image.avif';
  import { formStore, formIsChangedStore } from '$lib/store';

  export let backgroundBrightness: number = 55;
  export let backgroundPoster: FileList | null = null;

  const acceptedFileTypes: string = '.png, .svg, .gif, .webp, .avif, .apng';
  const maxFileSize: number = 700000;

  let hideDeleteButton = true;
  let displayFileSizeError = false;

  const handleBackgroundPosterUpload = async (ev: Event) => {
    const file = ev.target?.files?.[0];
    if (file?.size > maxFileSize) {
      displayFileSizeError = true;
      backgroundPoster = null;
      ev.target.setCustomValidity('File size is too large.');
    } else {
      displayFileSizeError = false;
      backgroundPoster = ev.target?.files;
      ev.target.setCustomValidity('');
    }

    $formStore['backgroundPoster'] = backgroundPoster[0];
    hideDeleteButton = true;
  };
</script>

<div class="content">
  {#if backgroundPoster?.[0]}
    <div class="p-2 m-2 is-translucent-black slider is-hidden-mobile">
      <input
        type="range"
        min="0"
        max="100"
        bind:value={backgroundBrightness}
        on:input={() => ($formStore['backgroundBrightness'] = backgroundBrightness)}
      />
      <p style="width: 3rem" class="ml-4 has-text-white is-size-3">{backgroundBrightness}</p>
    </div>
    <Background
      imageLink={window.URL.createObjectURL(backgroundPoster[0])}
      filter="brightness({backgroundBrightness}%)"
    />
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="deleteButtonWrapper"
      on:mouseenter={() => (hideDeleteButton = false)}
      on:mouseleave={() => (hideDeleteButton = true)}
    >
      <button
        on:click={() => {
          backgroundPoster = null;
          $formIsChangedStore = true;
        }}
        class:is-hidden={hideDeleteButton}
        class="button deleteButton is-danger mr-2 mt-2"
        type="button"
      >
        <span class="icon is-small">
          <i class="mdi mdi-36px  mdi-close" />
        </span>
      </button>
    </div>
  {:else}
    <Background imageLink={EmptyImage} filter="brightness({25}%)" />
    <div class="backgroundPosterButton ml-2">
      <button class="button mb-1 is-rounded  is-small">
        <input
          name="backgroundPoster"
          id="backgroundPoster"
          class="file-input"
          type="file"
          accept={acceptedFileTypes}
          on:input={handleBackgroundPosterUpload}
          required
        />
        <span class="mr-2 is-hidden-mobile">Upload a Background Poster</span>
        <span class="icon is-small">
          <i class="mdi mdi-24px mdi-image" />
        </span>
      </button>
      <div
        class:has-text-grey-white={!displayFileSizeError}
        class:has-text-danger={displayFileSizeError}
        class="icon is-hidden-mobile  informationIcon is-small "
      >
        <i class="mdi mdi-18px mdi-information-outline " />
        <p class="is-size-7 pl-1 ">
          {displayFileSizeError ? 'File size is too large' : `File must not exceed ${maxFileSize / 1000}KB in size`}
        </p>
      </div>
    </div>
  {/if}

  <section class="formSlot">
    <slot />
  </section>
</div>

<style lang="scss">
  .informationIcon {
    width: 100%;
    justify-content: flex-start;
    z-index: 1;
  }

  .formSlot {
    display: flex;
    position: absolute;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
  }

  .content {
    display: flex;
    position: relative;
    border-radius: 0.5rem;
    width: 95%;
    height: 66%;
    top: 6.75%;
    left: 2.75%;
  }

  .content :global(.is-brand-background) {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .backgroundPosterButton {
    position: absolute;
    z-index: 1;
    bottom: 0;
    left: 0;
  }

  .deleteButtonWrapper {
    display: flex;
    justify-content: flex-end;
    position: absolute;
    bottom: 0;
    height: 85%;
    width: 100%;
    z-index: 1;
  }

  .deleteButton {
    top: 0;
  }

  .slider {
    z-index: 2;
    display: flex;
    position: absolute;
    bottom: 0;
    border-radius: 0.5rem;
  }

  /*********** Baseline, reset styles ***********/
  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    width: 10rem;
  }

  /* Removes default focus */
  input[type='range']:focus {
    outline: none;
  }

  /******** Chrome, Safari, Opera and Edge Chromium styles ********/
  /* slider track */
  input[type='range']::-webkit-slider-runnable-track {
    background-color: #e6e6e6;
    border-radius: 0.5rem;
    height: 0.5rem;
  }

  /* slider thumb */
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    margin-top: -8px; /* Centers thumb on the track */
    background-color: #828282;
    border-radius: 0.5rem;
    height: 1.5rem;
    width: 0.5rem;
  }

  input[type='range']:focus::-webkit-slider-thumb {
    outline: 3px solid #828282;
    outline-offset: 0.125rem;
  }

  /*********** Firefox styles ***********/
  /* slider track */
  input[type='range']::-moz-range-track {
    background-color: #e6e6e6;
    border-radius: 0.5rem;
    height: 0.5rem;
  }

  /* slider thumb */
  input[type='range']::-moz-range-thumb {
    background-color: #828282;
    border: none; /*Removes extra border that FF applies*/
    border-radius: 0.5rem;
    height: 1.5rem;
    width: 0.5rem;
  }

  input[type='range']:focus::-moz-range-thumb {
    outline: 3px solid #828282;
    outline-offset: 0.125rem;
  }
</style>
