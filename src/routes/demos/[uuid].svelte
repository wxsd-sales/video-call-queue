<script lang="ts">
  import DemoFields from './save/.Part0DemoFields.svelte';
  import BackgroundFields from './save/.Part1BackgroundFields.svelte';
  import BrandFields from './save/.Part2BrandFields.svelte';
  import MeetingTypesOptionsFields from './save/.Part3MeetingTypesOptionsFields.svelte';
  import MiscFields from './save/.Part4MiscFields.svelte';
  import DemoSampleModal from './save/.DemoSampleModal/index.svelte';

  import { page } from '$app/stores';
  import { urlEncodedRequest } from '$lib/shared/urlencoded-request';

  import Modal from '$components/Modal/Modal.svelte';
  import {
    previewedDemoStore,
    formIsUnsavedStore,
    showUnsavedModal,
    selectedDemoCardStore,
    userIdStore,
    showErrorModalStore
  } from '$lib/store';
  import { goto } from '$app/navigation';

  export let form = undefined;
  export let name = undefined;
  export let backgroundPoster = undefined;
  export let backgroundBrightness = undefined;
  export let brandLogo = undefined;
  export let weatherCityId = undefined;
  export let weatherUnits = undefined;
  export let SIPQueues = undefined;
  export let displayFootnote = true;
  export let displayWeather = false;

  let formElement: HTMLFormElement;
  let showModal = false;
  let saveIsLoading = false;
  let saved = false;

  $: $previewedDemoStore = {
    name,
    backgroundPoster,
    backgroundBrightness,
    brandLogo,
    weatherCityId,
    weatherUnits,
    SIPQueues,
    displayFootnote,
    displayWeather: !!weatherCityId
  };

  const onSubmit = async (e) => {
    saveIsLoading = true;
    const formData = new FormData(e.target);

    formData.set('displayFootnote', formData.get('displayFootnote') === 'on' ? true : false);
    formData.set('displayWeather', formData.get('displayWeather') === 'on' ? true : false);

    const response = await fetch(`/api/users/${$userIdStore}/demos/${$page.params.uuid}`, {
      method: $page.params.uuid === 'new' ? 'POST' : 'PATCH',
      body: formData
    });

    if (response.status === 500) {
      $showErrorModalStore = true;
      goto('/demos');
    } else {
      $selectedDemoCardStore = await response.json();
      $formIsUnsavedStore = false;
      $showUnsavedModal = false;
      saveIsLoading = false;
      saved = true;

      setTimeout(() => {
        saved = false;
      }, 1000);

      goto($page.params.uuid === 'new' ? '/demos' : `/demos/${$selectedDemoCardStore.uuid}`);
    }
  };

  const toFileList = (file?: { bits: string; name: string; lastModified: number; type: string }) =>
    file != null
      ? urlEncodedRequest(file.bits)
          .get()
          .then((r) => r.blob())
          .then((r) => new File([r], file.name, { lastModified: file.lastModified, type: file.type }))
          .then((r) => {
            const container = new DataTransfer();
            container.items.add(r);
            return container.files;
          })
      : Promise.reject();
</script>

<form
  id="demo-create"
  class="container px-4 mb-2"
  on:input={() => ($formIsUnsavedStore = true)}
  on:submit|preventDefault={onSubmit}
  bind:this={formElement}
>
  <div class="level">
    <div class="level-left">
      <h2 class="title">Create a New Kiosk Instance</h2>
    </div>
    <div class="level-right">
      <button
        disabled={saveIsLoading}
        type="button"
        on:click={() => {
          showModal = true;
        }}
        class="button is-medium is-rounded is-info mr-4 "
      >
        <span class="icon">
          <i class="mdi mdi-eye-circle-outline" />
        </span>
        <span>Preview Demo</span>
      </button>
      <button
        disabled={saveIsLoading}
        class:is-loading={saveIsLoading}
        class=" button is-medium is-rounded is-success"
        class:is-light={$formIsUnsavedStore}
        type="submit"
      >
        <span class="icon">
          <i class="mdi" class:mdi-check-bold={saved} class:mdi-content-save-plus={!saved} />
        </span>
        <span>{saved ? 'Saved' : 'Save'}</span>
      </button>
    </div>
  </div>
  <div class="demo">
    <DemoFields {name} />
    <hr />
    {#await toFileList(backgroundPoster) then poster}
      <BackgroundFields {poster} brightness={backgroundBrightness} />
    {:catch e}
      <BackgroundFields brightness={backgroundBrightness} />
    {/await}
    <hr />
    {#await toFileList(brandLogo) then logo}
      <BrandFields {logo} />
    {:catch e}
      <BrandFields />
    {/await}
    <hr />
    <MeetingTypesOptionsFields {SIPQueues} id={$page.params.uuid} />
    <hr />
    <MiscFields cityId={weatherCityId} units={weatherUnits} {displayFootnote} {displayWeather} />
  </div>

  <Modal bind:showModal={$showUnsavedModal}>
    <div class="modal-content is-translucent-black">
      <article class="message is-danger pb-4">
        <div class="message-header">
          <p>Oops! You're Exiting Edit Mode</p>
          <button
            type="button"
            class="delete"
            aria-label="delete"
            on:click={() => {
              $showUnsavedModal = false;
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
                  $formIsUnsavedStore = false;
                  $showUnsavedModal = false;
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

{#key $previewedDemoStore}
  <Modal bind:showModal>
    <DemoSampleModal />
  </Modal>
{/key}

<style>
  .demo {
    height: 80vh;
    overflow: auto;
    scrollbar-width: none;
  }
</style>
