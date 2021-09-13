// import { login, logout, getInfo } from '@/api/user'
import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, setUserEmail, getUserEmail } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    email: getUserEmail(),
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { email, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ email: email.trim(), password: password }).then(response => {
        // const { data } = response
        // commit('SET_TOKEN', data.token)
        // setToken(data.token)
        commit('SET_TOKEN', response.token)
        commit('SET_EMAIL', email)
        setToken(response.token)
        setUserEmail(email)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }, email) {
    return new Promise((resolve, reject) => {
      getInfo(email).then(response => {
        const { results } = response
        console.log(results)

        if (!results) {
          return reject('Verification failed, please Login again.')
        }

        const { email, avatar } = results[0]
        console.log(email)
        console.log(avatar)

        commit('SET_EMAIL', email)
        commit('SET_AVATAR', avatar)
        resolve(results)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     removeToken() // must remove  token  first
    //     resetRouter()
    //     commit('RESET_STATE')
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

