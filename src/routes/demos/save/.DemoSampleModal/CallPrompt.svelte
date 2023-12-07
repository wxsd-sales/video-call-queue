<script lang="ts">
  export let title: string;
  export let sipImage: string;
</script>

<div>
  <div class="card is-translucent-black p-3">
    <div class="container card-image">
      <figure class="image  is-3by2">
        <img src={sipImage} alt="support-figure" />
      </figure>
    </div>
    <div class="card-content">
      <div class="content">
        <button class="button fixed is-size-6 is-primary is-centered is-fullwidth" disabled>{title} </button>
      </div>
    </div>
  </div>
</div>

<style>
  .fixed {
    width: 15rem;
  }
</style>
