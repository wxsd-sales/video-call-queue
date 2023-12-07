<script lang="ts">
  import { browser } from '$app/env';
  import { goto } from '$app/navigation';
  import loading from '$lib/static/gif/loading.gif';

  export let name;
  export let brandLogo;
  export let uuid;

  let isLoading = name == '+ New Demo +';
  let copyIsLoading = false;
  let copied = false;

  const url = browser && `${window.location.protocol}//${window.location.host}/sessions`;
</script>

<div class="card demo is-clickable mb-4" class:not-allowed={isLoading}>
  <div class="card-content " on:click={() => !isLoading && goto(`/demos/${uuid}`)}>
    <article class="media">
      <figure class="my-img-container media-left image is-64x64">
        <img src={isLoading ? loading : brandLogo} />
      </figure>
      <div class="media-content">
        <div class="content">
          {#if isLoading}
            <div class="mb-6">
              <progress class="progress is-small" />
            </div>
          {:else}
            <p class="mb-0 subtitle is-size-5"><strong>{name}</strong></p>
            <p class="subtitle is-size-6">Video SIP Calls</p>
          {/if}
        </div>
        <nav class="level is-mobile">
          <div class="level-left" />
          <div class="level-right">
            <a disabled={isLoading} class="button is-white" href={`${url}/${uuid}`} target="_blank">
              <span class="icon is-medium has-text-success"><i class="mdi mdi-24px mdi-open-in-new" /></span>
            </a>
            <button
              class="button level-item  m-0"
              style="border: none"
              class:is-white={!copyIsLoading}
              class:is-loading={copyIsLoading && !copied}
              disabled={isLoading}
              on:click={() => {
                copyIsLoading = true;
                setTimeout(() => {
                  copied = true;

                  setTimeout(() => {
                    copied = false;
                    copyIsLoading = false;
                  }, 1000);
                }, 1000);
              }}
            >
              <span class="icon is-medium has-text-info "
                ><i
                  class="mdi mdi-24px "
                  class:mdi-content-copy={!copyIsLoading || name}
                  class:mdi-check-bold={copied}
                /></span
              >
            </button>
            <form action="/demos/{uuid}?_method=DELETE" method="post" class="level-item is-clickable">
              <button class="button is-white" disabled={isLoading}>
                <span class="icon is-small has-text-danger"><i class="mdi mdi-24px mdi-delete" /></span>
              </button>
            </form>
          </div>
        </nav>
      </div>
    </article>
  </div>
</div>

<style>
  .demo {
    transition: 0.25s ease;
  }

  .demo progress {
    height: 0.5rem;
  }

  .demo:hover {
    -webkit-transform: scale(1.05);
    -ms-transform: scale(1.05);
    transform: scale(1.05);
    transition: 0.25s ease;
  }

  .icon {
    transition: 0.25s ease;
  }
  .icon:hover {
    -webkit-transform: scale(1.1);
    -ms-transform: scale(1.1);
    transform: scale(1.1);
    transition: 0.25s ease;
  }

  .not-allowed {
    cursor: not-allowed !important;
  }
</style>
