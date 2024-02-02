<script lang="ts">
  import { browser } from '$app/env';

  import { goto } from '$app/navigation';
  import reactiveURL from '$lib/shared/reactive-url';
  import loading from '$lib/static/gif/loading.gif';
  import { jsonRequest } from '$lib/shared/json-request';
  import { formIsChangedStore, showErrorModalStore, showDraftModal, userIdStore, targetDemoId } from '$lib/store';
  import copy from 'copy-to-clipboard';

  import type { Data } from '../../database/entities/data';
  import type { Demo } from '../../database/entities/demo';
  import Modal from '$components/Modal/Modal.svelte';
  import { onMount } from 'svelte';

  export let name: string;
  export let brandLogo: Data;
  export let uuid: string;
  export let removeDemoCard: (demoId: string) => Array<Demo>;

  const httpApiRequest = jsonRequest(`/api/users/${$userIdStore}/demos/${uuid}`);

  // export let switchDemoCard: () => void;

  let isNew = name == '+ New Demo +';
  let isSelected = isNew;
  let copyIsLoading = false;
  let isCopied = false;
  let isEditing = false;
  let isTouched = false;
  let showModal = false;
  let title = name;
  let demoCardRef: Element;

  const switchDemoCard = (e) => {
    // The utility buttons <I> should not execute the following logic
    if (e.target.tagName != 'I' && !isSelected) {
      $targetDemoId = uuid;
      if ($formIsChangedStore) {
        $showDraftModal = true;
      } else {
        goto(`/demos/${uuid}`);
      }
    }
  };

  const onDelete = async () => {
    try {
      const response = await httpApiRequest.delete();

      if (response.status == 500) {
        $showErrorModalStore = true;
      } else {
        removeDemoCard(uuid);
        goto('/demos');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onUpdate = async () => {
    try {
      const response = await httpApiRequest.patch('', {}, { name });
      isEditing = false;

      if (response.status === 500) {
        $showErrorModalStore = true;
      } else {
        title = name;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleKeydown = async (e) => {
    if (e.key === 'Enter') await onUpdate();
    else if (e.key === 'Escape') isEditing = false;
  };

  const url = browser && `${window.location.protocol}//${window.location.host}/sessions`;
  reactiveURL.subscribe((url) => (isSelected = isNew || url?.pathname.includes(uuid)));
  onMount(() => {
    if (isSelected) {
      demoCardRef.scrollIntoView(true);
    }
  });
</script>

<div
  class="card zoom m-3 is-clickable mb-4"
  class:not-allowed={isNew}
  class:is-selected={isSelected || isNew}
  bind:this={demoCardRef}
>
  <div class="card-content " on:click={(e) => switchDemoCard(e)}>
    <article class="media">
      <figure class="my-img-container media-left image is-64x64">
        <img src={isNew ? loading : brandLogo} alt="logo" />
      </figure>
      <div class="media-content">
        <div class="content">
          {#if isNew}
            <div class="mb-6">
              <progress class="progress is-small" />
            </div>
          {:else}
            <div class="mb-2">
              {#if isEditing}
                <div class="is-flex ">
                  <input
                    class="input is-small mr-2"
                    type="email"
                    placeholder={name}
                    bind:value={name}
                    on:click={(e) => e.stopPropagation()}
                    on:input={() => (isTouched = true)}
                    on:keydown={handleKeydown}
                  />
                  <button on:click={onUpdate} class="button is-small mr-1">
                    <span class="icon is-small">
                      <i class="mdi has-text-success mdi-24px mdi-check" />
                    </span>
                  </button>
                  <button
                    class="button is-small"
                    on:click={() => {
                      isEditing = false;
                    }}
                  >
                    <span class="icon is-small">
                      <i class="mdi has-text-danger mdi-24px mdi-close" />
                    </span>
                  </button>
                </div>
              {:else}
                <div class="is-flex is-justify-content-space-between">
                  <p class="mb-0 subtitle is-size-5"><strong>{title}</strong></p>
                  <span class="icon has-text-grey" on:click={() => (isEditing = true)}>
                    <i class="mdi  mdi-pencil" />
                  </span>
                </div>
              {/if}
            </div>
            <p class="subtitle is-size-6">Video SIP Call</p>
          {/if}
        </div>
        <nav class="level is-mobile">
          <div class="level-left" />
          <div class="level-right">
            <a
              class="button is-white mr-1"
              href={`${url}/${uuid}`}
              target="_blank"
              class:is-light={isSelected || isNew}
              class:is-disabled={isNew}
            >
              <span class="icon zoom is-medium has-text-success"><i class="mdi mdi-24px mdi-open-in-new" /></span>
            </a>
            <button
              class="button level-item is-white mr-1"
              class:is-light={isSelected || isNew}
              class:is-loading={copyIsLoading && !isCopied}
              disabled={isNew}
              on:click={() => {
                copyIsLoading = true;
                setTimeout(() => {
                  isCopied = true;

                  setTimeout(() => {
                    isCopied = false;
                    copyIsLoading = false;
                    copy(`${url}/${uuid}`);
                  }, 500);
                }, 1000);
              }}
            >
              <span class="icon zoom is-medium has-text-info "
                ><i
                  class="mdi mdi-24px "
                  class:mdi-content-copy={!copyIsLoading}
                  class:mdi-check-bold={isCopied}
                /></span
              >
            </button>
            <button
              class="button is-white"
              disabled={isNew}
              class:is-light={isSelected || isNew}
              on:click={() => (showModal = true)}
            >
              <span class="icon zoom is-small has-text-danger"><i class="mdi mdi-24px mdi-delete" /></span>
            </button>
          </div>
        </nav>
      </div>
    </article>
  </div>
</div>

<Modal bind:showModal>
  <div class="modal-content is-translucent-black">
    <div class="modal-content is-translucent-black">
      <article class="message is-danger pb-4">
        <div class="message-header">
          <p>You are about to delete a demo!</p>
          <button
            type="button"
            class="delete"
            aria-label="delete"
            on:click={() => {
              $showDraftModal = false;
            }}
          />
        </div>
        <div class="message-body">Are you sure you want to delete this demo?</div>
        <div class="level level-right mt-2 mx-4">
          <div class="field is-grouped">
            <p class="control">
              <button type="button" class="button is-dark is-outlined" on:click={() => (showModal = false)}>
                Discard Changes
              </button>
            </p>
            <p class="control">
              <button
                class="button is-danger is-outlined"
                type="button"
                on:click={async () => {
                  await onDelete();
                  showModal = false;
                }}
              >
                Delete Demo
              </button>
            </p>
          </div>
        </div>
      </article>
    </div>
  </div>
</Modal>

<style>
  .is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
  .is-selected {
    -webkit-transform: scale(1.05);
    -ms-transform: scale(1.05);
    transform: scale(1.05);
    transition: 0.25s ease;
    background-color: hsl(0, 0%, 96%);
  }
  .not-allowed {
    cursor: not-allowed !important;
  }
</style>
