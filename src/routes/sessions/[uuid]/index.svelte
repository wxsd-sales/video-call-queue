<script lang="ts">
  import { jsonRequest } from '$lib/shared/json-request';
  import type * as TYPES from '$lib/types';

  import Background from '$components/Background/Background.svelte';
  import Brand from '$components/Brand/Brand.svelte';
  import Clock from '$components/Clock/Clock.svelte';
  import Weather from '$components/Weather/Weather.svelte';
  import Notification from '$components/Notification/Notification.svelte';

  import Session from '$widgets/Session/Session.svelte';
  import { DEVICE_CALL_QUEUE_SETUP_GUIDE } from '$lib/constants';

  import type { Demo } from 'src/database/entities';
  import { NOTIFICATION_TYPES } from '$components/Notification/enums';

  import { browser } from '$app/env';
  import { onMount } from 'svelte';

  export let demo: Demo;
  export let role: string;

  let getWeatherResponse;
  let isDevice = browser ? (window.navigator.userAgent.includes('RoomOS') ? true : false) : false;

  const httpApiRequest = jsonRequest('/api');
  if (demo.weatherCityId) {
    getWeatherResponse = (id: number, units: string) =>
      httpApiRequest.get('weather', { id, units }).then((r) => r.json() as Promise<TYPES.WeatherResponse>);
  }
</script>

<Background imageLink={demo.backgroundPoster} filter="brightness({demo.backgroundBrightness}%)" />
<section id="hero" class="hero is-fullheight has-text-white is-dark">
  <!-- hero-head start -->
  <div id="head-widgets" class="hero-head">
    <nav class="navbar is-translucent-black">
      <div class="container is-block">
        <div class="columns m-0">
          <div id="brand" class="column is-7 is-flex is-align-self-center">
            <Brand title={demo.brandLogo} />
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
  <!-- hero-head end -->
  <!-- hero-body start -->
  <div id="body-widgets" class="hero-body p-1">
    <!--lhs start-->
    <div class="is-flex is-justify-content-space-evenly" style="width: 100%">
      <Session {demo} {isDevice} />
    </div>
  </div>
  <!-- hero-body end -->
  <!-- hero-foot start -->
  {#if demo.displayFootnote}
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

<Notification type={NOTIFICATION_TYPES.ERROR} display={!isDevice}>
  To experience our <strong>SIP URI Dialing </strong> flow, please ensure that you launch this demo on Cisco RoomOS
  devices in kiosk mode with the proper macro setup enabled. Additionally, make sure to enable the WxC video calling
  queue on the device. For more information please visit our
  <a target="_blank" href={DEVICE_CALL_QUEUE_SETUP_GUIDE}>page</a>.
</Notification>

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
</style>
