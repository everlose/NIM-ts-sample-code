import { NIM_Message } from './MessageInterface'
import { NIM_Session } from './SessionInterface'
import { NIM_SystemMessage } from './SystemMessageInterface'

export type StrAnyObj = {
  [key: string]: any
}

export type NIM_GetInstanceOptions = {
  /**
   * 应用的 appKey
   *
   * 注：在云信管理后台查看
   */
  appKey: string
  /**
   * 帐号 ID
   *
   * 注：应用内唯一
   */
  account: string
  /**
   * 帐号的登录凭证
   *
   * 注：只会在初始化登录建立连接时会校验一次
   */
  token: string
  /**
   * 账号 token 的认证类型，默认 0。形式有三种
   *
   * 0：token是固定的，只有主动调用接口修改才会更改
   *
   * 1：token是动态的，有过期时间。token过期后已登录状态的连接不受影响，但之后的登录（包括自动重连、正常的登录连接）需使用新token。对于自动重连场景，开发者可在onwillreconnect中，判断token是否过期，若过期可调用setOptions更新token
   *
   * 2：账号和 token 由开发者的服务校验，云信服务器收到登录请求后会转发至开发者服务器，并将其校验结果返回
   */
  authType?: number
  /**
   * 登录时的扩展字段
   *
   * 注：可抄送给开发者服务器，不会同步至其他端
   */
  loginExt?: string
  /**
   * 是否开启调试, 如果开启调试, 将会在控制台输出一些log。
   *
   * 默认false不输出日志, 可以传true来开启日志。
   */
  debug?: boolean
  /**
   * 默认的备用长连接地址
   *
   * 注：当 LBS 请求出错时，SDK会尝试该长连接地址，若不传此参数，默认将使用的云信的公网的备用地址。
   */
  defaultLink?: string
  /**
   * 默认使用的 LBS 连接地址
   *
   * 注：NIM 需要先请求 LBS 地址能得到长连接地址，再建立长连接。若不传此参数，默认将使用云信提供的公网地址。
   */
  lbsUrl?: string
  /**
   * 是否开启备用lbs，默认为 true
   *
   * 注：若开启，SDK会将备用的lbs地址存储到本地LocalStorage，当主lbs意外不可用时，会尝试请求备用lbs地址连接
   */
  lbsBackup?: boolean
  /**
   * 开发者自定义的备用 lbs 地址数组
   *
   * 注：举例如 ['https://address1', 'https://address2']，用于自行定义接口去代理 lbs 返回，防止运营商劫持。当主lbs意外不可用时，会尝试请求备用lbs地址连接，优先级比 localstorage 里缓存的低。
   */
  lbsBackupUrlsCustomer?: string[]
  /**
   * 上传文件存储全局配置-存储场景。
   *
   * 注：相当于使用的网易云存储的桶名，默认 “im”。
   */
  nosScenes?: string
  /**
   * 上传文件存储全局配置-存储有效时间。
   *
   * 注：默认 Infinity，设置的时间不得小于一天，单位秒
   */
  nosSurvivalTime?: number
  /**
   * 客户端自定义tag。最大32个字符
   *
   * 注：这个字段常用于登录时，多端同步通知其他端登陆，开发者设置可用于区分。
   */
  customTag?: string
  /**
   * 自定义客户端类型，请设置大于 0 的整数
   *
   * 注：默认端类型只有 Web，PC，AOS，iOS，如果开发者需要加以更细致的类型区分，如微信小程序等环境，可用这个字段自行做映射。
   */
  customClientType?: string
  /**
   * 是否自动标记消息为已收到
   */
  // autoMarkRead?: string
  /**
   * 是否使用 IM 业务数据库，默认 true
   *
   * 注：在支持数据库的浏览器上 SDK 会将消息，会话，群等数据缓存到 indexedDB 数据库中, 后续同步都是增量更新, 加快初始化同步速度。
   */
  db?: boolean
  /**
   * 是否将日志存储到本地数据库，默认 true
   *
   * 注：若开启，日志会被存储到数据库中，后续可通过服务器 API 来按需拉取本地数据库中日志。
   *
   * 注2：日志数据库与 IM 业务数据库为两个数据库，互不影响。
   */
  dbLog?: boolean
  /**
   * 本地数据库中的日志的有效期，单位小时，默认72小时
   *
   * 注：当 dbLog 为 true 时生效。
   */
  expire?: number
  /**
   * 是否开启自动重连，默认 true
   *
   * 注：若长连接因为网络，心跳超时等原因断开，sdk 提供能力能够自动尝试重连。
   *
   * 注2：重连的时间间隔从 1.6～8s 之间累加，每次重连将触发 onwillreconnect 事件
   */
  needReconnect?: boolean
  /**
   * SDK 尝试重连的最大次数，超过后则不再尝试重连。
   *
   * 注：当重连尝试达到最大次数，将结束重连过程，最终触发 ondisconnect 回调，表示彻底断开。
   */
  reconnectionAttempts?: number
  /**
   * 是否开启快速自动重连，默认 false。
   *
   * 注：只有当 needReconnect: true 时该配置才有效。
   *
   * 注2：启用这个能力时，sdk 将会监听 window 的 offline 和 online 事件来嗅探网络断开和恢复，将会做相应的断开和重连策略
   */
  quickReconnect?: boolean
  /**
   * 撤回消息后是否更新该消息影响的会话未读数，默认 false
   *
   * 注：如某会话有两条消息未读，然后其中一条消息被撤回了，若该参数为true，则会话未读数变为 1，否则未读数仍是 2
   */
  rollbackDelMsgUnread?: boolean
  /**
   * 清除会话的消息时会去同时更新会话的未读数与最近一条消息，默认 true
   */
  rollbackClearMsgsUnread?: boolean

  /**
   * 重置会话未读数时，若同步至服务器失败，是否仅重置本地会话未读数。
   *
   * 当同步至服务器失败时，若为 true，则本地未读数会被重置，服务器和其他端的未读数不会；若为false，则本地、服务器和其他端都不会被重置（重置失败），各端未读数会保持一致
   */
  resetUnreadMode?: boolean

  /**
   * 消息内容里的文件 cdn 链接，是否强制使用 https 协议。默认 false
   */
  // httpsEnabled?: boolean

  /**
   * 是否上报异常错误日志，默认 false，禁止上报错误日志
   *
   * 注：SDK会将部分错误及相关信息上传至云信统计平台，方便开发者统计及排查线上错误
   */
  // logReport?: boolean

  /**
   * 是否通过 https 协议跟服务器建立连接, 默认 true
   */
  // secure?: boolean

  /**
   * 是否同步黑名单和静音列表, 默认true.
   *
   * 注：若同步，则初始化同步接收黑名单和静音列表，结束后收到 onblacklist 回调和 onmutelist 回调
   */
  syncRelations?: boolean
  /**
   * 是否同步好友列表, 默认 true.
   *
   * 注：若同步，则初始化同步接收好友信息，结束后收到 onfriends 回调
   */
  syncFriends?: boolean

  /**
   * 是否同步好友对应的用户名片列表, 默认true
   *
   * 注：若同步，则初始化同步接收好友所对应的用户信息，结束后收到 onusers 回调
   */
  syncFriendUsers?: boolean
  /**
   * 是否同步超大群列表, 默认true
   *
   * 注：若同步，则初始化同步接收超级群列表，结束后收到 onSuperTeams 回调
   */
  syncSuperTeams?: boolean
  /**
   * 是否同步群列表, 默认 true.
   *
   * 注：若同步，则初始化同步接收群列表，结束后收到 onteams 回调
   */
  syncTeams?: boolean
  /**
   * 是否同步额外的群信息, 默认 true
   *
   * 注：若同步，则初始化同步接收群列表的额外信息，结束后收到 onteams 回调。
   *
   * 注2: 这里的“额外信息”举个例子，当前登录用户开启某个群的消息提醒 (SDK 只是存储了此信息, 具体用此信息来做什么事情完全由开发者控制)，开发者调用接口 updateInfoInTeam 来设置
   */
  syncExtraTeamInfo?: boolean
  /**
   * 是否同步会话的未读数, 默认 false
   *
   * 注：未读数即 session 的 unread 属性。
   */
  syncSessionUnread?: boolean
  /**
   * 是否同步云端置顶会话信息，默认 false
   *
   * 注：初始化同步云端置顶会话信息可以通过 onStickTopSessions 回调获取，且附带在 session 定义的 isTop 属性中。
   */
  syncStickTopSessions?: boolean
  /**
   * 是否同步漫游消息, 默认 true.
   *
   * 注：若同步，则初始化同步结束后收到 onroamingmsgs 回调.
   */
  syncRoamingMsgs?: boolean
  /**
   * 是否额外同步超大群的漫游消息, 默认 true.
   *
   * 注：若同步，则初始化同步结束后收到 onroamingmsgs 回调.
   */
  syncSuperTeamRoamingMsgs?: boolean
  /**
   * 是否同步已读回执时间戳, 默认 true.
   */
  syncMsgReceipts?: boolean
  /**
   * 是否同步离线广播，默认 false
   *
   * 注：若同步，初始化同步结束后收到 onbroadcastmsgs 回调
   */
  syncBroadcastMsgs?: boolean
  /**
   * 是否对日志做额外的处理，诸如日志存储、日志上报等等，该函数会截获console日志的参数，供开发者使用
   */
  logFunc?: (...args: (string | StrAnyObj)[]) => void
  /**
   * 钩子函数-判定通知类消息是否该计入会话的未读数
   *
   * 注：该方法接收一个通知消息，如果函数结果返回true，则将该通知消息计入未读数，否则不计入未读数。
   */
  shouldCountNotifyUnread?: (notification: StrAnyObj) => void
  /**
   * 钩子函数-连接建立后的回调
   */
  onconnect?: (data: NIM_OnConnectResult) => void
  /**
   * 钩子函数-即将重连的回调
   *
   * 注：此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
   */
  onwillreconnect?: (data: NIM_OnWillReconnectResult) => void
  /**
   * 钩子函数-断开链接的回调
   */
  ondisconnect?: (data: NIM_OnDisconnectResult) => void
  /**
   * 钩子函数-初始化同步完成的回调
   *
   * 注：推荐开发者在此阶段后再调用实例对象的 API。
   */
  onsyncdone?: () => void
  /**
   * 钩子函数-发生错误的回调
   *
   * 注：这里指的错误，通常是数据库的错误。也有少部分情况是连接时的，建议开发者做个收集。
   */
  onerror?: (data: StrAnyObj) => void
  /**
   * 多端登录状态变化的回调, 会收到登录端列表, 以下情况会收到此回调
   *
   * 1. 登录时其它端在线
   * 2. 登录后其它端上线或者下线
   */
  onloginportschange?: (datas: NIM_OnLoginPortsChangeResult[]) => void

  /**
   * 钩子函数-(初始化同步)收到了会话列表
   */
  onsessions?: (datas: NIM_Session[]) => void
  /**
   * 钩子函数-(在线)更新会话的回调
   *
   * 触发条件包括：收发消息，清理了会话未读数，撤回消息。
   */
  onupdatesessions?: (datas: NIM_Session[]) => void
  /**
   * 钩子函数-(初始化同步/在线)收到远端置顶会话回调
   */
  onStickTopSessions?: (datas: NIM_Session[]) => void

  /**
   * 钩子函数-(初始化同步)收到会话仍有更多的漫游消息回调
   *
   * 注：其中的 session.time 之前的时间里，仍有超过未漫游下来的消息。开发者可以进入会话时，通过获取历史消息再拉取消息。
   */
  onSessionsWithMoreRoaming?: (datas: NIM_Session[]) => void
  /**
   * 钩子函数-(初始化同步)收到漫游消息回调
   *
   * 注：初始化同步会触发多次这个事件，每一个会话触发一次。
   */
  onroamingmsgs?: (datas: NIM_Message[]) => void
  /**
   * 钩子函数-(初始化同步)收到离线消息的回调
   */
  onofflinemsgs?: (datas: NIM_Message[]) => void
  /**
   * 钩子函数-(多端同步/在线)收到消息的回调
   */
  onmsg?: (data: NIM_Message) => void
  /**
   * 钩子函数-(初始化同步)收到离线的系统消息的回调
   */
  onofflinesysmsgs?: (datas: NIM_SystemMessage[]) => void
  /**
   * 钩子函数-(初始化同步)收到漫游的系统消息的回调
   */
  onroamingsysmsgs?: (datas: NIM_SystemMessage[]) => void
  /**
   * 钩子函数-(在线)收到系统消息的回调
   */
  onsysmsg?: (data: NIM_SystemMessage) => void
  /**
   * 钩子函数-(在线)收到系统消息的更新的回调
   *
   * 注：触发更新的条件有：通过或者拒绝好友申请、接收或者拒绝入群申请、通过或者拒绝入群邀请。
   */
  onupdatesysmsg?: (data: NIM_SystemMessage) => void

  // oncustomsysmsg
  // onofflinecustomsysmsgs
  // onupdatesysmsg?: (data: NIM_SystemMessage) => void
  // onsysmsgunread
  // onupdatesysmsgunread
  // onTeamMsgReceipt
  // onQuickComment
  // onDeleteQuickComment
  // onPinMsgChange
  // onDeleteMsgSelf
  // onClearServerHistoryMsgs
  // onbroadcastmsgs
  // onbroadcastmsg
  // onSyncUpdateServerSession

  /**
   * 同步黑名单的回调, 会传入黑名单列表 blacklist
   */
  // onblacklist?: (result: NIM_OnBlacklistResult) => void
  // onsyncmarkinblacklist
  // onmutelist
  // onsyncmarkinmutelist

  /**
   * 同步好友列表的回调, 会传入好友列表。
   */
  // onfriends?: (result: NIM_Friend[]) => void
  // onsyncfriendaction

  /**
   * 同步登录用户名片的回调, 会传入用户名片
   */
  // onmyinfo
  // onupdatemyinfo

  /**
   * 同步好友用户名片的回调, 会传入用户名片数组
   */
  // onusers
  // onupdateuser

  /**
   * 同步超大群列表的回调, 会传入超大群数组
   */
  // onSuperTeams
  // onSyncCreateSuperTeam
  // onUpdateSuperTeam
  // onUpdateSuperTeamMember
  // onAddSuperTeamMembers
  // onRemoveSuperTeamMembers
  // onDismissSuperTeam
  // onTransferSuperTeam
  // onUpdateSuperTeamMembersMute

  /**
   * 同步群列表的回调, 会传入群数组teams
   *
   * teams的属性invalid包含退出的群
   */
  // onteams
  // onsynccreateteam
  // onupdateteammember
  // onCreateTeam
  // onUpdateTeam
  // onAddTeamMembers
  // onRemoveTeamMembers
  // onUpdateTeamManagers
  // onDismissTeam
  // onTransferTeam
  // onUpdateTeamMembersMute
}

