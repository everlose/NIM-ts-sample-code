import { NIM } from '@/3rd/NIM_Web_SDK_v8.9.100'
// import { promisify } from "@/utils";
import { Module, Store } from 'vuex'
import { TRootState } from './global'

window.NIM = NIM

type TState = {
  // nim: NIM | null;
}

const sdk: Module<TState, TRootState> = {
  namespaced: true,
  state: () => ({
    // 实例化后的变量
  }),
  mutations: {},
  actions: {
    async nimLogin(
      context,
      options: {
        appKey: string
        token: string
        account: string
        store: Store<any>
      }
    ) {
      if (window.nim) {
        console.log('NIM already connected!')
        return
      }
      return new Promise<void>((resolve, reject) => {
        const nim = NIM.getInstance({
          ...options,
          // demo 演示的账号，token 都是静态的，这里填了 0。真实使用若是动态的 token，请查看这个参数的说明
          authType: 0,
          db: true,
          debug: true,
          // 云信公网线上地址，
          // lbsUrl: 'https://imtest.netease.im/lbs/webconf',
          // 若怕 LBS 的 HTTP 连接被运营商劫持，开发者可以自行代理传入备份的 LBS 地址。
          // lbsBackupUrlsCustomer: []
          // 云信公网的备用长连接地址
          // defaultLink: 'weblink.netease.im',
          quickReconnect: true,
          rollbackDelMsgUnread: true,
          rollbackClearMsgsUnread: true,

          // 同步相关参数，结合你们的场景，关闭了某些信息的同步。
          syncRelations: false,
          syncFriends: false,
          syncFriendUsers: false,
          syncSuperTeams: false,
          syncTeams: false,
          syncExtraTeamInfo: false,
          syncStickTopSessions: false,
          syncSuperTeamRoamingMsgs: false,
          syncMsgReceipts: false,
          syncSessionUnread: true,

          onconnect() {
            console.log('连接通道建立完毕')
          },
          onsyncdone() {
            console.log('初始化同步完成')
            resolve()
          },
          onwillreconnect(obj) {
            console.log(
              `正在重连中，间隔：${obj.duration}, 重试次数：${obj.retryCount}`
            )
          },
          onloginportschange(datas) {
            console.log('收到了多端登录，信息有：', datas)
          },
          onerror(obj) {
            console.error('出错了', obj)
          },
          ondisconnect(data) {
            if (data) {
              switch (data.code) {
                // 账号或者密码错误, 请跳转到登录页面并提示错误
                case 302:
                  reject(data)
                  break
                // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
                case 417:
                  reject(data)
                  break
                // 被踢, 请提示错误后跳转到登录页面
                case 'kicked':
                  break
                default:
                  console.error('unknow disconnect')
                  break
              }
            }
          },
          // 钩子函数-(初始化同步)收到了会话列表
          onsessions(sessions) {
            console.log('收到了 onsessions, ', sessions)
            options.store.dispatch('session/onSessions', sessions)
          },
          // 钩子函数-(在线)更新会话的回调
          onupdatesessions(datas) {
            console.log('收到了 onupdatesessions, ', datas)
            options.store.dispatch('session/onUpdateSessions', datas)
          },
          // 钩子函数-(多端同步/在线)收到消息的回调
          onmsg(msg) {
            console.log('收到了 onmsg, ', msg)
            options.store.dispatch('messageLog/onMsg', msg)
            options.store.dispatch('session/onMsg', msg)
          },
        })
        window.nim = nim
      })
    },
    nimLogout() {
      const nim = window.nim
      // todo 判断连接可用：nim.isConnected()
      if (!nim) {
        throw new Error('No login')
      }
      return new Promise<void>((resolve, reject) => {
        nim.disconnect({
          done() {
            console.log('success disconnect')
            resolve()
          },
        })
      })
    },
    nimDestroy() {
      let nim = window.nim
      if (!nim) {
        throw new Error('No login')
      }
      return new Promise<void>((resolve, reject) => {
        nim &&
          nim.destroy({
            done() {
              console.log('success destroy')
              nim = null
              window.nim = null
              resolve()
            },
          })
      })
    },
    nimConnect() {
      const nim = window.nim
      if (!nim) {
        throw new Error('No login')
      }
      return new Promise<void>((resolve, reject) => {
        nim &&
          nim.connect({
            done() {
              console.log('success connect again')
              resolve()
            },
          })
      })
    },
  },
}

export default sdk
