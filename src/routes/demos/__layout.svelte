<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ session, fetch }) => {
    let { demos } = await (await fetch(`/api/user/${session.userId}/demos`)).json();

    return {
      props: {
        status: 200,
        demos: demos.reverse()
      }
    };
  };
</script>

<script lang="ts">
  import { browser } from '$app/env';
  import DemoCard from '$components/DemoCard/DemoCard.svelte';
  import { goto } from '$app/navigation';

  export let demos = [];
  const url = browser && `${window.location.protocol}//${browser && window.location.host}/sessions`;

  const addDemo = () => {
    demos = [{ name: '+ New Demo +' }, ...demos];
    goto('/demos/new');
  };
</script>

<div class="columns px-4">
  <div class="column is-one-fifth px-4 is-clickable">
    <div class="level ">
      <div class="level-left" />
      <div class="level-right">
        <div class="level-item">
          <button class="button is-fullwidth is-rounded is-light " on:click={addDemo}>
            <span class="icon">
              <i class="mdi mdi-plus-box" />
            </span>
            <span>New</span>
          </button>
        </div>
      </div>
    </div>
    <div class="demos">
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
    overflow: auto;
  }
</style>
