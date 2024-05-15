import { createStore } from "vuex";

export default createStore({
  state: {
    gameUserList: JSON.parse(localStorage.getItem('gameUserList')) || []
  },
  mutations: {
    addUser(state, user) {
      state.gameUserList.push(user);
      localStorage.setItem('gameUserList', JSON.stringify(state.gameUserList));
    },
    decrementUserPoints(state) {
      state.gameUserList.forEach(user => {
        if(user.point > 0) {
          user.point -=1;
        }
      });
      localStorage.setItem('gameUserList', JSON.stringify(state.gameUserList));
    },
    UpdateUserPoint(state, userName) {
      const user = state.gameUserList.find(user => user.name === userName);
      if (user) {
        user.point += 3;
        localStorage.setItem('gameUserList', JSON.stringify(state.gameUserList))
      }
    },
    ResetGamePoints(state) {
      state.gameUserList.forEach(user => {
        user.point = 3;
      });
      localStorage.setItem('gameUserList', JSON.stringify(state.gameUserList));
    }
  }
})