<script lang="ts">
  import CustomerSupportImg from '$lib/static/img/customer-support.svg';

  export let isSDK: boolean;
  export let isIC: boolean;
  export let isSIP: boolean;
  export let title: string;
  export let sipImage = CustomerSupportImg;

  $: displayMeetingOptions = isSDK ? isIC || isSIP : isIC && isSIP;
</script>

<div class="prompt box is-translucent-black is-flex is-flex-direction-column">
  <img src={CustomerSupportImg} alt="sipImage" class="is-align-self-center mb-2" on:load />
  <button disabled class="button is-primary is-centered mb-4 mx-2">{title} </button>
  <div class="control is-justify-content-space-around is-flex has-text-white is-size-6 mb-2">
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
    <div class="footnote has-text-white has-text-centered">* Unanswered request will auto-expire in 30 minutes</div>
  {/if}
</div>

<style>
  .footnote {
    font-size: 0.65rem;
  }
  .prompt {
    z-index: 1;
    width: 20rem;
    height: 20rem;
  }

  .prompt img {
    width: 11rem;
  }
</style>
