<template>
  <div class="game-section  row h-screen align-items-center m-0">
    <div class="wheel-section col-sm-8">
      <SpinWheel class="text-center"/>
    </div>
    <div class="col-sm-4 h-full pt-4">
      <UserListing />
    </div>
  </div>
</template>



<script>
import SpinWheel from './components/SpinWheel.vue';
import UserListing from './components/UserListing.vue';

export default {
  name: 'App',
  components: {
    SpinWheel,
    UserListing
  },
}
</script>
<style>
#app {
  background: url('../assets/Image/spinwheel-background.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>

