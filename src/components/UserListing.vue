<template>
  <div class="user-list-section table-responsive">
    <table class="table user-table mb-4 bg-secondary">
      <thead class="px-4">
        <tr class="d-block">
          <th
            class="font-bold text-black border-0 text-md font-bolder text-capitalize py-0 px-4 w-3/4 d-inline-block"
          >
            User Name
          </th>
          <th
            class="font-bold text-black border-0 text-md font-bolder text-capitalize py-0 px-4 w-1/4 d-inline-block"
          >
            Euro
          </th>
        </tr>
      </thead>
      <tbody class="px-4">
        <tr
          class="rounded-3"
          v-for="(user, index) in gameUserList"
          v-bind:key="index"
        >
          <td
            class="py-2 border-0 text-black text-base font-bolder text-capitalize rounded-start-3 w-3/4 d-inline-block text-wrap"
          >
            {{ user.name }}
          </td>
          <td
            class="py-2 d-inline-block border-0 text-black text-base font-bolder text-capitalize rounded-end-3 w-1/4 d-inline-block"
          >
            {{ user.point }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="text-center">
      <!-- Button to open modal -->
      <button
        type="button"
        class="border-0 btn text-black font-bolder mx-2"
        @click="showModal = true"
      >
        Add User
      </button>
      <button
        type="button"
        class="border-0 btn text-black font-bolder"
        @click="resetGamePoints"
      >
        Reset Game Point
      </button>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      :class="{ show: showModal }"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      v-if="showModal"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content bg-secondary">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Add User</h5>
            <button
              type="button"
              class="close bg-transparent"
              @click="closeModal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="modal-body">
              <input
                class="form-control mb-6 border-0"
                type="text"
                v-model="username"
              />
              <input
                class="btn-primary border-0 btn text-black font-bolder"
                type="submit"
                value="Submit"
                @click="addUserInArray"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- Backdrop -->
      <div class="modal-backdrop fade show" v-if="showModal"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import store from "../store/index";

const username = ref(null);
const showModal = ref(false);

const gameUserList = computed(() => store.state.gameUserList);
const closeModal = () => {
  showModal.value = false;
};
const addUserInArray = () => {
  if (username.value && !checkUserExists(username.value, gameUserList.value)) {
    const user = {
      name: username.value,
      point: 3,
    };
    store.commit("addUser", user);
    username.value = null;
    showModal.value = false;
  }
};
const checkUserExists = (nameToCheck: string, dataArray: any[]) => {
  return dataArray.some((user) => user.name === nameToCheck);
};
const resetGamePoints = () => {
  store.commit("ResetGamePoints");
};
</script>
<style scoped>
tr:nth-child(even) {
  background-color: #dddddd;
}
.user-add-modal-popup {
  display: block;
  position: fixed;
  z-index: 1;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}
/* Modal Content */

/* The Close Button */
.close {
  font-size: 28px;
  font-weight: bold;
}
.user-table > thead {
  display: block;
  padding: 12px 0;
}
.user-table > tbody {
  overflow-y: scroll;
  max-height: 500px;
  display: block;
}
.user-table > tbody::-webkit-scrollbar {
  background: transparent;
  width: 0;
  height: 5px;
}
.user-table > tbody::-webkit-scrollbar-thumb {
  background: gray;
  border-radius: 10px;
}
.user-table > tbody {
  scrollbar-width: none;
  scrollbar-color: gray transparent;
}
.user-table tbody > tr {
  background-color: #f0a71c;
  box-shadow: inset 0px 0px 20px #8a5306;
  min-width: 100%;
  display: inline-block;
  margin-bottom: 12px;
}
.user-table {
  background-color: #f5d02d;
  border-radius: 16px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  display: block;
}
.modal {
  display: none;
}
.modal.show {
  display: block;
  padding-right: 17px;
}
.modal-dialog {
  z-index: 9999;
}
.modal .modal-dialog-centered input {
  background-color: #f0a71c;
  box-shadow: inset 0px 0px 20px #8a5306;
}
.btn,
.btn:hover {
  background-color: #f0a71c;
  box-shadow: inset 0px 0px 20px #8a5306;
}
</style>