/**
 * 默认的 done 回调形式
 */
export type NIM_DefaultDoneFn<T extends StrAnyObj | void> = (
  err: Error | null | StrAnyObj,
  data: T,
  ...args: any[]
) => void

export enum NIM_ENUM_ClientType {
  Android = 1,
  iOS = 2,
  PC = 4,
  WindowsPhone = 8,
  Web = 16,
  Server = 32,
  Mac = 64,
}

export type NIM_ClientType = keyof typeof NIM_ENUM_ClientType

export type NIM_OnLoginPortsChangeResult = {
  /**
   * 登录的设备类型
   */
  type: string
  /**
   * 登录设备的操作系统
   */
  os: string
  /**
   * 登录设备的 mac 地址
   */
  mac: string
  /**
   * 登录设备 ID
   */
  deviceId: string
  /**
   * 登录的帐号
   */
  account: string
  /**
   * 登录设备的连接号
   */
  connectionId: number
  /**
   * 登录的服务器 IP
   */
  ip: string
  /**
   * 登录时间
   */
  time: number
  /**
   * 是否在线
   */
  online: boolean
}

export type NIM_OnDisconnectResult_kicked = {
  /**
   * 状态码
   */
  code: 'kicked'
  /**
   * 原因简述
   *
   * samePlatformKick: 不允许同一个帐号在多个地方同时登录
   * serverKick: 被服务器踢了
   * otherPlatformKick: 被其它端踢了
   */
  reason: string
  /**
   * 原因描述
   */
  message: string
  /**
   * 扩展字段
   */
  custom: string
  /**
   * 客户端类型
   */
  from: NIM_ClientType
  /**
   * 自定义端测类型
   */
  customClientType: number
}

export type NIM_OnDisconnectResult_other = {
  /**
   * 状态码
   */
  code: number
  /**
   * 原因描述
   */
  message: string
}
export type NIM_OnDisconnectResult =
  | NIM_OnDisconnectResult_kicked
  | NIM_OnDisconnectResult_other

export type NIM_OnWillReconnectResult = {
  /**
   * 重试次数
   */
  retryCount: number
  /**
   * 重试间隔
   */
  duration: number
}

export type NIM_OnConnectResult = {
  /**
   * 上次登录的设备的设备号
   */
  lastLoginDeviceId: string
  /**
   * 客户端自定义tag,登录时多端同步改字段，最大32个字符
   */
  customTag?: string
  /**
   * 本次登录的连接号
   */
  connectionId: string
  /**
   * IP 地址
   */
  ip: string
  /**
   * 端口
   */
  port: string
  /**
   * 地区
   */
  country?: string
}

export type NIM_CommonError = {
  /**
   * 通用错误码
   */
  code: number
  /**
   * 通用错误原因解释
   */
  message: string
  /**
   * 引发错误的事件
   */
  event: StrAnyObj
}
