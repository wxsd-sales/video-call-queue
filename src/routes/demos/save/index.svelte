<script lang="ts">
  import DemoFields from './.Part0DemoFields.svelte';
  import BackgroundFields from './.Part1BackgroundFields.svelte';
  import BrandFields from './.Part2BrandFields.svelte';
  import MeetingTypesOptionsFields from './.Part3MeetingTypesOptionsFields.svelte';
  import MiscFields from './.Part4MiscFields.svelte';
  import DemoSampleModal from './.DemoSampleModal/index.svelte';

  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { urlEncodedRequest } from '../../../lib/shared/urlencoded-request';

  import Modal from '$components/Modal/Modal.svelte';
  import { previewedDemoStore } from '$lib/store';

  export let form = undefined;
  export let name = undefined;
  export let description = undefined;
  export let poster = undefined;
  export let brightness = undefined;
  export let logo = undefined;
  export let title = undefined;
  export let subtitle = undefined;
  export let cityId = undefined;
  export let isSDK = false;
  export let isIC = false;
  export let isSIP = false;
  export let units = undefined;
  export let SIPQueues = undefined;
  export let displayFootnote = true;

  const id = $page.url.searchParams.get('id');

  let formElement: HTMLFormElement;
  let showModal = false;

  $previewedDemoStore = {
    name,
    description,
    poster: poster,
    brightness,
    logo: logo,
    title,
    subtitle,
    cityId: cityId || 4887398,
    SDK: isSDK,
    IC: isIC,
    SIP: isSIP,
    units: units || 'imperial',
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
  <DemoFields {name} {description} />
  <hr />
  {#await toFileList(poster) then poster}
    <BackgroundFields {poster} {brightness} />
  {:catch e}
    <BackgroundFields {brightness} />
  {/await}
  <hr />
  {#await toFileList(logo) then logo}
    <BrandFields {logo} {title} {subtitle} />
  {:catch e}
    <BrandFields {title} {subtitle} />
  {/await}
  <hr />
  <MeetingTypesOptionsFields {isSDK} {isIC} {isSIP} {SIPQueues} {id} />
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
        <button class="column button is-medium is-rounded is-success mr-4" type="submit">
          <span class="icon">
            <i class="mdi mdi-content-save-plus" />
          </span>
          <span>Save</span>
        </button>
        <button
          type="button"
          on:click={() => {
            showModal = true;
          }}
          class="column button is-medium is-rounded is-warning "
        >
          <span class="icon">
            <i class="mdi mdi-eye-circle-outline" />
          </span>
          <span>Preview Demo</span>
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
    class="sample button is-rounded is-warning is-light px-5"
  >
    Preview Demo
  </button>
</form>

<Modal bind:showModal>
  <DemoSampleModal />
</Modal>

<style>
  .sample {
    position: fixed;
    bottom: 0;
    right: 0;
    margin: 2.5rem;
  }
</style>
