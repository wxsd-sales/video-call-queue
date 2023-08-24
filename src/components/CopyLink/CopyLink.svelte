<script lang="ts">
  import { browser } from '$app/env';

  export let url: string;
  export let label: string;

  let isCopyLoading = false;
  let isEmbedLoading = false;

  let isEmbedded = false;
  let isCopied = false;

  const copyUrl = () => {
    browser &&
      Promise.resolve((isCopyLoading = true))
        .then(() => navigator.clipboard.writeText(url))
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

  const copyEmbedUrl = () => {
    browser &&
      Promise.resolve((isEmbedLoading = true))
        .then(() => navigator.clipboard.writeText(`${url}&embeddable`))
        .finally(() =>
          setTimeout(() => {
            isEmbedLoading = false;
            isEmbedded = true;

            setTimeout(() => {
              isEmbedded = false;
            }, 1000);
          }, 400)
        );
  };
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <label class="label is-small " for="copy-link-input">{label}</label>
    <div class="field has-addons mb-0">
      <div class="control">
        <a href={url} target="_blank">
          <button class="button is-info is-small">
            <span class="icon">
              <i class="mdi mdi-open-in-new" />
            </span>
          </button>
        </a>
      </div>
      <div class="control is-expanded">
        <input
          id="copy-link-input"
          class="has-text-link-dark input is-small has-text-weight-bold"
          value={url}
          readonly
        />
      </div>
      <div class="control">
        <button
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
      <div class="control">
        <button
          class="button customButton is-danger is-small"
          class:is-loading={isEmbedLoading}
          on:click={() => copyEmbedUrl()}
        >
          <span>{isEmbedded ? 'Copied' : 'Embed'}</span>
          <span class="icon">
            <i class="mdi mdi-{isEmbedded ? 'check' : 'code-tags'}" />
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
