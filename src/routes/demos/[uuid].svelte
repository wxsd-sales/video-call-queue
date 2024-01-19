<script lang="ts">
  import DeskPro from '$lib/static/img/desk-pro.png';
  import type { WEATHER_RESPONSE_UNITS } from '$lib/enums';
  import type { Data } from '../../database/entities/data';
  import { toFileList, horizontalSlide } from './.helpers';
  import { page } from '$app/stores';
  import reactiveURL from '$lib/shared/reactive-url';
  import { goto } from '$app/navigation';

  import FormBackgroundPoster from './.form/.BackgroundPoster.svelte';
  import FormHeader from './.form/.Header.svelte';
  import FormBody from './.form/.Body.svelte';
  import FormFooter from './.form/.Footer.svelte';
  import { DEFAULT_SIP_CONFIG } from '$lib/constants';

  import Modal from '$components/Modal/Modal.svelte';

  import {
    formIsChangedStore,
    showDraftModal,
    selectedDemoCardStore,
    userIdStore,
    showErrorModalStore,
    formStore,
    targetDemoId
  } from '$lib/store';

  export let backgroundPoster: Data;
  export let backgroundBrightness: number;
  export let brandLogo: Data;
  export let weatherCityId: number;
  export let weatherUnits: WEATHER_RESPONSE_UNITS;
  export let SIPQueues: Array<any>;
  export let displayFootnote: boolean;
  export let displayWeather: boolean;

  let width: number, height: number, parentWidth: number, offsetX: number, saved: boolean, saveIsLoading: boolean;

  const onSubmit = async (e) => {
    const formData = new FormData();
    const isNew = $page.params.uuid === 'new';
    const sipConfigIsNotEmpty = !!$formStore.extensionNumber1;

    if (isNew) {
      if (!sipConfigIsNotEmpty) {
        $formStore = {
          ...$formStore,
          extensionNumber1: DEFAULT_SIP_CONFIG.extensionNumber,
          videoLink1: DEFAULT_SIP_CONFIG.videoLink,
          sipTitle1: DEFAULT_SIP_CONFIG.sipTitle,
          sipImage1: (await toFileList(DEFAULT_SIP_CONFIG.sipImage))[0]
        };
      }
      $formStore.name = 'New Demo';
      $formStore.backgroundBrightness = '55';
    }

    Object.keys($formStore).forEach((key) => {
      const value = $formStore[key] instanceof File ? $formStore[key] : JSON.stringify($formStore[key]);
      formData.append(key, value);
    });

    const response = await fetch(`/api/users/${$userIdStore}/demos/${$page.params.uuid}`, {
      method: isNew ? 'POST' : 'PUT',
      body: formData
    });

    if (response.status === 500) {
      $showErrorModalStore = true;
      goto('/demos');
    } else {
      $selectedDemoCardStore = await response.json();
      $showDraftModal = false;
      saveIsLoading = false;
      saved = true;

      setTimeout(() => {
        saved = false;
        $formIsChangedStore = false;
      }, 1000);

      goto($page.params.uuid === 'new' ? '/demos' : `/demos/${$selectedDemoCardStore.uuid}`);
    }
  };

  const handleKeydown = (e) => {
    if (e.key === 'Enter') return;
  };

  $: offsetX = (parentWidth - width) / 2;
  reactiveURL.subscribe((url) => {
    $formIsChangedStore = url?.pathname.split('/')[2] === 'new';
    $formStore = {};
  });
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<form
  on:input={() => ($formIsChangedStore = true)}
  on:submit|preventDefault={onSubmit}
  class="is-flex is-relative is-justify-content-center has-text-white"
  bind:clientWidth={parentWidth}
  on:keydown={handleKeydown}
>
  {#if $formIsChangedStore}
    <button
      class:visible={$formIsChangedStore}
      style="left: calc(({width}px) + {offsetX}px - 2rem);"
      transition:horizontalSlide={{ axis: 'x', duration: 500 }}
      class:is-loading={saveIsLoading}
      class="button my-2 save is-medium is-success"
      type="submit"
    >
      <span>{saved ? 'Saved' : 'Save'}</span>
    </button>
  {/if}
  <div class="is-desk-pro" bind:clientHeight={height} bind:clientWidth={width}>
    <img alt="desk-pro" src={DeskPro} />
  </div>
  <div class="form" style="height: {height}px; width: {width}px">
    {#await toFileList(backgroundPoster) then backgroundPoster}
      <FormBackgroundPoster {backgroundPoster} {backgroundBrightness}>
        <FormHeader {brandLogo} {displayWeather} {weatherCityId} {weatherUnits} />
        <FormBody {SIPQueues} />
        <FormFooter {displayFootnote} />
      </FormBackgroundPoster>
    {:catch}
      <FormBackgroundPoster {backgroundBrightness}>
        <FormHeader {brandLogo} {displayWeather} {weatherCityId} {weatherUnits} />
        <FormBody {SIPQueues} />
        <FormFooter {displayFootnote} />
      </FormBackgroundPoster>
    {/await}
  </div>

  <Modal bind:showModal={$showDraftModal}>
    <div class="modal-content is-translucent-black">
      <article class="message is-danger pb-4">
        <div class="message-header">
          <p>Oops! You're Exiting Edit Mode</p>
          <button
            type="button"
            class="delete"
            aria-label="delete"
            on:click={() => {
              $showDraftModal = false;
            }}
          />
        </div>
        <div class="message-body">
          It seems you're leaving edit mode without saving your changes. Your edits won't be preserved! Are you sure you
          want to exit?
        </div>
        <div class="level level-right mt-2 mx-4">
          <div class="field is-grouped">
            <p class="control">
              <button class="button is-success is-outlined" type="submit"> Save changes </button>
            </p>
            <p class="control">
              <button
                type="button"
                class="button is-danger is-outlined"
                on:click={() => {
                  goto(`/demos/${$targetDemoId}`);
                  $formIsChangedStore = false;
                  $showDraftModal = false;
                }}
              >
                Discard Changes
              </button>
            </p>
          </div>
        </div>
      </article>
    </div>
  </Modal>
</form>

<style>
  .save {
    position: absolute;
    z-index: -1;
    padding-left: 2rem;
    padding-right: 0.75rem;
    left: 0;
  }

  .visible {
    z-index: 0;
  }
  .is-desk-pro {
    width: 100vh;
  }
  .form {
    position: absolute;
  }
</style>
