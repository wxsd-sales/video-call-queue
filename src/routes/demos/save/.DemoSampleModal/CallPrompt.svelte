<script lang="ts">
  export let title: string;
  export let sipImage: string;
</script>

<div class="card is-translucent-black p-3">
  <div class="container card-image" style="width: 15rem">
    <figure class="image  is-3by2">
      <img src={sipImage} alt="support-figure" />
    </figure>
  </div>
  <div class="card-content">
    <div class="content">
      <button class="button is-size-6 is-primary is-centered is-fullwidth" disabled>{title} </button>
    </div>
  </div>
</div>
