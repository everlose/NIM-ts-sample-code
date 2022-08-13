import { NIM_DefaultDoneFn, StrAnyObj } from './types'

/**
 * NIM 实例连接的基础接口定义
 */
export interface NIMInterface {
  /**
   * 断开连接。
   *
   * 退出登录状态，并断开 websocket 连接
   *
   * disconnect完成后，实例不会被销毁，可再次 connect 方法登录IM
   */
  disconnect(options: NIM_DisconnectOptions): void

  /**
   * 连接
   *
   * 注：这个方法仅在 disconnect 后再调用。而 getInstance 后不需要调用。
   */
  connect(options: { done: NIM_DefaultDoneFn<StrAnyObj> }): void

  /**
   * 销毁实例
   *
   * 销毁当前 IM 实例，同时会退出登录状态，并断开websocket连接
   *
   * 移除所有监听事件，销毁部分内部变量，并且此实例再也无法调用 connect 恢复 IM 连接
   */
  destroy(options: NIM_DestroyOptions): void

  /**
   * 踢当前用户登录的其它端
   */
  kick(options: NIM_KickOptions): void
}

export type NIM_DisconnectOptions = {
  /**
   * done 回调
   */
  done: NIM_DefaultDoneFn<StrAnyObj>
}

export type NIM_DestroyOptions = {
  /**
   * done 回调
   */
  done: NIM_DefaultDoneFn<StrAnyObj>
}

export type NIM_KickOptions = {
  /**
   * 踢当前用户登录的其它端
   */
  deviceIds: []
  /**
   * done 回调
   */
  done: NIM_DefaultDoneFn<StrAnyObj>
}
