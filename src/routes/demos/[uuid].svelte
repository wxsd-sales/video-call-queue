<script lang="ts">
  import DeskPro from '$lib/static/img/desk-pro.png';
  import type { WEATHER_RESPONSE_UNITS } from '$lib/enums';
  import type { Data } from '../../database/entities/data';
  import { toFileList } from './.helpers';
  import { page } from '$app/stores';
  import reactiveURL from '$lib/shared/reactive-url';
  import { goto } from '$app/navigation';
  import { generateMacro } from '$lib/webex/macro/WxCQ.js';
  import FormBackgroundPoster from './.form/.BackgroundPoster.svelte';
  import FormHeader from './.form/.Header.svelte';
  import FormBody from './.form/.Body.svelte';
  import FormFooter from './.form/.Footer.svelte';
  import { DEFAULT_SIP_CONFIG } from '$lib/constants';
  import CodeSnippet from '$components/CodeSnippet/CodeSnippet.svelte';
  import Modal from '$components/Modal/Modal.svelte';
  import CopyLink from '$components/CopyLink/CopyLink.svelte';
  import {
    formIsChangedStore,
    showDraftModal,
    selectedDemoCardStore,
    userIdStore,
    showErrorModalStore,
    formStore,
    targetDemoId,
    demoIsLoading
  } from '$lib/store';
  import { onMount } from 'svelte';
  import loadingGif from '$lib/static/gif/webex-loading.gif';

  export let backgroundPoster: Data;
  export let backgroundBrightness: number;
  export let brandLogo: Data;
  export let weatherCityId: number;
  export let weatherUnits: WEATHER_RESPONSE_UNITS;
  export let SIPQueues: Array<any>;
  export let displayFootnote: boolean;
  export let displayWeather: boolean;
  export let name: string;

  let width: number,
    height: number,
    saved: boolean,
    saveIsLoading: boolean,
    generateIsLoading: boolean,
    showMacroModal: boolean,
    formRef: HTMLFormElement;

  let codeSnippet = generateMacro(SIPQueues);

  const onSubmit = async (e) => {
    if (!formRef.checkValidity()) {
      formRef.reportValidity();
      return;
    }

    try {
      const formData = new FormData();
      const isNew = $page.params.uuid === 'new';
      const sipConfigIsNotEmpty = !!$formStore.extensionNumber1;
      saveIsLoading = true;

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

      saveIsLoading = false;
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
    } catch (e) {
      $showErrorModalStore = true;
      console.error(e);
    }
  };

  const handleKeydown = (e) => {
    if (e.key === 'Enter') return;
  };

  reactiveURL.subscribe((url) => {
    $formIsChangedStore = url?.pathname.split('/')[2] === 'new';
    $formStore = {};
  });
</script>

{#if $demoIsLoading}
  <div class="is-loading is-fullheight is-flex is-align-items-center is-justify-content-center">
    <figure style="width: 256px">
      <img src={loadingGif} />
    </figure>
  </div>
{:else}
  <div>
    <CopyLink
      url={`${$page.url.toString().replace('demos', 'sessions')}`}
      label={name || 'New Demo'}
      disabled={$page.params.uuid === 'new'}
    />
  </div>
  <div class="is-flex is-justify-content-center">
    <form
      on:input={() => ($formIsChangedStore = true)}
      class="column is-flex is-relative is-justify-content-center has-text-white"
      on:keydown={handleKeydown}
      bind:this={formRef}
    >
      <div bind:clientHeight={height} bind:clientWidth={width}>
        <img style="width: 100vh" alt="desk-pro" src={DeskPro} />
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
    </form>
  </div>
  <div class="is-flex is-justify-content-center mr-5">
    <button
      class:is-loading={generateIsLoading}
      type="button"
      class="button mr-3 is-primary  "
      on:click={() => {
        generateIsLoading = true;
        const sipConfigIsNotEmpty = !!$formStore.extensionNumber1;
        let queues = SIPQueues;

        if (sipConfigIsNotEmpty) {
          queues = [];
          for (let i = 1; i <= 4; i++) {
            if ($formStore[`extensionNumber${i}`]) {
              queues.push({
                extensionNumber: $formStore[`extensionNumber${i}`],
                videoLink: $formStore[`videoLink${i}`]
              });
            }
          }
        }

        codeSnippet = generateMacro(queues);
        setTimeout(() => {
          generateIsLoading = false;
          showMacroModal = true;
        }, 1000);
      }}
    >
      <span> View Macro </span>
    </button>
    <button
      disabled={!$formIsChangedStore}
      class:is-loading={saveIsLoading}
      class="button  is-success"
      on:click={onSubmit}
    >
      <span>{saved ? 'Saved' : 'Save'}</span>
    </button>
  </div>
{/if}
<Modal bind:showModal={showMacroModal}>
  <div class="modal-content snippet is-translucent-black">
    <CodeSnippet code={codeSnippet} language="javascript" filename="VCQMacro.js" />
  </div>
</Modal>

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
            <button class="button is-success is-outlined" on:click={onSubmit}> Save changes </button>
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

<style>
  .snippet {
    height: 50rem;
    padding: 1.5rem;
    width: 100%;
    border-radius: 1rem;
  }
  .form {
    position: absolute;
  }
</style>
