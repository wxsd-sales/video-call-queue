<script lang="ts">
  import Prism from 'prismjs';
  import 'prism-themes/themes/prism-coy-without-shadows.css';
  import copy from 'copy-to-clipboard';

  export let language: string;
  export let code: string;
  export let filename: string;

  let copyIsLoading = false;
  let isCopied = false;

  let downloadIsLoading = false;
  let isDownloaded = false;

  const download = (filename: string, text: string) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  const clickToDownload = () => {
    downloadIsLoading = true;

    setTimeout(async () => {
      downloadIsLoading = false;
      download(filename, code);
      isDownloaded = true;

      setTimeout(() => {
        isDownloaded = false;
      }, 2000);
    }, 1000);
  };

  const clickToCopy = () => {
    copyIsLoading = true;

    setTimeout(async () => {
      copy(code);
      copyIsLoading = false;
      isCopied = true;

      setTimeout(() => {
        isCopied = false;
      }, 2000);
    }, 1000);
  };
</script>

<pre class="is-flex is-flex-direction-column " style="height: 100%; border-radius: 1rem;">
   <div class="is-flex is-justify-content-flex-end m-0">
      <button
      type="button"
      class={`button is-inverted ${isDownloaded && 'is-success'}`}
      style="border: none; box-shadow:none; background:transparent;"
      class:is-loading={downloadIsLoading}
      on:click={() => clickToDownload()}>
        <span class="icon ">
          <i class={`mdi  mdi-24px mdi-${isDownloaded ? 'check' : 'download'}`} />
        </span>
      </button>
      <button
      type="button"
      class={`button is-inverted ${isCopied && 'is-success'}`}
      style="border: none; box-shadow:none; background:transparent;"
      class:is-loading={copyIsLoading}
      on:click={() => clickToCopy()}>
        <span class="icon">
          <i class={`mdi mdi-24px mdi-${isCopied ? 'check' : 'content-copy'}`} />
        </span>
      </button>
    </div>
  <div class="code">
    {@html Prism.highlight(code, Prism.languages[language])}
  </div>
</pre>

<style>
  .code {
    overflow: auto;
    height: 100%;
  }

  div.code > .token {
    display: initial !important;
  }
</style>
