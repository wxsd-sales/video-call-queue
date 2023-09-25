<script lang="ts">
  import { jsonRequest } from '$lib/shared/json-request';

  import CiscoBackground from '$lib/static/img/Cisco.png';
  import CiscoLogo from '$lib/static/img/cisco-logo-white.png';
  import CustomerSupportImg from '$lib/static/img/customer-support.png';

  import CallPrompt from './CallPrompt.svelte';

  import Background from '$components/Background/Background.svelte';
  import Brand from '$components/Brand/Brand.svelte';
  import Clock from '$components/Clock/Clock.svelte';
  import Weather from '$components/Weather/Weather.svelte';

  export let demo = {
    backgroundBrightness: '55',
    backgroundPoster: CiscoBackground,
    brandTitle: 'Cisco Systems, Inc.',
    brandSubtitle: 'Bridge to Possible',
    brandLogo: CiscoLogo,
    weatherUnits: 'imperial',
    weatherCityId: 4887398,
    isSDK: true,
    isIC: true,
    isSIP: true,
    extensionNumber: 1111,
    sipTitle: 'Looking For Assistance?',
    sipImage: CustomerSupportImg
  };

  let role = 'requester';
  let embeddable = false;

  let getWeatherResponse;
  const httpApiRequest = jsonRequest('/api');

  if (demo.weatherCityId) {
    getWeatherResponse = (id: number, units: string) =>
      httpApiRequest.get('weather', { id, units }).then((r) => r.json() as Promise<TYPES.WeatherResponse>);
  }
</script>

<div class="preview is-flex has-text-white p-6">
  <Background
    cssClass="background-class"
    imageLink={demo.backgroundPoster}
    filter="brightness({demo.backgroundBrightness}%)"
  />
  <div>
    <nav class="navbar header is-translucent-black">
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
  <CallPrompt isIC={demo.isIC} isSDK={demo.isSDK} isSIP={demo.isSIP} title={demo.sipTitle} sipImage={demo.sipImage} />
  <div class="mx-2 p-2 is-align-self-flex-end">
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
</div>

<style>
  .preview {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 51rem;
    cursor: not-allowed;
  }
  .preview :global(.background-class) {
    position: fixed;
    padding: 0 4rem;
    top: 50%;
    left: 50%;
    z-index: 0;
    transform: translate(-50%, -50%);
  }

  .header {
    width: 90rem;
  }
</style>
