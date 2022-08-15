import { NIM_DefaultDoneFn, StrAnyObj } from './types'

/**
 * 事件相关 API
 *
 * 注：appkey 级别需要开通功能才可以启用。
 */
export interface EventServiceInterface {
  /**
   * 发布某事件
   */
  publishEvent(options: NIM_PublishEventOptions): void
  /**
   * 订阅某事件
   */
  subscribeEvent(options: NIM_SubscribeEventOptions): void
  /**
   * 按账号取消订阅关系
   */
  unSubscribeEventsByAccounts(
    options: NIM_UnSubscribeEventsByAccountsOptions
  ): void
  /**
   * 取消指定事件的全部订阅关系
   */
  unSubscribeEventsByType(options: NIM_UnSubscribeEventsByTypeOptions): void
  /**
   * 按账号获取指定事件的订阅关系
   */
  querySubscribeEventsByAccounts(
    options: NIM_QuerySubscribeEventsByAccountsOptions
  ): void
  /**
   * 按账号获取指定事件的订阅关系
   */
  querySubscribeEventsByType(
    options: NIM_QuerySubscribeEventsByTypeOptions
  ): void
}

/**
 * 下推下来的事件定义
 */
export type NIM_PushEventInfo = {
  /**
   * 事件类型，云信预留 "1"
   */
  type: string
  /**
   * 事件状态，云信预留 "1"/"2"/"3" 来标识登陆，登出，断开链接。
   */
  value: string
  /**
   * 此事件触发的时间戳
   */
  time: string
  /**
   * 事件触发者
   */
  account: string
  /**
   * 事件触发者的客户端类型
   */
  clientType: string
  /**
   * 扩展字段，任意对象。
   */
  custom: StrAnyObj
  /**
   * 客户端生成的 id
   */
  idClient: string
  /**
   * 服务器生成的 id
   */
  idServer: string
}

/**
 * 自己订阅的事件服务定义。
 */
export type NIM_SubscribeEventInfo = {
  /**
   * 事件类型
   */
  type: string
  /**
   * 订阅有效期，秒为单位
   */
  subscribeTime: string
  /**
   * 被订阅人（也就是事件发布人）的 accid
   */
  to: string
  /**
   * 订阅此事件的时间戳
   */
  time: string
}

export type NIM_QuerySubscribeEventsByTypeOptions = {
  /**
   * 事件类型
   */
  type: number
  done?: NIM_DefaultDoneFn<NIM_SubscribeEventInfo[]>
}

export type NIM_QuerySubscribeEventsByAccountsOptions = {
  /**
   * 事件类型
   */
  type: number
  accounts?: string[]
  done?: NIM_DefaultDoneFn<NIM_SubscribeEventInfo[]>
}

export type NIM_UnSubscribeEventsByTypeOptions = {
  /**
   * 事件类型
   */
  type: number
  done?: NIM_DefaultDoneFn<void>
}

export type NIM_UnSubscribeEventsByAccountsResult = {
  /**
   * 取消失败的账号列表
   */
  failedAccounts: string[]
}

export type NIM_UnSubscribeEventsByAccountsOptions = {
  /**
   * 事件类型
   */
  type: number
  accounts?: string[]
  done?: NIM_DefaultDoneFn<NIM_UnSubscribeEventsByAccountsResult>
}

export type NIM_SubscribeEventResult = {
  /**
   * 订阅失败的账号列表
   */
  failedAccounts?: string[]
}

export type NIM_SubscribeEventOptions = {
  /**
   * 事件类型
   */
  type: number
  /**
   * 订阅账户列表
   */
  accounts: string[]
  /**
   * 订阅关系有效期，以秒为单位
   */
  subscribeTime?: number
  /**
   * 同步订阅事件
   */
  sync?: boolean
  done?: NIM_DefaultDoneFn<NIM_SubscribeEventResult>
}

export type NIM_PublishEventResult = {
  idClient: string
  idServer: string
  time: number
}

export type NIM_PublishEventOptions = {
  /**
   * 事件类型, 须向 IM 服务器开通。
   */
  type: number
  /**
   * 事件状态/事件内容，由开发者做自定义映射
   *
   * 注：value 须为 10000 以上 (1-9999为云信预定义值，开发者不可使用)
   */
  value: number
  /**
   * 用户自定义事件扩展属性
   */
  custom?: string
  /**
   * 发布事件的有效时间 单位秒 60s~7天(604800s)，默认 7 天
   */
  vaildTime?: number
  /**
   * 广播类型
   *
   * 1: 仅在线
   * 2:在线和离线
   */
  broadcastType?: number
  /**
   * @Multi_Lang_Tag
   * @locale cn
   * 是否同步给自己
   * @locale
   *
   * @locale en
   * Whether to synchronize to yourself
   * @locale
   */
  sync?: boolean
  done?: NIM_DefaultDoneFn<NIM_PublishEventResult>
}
