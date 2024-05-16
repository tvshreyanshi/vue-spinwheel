<template>
  <div v-if="visible" class="modal">
    <div ref="modalContainer" class="modal-container">
      <div ref="modalContent" class="modal-content">
        <h1 ref="el => animatedText.value[0] = el">🎉 Congratulations!</h1>
        <button @click="closeModal" class="close-button">Close</button>
      </div>
      <div class="pixi-container" ref="pixiContainer"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick, onMounted } from 'vue';
import { gsap } from 'gsap';
import * as PIXI from 'pixi.js';

export default defineComponent({
  name: 'WinnerModal',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const modalContainer = ref<HTMLDivElement | null>(null);
    const modalContent = ref<HTMLDivElement | null>(null);
    const animatedText = ref<(HTMLHeadingElement | HTMLParagraphElement)[]>([]);
    const pixiContainer = ref<HTMLDivElement | null>(null);

    const app = ref<PIXI.Application | null>(null);
    const particleTexture = ref<PIXI.Texture | null>(null);
    const particles = ref<PIXI.Sprite[]>([]);

    const createParticleTexture = () => {
      const graphics = new PIXI.Graphics();
      graphics.beginFill(0xffffff);
      graphics.drawCircle(0, 0, 5);
      graphics.endFill();
      if (app.value) {
        particleTexture.value = app.value.renderer.generateTexture(graphics);
      }
    };

    const createParticles = () => {
      if (particleTexture.value && app.value) {
        for (let i = 0; i < 200; i++) {
          const particle = new PIXI.Sprite(particleTexture.value);
          particle.anchor.set(0.5);
          particle.visible = true; // Set to visible by default
          particles.value.push(particle);
          app.value.stage.addChild(particle);
        }
      }
    };

    const showParticles = () => {
      particles.value.forEach((particle, i) => {
        particle.x = 150;
        particle.y = 150;
        particle.alpha = 0;
        particle.visible = true;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        gsap.fromTo(
          particle,
          { alpha: 0 },
          {
            alpha: 1,
            x: 150 + Math.cos(angle) * speed * 50,
            y: 150 + Math.sin(angle) * speed * 50,
            duration: 2,
            ease: 'power1.out',
            repeat: -1,
            repeatDelay: 2,
          }
        );
      });
    };

    const animateModalContent = () => {
      if (modalContent.value) {
        // Animate the modal content
        gsap.fromTo(
          modalContent.value,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: 'bounce.out' }
        );
      }

      animatedText.value.forEach((element, index) => {
        if (element) {
          // Animate the text
          gsap.fromTo(
            element,
            { scale: 0.8, color: '#000' },
            {
              scale: 1,
              color: '#ff4500',
              yoyo: true,
              repeat: -1,
              ease: 'power1.inOut',
              duration: 0.6,
              delay: index * 0.1, // Stagger animation
            }
          );
        }
      });
    };

    watch(() => props.visible, (newVal) => {
      if (newVal) {
        nextTick(() => {
          animateModalContent();
          showParticles();
        });
      }
    });

    const closeModal = () => {
      emit('update:visible', false);
    };

    onMounted(() => {
      if (pixiContainer.value) {
        app.value = new PIXI.Application({ width: 300, height: 300, transparent: true });
        pixiContainer.value.appendChild(app.value.view);
        createParticleTexture();
        createParticles();
      }
    });

    return { modalContainer, modalContent, animatedText, pixiContainer, closeModal };
  },
});
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  position: relative;
}

.modal-content {
  background: yellow;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  transform: scale(0.5);
  animation: popIn 0.6s forwards, bounce 1s infinite;
  width: 300px;
  position: relative;
}

.pixi-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Allow clicking through the PIXI canvas */
}

h1 {
  font-size: 1.8em;
  margin-bottom: 0.5em;
}

p {
  font-size: 1.2em;
  margin-bottom: 1em;
}

.close-button {
  padding: 5px 10px;
  font-size: 0.9em;
  border: none;
  border-radius: 3px;
  background: #FF6347; /* Tomato color */
  color: white;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
}

.close-button:hover {
  background: #FF4500; /* OrangeRed color */
  transform: scale(1.1);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}
</style>
