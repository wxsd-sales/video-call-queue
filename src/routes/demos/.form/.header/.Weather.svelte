<script lang="ts">
  import { WEATHER_RESPONSE_UNITS } from '$lib/enums';

  import Weather from '$components/Weather/Weather.svelte';
  import Clock from '$components/Clock/Clock.svelte';
  import Modal from '$components/Modal/Modal.svelte';
  import { formStore, formIsChangedStore } from '$lib/store';

  export let displayWeather = false;
  export let weatherCityId = 4887398;
  export let weatherUnits = WEATHER_RESPONSE_UNITS.IMPERIAL;

  let disableDeleteButton = false;
  let displayWeatherInputsModal = false;
  let disableSaveButton = false;

  const getWeatherResponse = (id: string, units: string) =>
    fetch('/api/weather?' + new URLSearchParams({ id, units })).then((r) => r.json());
</script>

<div
  class="headerWeather"
  on:mouseenter={() => (disableDeleteButton = true)}
  on:mouseleave={() => (disableDeleteButton = false)}
>
  {#if displayWeather}
    <button
      on:click={() => {
        $formIsChangedStore = true;
        displayWeather = false;
        $formStore['displayWeather'] = false;
      }}
      class:is-hidden={!disableDeleteButton}
      class="button is-danger is-small deleteIcon"
    >
      <span class="icon ">
        <i class="mdi mdi-24px mdi-close " />
      </span>
    </button>
    <div class="weatherInfo">
      <Weather cityId={weatherCityId} units={weatherUnits} {getWeatherResponse} {displayWeather}>
        <Clock timeFormatOptions={{ hour: '2-digit', minute: '2-digit', hour12: false }} />
      </Weather>
    </div>
  {:else if !displayWeatherInputsModal}
    <div class="is-flex is-justify-content-flex-end ">
      <button
        on:click={() => {
          displayWeather = false;
          displayWeatherInputsModal = true;
        }}
        class="button is-small is-align-self-flex-end is-success is-outlined is-rounded"
      >
        <span class="mr-2 is-hidden-mobile">Add a Location</span>
        <span class="icon is-small">
          <i class="mdi mdi-24px  mdi-map-marker-outline" />
        </span>
      </button>
    </div>
  {/if}
</div>

<Modal bind:showModal={displayWeatherInputsModal}>
  <div class="modal-content is-translucent-black">
    <article class="message pb-4">
      <div class="message-header">
        <p class="mb-0">Add Location Weather Information</p>
        <button
          type="button"
          class="delete"
          aria-label="delete"
          on:click={() => {
            displayWeatherInputsModal = false;
          }}
        />
      </div>
      <div class="message-body">
        <div class="columns is-flex is-alig">
          <div class="column is-two-fifths">
            <label class="label" for="weatherUnits">Units <sup class="has-text-danger" title="required">*</sup></label>
            <div class="control has-icons-left">
              <span class="select is-empty">
                <select
                  name="weatherUnits"
                  id="unweatherUnitsits"
                  bind:value={weatherUnits}
                  on:input={(e) => ($formStore['weatherUnits'] = e.target.value)}
                >
                  <option selected value="imperial">Imperial &mdash; &deg;F</option>
                  <option value="metric">Metric &mdash; &deg;C</option>
                </select>
              </span>
              <span class="icon is-left">
                <i class="mdi mdi-tape-measure" />
              </span>
              <div class="help">
                <p>Choose a unit for display values</p>
              </div>
            </div>
          </div>
          <div class="column is-three-fifths">
            <label class="label" for="weatherCityId"
              >City Id <sup class="has-text-danger" title="required">*</sup></label
            >
            <div class="control has-icons-left">
              <input
                name="weatherCityId"
                id="weatherCityId"
                class="input"
                type="number"
                placeholder="4887398"
                on:input={(e) => {
                  disableSaveButton = !e.target.value.length;
                }}
                bind:value={weatherCityId}
              />
              <span class="icon is-left">
                <i class="mdi mdi-numeric" />
              </span>
            </div>
            <div class="help">
              <p>
                Enter a valid
                <a href="https://bulk.openweathermap.org/sample/city.list.json.gz" target="_blank">OWM City Id</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="level level-right mt-2 mx-4">
        <div class="field is-grouped">
          <p class="control">
            <button
              class="button is-success is-outlined"
              disabled={disableSaveButton}
              type="button"
              on:click={() => {
                displayWeatherInputsModal = false;
                displayWeather = true;
                disableDeleteButton = false;
                $formIsChangedStore = true;
                $formStore['weatherCityId'] = weatherCityId;
                $formStore['displayWeather'] = !!weatherCityId;
              }}
            >
              Save changes
            </button>
          </p>
          <p class="control">
            <button
              type="button"
              class="button is-danger is-outlined"
              on:click={() => {
                displayWeatherInputsModal = false;
                displayWeather = false;
                disableDeleteButton = false;
              }}
            >
              Discard Changes
            </button>
          </p>
        </div>
      </div>
    </article>
  </div>
</Modal>

<style>
  .deleteIcon {
    z-index: 1;
    top: 0;
    right: 0;
    position: absolute;
  }
  .headerWeather {
    width: 35%;
  }

  .weatherInfo {
    zoom: 0.75;
    position: relative;
  }
</style>
