import { NIM_Session } from '@/3rd/NIM_Web_SDK_v8.9.100/SessionInterface'
import { Module } from 'vuex'

import { TRootState } from './global'

type TState = {
  sessionList: NIM_Session[]
  currentSession: NIM_Session | null
}

const sessionModule: Module<TState, TRootState> = {
  namespaced: true,

  state: () => ({
    sessionList: [],
    currentSession: null,
  }),
  mutations: {
    setSessionList(state, payload: NIM_Session[]) {
      state.sessionList = payload
    },
    setCurrSession(state, payload: NIM_Session) {
      state.currentSession = payload
    },
    // sessionList 有变化时，让当前的 currentSession 变化为 sessionList 列表里最新的对象
    resetCurrentChannel(state) {
      const newSession = state.sessionList.find(
        (session) => session.id === state.currentSession?.id
      )
      if (newSession) {
        state.currentSession = newSession
      }
    },
  },
  actions: {
    // 创建 Session
    // async createSession(context, options: CreateSessionOptions) {},
    // 更新 Session
    // async updateSession(context, options: UpdateSessionOptions) {
    //   if (!window.nim) {
    //     throw new Error('nim no login')
    //   }
    // },
    // 删除 Session
    // async deleteSession(context) {
    //   if (!window.nim) {
    //     throw new Error('nim no login')
    //   }
    //   const sessionId = context.state.currentSession?.id
    // },

    // 进入会话
    async setCurrentSession(
      context,
      options: {
        session: NIM_Session
      }
    ) {
      context.commit('setCurrSession', options.session)
      // 重置未读数
      return new Promise<void>((resolve, reject) => {
        window.nim &&
          window.nim.resetSessionUnread({
            sessionId: options.session.id,
            done() {
              resolve()
            },
          })
      })
    },
  },
}

export default sessionModule
