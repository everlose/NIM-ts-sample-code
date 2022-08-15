import {
  NIM_GetHistoryMsgsOptions,
  NIM_Message,
} from '@/3rd/NIM_Web_SDK_v8.9.100/MessageInterface'
import { getAccountFromSessionId } from '@/utils'
import { Module } from 'vuex'

import { TRootState } from './global'

type MsgLogTag = {
  // 时间查询条件
  endTime: number
  // 上一次查询的 id
  lastMsgId?: string
  // 是否还有下一页
  hasMore: boolean
}

type TState = {
  msgLog: {
    // session.id 做 key，value 就是 这个 session 的消息
    [key: string]: NIM_Message[]
  }
  // 消息记录的标记，包含一些关键的查询条件和是否还有下一页等信息
  msgLogTag: {
    [key: string]: MsgLogTag
  }
}

const messageLogModule: Module<TState, TRootState> = {
  namespaced: true,

  state: () => ({
    msgLog: {},
    msgLogTag: {},
  }),
  mutations: {
    updateMsgsLogTag(
      state,
      payload: {
        sessionId: string
        data: MsgLogTag
      }
    ) {
      const tag = state.msgLogTag[payload.sessionId] || {}
      state.msgLogTag[payload.sessionId] = Object.assign(tag, payload.data)
    },
    prependMsgsLog(
      state,
      payload: {
        sessionId: string
        messages: NIM_Message[]
      }
    ) {
      state.msgLog[payload.sessionId] = state.msgLog[payload.sessionId]
        ? payload.messages.concat(state.msgLog[payload.sessionId])
        : payload.messages
    },
    appendMsgLog(state, payload: NIM_Message) {
      const sessionId = payload.sessionId
      state.msgLog[sessionId] = state.msgLog[sessionId]
        ? state.msgLog[sessionId].concat(payload)
        : [payload]
    },
  },
  actions: {
    onMsg(context, payload: NIM_Message) {
      // 在线收到了消息，插入一条消息
      context.commit('appendMsgLog', payload)
    },
    // 获取历史消息
    async getHistoryMsgs(context, payload: string) {
      if (!window.nim) {
        throw new Error('nim no login')
      }
      const { scene, accid } = getAccountFromSessionId(payload)
      const queryParams = context.state.msgLogTag[payload] || 0
      const options: NIM_GetHistoryMsgsOptions = {
        scene,
        to: accid,
        endTime: queryParams.endTime || 0,
      }
      return new Promise<void>((resolve, reject) => {
        window.nim &&
          window.nim.getHistoryMsgs({
            ...options,
            // 默认 false， 从 endTime 开始往前查找 limit 条历史消息。而 fromTime 不传就是代表不限制。
            // reverse: false,
            // 返回的结果升序排列
            asc: true,
            done(err, result) {
              if (err) {
                console.log('getHistory 失败', err)
                return reject()
              }
              console.log('getHistory 成功', result)
              if (result.msgs.length === 0) {
                // 确认没有下一页了。
                context.commit('updateMsgsLogTag', {
                  sessionId: payload,
                  data: {
                    hasMore: false,
                  },
                })
                resolve()
                return
              }
              // 追加去 log 中。
              context.commit('prependMsgsLog', {
                sessionId: payload,
                messages: result.msgs,
              })
              // 更新 params
              context.commit('updateMsgsLogTag', {
                sessionId: payload,
                data: {
                  // 数组第一个消息，就是分页下一页的起点。
                  endTime: result.msgs[0].time,
                  lastMsgId: result.msgs[0].idServer,
                  hasMore: true,
                },
              })
              resolve()
            },
          })
      })
    },
  },
}

export default messageLogModule
