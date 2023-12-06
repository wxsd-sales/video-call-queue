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

<div class="columns is-multiline">
  <div class="column is-full">
    <label class="label is-small" class:has-text-grey={disabled} for="copy-link-input">{label}</label>
    <div class="field has-addons mb-0">
      <div class="control">
        <a href={url} target="_blank">
          <button {disabled} class="button is-info is-small">
            <span class="icon">
              <i class="mdi mdi-open-in-new" />
            </span>
          </button>
        </a>
      </div>
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
          class="button customButton is-success is-small"
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
