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
  const id = $page.url.searchParams.get('id');

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
  class="container px-4 mb-6"
  action={'./save' + (id == null ? '' : '?_method=PATCH')}
  method="post"
  enctype="multipart/form-data"
  bind:this={formElement}
>
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
  <hr />

  <div class="columns is-multiline">
    {#if id != null}
      <div class="column is-12 is-hidden">
        <input class="input" name="id" value={id} readonly />
      </div>
    {/if}
    <div class="column is-12">
      <div class="columns">
        <button
          type="button"
          on:click={() => {
            showModal = true;
          }}
          class="column is-one-third button is-medium is-rounded is-info mr-4 "
        >
          <span class="icon">
            <i class="mdi mdi-eye-circle-outline" />
          </span>
          <span>Preview Demo</span>
        </button>
        <button class="column button is-medium is-rounded is-success " type="submit">
          <span class="icon">
            <i class="mdi mdi-content-save-plus" />
          </span>
          <span>Save</span>
        </button>
      </div>
    </div>
    <div class="column is-12 has-text-danger">
      {form ?? ''}
    </div>
  </div>

  <button
    on:click={() => {
      showModal = true;
    }}
    type="button"
    class="sample button is-rounded is-info is-light px-5"
  >
    Preview Demo
  </button>
</form>

<!-- {#key $previewedDemoStore}
  <Modal bind:showModal>
    <DemoSampleModal />
  </Modal>
{/key} -->
<style>
  .sample {
    position: fixed;
    bottom: 0;
    right: 0;
    margin: 2.5rem;
  }
</style>