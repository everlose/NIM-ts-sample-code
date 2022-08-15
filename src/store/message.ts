import {
  NIM_Message,
  NIM_SendFileOptions,
  NIM_SendTextOptions,
} from '@/3rd/NIM_Web_SDK_v8.9.100/MessageInterface'
import { Module } from 'vuex'
import store from './index'

import { TRootState } from './global'

type TState = {
  // test
}

const messageModule: Module<TState, TRootState> = {
  namespaced: true,

  state: () => ({}),
  mutations: {},
  actions: {
    // 发送文本消息
    async sendText(context, options: NIM_SendTextOptions) {
      if (!window.nim) {
        throw new Error('nim no login')
      }
      const message = await new Promise<NIM_Message>((resolve, reject) => {
        window.nim &&
          window.nim.sendText({
            ...options,
            done(err, msg) {
              if (err) {
                console.log('发送失败：', err)
                reject(err)
                return
              }
              console.log('发送成功：', msg)
              resolve(msg)
            },
          })
      })
      store.dispatch('messageLog/onMsg', message)
    },
    // 发送文件类型消息
    async sendFile(context, options: NIM_SendFileOptions) {
      if (!window.nim) {
        throw new Error('nim no login')
      }
      return new Promise<void>((resolve, reject) => {
        window.nim &&
          window.nim.sendFile({
            ...options,
            done(err, msg) {
              if (err) {
                console.log('发送失败：', err)
                reject(err)
                return
              }
              console.log('发送成功：', msg)
              resolve()
            },
          })
      })
    },
  },
}

export default messageModule
