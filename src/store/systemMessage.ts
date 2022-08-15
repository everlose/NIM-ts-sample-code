import { Module } from 'vuex'

import { TRootState } from './global'
import {
  NIM_SendCustomSysMsgOptions,
  NIM_SystemMessage,
} from '@/3rd/NIM_Web_SDK_v8.9.100/SystemMessageInterface'

type TState = {
  // test
}

const messageModule: Module<TState, TRootState> = {
  namespaced: true,

  state: () => ({}),
  mutations: {},
  actions: {
    // 发送自定义系统消息
    async sendCustomSysMsg(context, options: NIM_SendCustomSysMsgOptions) {
      if (!window.nim) {
        throw new Error('nim no login')
      }
      await new Promise<NIM_SystemMessage>((resolve, reject) => {
        window.nim &&
          window.nim.sendCustomSysMsg({
            ...options,
            done(err, msg) {
              if (err) {
                console.log('发送失败：', err, msg)
                reject(err)
                return
              }
              console.log('发送成功：', msg)
              resolve(msg)
            },
          })
      })
    },
  },
}

export default messageModule
