<script lang="ts">
  import { jsonRequest } from '$lib/shared/json-request';
  import type * as TYPES from '$lib/types';

  import Background from '$components/Background/Background.svelte';
  import Brand from '$components/Brand/Brand.svelte';
  import Clock from '$components/Clock/Clock.svelte';
  import Weather from '$components/Weather/Weather.svelte';

  import Responder from './.Responder.svelte';
  import Requester from './.Requester.svelte';

  import type { Demo } from 'src/database/entities';

  export let demo: Demo;
  export let role: string;

  const httpApiRequest = jsonRequest('/api');

  const getWeatherResponse = (id: number, units: string) =>
    httpApiRequest.get('weather', { id, units }).then((r) => r.json() as Promise<TYPES.WeatherResponse>);
</script>

<svelte:head>
  <script crossorigin src="https://unpkg.com/webex@^2/umd/webex.min.js"></script>
</svelte:head>

<Background imageLink={demo.backgroundPoster} filter="brightness({demo.backgroundBrightness}%)" />
<section id="hero" class="hero is-fullheight has-text-white is-dark">
  <!-- hero-head start -->
  <div id="head-widgets" class="hero-head">
    <nav class="navbar is-translucent-black">
      <div class="container is-block">
        <div class="columns m-0">
          <div id="brand" class="column is-7 is-flex is-align-self-center">
            <Brand title={demo.brandLogo} subtitle={demo.brandSubtitle} />
          </div>
          <div id="weather" class="column is-5 is-align-self-center">
            <Weather cityId={demo.weatherCityId} units={demo.weatherUnits} {getWeatherResponse}>
              <Clock timeFormatOptions={{ hour: '2-digit', minute: '2-digit', hour12: false }} />
            </Weather>
          </div>
        </div>
      </div>
    </nav>
  </div>
  <!-- hero-head end -->
  <!-- hero-body start -->
  <div id="body-widgets" class="hero-body p-1">
    <div class="container">
      <!--lhs start-->
      <div id="sessions" class="box is-flex is-flex-direction-column  is-translucent-black">
        {#if role === 'responder'}
          <Responder socketID={demo.uuid} />
        {:else}
          <Requester
            socketID={demo.uuid}
            isSIPAvailable={demo.isSIP}
            isSDKAvailable={demo.isSDK}
            isICAvailable={demo.isIC}
            extensionNumber={demo.extensionNumber}
          />
        {/if}
      </div>
    </div>
  </div>
  <!-- hero-body end -->
  <!-- hero-foot start -->
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
  <!-- hero-foot end -->
</section>

<style lang="scss">
  @use 'bulma/sass/helpers/typography';
  @use 'bulma/sass/helpers/color';
  @use 'bulma/sass/helpers/spacing';

  #sessions {
    height: 43rem;

    @media screen and (min-width: 480px) {
      height: 48rem;
    }
  }

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

  #app-model :global(.modal-content) {
    @extend .p-2;
    @extend .is-translucent-black;
    border-radius: var(--border-radius-large);
    width: calc(100% - 10vw);
  }

  #app-model :global(iframe) {
    border-radius: var(--border-radius-large);
  }

  @media screen and (max-width: 1215px) {
  }

  @media screen and (max-width: 1215px) {
  }
</style>
