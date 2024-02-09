<script lang="ts">
  import { browser } from '$app/env';
  import copy from 'copy-to-clipboard';

  export let url: string;
  export let label: string;
  export let disabled: boolean;

  let isCopyLoading = false;
  let isCopied = false;

  const copyUrl = () => {
    browser &&
      Promise.resolve((isCopyLoading = true))
        .then(() => copy(url))
        .finally(() =>
          setTimeout(() => {
            isCopyLoading = false;
            isCopied = true;

            setTimeout(() => {
              isCopied = false;
            }, 1000);
          }, 400)
        );
  };
</script>

<div class="columns is-justify-content-center">
  <div class="has-text-weight-medium is-size-6 is-flex is-align-items-center">Demo URL</div>
  <div class="column is-8">
    <div class="field has-addons mb-0">
      <div class="control is-expanded">
        <input
          {disabled}
          class:has-text-white={disabled}
          id="copy-link-input"
          class="has-text-link-dark input is-small has-text-weight-bold"
          value={disabled ? '' : url}
          readonly
        />
      </div>
      <div class="control">
        <button
          {disabled}
          class="button customButton is-small is-success"
          class:is-loading={isCopyLoading}
          on:click={() => copyUrl()}
        >
          <span>{isCopied ? 'Copied' : 'Copy'}</span>
          <span class="icon">
            <i class="mdi mdi-{isCopied ? 'check' : 'content-copy'}" />
          </span>
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .customButton {
    width: 5rem;
  }
</style>
