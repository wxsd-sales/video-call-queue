<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ session, fetch }) => {
    const { demos } = await (await fetch(`/api/user/${session.userId}/demos`)).json();

    return {
      props: {
        status: 200,
        demos
      }
    };
  };
</script>

<script lang="ts">
  import CopyLink from '$components/CopyLink/CopyLink.svelte';
  import { browser } from '$app/env';
  import DemoCard from '$components/DemoCard/DemoCard.svelte';

  export let demos = [];
  const url = browser && `${window.location.protocol}//${browser && window.location.host}/sessions`;
</script>

<div class="columns">
  <div class="px-4 mb-6">
    <div class="columns is-vcentered">
      <div class="column is-3">
        <a class="button is-fullwidth is-rounded is-light is-justify-content-space-between" href="/demos/save">
          <span class="icon">
            <i class="mdi mdi-plus-box" />
          </span>
          <span>New</span>
        </a>
      </div>
    </div>
    {#if demos.length === 0}
      <hr />
      <p>You currently have no demos. To create one, click the "New" button above.</p>
    {/if}
    {#each demos as demo (demo.uuid)}
      <DemoCard />
      <!-- <hr />
      <div class="columns is-vcentered is-mobile">
        <div class="column is-6">
          <p class="title is-size-5 has-text-weight-bold">{demo.name}</p>
        </div>
        <div class="column is-3">
          <a
            class="button is-fullwidth is-rounded is-warning is-light is-justify-content-space-between"
            href="/demos/{demo.uuid}"
          >
            <span class="icon">
              <i class="mdi mdi-pencil" />
            </span>
            <span>Edit</span>
          </a>
        </div>
        <form action="/demos/{demo.uuid}?_method=DELETE" method="post" class="column is-3">
          <button class="button is-fullwidth is-rounded is-danger is-light is-justify-content-space-between">
            <span class="icon">
              <i class="mdi mdi-delete" />
            </span>
            <div>Delete</div>
          </button>
        </form>
      </div>
      <div class="columns is-multiline is-flex-direction-column">
        <div class="column is-full">
          <CopyLink url={`${url}/${demo.uuid}/?role=requester`} label={`Requester View Link`} />
        </div>
      </div> -->
    {/each}
  </div>
  <div style="border-left:1px solid #000" />
  <div>
    {#key demos}
      <slot />
    {/key}
  </div>
</div>
