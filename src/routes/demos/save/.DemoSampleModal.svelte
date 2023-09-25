<script>
  import Carousel from '$components/Carousel/Carousel.svelte';
  import CarouselItem from '$components/Carousel/CarouselItem.svelte';
  import multiple from '$lib/static/img/multiple.png';
  import single from '$lib/static/img/single.png';
</script>

<Carousel>
  <CarouselItem>
    <h3 class="title has-text-white has-text-centered">Single Browser Queue</h3>
    <img alt="single" src={single} />
  </CarouselItem>
  <CarouselItem>
    <h3 class="title has-text-white has-text-centered">Multiple SIP Queues</h3>
    <img alt="multiple" src={multiple} />
  </CarouselItem>
</Carousel>
