<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = ({ error, status, session }) => {
    return {
      status: 200,
      props: { email: session.email, isError: error != null || status !== 200 }
    };
  };
</script>

<!-- Scripts -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { page } from '$app/stores';
  import {
    PUBLIC_APPD_CONFIG_APP_KEY,
    PUBLIC_APPD_CONFIG_EXTERNAL_URL,
    PUBLIC_APPD_CONFIG_BEACON_URL
  } from '$env/static/public';

  let APPD_CONFIG = {
    appKey: PUBLIC_APPD_CONFIG_APP_KEY,
    adrumExtUrlHttp: PUBLIC_APPD_CONFIG_EXTERNAL_URL,
    adrumExtUrlHttps: PUBLIC_APPD_CONFIG_EXTERNAL_URL.replace('http', 'https'),
    beaconUrlHttp: PUBLIC_APPD_CONFIG_BEACON_URL,
    beaconUrlHttps: PUBLIC_APPD_CONFIG_BEACON_URL.replace('http', 'https'),
    resTiming: { bufSize: 200, clearResTimingOnBeaconSend: true },
    useHTTPSAlways: false,
    maxUrlLength: 512
  };

  export let email = undefined;
  export let isError = false;

  let isNavVisible = !($page.url.pathname === base || $page.url.pathname.includes('sessions') || !isError);

  let form: HTMLFormElement;

  onMount(() => {
    // if this functions returns it indicates javascript is enabled on the browser
    function isJavascriptEnabled() {
      return true;
    }

    // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cookies.js
    function hasCookiesEnabled() {
      // Quick test if browser has cookieEnabled host property
      if (navigator.cookieEnabled) return true;
      // Create cookie
      document.cookie = 'cookieTest=1';
      const isCookieSet = document.cookie.indexOf('cookieTest=') !== -1;
      // Delete cookie
      document.cookie = 'cookieTest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT';
      return isCookieSet;
    }

    const mainMenu = document.getElementById('main-burger');
    // Check if there are any navbar burgers
    mainMenu?.addEventListener('click', () => {
      // Get the target from the "data-target" attribute
      const target = document.getElementById(mainMenu.dataset.target);
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      mainMenu.classList.toggle('is-active');
      target.classList.toggle('is-active');
    });

    // Show the app if javascript is enabled
    if (isJavascriptEnabled() === true) {
      document.getElementById('app').classList.remove('is-invisible');
    }

    // log to console and hide the app if cookies are not enabled
    if (hasCookiesEnabled() === false) {
      console.error('Cookies are disabled.');
      document.getElementById('cookies-warning').classList.remove('is-hidden');
      document.getElementById('app').classList.add('is-invisible');
    }

    if (isNavVisible) {
      document.body.classList.add('has-navbar-fixed-top');
    }
  });
</script>

<svelte:head>
  <title>Webex Video Call Queue</title>
  <meta name="appd-config" content={JSON.stringify(APPD_CONFIG)} />
  <script>
    window['adrum-start-time'] = new Date().getTime();
    var {
      appKey,
      adrumExtUrlHttp,
      adrumExtUrlHttps,
      beaconUrlHttp,
      beaconUrlHttps,
      resTiming,
      useHTTPSAlways,
      maxUrlLength
    } = JSON.parse(document.querySelector('meta[name=appd-config]').getAttribute('content'));

    (function (config) {
      config.userEventInfo = {
        PageView: function () {
          let device = 'N/A';
          if (navigator.userAgent.includes('RoomOS'))
            device = navigator.userAgent.split(';')[2].split(')')[0].replace('Cisco', '').trim();

          return {
            userData: {
              CiscoDevice: device
            }
          };
        }
      };
      config.appKey = appKey;
      config.adrumExtUrlHttp = adrumExtUrlHttp;
      config.adrumExtUrlHttps = adrumExtUrlHttps;
      config.beaconUrlHttp = beaconUrlHttp;
      config.beaconUrlHttps = beaconUrlHttps;
      config.useHTTPSAlways = useHTTPSAlways;
      config.resTiming = resTiming;
      config.maxUrlLength = maxUrlLength;
    })(window['adrum-config'] || (window['adrum-config'] = {}));
  </script>
  <script src="//cdn.appdynamics.com/adrum/adrum-23.3.0.4265.js"></script>
</svelte:head>

<noscript id="javascript-warning" class="hero is-danger is-bold">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
        <span class="icon">
          <i class="mdi mdi-alert" />
        </span>
        <span>Javascript is disabled.</span>
      </h1>
      <h2 class="subtitle">
        This site requires Javascript for its core functionality. Please enable Javascript in browser settings and
        reload this page.
      </h2>
    </div>
  </div>
</noscript>

<section id="cookies-warning" class="hero is-danger is-bold is-hidden">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
        <span class="icon">
          <i class="mdi mdi-alert" />
        </span>
        <span>Cookies are disabled.</span>
      </h1>
      <h2 class="subtitle">
        This site requires cookies for its core functionality. Please enable cookies in browser settings and reload this
        page.
      </h2>
    </div>
  </div>
</section>

{#if isNavVisible}
  <nav class="navbar is-fixed-top has-shadow" aria-label="main navigation">
    <div class="navbar-brand">
      {#if email}
        <a class="navbar-item" href="/demos">
          <img src="/favicon.png" alt="Webex Video Call Queue" />
        </a>
      {:else}
        <a class="navbar-item" href="/auth">
          <img src="/favicon.png" alt="Webex Video Call Queue" />
        </a>
      {/if}

      <button
        id="main-burger"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
        {#if email}
          <a class="navbar-item" href="/demos">Home</a>
        {/if}
      </div>

      <div class="navbar-end">
        {#if email == null}
          <div class="navbar-item">
            <div class="buttons">
              <a
                class="button is-fullwidth is-rounded is-primary is-light has-text-weight-bold"
                href="/auth/webex/redirect"
              >
                <span class="icon">
                  <i class="mdi mdi-login" />
                </span>
                <span>Log in</span>
              </a>
            </div>
          </div>
        {:else}
          <div class="navbar-item has-dropdown is-hoverable">
            <p class="navbar-link has-text-weight-bold">{email}</p>
            <div class="navbar-dropdown is-right">
              <div class="navbar-item">
                <button
                  class="button is-fullwidth is-rounded is-danger is-light has-text-weight-bold"
                  on:click={() => form.submit()}
                >
                  <span class="icon">
                    <i class="mdi mdi-logout" />
                  </span>
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <form action="/logout" method="post" class="is-hidden" bind:this={form}>
      <button class="button is-fullwidth is-rounded is-danger is-light has-text-weight-bold" type="submit">
        <span class="icon">
          <i class="mdi mdi-logout" />
        </span>
        <span>Log out</span>
      </button>
    </form>
  </nav>
{/if}

<main id="app" class="is-invisible" class:mt-5={isNavVisible}>
  <slot />
</main>

<style lang="scss" global>
  @use '../app.scss';
</style>
