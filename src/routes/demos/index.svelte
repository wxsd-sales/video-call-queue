<script lang="ts">
  import type { Demo } from 'src/database/entities';
  import { browser } from '$app/env';

  import CopyLink from '$components/CopyLink/CopyLink.svelte';
  import Notification from '$components/Notification/Notification.svelte';

  import { NOTIFICATION_TYPES } from '$components/Notification/enums';
  import { onMount } from 'svelte';

  export let demos: Array<Demo>;

  const url = browser && `${window.location.protocol}//${browser && window.location.host}/sessions`;

  let showNotification = false;

  setTimeout(() => {
    showNotification = demos.some((demo) => demo.isIC || demo.isSDK);
  }, 500);
</script>

<div class="container px-4 mb-6">
  <div class="columns is-vcentered">
    <div class="column is-3">
      <a class="button is-fullwidth is-rounded is-light is-justify-content-space-between" href="/demos/save">
        <span class="icon">
          <i class="mdi mdi-plus-box" />
        </span>
        <span>New</span>
      </a>
    </div>
    <div class="column is-9 has-text-centered has-text-right-tablet">
      <p>Last refreshed at: {new Date().toLocaleString()}</p>
    </div>
  </div>
  {#if demos.length === 0}
    <hr />
    <p>You currently have no demos. To create one, click the "New" button above.</p>
  {/if}
  {#each demos as demo (demo.uuid)}
    <hr />
    <div class="columns is-vcentered is-mobile">
      <div class="column is-6">
        <p class:has-text-grey={demo.isIC || demo.isSDK} class="title is-size-5 has-text-weight-bold">{demo.name}</p>
      </div>
      <div class="column is-3">
        <a
          class="button is-fullwidth is-rounded is-warning is-light is-justify-content-space-between"
          href="/demos/save?id={demo.uuid}"
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
        <CopyLink
          url={`${url}/${demo.uuid}/?role=requester`}
          label={`Session Link`}
          disabled={demo.isIC || demo.isSDK}
        />
      </div>
    </div>
  {/each}
</div>

<Notification type={NOTIFICATION_TYPES.ERROR} display={showNotification}>
  It appears that some instances are still leveraging outdated WebRTC solutions. Several links have been disabled,
  indicating the need for an update to support SIP URI Dialing.
</Notification>
