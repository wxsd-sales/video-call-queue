<script lang="ts">
  import HeaderLogo from './.header/.Logo.svelte';
  import HeaderWeather from './.header/.Weather.svelte';
  import type { Data } from '../../../database/entities/data';
  import type { WEATHER_RESPONSE_UNITS } from '$lib/enums';

  import { toFileList } from '../.helpers';

  export let brandLogo: Data;
  export let displayWeather: boolean;
  export let weatherCityId: number;
  export let weatherUnits: WEATHER_RESPONSE_UNITS;
</script>

<div class="header px-2 has-text-white is-translucent-black">
  {#await toFileList(brandLogo) then brandLogo}
    <HeaderLogo {brandLogo} />
  {:catch}
    <HeaderLogo />
  {/await}
  <HeaderWeather {displayWeather} {weatherCityId} {weatherUnits} />
</div>

<style>
  .header {
    display: flex;
    height: 15%;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
</style>
