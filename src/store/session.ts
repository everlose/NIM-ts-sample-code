import { NIM_Message } from '@/3rd/NIM_Web_SDK_v8.9.100/MessageInterface'
import { NIM_Session } from '@/3rd/NIM_Web_SDK_v8.9.100/SessionInterface'
import { findIndex } from 'lodash'
import { Module, Store } from 'vuex'

import { TRootState } from './global'

type TState = {
  sessions: {
    // key 为 session.id
    [key: string]: NIM_Session
  }
  currentSessionId: string | undefined
}

const sessionModule: Module<TState, TRootState> = {
  namespaced: true,

  state: () => ({
    sessions: {},
    currentSessionId: undefined,
  }),
  mutations: {
    updateSessions(state, payload: NIM_Session[]) {
      payload.forEach((session) => {
        state.sessions[session.id] = session
      })
    },
    setCurrSession(state, payload: NIM_Session) {
      state.currentSessionId = payload.id
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
      payload: {
        session: NIM_Session
        store: Store<any>
      }
    ) {
      const session = payload.session
      console.log('进入会话', session)
      context.commit('setCurrSession', session)
      console.log('开始重置未读数', session.id)
      // todo 后续收到 msg，需要确认 currentSession ，再 resetSessionUnread。
      // 重置未读数
      await new Promise<void>((resolve, reject) => {
        window.nim &&
          window.nim.resetSessionUnread(session.id, (err, failedSessionId) => {
            if (err) {
              reject(failedSessionId)
            } else {
              resolve()
            }
          })
      })
      // 拉取历史消息
      payload.store.dispatch('messageLog/getHistoryMsgs', session.id)
    },

    onMsg(context, payload: NIM_Message) {
      // 判定接到的消息是否为当前会话里的消息，是的话则直接清空未读数
      if (payload.sessionId === context.state.currentSessionId) {
        window.nim?.resetSessionUnread(payload.sessionId)
      }
    },

    onSessions(context, payload: NIM_Session[]) {
      context.commit('updateSessions', payload)
    },
    onUpdateSessions(context, payload: NIM_Session[]) {
      // 判定更新的会话是否为当前选中的会话，是的话，手动标记下 unread 数为空的，避免页面抖动渲染。
      const idx = findIndex(payload, { id: context.state.currentSessionId })
      if (idx > -1) {
        payload[idx].unread = 0
      }
      context.commit('updateSessions', payload)
    },
  },
}

export default sessionModule
