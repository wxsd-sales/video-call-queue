<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ session, fetch }) => {
    try {
      let { demos } = await (await fetch(`/api/users/${session.userId}/demos`)).json();
      return {
        props: {
          userId: session.userId,
          demos: demos.reverse()
        }
      };
    } catch (e) {
      console.error(e);
      return {
        props: {
          userId: session.userId,
          demos: []
        }
      };
    }
  };
</script>

<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { Demo } from '../../database/entities/demo';
  import reactiveURL from '$lib/shared/reactive-url';
  import DemoCard from '$components/DemoCard/DemoCard.svelte';
  import Modal from '$components/Modal/Modal.svelte';
  import {
    selectedDemoCardStore,
    userIdStore,
    formIsChangedStore,
    showDraftModal,
    showErrorModalStore,
    targetDemoId
  } from '$lib/store';

  export let demos: Array<Demo> = [];
  export let userId: string;

  let newIsLoading = false;

  $userIdStore = userId;

  const removeDemoCard = (demoId: string) => (demos = demos.filter((demo) => demo.uuid !== demoId));
  reactiveURL.subscribe((url) => {
    if (url?.pathname.includes('new') && !demos.some((demo) => demo.name === '+ New Demo +')) {
      demos = [{ name: '+ New Demo +' } as Demo, ...demos];
      newIsLoading = true;
    }

    if (!url?.pathname.includes('new')) {
      demos = demos.filter((demo) => demo.name !== '+ New Demo +');
      newIsLoading = false;
    }
  });

  const addDemo = () => {
    $targetDemoId = 'new';
    if ($formIsChangedStore) {
      $showDraftModal = true;
    } else {
      demos = [{ name: '+ New Demo +' } as Demo, ...demos];
      goto('/demos/new');
    }
  };

  selectedDemoCardStore.subscribe((demo) => {
    if (demos.some((demo) => demo.name === '+ New Demo +') && demo) {
      demos = demos.filter((demo) => demo.name != '+ New Demo +');
      demos = [{ uuid: demo.uuid, brandLogo: demo.brandLogo, name: demo.name } as Demo, ...demos];
    }

    demos = demos.map((cursor) => {
      if (cursor.name != '+ New Demo +' && cursor.uuid === demo?.uuid) {
        cursor = { ...cursor, brandLogo: demo.brandLogo.bits, name: demo.name };
      }
      return cursor;
    });
  });

  $: newIsLoading = $page.params.uuid === 'new';
</script>

<div class="columns px-4">
  <div class="column is-3 px-4 is-clickable">
    <div class="level ">
      <div class="level-left" />
      <div class="level-right">
        <div class="level-item">
          {#if !newIsLoading}
            <button class="button is-size-6 is-rounded is-light " on:click={addDemo}>
              <span class="icon">
                <i class="mdi mdi-plus-box" />
              </span>
              <span>New</span>
            </button>
          {:else}
            <a class="button is-size-6 is-rounded is-danger " href="/demos">
              <span class="icon">
                <i class="mdi mdi-close" />
              </span>
              <span>Cancel</span>
            </a>
          {/if}
        </div>
      </div>
    </div>

    <div class="demos">
      {#if !demos.length}
        <p class="is-fullheight is-flex is-justify-content-center is-align-items-center has-text-grey">No Demos</p>
      {/if}
      {#each demos as { name, SIPQueues, brandLogo, uuid } (uuid)}
        <DemoCard {uuid} {name} {brandLogo} {removeDemoCard} {SIPQueues} />
      {/each}
    </div>
  </div>
  <div class="ml-2 divider" />
  <div class="column  px-4">
    <slot />
  </div>
</div>

<Modal bind:showModal={$showErrorModalStore}>
  <div class="modal-content is-translucent-black">
    <article class="message is-danger pb-4">
      <div class="message-header">
        <p>Oops! Something went wrong.</p>
        <button
          type="button"
          class="delete"
          aria-label="delete"
          on:click={() => {
            $showErrorModalStore = false;
          }}
        />
      </div>
      <div class="message-body">
        We're sorry, but we're experiencing some internal issues at the moment. Our team has been notified, and we're
        working hard to fix the problem. Please try again later. If the issue persists, feel free to contact our support
        team at wxsd@external.cisco.com for further assistance. Thank you for your understanding.
      </div>
    </article>
  </div>
</Modal>

<style>
  .divider {
    border: 1px solid hsl(0, 0%, 96%);
  }

  .demos {
    height: 80vh;
    overflow: scroll;
    scrollbar-width: none;
  }
</style>
