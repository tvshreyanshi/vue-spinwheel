<template>
  <div>
    <!-- type: canvas -->
    <FortuneWheel
      style="width: 500px; max-width: 100%;"
      :verify="verify"
      :canvas="options"
      :prizes="prizes"
      @rotateStart="onCanvasRotateStart"
      @rotateEnd="onRotateEnd"
      class="spinn-wheel"
      @click="showModal = true"
    />
    <div class="modal fade" :class="{ show: showModal }" style="display: block;" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" v-if="showModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title fs-5">Select your Lottery Number</h3>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="gameUserList && gameUserList.length > 0">
              <h5 class="mb-4 text-start">User name:</h5>
              <div v-for="(data, index) in gameUserList" :key="index">
                <div class="input-group mb-3">
                  <span class="input-group-text border border-primary w-3/4" id="basic-addon1">{{ data.name }}</span>
                  <input type="text" class="form-control border-primary" v-model="selectedValue[index]">
                </div>
              </div>
              <input class="btn btn-primary" type="submit" value="Submit" @click="addUserAndRotate">
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="modal" :class="{ 'is-active': showModal }">
      <div class="modal-background" @click="closeAddUserModal"></div>
      <div class="modal-content">
        <h3>Select your Lottery Number</h3>
        <hr />
        <div v-if="gameUserList && gameUserList.length > 0">
          <label for="username">User name:</label>
          <div v-for="(data, index) in gameUserList" :key="index">
            <label>{{ data.name }}</label>
            <input type="text" v-model="selectedValue[index]" style="margin-left: 10px;" />
          </div>
          <input type="submit" value="Submit" @click="addUserAndRotate">
        </div>
        </div>
    </div> -->
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import FortuneWheel from 'vue-fortune-wheel'
import 'vue-fortune-wheel/style.css'
import gameData from '../data/game.json';


export default {
  name: 'SpinWheel',
  components: {
    FortuneWheel
  },
  data() {
    return {
      options: {
        btnWidth: 140,
        borderColor: '#584b43',
        borderWidth: 6,
        lineHeight: 30
      },
      verifyDuration: 2,
      verify: true,
      prizes: gameData.prizes,
      showModal: false,
      username: '',
      selectedValue: [],
    };
  },
  computed: {
    ...mapState(["gameUserList"]),
    getGameUserData() {
      return this.gameUserList && this.gameUserList.filter((user) => user.point > 0)
    }
  },
  methods: {
    ...mapMutations(["addUser", "UpdateUserPoint", "decrementUserPoints"]),
    onCanvasRotateStart (rotate) {
      this.showModal = true;
      this.rotate = rotate;
    },
    addUserAndRotate() {
      this.decrementUserPoints(this.gameUserList);
      this.showModal = false;
      

      if (this.verify) {
        const verified = true;
        this.spinDelayRequest(verified, this.verifyDuration * 1000).then((verifiedRes) => {
          if (verifiedRes) {
            this.rotate();
          } else {
            alert('Failed verification')
          }
        })
        return
      }
    },
    spinDelayRequest (verified, duration) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(verified)
        }, duration)
      })
    },
    onRotateEnd (prize) {
      alert(prize.value);
      this.calculation(prize.id)
    },
    calculation(prize) {
      console.log('prize---', prize);
      console.log('selectd', this.selectedValue);
      console.log('gameUserList', this.gameUserList);
      const winnerIndex = this.selectedValue.findIndex(i => i == prize.toString());
      if (winnerIndex != -1) {
        const username =  this.gameUserList[winnerIndex].name;
        console.log('username in spinwheel');
        this.UpdateUserPoint(username);
      }
      this.selectedValue = [];
      // console.log('winner',);
    }
  },
};
</script>
<style>
/* CSS for modal */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  justify-content: center;
  align-items: center;
}

.modal.is-active {
  display: flex;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
</style>
