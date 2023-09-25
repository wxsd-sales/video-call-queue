<script lang="ts">
  import { jsonRequest } from '$lib/shared/json-request';
  import type * as TYPES from '$lib/types';

  import Background from '$components/Background/Background.svelte';
  import Brand from '$components/Brand/Brand.svelte';
  import Clock from '$components/Clock/Clock.svelte';
  import Weather from '$components/Weather/Weather.svelte';

  import Responder from './.Responder.svelte';
  import Requester from './.Requester/.Requester.svelte';

  import type { Demo } from 'src/database/entities';

  export let demo: Demo;
  export let role: string;
  export let embeddable: boolean;

  const httpApiRequest = jsonRequest('/api');
  let getWeatherResponse;

  if (demo.weatherCityId) {
    getWeatherResponse = (id: number, units: string) =>
      httpApiRequest.get('weather', { id, units }).then((r) => r.json() as Promise<TYPES.WeatherResponse>);
  }
</script>

<svelte:head>
  <script crossorigin src="https://unpkg.com/webex@^2/umd/webex.min.js"></script>
</svelte:head>

<Background imageLink={demo.backgroundPoster} filter="brightness({demo.backgroundBrightness}%)" />
<section id="hero" class="hero is-fullheight has-text-white is-dark">
  {#if !embeddable}
    <!-- hero-head start -->
    <div id="head-widgets" class="hero-head">
      <nav class="navbar is-translucent-black">
        <div class="container is-block">
          <div class="columns m-0">
            <div id="brand" class="column is-7 is-flex is-align-self-center">
              <Brand title={demo.brandLogo} subtitle={demo.brandSubtitle} />
            </div>
            {#if demo.weatherCityId !== null}
              <div id="weather" class="column is-5 is-align-self-center">
                <Weather cityId={demo.weatherCityId} units={demo.weatherUnits} {getWeatherResponse}>
                  <Clock timeFormatOptions={{ hour: '2-digit', minute: '2-digit', hour12: false }} />
                </Weather>
              </div>
            {/if}
          </div>
        </div>
      </nav>
    </div>
  {/if}
  <!-- hero-head end -->
  <!-- hero-body start -->
  <div id="body-widgets" class="hero-body p-1">
    <div class="container">
      <!--lhs start-->
      <div id="is-flex is-align-items-center is-justify-content-center" class:embeddable>
        {#if role === 'responder'}
          <Responder socketID={demo.uuid} {embeddable} />
        {:else}
          <Requester {demo} {embeddable} />
        {/if}
      </div>
    </div>
  </div>
  <!-- hero-body end -->
  <!-- hero-foot start -->
  {#if demo.displayFootnote && !embeddable}
    <div id="foot-widgets" class="hero-foot mx-2 p-2">
      <nav class="tabs">
        <div class="container">
          <div class="is-flex is-justify-content-flex-end ">
            <div class="has-text-centered has-text-weight-medium">
              <p>
                Made with
                <span class="icon-text has-text-danger">
                  <i class="mdi mdi-heart" />
                </span>
                by the WXSD team (wxsd@external.cisco.com)
              </p>
            </div>
          </div>
        </div>
      </nav>
    </div>
  {/if}
  <!-- hero-foot end -->
</section>

<style lang="scss">
  @use 'bulma/sass/helpers/typography';
  @use 'bulma/sass/helpers/color';
  @use 'bulma/sass/helpers/spacing';

  #weather {
    display: none;

    @media screen and (min-width: 480px) {
      display: block;
    }
  }

  .is-translucent-black {
    background-color: hsl(0, 0%, 0%, 0.8) !important;
    box-shadow: none !important;
  }

  .embeddable {
    zoom: 0.85;
  }

  #app-model :global(.modal-content) {
    @extend .p-2;
    @extend .is-translucent-black;
    border-radius: var(--border-radius-large);
    width: calc(100% - 10vw);
  }

  #app-model :global(iframe) {
    border-radius: var(--border-radius-large);
  }
</style>
