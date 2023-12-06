<script lang="ts">
  import { previewedDemoStore } from '$lib/store';

  export let name: string;
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">Create a New Kiosk Instance</h2>
  </div>
  <div class="column is-full">
    <label class="label" for="name">Name <sup class="has-text-danger" title="required">*</sup></label>
    <div class="control ">
      <input
        name="name"
        id="name"
        class="input"
        type="text"
        minlength="6"
        maxlength="64"
        placeholder="Video Calling Queue Demo"
        bind:value={name}
        on:input={(e) => ($previewedDemoStore.name = e.target.value)}
      />
      <span class="icon is-left" />
    </div>
    <div class="help">
      <p>This is only for your reference</p>
    </div>
  </div>
</div>
