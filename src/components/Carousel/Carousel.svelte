<script lang="ts">
  import { onMount } from 'svelte';
  import { register } from 'swiper/element/bundle';

  let swiperEl;

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') swiperEl.swiper.slideNext();
    if (e.key === 'ArrowLeft') swiperEl.swiper.slidePrev();
  };

  onMount(() => {
    register();
  });
</script>

<div class="modal-content is-translucent-black" style="padding: 3rem; width: 100rem;border-radius: 1.25rem;">
  <div class="columns">
    <div class="column  is-flex is-align-items-center">
      <button class="button is-medium is-danger" on:click={swiperEl.swiper.slidePrev()}
        ><span class="icon is-medium">
          <i class="mdi mdi-less-than" />
        </span></button
      >
    </div>
    <div class="column is-10">
      <swiper-container slides-per-view="1" grid-rows="1" bind:this={swiperEl} space-between={5} pagination="true">
        <slot />
      </swiper-container>
    </div>
    <div class="column ml-5 is-align-items-center is-flex">
      <button class="button is-medium is-danger" on:click={swiperEl.swiper.slideNext()}>
        <span class="icon ">
          <i class="mdi mdi-greater-than" />
        </span>
      </button>
    </div>
  </div>
</div>

<svelte:window on:keydown={onKeyDown} />
