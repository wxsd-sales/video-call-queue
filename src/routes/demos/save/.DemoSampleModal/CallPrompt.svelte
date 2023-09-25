<script lang="ts">
  import { MEETING_TYPE_OPTIONS } from '$lib/enums';

  export let isSDK: boolean;
  export let isIC: boolean;
  export let isSIP: boolean;
  export let title: string;
  export let sipImage: string;

  let meetingType: MEETING_TYPE_OPTIONS =
    (isSDK && MEETING_TYPE_OPTIONS.BROWSER_SDK) ||
    (isIC && MEETING_TYPE_OPTIONS.INSTANT_CONNECT) ||
    ((isSIP && MEETING_TYPE_OPTIONS.SIP_URI_DIALING) as MEETING_TYPE_OPTIONS);
  let displayMeetingOptions = isSDK ? isIC || isSIP : isIC && isSIP;
</script>

<div class="prompt box is-translucent-black is-flex is-flex-direction-column">
  <img src={sipImage} alt="sipImage" class="is-align-self-center mx-5" />
  <button disabled class="button is-primary is-centered mb-4 mx-2">{title} </button>
  <div class="control is-justify-content-space-around is-flex has-text-white is-size-6">
    {#if displayMeetingOptions}
      {#if isSDK}
        <label class="radio">
          <input type="radio" disabled />
          <span>SDK</span>
        </label>
      {/if}
      {#if isIC}
        <label class="radio">
          <input type="radio" disabled />
          <span>IC</span>
        </label>
      {/if}
      {#if isSIP}
        <label class="radio">
          <input type="radio" disabled />
          <span>SIP</span>
        </label>
      {/if}
    {/if}
  </div>
  {#if !(isSIP && !isIC && !isSDK)}
    <div class="has-text-white has-text-centered mt-5" style="font-size: 0.65rem ">
      * Unanswered request will auto-expire in 30 minutes
    </div>
  {/if}
</div>

<style>
  .prompt {
    z-index: 1;
    width: 22rem;
    zoom: 0.9;
  }

  .prompt img {
    width: 15rem;
  }
</style>
