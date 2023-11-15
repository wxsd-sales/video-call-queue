<script lang="ts">
  import { previewedDemoStore } from '$lib/store';
  import { onDestroy, onMount } from 'svelte';

  export let name: string;
  export let description: string;
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">Create a New Kiosk Instance</h2>
    <article class="message is-info is-medium">
      <div class="message-header is-hidden" />
      <div class="message-body content ">
        <p class="is-italic">
          An <strong>"Instance"</strong> is a single Video Queue implementation accessible between a requestor and an agent.
          This means users can now request support from a device to be connected to an agent in a FIFO order. No authentication
          has been implemented for simplicity.
        </p>
        <p class="has-text-weight-semibold">
          We highly recommend you create an individual "Instance" per customer or use case in order to avoid confusion!
        </p>
      </div>
    </article>
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
  <div class="column is-full is-hidden">
    <label class="label" for="description">Description</label>
    <textarea
      name="description"
      id="description"
      class="textarea"
      maxlength="256"
      placeholder="A few lines..."
      bind:value={description}
      on:input={(e) => ($previewedDemoStore.description = e.target.value)}
    />
    <div class="help">
      <p>This is only for your reference</p>
    </div>
  </div>
</div>
