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
  import { previewedDemoStore, formIsUnsavedStore, showUnsavedModal } from '$lib/store';

  export let form = undefined;
  export let name = undefined;
  export let poster = undefined;
  export let brightness = undefined;
  export let logo = undefined;
  export let cityId = undefined;
  export let units = undefined;
  export let SIPQueues = undefined;
  export let displayFootnote = true;

  let formElement: HTMLFormElement;
  let showModal = false;
  let formIsUnsaved = false;
  let saveIsLoading = false;

  $previewedDemoStore = {
    name,
    poster: poster,
    brightness,
    logo: logo,
    cityId,
    units,
    SIPQueues,
    displayFootnote,
    displayWeather: !!cityId
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
  on:submit={(e) => {
    $formIsUnsavedStore = false;
    saveIsLoading = true;
  }}
  action={$page.params.uuid == 'new' ? '' : '?_method=PATCH'}
  method="post"
  enctype="multipart/form-data"
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
          <i class="mdi mdi-content-save-plus" />
        </span>
        <span>Save</span>
      </button>
    </div>
  </div>
  <div class="demo">
    <DemoFields {name} />
    <hr />
    {#await toFileList(poster) then poster}
      <BackgroundFields {poster} {brightness} />
    {:catch e}
      <BackgroundFields {brightness} />
    {/await}
    <hr />
    {#await toFileList(logo) then logo}
      <BrandFields {logo} />
    {:catch e}
      <BrandFields />
    {/await}
    <hr />
    <MeetingTypesOptionsFields {SIPQueues} id={$page.params.uuid} />
    <hr />
    <MiscFields {units} {cityId} {displayFootnote} />
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
