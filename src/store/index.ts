import { createStore, MutationTree } from 'vuex'

interface User {
  name: string;
  point: number;
}
interface State {
  gameUserList: User[];
}
const state: State = {
  gameUserList: JSON.parse(localStorage.getItem('gameUserList') || '[]')
};

const mutations: MutationTree<State> = {
  addUser(state, user: User) {
    state.gameUserList.push(user);
    localStorage.setItem('gameUserList', JSON.stringify(state.gameUserList));
  },
  decrementUserPoints(state) {
    state.gameUserList.forEach(user => {
      if (user.point > 0) {
        user.point -= 1;
      }
    });
    localStorage.setItem('gameUserList', JSON.stringify(state.gameUserList));
  },
  UpdateUserPoint(state, userName: string) {
    const user = state.gameUserList.find(user => user.name === userName);
    if (user) {
      user.point += 2;
      localStorage.setItem('gameUserList', JSON.stringify(state.gameUserList))
    }
  },
  ResetGamePoints(state) {
    state.gameUserList.forEach(user => {
      user.point = 3;
    });
    localStorage.setItem('gameUserList', JSON.stringify(state.gameUserList));
  }
};

export default createStore({
  state,
  mutations,
})
