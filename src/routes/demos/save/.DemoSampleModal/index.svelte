<script lang="ts">
  import { jsonRequest } from '$lib/shared/json-request';

  import CiscoBackground from '$lib/static/img/cisco-background.png';
  import CiscoLogo from '$lib/static/img/cisco-logo-white.png';
  import CustomerSupportImg from '$lib/static/img/customer-support.svg';

  import CallPrompt from './CallPrompt.svelte';

  import Background from '$components/Background/Background.svelte';
  import Brand from '$components/Brand/Brand.svelte';
  import Clock from '$components/Clock/Clock.svelte';
  import Weather from '$components/Weather/Weather.svelte';

  import { previewedDemoStore } from '$lib/store';

  let getWeatherResponse;
  const httpApiRequest = jsonRequest('/api');

  getWeatherResponse = (id: number, units: string) =>
    httpApiRequest.get('weather', { id, units }).then((r) => r.json() as Promise<TYPES.WeatherResponse>);
</script>

<div class="preview is-flex has-text-white ">
  <Background
    imageLink={$previewedDemoStore.poster?.bits || CiscoBackground}
    filter="brightness({$previewedDemoStore.brightness}%)"
  />
  <div>
    <nav class="navbar is-danger is-flex is-justify-content-center">
      <div class="navbar-item has-text-white is-size-4 has-text-center">
        The section below is for view-only purposes, and the buttons within it are not clickable.
      </div>
    </nav>
    <nav class="navbar header is-translucent-black">
      <div class="container is-block">
        <div class="columns m-0">
          <div id="brand" class="column is-7 is-flex is-align-self-center">
            <Brand title={$previewedDemoStore.logo?.bits || CiscoLogo} subtitle={$previewedDemoStore.brandSubtitle} />
          </div>
          {#if $previewedDemoStore.displayWeather}
            <div id="weather" class="column is-5 is-align-self-center">
              <Weather cityId={$previewedDemoStore.cityId} units={$previewedDemoStore.units} {getWeatherResponse}>
                <Clock timeFormatOptions={{ hour: '2-digit', minute: '2-digit', hour12: false }} />
              </Weather>
            </div>
          {/if}
        </div>
      </div>
    </nav>
  </div>
  <div class="prompts is-flex is-justify-content-space-evenly">
    {#each $previewedDemoStore.SIPQueues as { sipTitle, sipImage }, index (index)}
      <CallPrompt
        isIC={$previewedDemoStore.IC}
        isSDK={$previewedDemoStore.SDK}
        isSIP={$previewedDemoStore.SIP}
        title={sipTitle}
        sipImage={sipImage?.bits || CustomerSupportImg}
      />
    {/each}
  </div>
  <div class="mx-2 p-2 is-align-self-flex-end">
    <nav class="tabs">
      <div class="container">
        <div class="is-flex is-justify-content-flex-end ">
          <div class="has-text-centered has-text-weight-medium">
            {#if $previewedDemoStore.displayFootnote}
              <p>
                Made with
                <span class="icon-text has-text-danger">
                  <i class="mdi mdi-heart" />
                </span>
                by the WXSD team (wxsd@external.cisco.com)
              </p>
            {/if}
          </div>
        </div>
      </div>
    </nav>
  </div>
</div>

<style>
  .preview {
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 50rem;
    cursor: not-allowed;
  }

  .prompts {
    width: 100%;
  }
  .preview :global(.is-brand-background) {
    position: fixed;
    object-fit: cover;
    height: 50rem;
    width: 90rem;
    top: 50%;
    left: 50%;
    z-index: 0;
    transform: translate(-50%, -50%);
  }

  .header {
    width: 90rem;
  }

  .warning {
    max-width: 100%;
    background-color: red;
  }
</style>
