import { NIM_CommonError } from './types'

export enum NIM_ENUM_SystemMessageType {
  /**
   * 直接加某个用户为好友。
   *
   * 注：对方不需要确认, 直接成为当前登录用户的好友。
   */
  addFriend,
  /**
   * 申请加某个用户为好友。
   */
  applyFriend,
  /**
   * 通过好友申请
   */
  passFriendApply,
  /**
   * 拒绝好友申请
   */
  rejectFriendApply,
  /**
   * 删除好友
   */
  deleteFriend,
  /**
   * 邀请人加入群聊
   */
  teamInvite,
  /**
   * 拒绝加群的邀请
   */
  rejectTeamInvite,
  /**
   * 入群申请
   */
  applyTeam,
  /**
   * 拒绝入群的申请
   */
  rejectTeamApply,
  /**
   * 入超级群申请
   */
  applySuperTeam,
  /**
   * 拒绝入超级群的申请
   */
  rejectSuperTeamApply,
  /**
   * 邀请人加入超级群聊
   */
  superTeamInvite,
  /**
   * 拒绝加超级群的邀请
   */
  rejectSuperTeamInvite,
  /**
   * 撤回一条消息
   */
  deleteMsg,
  /**
   * 自定义系统通知
   */
  custom
}

export type NIM_SystemMessageType = keyof typeof NIM_ENUM_SystemMessageType

export type NIM_SystemMessage = {
  /**
   * 时间戳
   */
  time: number
  /**
   * 系统通知类型
   */
  type?: NIM_SystemMessageType
  /**
   * 系统通知的来源, 账号或者群ID
   */
  from: string
  /**
   * 系统通知的目标, 账号或者群ID
   */
  to: string
  /**
   * 内建系统通知的 idServer
   */
  idServer?: string
  /**
   * 内建系统通知是否已读
   */
  read?: boolean
  /**
   * 内建系统通知的种类
   */
  category?: string
  /**
   * 内建系统通知的state
   */
  state?: string
  /**
   * 内建系统通知的state 为 'error' 时, 此字段包含错误的信息
   */
  error?: NIM_CommonError
  /**
   * 内建系统通知的本地数据库自定义扩展字段
   *
   * 注：打开 db 时，才存在这个字段。
   */
  localCustom?: string
  /**
   * 内建系统通知的附言
   */
  ps?: string
  /**
   * 内建系统通知的附加信息, 参考系统通知类型来查看不同类型的系统通知对应的附加信息
   */
  attach?: {
    /**
     * 附加消息的扩展字段
     */
    custom?: string
  }
  /**
   * 自定义系系统通知的场景, 参考消息场景
   */
  scene?: string
  /**
   * 自定义系统通知的内容
   */
  content?: string
  /**
   * 是否需要推送
   */
  isPushable?: boolean
  /**
   * 自定义系统通知的推送文案, 仅对接收方为iOS设备有效
   */
  apnsText?: string
  /**
   * 自定义系统通知的推送属性
   *
   * 注：推荐传入 JSON 格式化字符串
   */
  pushPayload?: string
  /**
   * 是否需要推送昵称
   */
  needPushNick?: boolean
  /**
   * 自定义系统通知是否只发送给在线用户
   *
   * true 只发送给在线用户, 适合发送即时通知, 比如正在输入。
   *
   * false 时假如目标用户或群不在线, 会在其上线后推送过去。
   *
   * 注：该参数只对 p2p 自定义系统通知有效, 对群自定义系统通知无效, 群自定义系统通知只会发给在线的群成员, 不会存离线。
   */
  sendToOnlineUsersOnly?: boolean
  /**
   * 自定义系统通知是否抄送
   */
  cc?: boolean
}
