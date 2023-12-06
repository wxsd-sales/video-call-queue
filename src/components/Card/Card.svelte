<script type="ts">
  import Notification from '$components/Notification/Notification.svelte';
  import { NOTIFICATION_TYPES } from '$components/Notification/enums';
  import { hideSIPWarningStore } from '$lib/store';

  export let extensionNumber: number;
  export let title: string;
  export let img: string;
  export let index: number;
  export let isDevice: boolean;

  let buttonIsLoading = false;
  let timer = 5;
  let displayNotification = false;

  /** Submits a request and append it to the queue */
  const submitRequest = () => {
    window.location.hash = String(extensionNumber);
    window.location.hash = '';
    buttonIsLoading = true;

    if (!$hideSIPWarningStore) {
      displayNotification = true;
      const interval = setInterval(() => {
        timer--;

        if (!timer) {
          clearInterval(interval);
          timer = 5;
          displayNotification = false;
          buttonIsLoading = false;
        }
      }, 1000);
    } else {
      setTimeout(() => {
        buttonIsLoading = false;
      }, 1000);
    }
  };
</script>

<div id={index} class="card is-translucent-black p-3">
  <div class="card-image container" style="width: 18rem">
    <figure class="image is-3by2">
      <img src={img} alt="support-figure" class="is-fullwidth" />
    </figure>
  </div>
  <div class="card-content">
    <div class="content">
      <button
        class="button is-size-5 is-primary is-centered is-fullwidth {buttonIsLoading && 'is-loading'}"
        disabled={!isDevice}
        on:click={submitRequest}
        >{title}
      </button>
    </div>
  </div>
</div>

<Notification type={NOTIFICATION_TYPES.WARNING} display={displayNotification} hideClose>
  <div class="is-flex is-flex-direction-column">
    <p>
      A new macro available inside our demo generator is recommended to be enabled and saved in your device. Please
      acknowledge before dialing.
    </p>
    <button
      class="button is-warning is-light mt-4"
      on:click={() => {
        displayNotification = false;
        $hideSIPWarningStore = true;
        buttonIsLoading = false;
      }}>Acknowledge</button
    >
    <p class="is-size-7 pt-2 is-align-self-center">* This notification automatically closes in {timer} seconds.</p>
  </div>
</Notification>
