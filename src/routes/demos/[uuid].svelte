<script lang="ts">
  import DemoFields from './save/.Part0DemoFields.svelte';
  import BackgroundFields from './save/.Part1BackgroundFields.svelte';
  import BrandFields from './save/.Part2BrandFields.svelte';
  import MeetingTypesOptionsFields from './save/.Part3MeetingTypesOptionsFields.svelte';
  import MiscFields from './save/.Part4MiscFields.svelte';
  import DemoSampleModal from './save/.DemoSampleModal/index.svelte';

  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { urlEncodedRequest } from '$lib/shared/urlencoded-request';

  import Modal from '$components/Modal/Modal.svelte';
  import { previewedDemoStore } from '$lib/store';

  export let form = undefined;
  export let name = undefined;
  export let poster = undefined;
  export let brightness = undefined;
  export let logo = undefined;
  export let cityId = undefined;
  export let units = undefined;
  export let SIPQueues = undefined;
  export let displayFootnote = true;
  const id = $page.params.uuid;

  let formElement: HTMLFormElement;
  let showModal = false;

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

  onMount(() => {
    return form && scrollTo(null, formElement.scrollHeight);
  });
</script>

<form
  id="demo-create"
  class="container px-4 mb-2"
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
      <button class=" button is-medium is-rounded is-success " type="submit">
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
    <MeetingTypesOptionsFields {SIPQueues} {id} />
    <hr />
    <MiscFields {units} {cityId} {displayFootnote} />
  </div>
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
  }
</style>
