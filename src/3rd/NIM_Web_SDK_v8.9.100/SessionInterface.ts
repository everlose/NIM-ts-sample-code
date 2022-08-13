import { NIM_Message } from './MessageInterface'
import { NIM_DefaultDoneFn } from './types'

export interface SessionInterface {
  /**
   * 通过 sessionId 获取本地会话
   */
  getLocalSession(options: NIM_GetLocalSessionOptions): void
  /**
   * 分页查询本地会话列表
   *
   * 注：会话列表按 updateTime 降序排列, 即最近聊过天的放在列表的最前面
   */
  getLocalSessions(options: NIM_GetLocalSessionsOptions): void
  /**
   * 重置某个会话的未读数
   *
   * 注：如果是未读数不是 0 的会话，接口生效会收到 onupdatesessions 回调，更新其未读数
   */
  resetSessionUnread(options: NIM_ResetSessionUnreadOptions): void
  /**
   * 重置某些会话的未读数
   *
   * 注：如果是未读数不是 0 的会话，接口生效会收到 onupdatesessions 回调，更新其未读数
   */
  resetSessionsUnread(options: NIM_ResetSessionsUnreadOptions): void
  /**
   * 重置所有会话的未读数
   *
   * 注：如果是未读数不是 0 的会话，接口生效会收到 onupdatesessions 回调，更新其未读数
   */
  resetAllSessionUnread(options: { done: NIM_DefaultDoneFn<void> }): void
}

export type NIM_ResetSessionsUnreadOptions = {
  /**
   * 即 {@link NIM_Session.id | session.id}
   */
  sessionIds: string[]
  done: NIM_DefaultDoneFn<void>
}

export type NIM_ResetSessionUnreadOptions = {
  /**
   * 即 {@link NIM_Session.id | session.id}
   */
  sessionId: string
  /**
   * 当同步至其他端失败，err 不为 null，且第二个参数是失败的 sessionId
   */
  done: (err: Error | null, failedSessionId: string) => void
}

export type NIM_GetLocalSessionsOptions = {
  /**
   * 上一页最后一条会话的 id，第一次查询可以不填。
   */
  lastSessionId?: string
  /**
   * 分页查询数量限制，默认 100 条记录
   */
  limit?: number
  /**
   * 查询顺序。默认 false 代表降序
   *
   * false 即从最近的会话开始往前查找本地会话
   *
   * true 表示从第一条会话开始往后查找本地会话
   */
  reverse?: boolean
  done: NIM_DefaultDoneFn<NIM_Session[]>
}

export type NIM_GetLocalSessionOptions = {
  /**
   * 即 {@link NIM_Session.id | session.id}
   */
  sessionId: string
  done: NIM_DefaultDoneFn<NIM_Session>
}

export type NIM_Session = {
  /**
   * 会话ID
   */
  id: string
  /**
   * 场景
   *
   * p2p 单聊
   * team 群聊
   * superTeam 超大群聊
   */
  scene: string
  /**
   * 聊天对象, 账号或群ID
   */
  to: string
  /**
   * 会话更新的时间
   */
  updateTime: number
  /**
   * 未读数
   */
  unread: number
  /**
   * 此会话的最后一条消息
   */
  lastMsg: NIM_Message
  /**
   * 消息已读回执时间戳
   *
   * 注：这个字段表述自己发送的消息，对方是不是已读过。如果有此字段, 说明此时间戳之前的所有消息对方均已读
   *
   * 注2: 目前仅对'p2p'会话起作用
   */
  msgReceiptTime?: number
  /**
   * 是否被置顶会话
   */
  isTop?: boolean
  /**
   * 置顶的扩展字段
   */
  topCustom?: string
  /**
   * 本地数据库中的会话自定义扩展字段
   *
   * 注：在支持数据库时可以调用更新本地会话来更新此字段, 此字段只会被更新到本地数据库, 不会被更新到服务器上
   */
  localCustom?: string
}
