<script lang="ts">
  import { DonutChart, CirclePackChart, LineChart } from '@carbon/charts-svelte';
  import '@carbon/styles/css/styles.css';
  import '@carbon/charts/styles.css';

  export let meetingOptionsData;
  export let userDemosData;
  export let numberOfAll;

  console.log(numberOfAll);
  export const donutCenteredOptions = {
    resizable: true,
    legend: {
      alignment: 'center'
    },
    donut: {
      center: {
        label: 'Entries'
      },
      alignment: 'center'
    }
  };
</script>

<div class="hero p-6">
  <div class="hero-head">
    <div class="title is-size-2">Metrics</div>
  </div>
  <hr />
  <div class="hero-body">
    <div class="columns">
      <div class="column is-4">
        <div class="subtitle is-size-4"># Demos / Meeting Types</div>
      </div>
      <div class="column is-8">
        <DonutChart data={meetingOptionsData} options={donutCenteredOptions} />
      </div>
    </div>
    <hr />
    <div class="columns">
      <div class="column is-4">
        <div class="subtitle is-size-4"># Demos / Registered Users</div>
      </div>
      <div class="column is-8">
        <CirclePackChart data={userDemosData} options={donutCenteredOptions} />
      </div>
    </div>
    <hr />
    <div class="columns">
      <div class="column is-5">
        <div class="subtitle is-size-4"># Demos & Registered Users Per Day</div>
      </div>
      <div class="column is-7">
        <LineChart
          data={numberOfAll}
          options={{
            timeScale: {
              showDayName: true
            },
            axes: {
              bottom: {
                mapsTo: 'date',
                scaleType: 'time'
              },
              left: {
                mapsTo: 'value',
                title: 'Number of Registered Users',
                scaleType: 'linear'
              }
            },
            curve: 'curveMonotoneX',
            height: '400px'
          }}
        />
      </div>
    </div>
  </div>
</div>
