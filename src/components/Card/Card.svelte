<script type="ts">
  import Notification from '$components/Notification/Notification.svelte';
  import { NOTIFICATION_TYPES } from '$components/Notification/enums';
  import { hideSIPWarningStore } from '$lib/store';

  export let extensionNumber: number;
  export let title: string;
  export let img: string;
  export let isDevice: boolean;

  let isLoading = false;
  let SIPrequestIsSubmitted = false;
  let buttonIsLoading = false;
  let timer = 5;
  let displayNotification = false;

  /** Submits a request and append it to the queue */
  const submitRequest = () => {
    SIPrequestIsSubmitted = true;
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
      buttonIsLoading = false;
    }
  };
</script>

<div class="card is-translucent-black p-3">
  <div class="card-image">
    <figure class="image is-5by3">
      <img src={img} alt="support-figure" />
    </figure>
  </div>
  <div class="card-content">
    <div class="content">
      <button
        class="button is-size-4 is-primary is-centered  {buttonIsLoading && 'is-loading'}"
        on:click={submitRequest}
        disabled={!isDevice}
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
