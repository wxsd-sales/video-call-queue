<script lang="ts">
  import QueuePrompt from './.QueuePrompt.svelte';
  import Notification from '$components/Notification/Notification.svelte';
  import { NOTIFICATION_TYPES, NOTIFICATION_VALUES } from '$components/Notification/enums';
  import { DEVICE_CALL_QUEUE_SETUP_GUIDE } from '$lib/constants';
  import defaultSupportImg from '$lib/static/img/customer-support.png';
  export let demo: JSON;
  export let embeddable: boolean;

  const { isSIP, isSDK, isIC, uuid } = demo;

  let sipQueues = [{ title: 'Looking for Assistance?', extensionNumber: 1111, sipImage: defaultSupportImg }];
  let extensionNumber = 1111;

  if (demo.isSIP) {
    sipQueues = [
      {
        title: demo.sipTitle || 'Looking for Assistance?',
        extensionNumber: demo.extensionNumber,
        sipImage: demo.sipImage || defaultSupportImg
      },
      demo.sipTitle1 && { title: demo.sipTitle1, extensionNumber: demo.extensionNumber1, sipImage: demo.sipImage1 },
      demo.sipTitle2 && { title: demo.sipTitle2, extensionNumber: demo.extensionNumber2, sipImage: demo.sipImage2 },
      demo.sipTitle3 && { title: demo.sipTitle3, extensionNumber: demo.extensionNumber3, sipImage: demo.sipImage3 }
    ].filter(Boolean);
  }
  embeddable = sipQueues.length > 1 ? true : embeddable;

  let displaySIPErrorNotification = false;
  let displayNewSIPErrorNotification = false;
  let timer = 8;

  const showNotif = ({ detail }) => {
    if (detail.props.value === NOTIFICATION_VALUES.SIP_ERROR) {
      displaySIPErrorNotification = true;
    } else {
      displayNewSIPErrorNotification = true;
      extensionNumber = detail.props.extensionNumber;
      const interval = setInterval(() => {
        timer--;

        if (!timer) {
          clearInterval(interval);
          timer = 8;
          displayNewSIPErrorNotification = false;
        }
      }, 1000);
    }
  };
</script>

<div class="columns mb-2 is-align-items-center is-mobile">
  <div class="column is-3 is-flex is-justify-content-flex-end" />
</div>

<div class="is-flex is-justify-content-space-evenly">
  {#each sipQueues as { extensionNumber, title, sipImage }, index}
    <QueuePrompt
      {index}
      {uuid}
      {isSDK}
      {isIC}
      {isSIP}
      {extensionNumber}
      {title}
      {embeddable}
      {sipImage}
      on:notif={showNotif}
    />
  {/each}
</div>

<Notification type={NOTIFICATION_TYPES.ERROR} display={displaySIPErrorNotification} {embeddable}>
  In order to experience our <strong>SIP URI Dialing</strong> flow, you must launch this demo on Cisco roomOS devices in
  kiosk mode with proper macro setup enabled on the device and enable WxC video calling queue. For more information
  please visit our
  <a target="_blank" href={DEVICE_CALL_QUEUE_SETUP_GUIDE}>page</a>.
</Notification>

<Notification type={NOTIFICATION_TYPES.WARNING} display={displayNewSIPErrorNotification} hideClose>
  <div class="is-flex is-flex-direction-column">
    <p>
      A new macro available inside our demo generator is recommended to be enabled and saved in your device. Please
      acknowledge before dialing.
    </p>
    <button
      class="button is-warning is-light mt-4"
      on:click={() => {
        location.href = `sip:${extensionNumber}`;
        displayNewSIPErrorNotification = false;
      }}>Acknowledge</button
    >
    <p class="is-size-7 pt-2 is-align-self-center">* This notification automatically closes in {timer} seconds.</p>
  </div>
</Notification>
