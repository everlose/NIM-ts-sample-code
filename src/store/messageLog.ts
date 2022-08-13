import {
  NIM_GetHistoryMsgsOptions,
  NIM_Message,
} from '@/3rd/NIM_Web_SDK_v8.9.100/MessageInterface'
import { getAccountFromSessionId } from '@/utils'
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
      state.msgLog[payload.sessionId] = state.msgLog[payload.sessionId]
        ? state.msgLog[payload.sessionId].concat(payload.messages)
        : payload.messages
    },
  },
  actions: {
    // 获取历史消息
    async getHistoryMsgs(context, payload: string) {
      const { scene, accid } = getAccountFromSessionId(payload)
      const options: NIM_GetHistoryMsgsOptions = {
        scene,
        to: accid,
      }
      if (!window.nim) {
        throw new Error('nim no login')
      }
      return new Promise<void>((resolve, reject) => {
        window.nim &&
          window.nim.getHistoryMsgs({
            ...options,
            done(err, result) {
              if (err) {
                console.log('getHistory 失败', err)
                return reject()
              }
              console.log('getHistory 成功', result.msgs)
              // 追加去 log 中。
              context.commit('appendMsgLog', {
                sessionId: payload,
                messages: result.msgs,
              })
              resolve()
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
