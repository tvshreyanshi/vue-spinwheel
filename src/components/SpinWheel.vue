<template>
  <div>
    <!-- type: canvas -->
    <FortuneWheel
      style="width: 550px; max-width: 100%;"
      :verify="verify"
      :canvas="options"
      :prizes="prizes"
      @rotateStart="onCanvasRotateStart"
      @rotateEnd="onRotateEnd"
      class="spinn-wheel"
      @click="showModal = true"
    />
    <div class="modal fade" :class="{ show: showModal }" style="display: block;" tabindex="-1" role="dialog" aria-labelledby="lotteryModalLabel" aria-hidden="true" v-if="showModal && eligibleUser && eligibleUser.length > 1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-secondary">
          <div class="modal-header">
            <span class="text-black font-bolder">You have {{ timeLeft }} seconds left</span>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal" ></button>
          </div>
          <div class="modal-body">
            <div v-if="eligibleUser && eligibleUser.length > 0">
              <div v-for="(data, index) in eligibleUser" :key="index">
                <div class="input-group mb-3 shadow-none">
                  <span class="input-group-text border border-primary w-3/4 border-0" id="basic-addon1">{{ data.name }}</span>
                  <input type="text" class="form-control border-primary border-0" v-model="selectedValue[index]">
                </div>
              </div>
              <input class="btn btn-primary border-0 text-black font-bolder" type="submit" value="Submit" @click="addUserAndRotate">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" :class="{ show: showWinningModal }" style="display: block;" tabindex="-1" role="dialog" aria-labelledby="winnerModalLabel" aria-hidden="true" v-if="showWinningModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-secondary">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeWinnerModal" ></button>
          </div>
          <div class="modal-body">
            <span class="text-black text-base font-bolder text-capitalize">The Lucky number is {{ lotteryNumber }}</span>
          </div>
      </div>
    </div>
  </div>
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
        borderColor: '#1f1d2b',
        borderWidth: 20,
        lineHeight: 30,
      },
      verifyDuration: 2,
      verify: true,
      prizes: gameData.prizes,
      showModal: false,
      username: '',
      selectedValue: [],
      timer: null,
      timeLeft: 15,
      winnerUser: '',
      showWinningModal: false,
      lotteryNumber: '',
    };
  },
  computed: {
    ...mapState(["gameUserList"]),
    eligibleUser() {
      return this.gameUserList && this.gameUserList.filter((user) => user.point > 0)
    }
  },
  methods: {
    ...mapMutations(["addUser", "UpdateUserPoint", "decrementUserPoints"]),
    closeModal() {
      this.showModal = false;
      this.timeLeft = 15;
    },
    closeWinnerModal() {
      this.showWinningModal = false;
    },
    onCanvasRotateStart (rotate) {
      this.showModal = true;
      this.startTimer();
      this.rotate = rotate;
    },
    addUserAndRotate() {
      this.decrementUserPoints(this.gameUserList);
      this.showModal = false;
      clearInterval(this.timer);

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
      this.lotteryNumber = prize.id;
      this.showWinningModal = true;
      this.calculation(prize.id)
    },
    calculation(prize) {
      const winnerIndex = this.selectedValue.findIndex(i => i == prize.toString());
      if (winnerIndex != -1) {
        const username =  this.eligibleUser[winnerIndex] && this.eligibleUser[winnerIndex].name;
        this.UpdateUserPoint(username);
      }
      this.selectedValue = [];
    },
    startTimer() {
      const interval = 1000;
      const timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          clearInterval(timer);
          this.closeModal(); 
        }
      }, interval);
    },
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
  cursor: pointer;
  line-height: 1;
}
.fw-wheel:before {
  content: "";
  height: calc(100% + 20px);
  position: absolute;
  width: calc(100% + 20px);
  border: 20px solid #dbeaf2;
  border-radius: 50%;
  left: -10px;
  top: -10px;
}
.fw-wheel:after {
  content: "";
  height: calc(100% + 40px);
  position: absolute;
  width: calc(100% + 40px);
  border: 10px solid #3c3a58;
  border-radius: 50%;
  left: -20px;
  top: -20px;
}
.fw-container.spinn-wheel {
  overflow: visible;
}
.modal .modal-dialog-centered .input-group .input-group-text{
  background-color: #f0a71c;
  box-shadow: inset 10px 0px 20px #8a5306;
  font-size: 18px;
  color: black;
  font-weight: 600;
}
.modal .modal-dialog-centered input:focus {
  box-shadow: inset -10px 0px 20px #8a5306;
}
.modal .modal-dialog-centered input {
  background-color: #f0a71c;
  box-shadow: inset -10px 0px 20px #8a5306;
}
</style>