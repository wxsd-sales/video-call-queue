<script lang="ts">
  import SIPQueueConfig from './.SIPConfig.svelte';
  import Modal from '$components/Modal/Modal.svelte';
  import { createEventDispatcher } from 'svelte';
  import { DEFAULT_SIP_CONFIG } from '$lib/constants';
  import { formIsChangedStore } from '$lib/store';

  const dispatch = createEventDispatcher();

  export let selectedIndex = 0;
  export let showModal = false;
  export let SIPQueues;

  const handleClickOutside = () => {
    if (configIsTouched) {
      active = true;
      showDraftModal = true;
    }

    return active;
  };

  const saveChanges = () => {
    dispatch('queuesUpdate', { payload: { newSIPQueues } });
    showModal = false;
  };

  let isConfigValid = true;
  let invalidConfigIndex = -1;
  let showDraftModal = false;
  let active = false;
  let configIsTouched = false;
  let newSIPQueues = [...SIPQueues];
</script>

<Modal bind:showModal {handleClickOutside}>
  <div class="modal-content is-translucent-black">
    <article class="message has-text-grey is-white">
      <div class="tabs is-boxed message-body m-0 p-0">
        <ul class="m-0">
          {#each newSIPQueues as _, i}
            <li class:is-active={selectedIndex === i}>
              <!-- svelte-ignore a11y-missing-attribute -->
              <a
                on:click={() => (selectedIndex = invalidConfigIndex == -1 ? i : selectedIndex)}
                class="pr-0 pt-2"
                class:is-unclickable={invalidConfigIndex != -1}
              >
                <span
                  class="mr-2 {invalidConfigIndex === i
                    ? 'has-text-danger'
                    : invalidConfigIndex === -1
                    ? 'has-text-link'
                    : 'has-text-grey-light'}"
                  >Call Button
                </span>
                <span class="icon is-small"
                  ><i
                    class="mdi mdi-36px {invalidConfigIndex === i
                      ? 'has-text-danger'
                      : invalidConfigIndex === -1
                      ? 'has-text-link'
                      : 'has-text-grey-light'} mdi-numeric-{i + 1}"
                    aria-hidden="true"
                  /></span
                >
                <span
                  class:mx-2={selectedIndex == i}
                  class="icon is-small mb-5"
                  on:click={() => {
                    $formIsChangedStore = true;
                    configIsTouched = true;
                    if (selectedIndex == i && invalidConfigIndex == -1) {
                      newSIPQueues = [...newSIPQueues.slice(0, i), ...newSIPQueues.slice(i + 1)];
                      selectedIndex = selectedIndex - 1;
                    }
                  }}
                >
                  {#if selectedIndex == i && selectedIndex != 0}
                    <i
                      class="mdi mdi-18px {invalidConfigIndex == -1
                        ? 'has-text-danger'
                        : 'has-text-grey-light'} mdi-close"
                      aria-hidden="true"
                    />
                  {/if}
                </span>
              </a>
            </li>
          {/each}
          <span
            class="icon is-medium mx-2 is-clickable"
            class:is-unclickable={newSIPQueues.length == 4 || invalidConfigIndex != -1}
            on:click={async () => {
              $formIsChangedStore = true;
              configIsTouched = true;
              SIPQueues = newSIPQueues =
                newSIPQueues.length != 4 && invalidConfigIndex == -1
                  ? [...newSIPQueues, DEFAULT_SIP_CONFIG]
                  : newSIPQueues;
              selectedIndex = newSIPQueues.length - 1;
            }}
            ><i
              class="mdi {newSIPQueues.length !== 4 && invalidConfigIndex == -1
                ? 'has-text-success'
                : 'has-text-grey'} mdi-plus-thick "
              aria-hidden="true"
            />
          </span>
        </ul>
      </div>
      <div class="p-4 px-5">
        <SIPQueueConfig
          extensionNumber={SIPQueues[selectedIndex].extensionNumber}
          videoLink={SIPQueues[selectedIndex].videoLink}
          index={selectedIndex}
          sipTitle={SIPQueues[selectedIndex].sipTitle}
          sipImage={SIPQueues[selectedIndex].sipImage}
          on:queueIsValid={({ detail: { formIsValid, index } }) => {
            isConfigValid = formIsValid;
            invalidConfigIndex = isConfigValid ? -1 : index;
            configIsTouched = true;
          }}
          on:sipQs={({ detail: { payload } }) => {
            const { index, videoLink, sipTitle, extensionNumber, sipImage } = payload;
            newSIPQueues[index] = {
              videoLink,
              sipTitle,
              extensionNumber,
              sipImage
            };
          }}
        />

        <div class="level level-right mt-2 mx-4">
          <div class="field is-grouped">
            <p class="control">
              <button
                on:click={saveChanges}
                disabled={!isConfigValid}
                class="button is-success is-small "
                type="button"
              >
                <span class="icon">
                  <i class="mdi mdi-content-save-check" />
                </span>
                <span> Save Changes </span>
              </button>
            </p>

            <p class="control">
              <button
                type="button"
                class="button is-danger is-small "
                on:click={() => {
                  showModal = false;
                }}
              >
                <span class="icon">
                  <i class="mdi mdi-cancel" />
                </span>
                <span> Discard Changes </span>
              </button>
            </p>
          </div>
        </div>
      </div>
    </article>
  </div>
</Modal>

<Modal bind:showModal={showDraftModal}>
  <div class="modal-content is-translucent-black">
    <article class="message is-danger pb-4">
      <div class="message-header">
        <p>{isConfigValid ? "Oops! You're Exiting Edit Mode" : 'Oops! Invalid Inputs'}</p>
        <button
          type="button"
          class="delete"
          aria-label="delete"
          on:click={() => {
            showDraftModal = false;
          }}
        />
      </div>
      <div class="message-body">
        {isConfigValid
          ? "Your edits won't be saved! Are you sure you want to exit?"
          : 'Make sure to fill in appropriate inputs and save.'}
      </div>
      <div class="level level-right mt-2 mx-4">
        <div class="field is-grouped">
          {#if isConfigValid}
            <p class="control">
              <button
                disabled={!isConfigValid}
                class="button is-success"
                on:click={() => {
                  saveChanges();
                  showDraftModal = false;
                  showModal = false;
                }}
              >
                Save changes
              </button>
            </p>
          {/if}
          <p class="control">
            <button
              type="button"
              class="button is-danger "
              on:click={() => {
                showDraftModal = false;
                if (isConfigValid) {
                  showModal = false;
                }
              }}
            >
              {isConfigValid ? 'Discard Changes' : 'Close'}
            </button>
          </p>
        </div>
      </div>
    </article>
  </div>
</Modal>

<style>
  .message a {
    text-decoration: none !important;
  }

  .message .tabs {
    border: 0;
  }

  .is-unclickable {
    cursor: not-allowed !important;
  }
</style>
