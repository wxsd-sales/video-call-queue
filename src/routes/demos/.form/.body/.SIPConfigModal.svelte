<script lang="ts">
  import SIPQueueConfig from './.SIPConfig.svelte';
  import Modal from '$components/Modal/Modal.svelte';
  import { createEventDispatcher } from 'svelte';
  import { DEFAULT_SIP_CONFIG } from '$lib/constants';
  import { formIsChangedStore, formStore } from '$lib/store';
  import { generateMacro } from '$lib/webex/macro/WxCQ';

  const dispatch = createEventDispatcher();

  export let selectedIndex = 0;
  export let showModal = false;
  export let SIPQueues;

  let code = generateMacro(SIPQueues);
  let isConfigValid = true;
  let invalidConfigIndex = -1;
  let oldSIPQueues = [...SIPQueues];
  let downloadIsLoading = false;
  let isDownloaded = false;

  const download = (filename: string, text: string) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  const clickToDownload = () => {
    const filename = 'VCQMacro.js';
    downloadIsLoading = true;
    setTimeout(async () => {
      downloadIsLoading = false;
      download(filename, code);
      isDownloaded = true;

      setTimeout(() => {
        isDownloaded = false;
      }, 2000);
    }, 1000);
  };
</script>

<Modal bind:showModal>
  <div class="modal-content is-translucent-black">
    <article class="message has-text-grey is-white">
      <div class="tabs is-boxed message-body m-0 p-0">
        <ul class="m-0">
          {#each SIPQueues as _, i}
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
                  >SIP Config
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
                    if (selectedIndex == i && invalidConfigIndex == -1) {
                      SIPQueues = [...SIPQueues.slice(0, i), ...SIPQueues.slice(i + 1)];
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
            class:is-unclickable={SIPQueues.length == 4 || invalidConfigIndex != -1}
            on:click={async () => {
              $formIsChangedStore = true;
              SIPQueues =
                SIPQueues.length != 4 && invalidConfigIndex == -1 ? [...SIPQueues, DEFAULT_SIP_CONFIG] : SIPQueues;
              selectedIndex = SIPQueues.length - 1;
            }}
            ><i
              class="mdi {SIPQueues.length !== 4 && invalidConfigIndex == -1
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
          }}
          on:sipQs={({ detail: { payload } }) => {
            const { index, videoLink, sipTitle, extensionNumber, sipImage } = payload;
            SIPQueues[index] = {
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
                on:click={async () => {
                  const newSIPQueues = [...SIPQueues];
                  dispatch('queuesUpdate', { payload: { newSIPQueues } });
                  showModal = false;
                }}
                disabled={!isConfigValid}
                class="button is-success is-small is-outlined"
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
                disabled={!isConfigValid}
                class:is-loading={downloadIsLoading}
                type="button"
                class="button is-small is-primary is-outlined "
                on:click={() => {
                  downloadIsLoading = true;
                  code = generateMacro(SIPQueues);
                  clickToDownload();
                  setTimeout(() => {
                    downloadIsLoading = false;
                    showModal = true;
                  }, 1000);
                }}
              >
                <span class="icon">
                  <i class="mdi mdi-download" />
                </span>
                <span> Download Macro </span>
              </button>
            </p>
            <p class="control">
              <button
                type="button"
                class="button is-danger is-small is-outlined"
                on:click={() => {
                  showModal = false;
                  SIPQueues = [...oldSIPQueues];
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
