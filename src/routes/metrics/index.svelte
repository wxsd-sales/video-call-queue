<script lang="ts">
  import { CirclePackChart, LineChart, TreemapChart, TreeChart } from '@carbon/charts-svelte';
  import '@carbon/charts/styles.css';

  export let userDemosData;
  export let numberOfAll;
  export let treeData;

  let tree;
  const treeOptions = {
    height: '1000px',
    tree: {
      rootTitle: 'Users'
    }
  };
  const donutCenteredOptions = {
    resizable: true,
    legend: {
      alignment: 'left',
      truncation: {
        numCharacter: 3
      }
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
  <div class="hero-body">
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
    <hr />
    <div class="columns">
      <div class="column">
        <div class="subtitle is-size-4"># Users Tree</div>
      </div>
    </div>
    <div class="columns">
      <div class="column ">
        <TreeChart data={treeData} options={treeOptions} />
      </div>
    </div>
  </div>
</div>
