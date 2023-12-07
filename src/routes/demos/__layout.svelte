<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ session, fetch }) => {
    let { demos } = await (await fetch(`/api/user/${session.userId}/demos`)).json();

    return {
      props: {
        demos: demos.reverse()
      }
    };
  };
</script>

<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { Demo } from '../../database/entities/demo';
  import reactiveURL from '$lib/shared/reactive-url';
  import DemoCard from '$components/DemoCard/DemoCard.svelte';

  export let demos: Array<Demo> = [];

  let newIsLoading = false;
  let demosRef;
  let showModal = false;

  reactiveURL.subscribe((url) => {
    if (url?.pathname.includes('new') && !demos.some((demo) => demo.name === '+ New Demo +')) {
      demos = [{ name: '+ New Demo +' }, ...demos];
      newIsLoading = true;
    }

    if (!url?.pathname.includes('new')) {
      demos = demos.filter((demo) => demo.name !== '+ New Demo +');
      newIsLoading = false;
    }
  });

  const addDemo = () => {
    demos = [{ name: '+ New Demo +' }, ...demos];
    demosRef.scroll(0, 0);

    goto('/demos/new');
  };

  $: newIsLoading = $page.params.uuid === 'new';
</script>

<div class="columns px-4">
  <div class="column is-3 px-4 is-clickable">
    <div class="level ">
      <div class="level-left" />
      <div class="level-right">
        <div class="level-item">
          {#if !newIsLoading}
            <button class="button is-size-6 is-fullwidth is-rounded is-light " on:click={addDemo}>
              <span class="icon">
                <i class="mdi mdi-plus-box" />
              </span>
              <span>New</span>
            </button>
          {:else}
            <a class="button is-size-7 is-rounded is-danger " href="/demos">
              <span class="icon">
                <i class="mdi mdi-close" />
              </span>
              <span>Cancel</span>
            </a>
          {/if}
        </div>
      </div>
    </div>

    <div class="demos" bind:this={demosRef}>
      {#if !demos.length}
        <p class="is-fullheight is-flex is-justify-content-center is-align-items-center has-text-grey">No Demos</p>
      {/if}
      {#each demos as { name, brandLogo, uuid } (uuid)}
        <DemoCard {name} {brandLogo} {uuid} />
      {/each}
    </div>
  </div>
  <div class="ml-2 divider" />
  <div class="column  px-4">
    <slot />
  </div>
</div>

<style>
  .divider {
    border: 1px solid hsl(0, 0%, 96%);
  }

  .demos {
    height: 80vh;
    overflow: scroll;
  }
</style>
