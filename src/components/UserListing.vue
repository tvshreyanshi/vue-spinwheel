<template>
   <div class="user-list-section table-responsive">
      <table class="table bg-secondary user-table">
        <thead>
          <tr>
            <th class="font-bold text-white border-0 text-md font-bolder text-capitalize py-0 px-4">User Name</th>
            <th class="font-bold text-white border-0 text-md font-bolder text-capitalize py-0 px-4">Euro</th>
          </tr>
        </thead>
        <tbody>
          <tr class="rounded-3" v-for="(user, index) in gameUserList" v-bind:key="index">
            <td class="py-2 border-0 text-white text-base font-bolder text-capitalize rounded-start-3">{{ user.name }}</td>
            <td class="py-2 border-0 text-white text-base font-bolder text-capitalize rounded-end-3">{{ user.point }}</td>
          </tr>
        </tbody>
      </table>
      <div>
    <!-- Button to open modal -->
    <button type="button" class="btn btn-primary" @click="showModal = true">
      Add User
    </button>

    <!-- Modal -->
    <div class="modal fade" :class="{ show: showModal }" style="display: block;" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" v-if="showModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Add User</h5>
            <button type="button" class="close" @click="closeModal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="modal-body">
              <label class="form-label" for="username">User name:</label>
              <input class="form-control mb-6 border border-black" type="text" v-model="username"/>
              <input class="btn-primary btn" type="submit" value="Submit" @click="addUserInArray">
            </div>
          </div>
        </div>
      </div>
      <!-- Backdrop -->
      <div class="modal-backdrop fade show" v-if="showModal"></div>
    </div>
  </div>
    </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
export default {
    name: 'UserListing',
  data() {
    return {
      isModleOpen: 'modal',
      username: null,
      showModal: false
    };
  },
  computed: {
    ...mapState(["gameUserList"])
  },
  methods: {
    ...mapMutations(["addUser"]),
    closeModal() {
      this.showModal = false;
    },
    addUserInArray() {
      if(this.username && !this.checkUserExists(this.username, this.gameUserList)) {
        const user = {
            name: this.username,
            point: 3,
        };
        this.addUser(user);
        this.username = null;
        this.showModal = false;
      }
    },
    updateUserPoints(username, points) {
        this.updateUserPoints(username, points);
    },
    checkUserExists(nameToCheck, dataArray) {
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].name === nameToCheck) {
          return true;
        }
      }
      return false;
    }
  },
  // watch: {
  //   gameUserListArr() {
  //       this.gameUserList = JSON.parse(localStorage.getItem('gameUserList')) || [];
  //   },
  //   deep: true
  // }
}
</script>
<style scoped>
tr:nth-child(even) {
  background-color: #dddddd;
}
.user-add-modal-popup {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}
/* Modal Content */

/* The Close Button */
.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
.user-table tbody > tr {
  background-color: #f0a71c;
  box-shadow: inset 0px 0px 20px #8a5306;
}
.user-table {
  border-collapse: separate;
  border-spacing: 0 12px;
  background-color: #f5d02d;
  border-radius: 16px;
  padding: 16px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}
.modal {
  display: none;
}
.modal.show {
  display: block;
  padding-right: 17px; /* Adjust for scrollbar */
}
.modal-dialog {
  z-index: 9999;
}
</style>
