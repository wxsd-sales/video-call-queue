<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Modal from '$components/Modal/Modal.svelte';
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">Video Call Queue SIP Configuration</h2>
  </div>
  <div class="column is-full content mb-0">
    <p>
      Requiring authentication would allow the the queue system to manage and control both requests and calls more
      effectively. Also SIP URI Dialing call option is only available with authentication enabled.
    </p>
  </div>
</div>
