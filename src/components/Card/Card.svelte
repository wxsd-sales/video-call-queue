<script type="ts">
  export let extensionNumber: number;
  export let title: string;
  export let img: string;
  export let index: number;
  export let isDevice: boolean;

  let buttonIsLoading = false;

  const dial = () => {
    window.location.hash = String(extensionNumber);
    window.location.hash = '';
  };

  /** Submits a request and append it to the queue */
  const submitRequest = () => {
    buttonIsLoading = true;

    setTimeout(() => {
      buttonIsLoading = false;
      dial();
    }, 1000);
  };
</script>

<div class="tile is-justify-content-center m-2 ">
  <div id={index} class="card is-translucent-black p-3 ">
    <div class="card-image">
      <figure class="image is-3by2">
        <img src={img} alt="support-figure" class="is-fullwidth" />
      </figure>
    </div>
    <div class="card-content">
      <div class="content">
        <button
          class="button  is-size-5 is-primary is-centered is-fullwidth {buttonIsLoading && 'is-loading'}"
          disabled={!isDevice}
          on:click={submitRequest}
          >{title}
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .card {
    min-width: 20rem;
  }
</style>
