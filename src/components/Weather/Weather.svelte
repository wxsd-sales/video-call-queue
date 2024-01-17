<script lang="ts">
  import type { WeatherResponse, Units, IconVariant } from './types';
  import { onMount } from 'svelte';
  import { browser } from '$app/env';
  import WeatherIcon from './WeatherIcon.svelte';

  export let dataSource = 'OWM';
  export let cityId = 4887398;
  export let units: Units = 'imperial';
  export let iconVariant: IconVariant = 'line';
  export let updateInterval = 3600;
  export let iconPrefix = '/api';
  export let getWeatherResponse: (...args) => Promise<WeatherResponse> = () => Promise.reject(undefined);
  export const tempSuffix = (units: Units) => {
    switch (units) {
      case 'imperial':
        return '&deg;F';
      case 'metric':
        return '&deg;C';
      default:
        return '&deg;K';
    }
  };
  export let displayWeather = false;

  let weatherResponse = browser ? getWeatherResponse(cityId, units) : Promise.reject(undefined);

  onMount(() => {
    const interval = updateInterval * 1000;
    const intervalId = setInterval(() => (weatherResponse = getWeatherResponse(cityId, units)), interval);

    return () => clearInterval(intervalId);
  });
</script>

<section>
  {#await weatherResponse then value}
    <div class="level is-mobile mb-3">
      {#if dataSource}
        <p class="level-left is-size-7 has-text-grey-light">Source: {dataSource}</p>
      {/if}
      <p class="level-right has-text-right has-text-weight-medium is-size-6">{value.place}</p>
    </div>
    <slot />
    <div class="level is-mobile">
      <div class="level-left">
        <p class="level-item">{value.temp.toFixed(0)}{@html tempSuffix(value.units)}</p>
        <p class="level-item is-size-6">
          <small>H: {value.tempMax.toFixed(0)}&deg;</small>
        </p>
        <p class="level-item is-size-6">
          <small>L: {value.tempMin.toFixed(0)}&deg;</small>
        </p>
      </div>
      <div class="level-right has-text-right">
        {#if $$slots.icon}
          <slot name="icon" />
        {:else}
          <WeatherIcon url="{iconPrefix}/weather/icons/{value.icon}?iconVariant={iconVariant}" />
        {/if}
        <p class="level-item">{value.main}</p>
      </div>
    </div>
  {:catch error}
    {#if displayWeather}
      <div class="is-flex is-justify-content-center">
        <p class="is-size-4 has-text-danger">Invalid city ID, Please try again.</p>
      </div>
    {/if}
  {/await}
</section>
