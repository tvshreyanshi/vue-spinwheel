<template>
  <div>
    <FortuneWheel
      style="width: 550px; max-width: 100%"
      :verify="verify"
      :canvas="options"
      :prizes="prizes"
      @rotateStart="onCanvasRotateStart"
      @rotateEnd="onRotateEnd"
      class="spinn-wheel"
      @click="showModal = true"
    />
    <div
      class="modal fade"
      :class="{ show: showModal }"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-labelledby="lotteryModalLabel"
      aria-hidden="true"
      v-if="showModal && eligibleUser && eligibleUser.length > 0"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-secondary">
          <div class="modal-header">
            <span class="text-black font-bolder"
              >You have {{ timeLeft }} seconds left</span
            >
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="eligibleUser && eligibleUser.length > 0">
              <div v-for="(data, index) in eligibleUser" :key="index">
                <div class="input-group mb-3 shadow-none">
                  <span
                    class="input-group-text border border-primary w-3/4 border-0"
                    id="basic-addon1"
                    >{{ data.name }}</span
                  >
                  <input
                    type="text"
                    class="form-control border-primary border-0 select-value-input"
                    v-model="selectedValue[index]"
                  />
                </div>
              </div>
              <input
                class="btn btn-primary border-0 text-black font-bolder"
                type="submit"
                value="Submit"
                @click="addUserAndRotate"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      :class="{ show: showWinningModal }"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-labelledby="winnerModalLabel"
      aria-hidden="true"
      v-if="showWinningModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-secondary">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="closeWinnerModal"
            ></button>
          </div>
          <div class="modal-body">
            <span class="text-black text-base font-bolder text-capitalize"
              >The Lucky number is {{ lotteryNumber }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <WinnerModal v-model:visible="winnerVisible" />
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import * as PIXI from 'pixi.js';
import FortuneWheel from "vue-fortune-wheel";
import "vue-fortune-wheel/style.css";
import gameData from "../data/game.json";
import store from "../store/index";
import WinnerModal from './WinnerModal.vue';
import { gsap } from 'gsap';

const pixiContainer = ref<HTMLDivElement | null>(null);
const pixiApp = ref<PIXI.Application>();
const winnerVisible = ref(false);
const verify = ref(true);
const prizes = gameData.prizes;
const showModal = ref(false);
const selectedValue = ref([]);
const timer = ref<number | undefined>(undefined);
const showWinningModal = ref(false);
const lotteryNumber = ref("");
const verifyDuration = 2;
const rotateSpin = ref();
const options = {
  btnWidth: 140,
  borderColor: "#1f1d2b",
  borderWidth: 20,
  lineHeight: 30,
};
let timeLeft = ref(15);
const gameUserList = computed(() => store.state.gameUserList);

const eligibleUser = computed(() => {
  return gameUserList.value.filter((user: any) => user.point > 0);
});
const closeModal = () => {
  showModal.value = false;
  clearInterval(timer.value);
};
const closeWinnerModal = () => {
  showWinningModal.value = false;
};
const onCanvasRotateStart = (rotate: any) => {
  showModal.value = true;
  startTimer();
  rotateSpin.value = rotate;
  // rotate();
};
const addUserAndRotate = () => {
  store.commit("decrementUserPoints", gameUserList.value);
  showModal.value = false;
  clearInterval(timer.value);
  if (verify.value) {
    const verified = true;
    spinDelayRequest(verified, verifyDuration * 1000).then((verifiedRes) => {
      if (verifiedRes) {
        rotateSpin.value();
      } else {
        alert("Failed verification");
      }
    });
    return;
  }
};
const spinDelayRequest = (verified: any, duration: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(verified);
    }, duration);
  });
};
const onRotateEnd = (prize: any) => {
  //lotteryNumber.value = prize.id;
  //showWinningModal.value = true;
  calculation(prize.id);
};
const calculation = (prize: any) => {
  winnerVisible.value = true;
  showWinnerAnimation();
  // const winnerIndex = selectedValue.value.findIndex(
  //   (i) => i == prize.toString()
  // );
  // if (winnerIndex != -1) {
  //   const username = eligibleUser.value[winnerIndex] && eligibleUser.value[winnerIndex].name;
  //   store.commit("UpdateUserPoint", username);
  // }
  // selectedValue.value = [];
};
const startTimer = () => {
  const interval = 1000;
  const timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timer);
      closeModal();
    }
  }, interval);
  timeLeft.value = 15;
};

const showWinnerAnimation = () => {
  if (pixiApp.value) {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xffd700);
    graphics.drawStar(400, 300, 5, 100, 50);
    graphics.endFill();
    pixiApp.value.stage.addChild(graphics);
    
    // Animate the star graphic
    gsap.fromTo(graphics, 
      { alpha: 0, scale: 0 }, 
      { alpha: 1, scale: 1, duration: 1, ease: "elastic.out(1, 0.3)" }
    );
    
    // Add celebratory particles
    const particles = new PIXI.ParticleContainer(1000, {
      scale: true,
      position: true,
      rotation: true,
      uvs: true,
      alpha: true,
    });
    pixiApp.value.stage.addChild(particles);

    for (let i = 0; i < 100; i++) {
      const particle = new PIXI.Sprite.from(PIXI.Texture.WHITE);
      particle.tint = Math.random() * 0xFFFFFF;
      particle.x = 400;
      particle.y = 300;
      particle.alpha = 0.6;
      particle.anchor.set(0.5);
      particle.scale.set(Math.random() * 0.5);
      particles.addChild(particle);

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      gsap.fromTo(
        particle,
        { alpha: 0 },
        {
          alpha: 1,
          x: 400 + Math.cos(angle) * speed * 50,
          y: 300 + Math.sin(angle) * speed * 50,
          duration: 2,
          ease: "power1.out",
          repeat: -1,
          repeatDelay: 2,
        }
      );
    }
  }
};

onMounted(() => {
  if (pixiContainer.value) {
    pixiApp.value = new PIXI.Application({ width: 800, height: 600 });
    pixiContainer.value.appendChild(pixiApp.value.view);
  }
});

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
.modal .modal-dialog-centered .input-group .input-group-text {
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
.modal .modal-dialog-centered input.select-value-input {
  box-shadow: inset 7px 0px 20px #8a5306;
}
</style>
