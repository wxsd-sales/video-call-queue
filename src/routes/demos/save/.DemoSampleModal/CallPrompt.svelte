<script lang="ts">
  export let title: string;
  export let sipImage: string;
</script>

<div class="prompt box is-translucent-black is-flex is-flex-direction-column">
  <img src={sipImage} alt="sipImage" class="is-align-self-center mb-2" on:load />
  <button disabled class="button is-primary is-centered mb-4 mx-2">{title} </button>
  <div class="control is-justify-content-space-around is-flex has-text-white is-size-6 mb-2" />
</div>

<style>
  .prompt {
    z-index: 1;
    width: 20rem;
    height: 18rem;
  }

  .prompt img {
    width: 11rem;
  }
</style>
