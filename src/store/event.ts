import { Module } from 'vuex'

import { TRootState } from './global'
import { NIM_PushEventInfo } from '@/3rd/NIM_Web_SDK_v8.9.100/EventInterface'

type TState = {
  // test
}

const messageModule: Module<TState, TRootState> = {
  namespaced: true,

  state: () => ({}),
  mutations: {},
  actions: {
    // 订阅消息
    async subscribeEvent(context, payload: string[] = []) {
      if (!window.nim) {
        throw new Error('nim no login')
      }
      if (!(payload && payload.length > 0)) {
        console.warn('找不到订阅的目标账号')
        throw new Error('No accounts to subscribe!')
      }
      await new Promise<void>((resolve, reject) => {
        window.nim &&
          window.nim.subscribeEvent({
            type: 1,
            // 目标账号列表
            accounts: payload,
            // 订阅的有效期，例子给上 1 小时
            subscribeTime: 3600,
            sync: true,
            done(err, result) {
              if (err) {
                console.log('订阅失败：', err)
                reject(err)
                return
              }
              console.log(`订阅成功`, result)
              resolve()
            },
          })
      })
    },
    onPushEvents(context, payload: NIM_PushEventInfo) {
      // todo，收到了目标账号的上下线事件变更
      console.log('收到了目标账号的上下线事件变更', payload)
    },
  },
}

export default messageModule
