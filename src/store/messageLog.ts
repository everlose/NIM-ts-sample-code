import {
  NIM_GetHistoryMsgsOptions,
  NIM_Message,
} from '@/3rd/NIM_Web_SDK_v8.9.100/MessageInterface'
import { Module } from 'vuex'

import { TRootState } from './global'

type TState = {
  msgLog: {
    // session.id 做 key，value 就是 这个 session 的消息
    [key: string]: NIM_Message[]
  }
}

const messageLogModule: Module<TState, TRootState> = {
  namespaced: true,

  state: () => ({
    msgLog: {},
  }),
  mutations: {
    setMsgLog(
      state,
      payload: {
        sessionId: string
        messages: NIM_Message[]
      }
    ) {
      state.msgLog[payload.sessionId] = payload.messages
    },
    appendMsgLog(
      state,
      payload: {
        sessionId: string
        messages: NIM_Message[]
      }
    ) {
      state.msgLog[payload.sessionId] = state.msgLog[payload.sessionId].concat(
        payload.messages
      )
    },
  },
  actions: {
    // 获取历史消息
    async getHistoryMsgs(context, options: NIM_GetHistoryMsgsOptions) {
      if (!window.nim) {
        throw new Error('nim no login')
      }
      return new Promise<void>((resolve, reject) => {
        window.nim &&
          window.nim.getHistoryMsgs({
            ...options,
            done(err, messages) {
              if (err) {
                console.log('失败', err)
                return
              }
              console.log('成功', messages)
              // 追加去 log 中。
              context.commit('appendMsgLog', {
                sessionId: 11,
                message: messages,
              })
            },
          })
      })
    },
    // 删除 Session
    // async deleteSession(context) {
    //   if (!window.nim) {
    //     throw new Error('nim no login')
    //   }
    //   const sessionId = context.state.currentSession?.id
    // },
  },
}

export default messageLogModule
