<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ session, fetch }) => {
    let { demos } = await (await fetch(`/api/user/${session.userId}/demos`)).json();

    return {
      props: {
        status: 200,
        demos
      }
    };
  };
</script>

<script lang="ts">
  import { browser } from '$app/env';
  import DemoCard from '$components/DemoCard/DemoCard.svelte';

  export let demos = [];
  const url = browser && `${window.location.protocol}//${browser && window.location.host}/sessions`;
</script>

<div class="columns px-4">
  <div class="px-4 is-clickable">
    <div class="level ">
      <div class="level-left" />
      <div class="level-right">
        <div class="level-item">
          <a class="button is-fullwidth is-rounded is-light " href="/demos">
            <span class="icon">
              <i class="mdi mdi-plus-box" />
            </span>
            <span>New</span>
          </a>
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
  <div class="px-4">
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
