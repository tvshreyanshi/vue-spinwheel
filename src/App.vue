<template>
 <div class="game-section row align-items-center m-0 gy-lg-0 gy-5 h-full">
    <div class="wheel-section col-lg-8">
      <SpinWheel class="text-center"/>
    </div>
    <div class="col-lg-4 h-full pt-4 pb-lg-0 pb-4">
      <UserListing />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import UserListing from './components/UserListing.vue';
import SpinWheel from './components/SpinWheel.vue';

export default defineComponent({
  name: 'App',
  components: {
    UserListing,
    SpinWheel,
  },
})
</script>
<style>
#app {
  background: url('../src/assets/Image/spinwheel-background.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-attachment:fixed;
}
</style>

