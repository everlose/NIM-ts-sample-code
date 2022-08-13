import { NIM_DefaultDoneFn, StrAnyObj } from './types'

export interface MsgInterface {
  /**
   * 发送文本消息
   */
  sendText(options: NIM_SendTextOptions): void
  /**
   * 发送文件类型消息。
   *
   * 注：参数 type 可以选择：image 图片，video 视频，audio 音频，file 其他文件。
   */
  sendFile(options: NIM_SendFileOptions): void
  /**
   * 发送自定义消息
   *
   * 注：举例一个场景，剪刀石头布游戏
   */
  sendCustomMsg(options: NIM_SendCustomMsgOptions): void
  /**
   * 发送地理位置消息
   */
  sendGEO(options: NIM_SendGEOOptions): void
  /**
   * 发送地理位置消息
   */
  sendTipMsg(options: NIM_SendTipMsgOptions): void
  /**
   * 重发消息
   */
  resendMsg(options: NIM_ResendMsgOptions): void
  /**
   * 获取云端的消息历史记录
   */
  getHistoryMsgs(options: NIM_GetHistoryMsgsOptions): void
}

export type NIM_GetHistoryMsgsOptions = {
  /**
   * 消息场景
   */
  scene: NIM_MsgScene
  /**
   * 聊天对象。若是点对点消息请传入对方的账号，若是群消息则传入群id
   */
  to: string
  /**
   * 开始时间的时间戳. 精确到 ms, 默认为 0
   */
  beginTime?: number
  /**
   * 结束时间的时间戳. 精确到 ms, 默认为 0
   */
  endTime?: number
  /**
   * 上次查询的最后一条消息的 idServer, 第一次不填
   */
  lastMsgId?: string
  /**
   * 分页查询数量限制，默认 100 条记录
   */
  limit?: number
  /**
   * 查询顺序。默认 false 代表降序
   *
   * false 从 endTime 开始往前查找 limit 条历史消息
   *
   * true 从 beginTime 开始往后查找 limit 条历史消息
   */
  reverse?: boolean
  /**
   * 排序顺序。默认 false
   *
   * false 表示返回的消息按时间降序排序;
   *
   * true 表示按时间升序排序
   */
  asc?: boolean
  /**
   * 指定消息类型。默认不填写就是查找全部消息类型
   */
  msgTypes?: NIM_MsgScene[]
  done?: NIM_DefaultDoneFn<{ msgs: NIM_Message[] }>
}

export type NIM_ResendMsgOptions = {
  /**
   * 待重发的消息。
   *
   * 注：消息体中含有 idClient，且 status 不为 success 的才会重发。
   */
  msg: NIM_Message
  done?: NIM_DefaultDoneFn<NIM_Message>
}

export type NIM_BaseSendMsgOptions = {
  /**
   * 场景
   */
  scene: NIM_MsgScene
  /**
   * 接收方, 对方帐号或者群id
   */
  to: string
  /**
   * 是否是重发。如果是重发，还需要额外带上 消息的flow和status
   */
  // resend?: boolean
  /**
   * 如果是重发, 那么需要带上之前生成的idClient来标记这条消息
   */
  // idClient?: string
  /**
   * 扩展字段
   *
   * 注：推荐使用 JSON 序列化字符串
   */
  custom?: string
  /**
   * 自定义推送文案
   */
  pushContent?: string
  /**
   * 自定义的推送属性
   *
   * 注：推荐使用 JSON 序列化字符串
   */
  pushPayload?: string
  /**
   * 是否需要推送昵称，默认 true
   */
  needPushNick?: boolean
  /**
   * 是否存储云端历，默认 true
   */
  isHistoryable?: boolean
  /**
   * 是否支持漫游，默认 true
   */
  isRoamingable?: boolean
  /**
   * 是否支持发送者多端同步，默认 true
   */
  isSyncable?: boolean
  /**
   * 是否支持抄送，默认 true
   */
  cc?: boolean
  /**
   * 是否需要推送，默认 true
   */
  isPushable?: boolean
  /**
   * 是否要存离线，默认 true
   */
  isOfflinable?: boolean
  /**
   * 是否计入消息未读数，默认 true
   */
  isUnreadable?: boolean
  /**
   * 特殊推送选项, 只在群会话中使用
   */
  apns?: {
    /**
     * 需要特殊推送的账号列表, 不填表示推送给当前会话内的所有用户
     */
    accounts?: string[]
    /**
     * 需要特殊推送的文案, 不填的话默认为 pushContent
     */
    content?: string
    /**
     * 是否强制推送, true 表示即使推送列表中的胡勇屏蔽了当前会话（如静音）, 仍能够推送当前这条内容给相应用户
     */
    forcePush?: boolean
  }
  /**
   * 是否是本地消息，默认 false
   *
   * 注：此参数为 true，sdk 仅仅只是把消息存入库，不会发往 NIM 服务器
   */
  isLocal?: boolean
  /**
   * 本地消息的发送方，默认是当前用户.
   *
   * isLocal 为 true 时生效。
   */
  localFrom?: string
  /**
   * 是否需要业务已读，默认 false
   *
   * 注：msgReceipt 指的是本端发送的消息，对端是不是已读了本端的消息。
   */
  needMsgReceipt?: boolean
  /**
   * 是否需要过客户端反垃圾，默认 false
   */
  clientAntiSpam?: boolean
  /**
   * 是否需要使用自定义反垃圾字段，默认 false
   *
   * 注：NIM 服务器默认只对文本内容等字段进行反垃圾校验。如字段为true，可通过 antiSpamContent 指定其他的消息的字段同样需要反垃圾校验
   */
  yidunEnable?: boolean
  /**
   * 开发者自定义的反垃圾字段.
   *
   * 注：仅当 yidunEnable 为 true 后才能开启这个功能,
   *
   * 注2: 请使用 JSON 序列化字符串，格式如下：{"type": 1, "data": "custom content"}
   * 字段说明：type: 1.文本；2.图片；3.视频。data 内容可以是: 文本内容，图片地址，视频地址
   */
  antiSpamContent?: string
  /**
   * 用户配置的对某条单条消息另外反垃圾的业务ID
   */
  antiSpamBusinessId?: string
  /**
   * 单条消息是否需要易盾反垃圾，默认 false
   */
  antiSpamUsingYidun?: boolean
  /**
   * 是否需要刷新远端的服务器会话列表，默认是（请注意区分两种会话），默认为 true
   */
  needUpdateSession?: boolean
  /**
   * 要回复的消息对象，表示当前消息是对某条消息的回复
   */
  replyMsg?: NIM_Message
  /**
   * 易盾反作弊字段，长度限制1024，JSON 序列化字符串。
   *
   * 如："{"email":"test@163.com","phone":"12345678901","token":"1234","extension":"hello"}"
   */
  yidunAntiCheating?: string
  /**
   * 易盾反作弊扩展字段字段，2021-08-09 追加。JSON 序列化字符串，长度上限 1024
   */
  yidunAntiSpamExt?: string
  /**
   * 消息子类型。格式为大于0的整数，开发者需要自行映射其含义
   */
  subType?: number
  /**
   * 环境变量，用于指向不同的抄送、第三方回调等配置
   */
  env?: string
  /**
   * 消息构建完成，在发送前触发的回调
   *
   * 注：此时 idClient 已经构建完毕，status 为 sending，time 为端测本地时间。
   */
  beforesend?: NIM_DefaultDoneFn<NIM_Message>
  /**
   * 消息发送成功回调
   *
   * 注：接到 NIM 服务器回包后，传回 idServer，更正 status 为 success，time 更正为服务器侧的发送时间。
   */
  done?: NIM_DefaultDoneFn<NIM_Message>
}

export type NIM_SendTipMsgOptions = {
  /**
   * 提醒内容
   */
  tip: string
} & NIM_BaseSendMsgOptions

export type NIM_SendGEOOptions = {
  /**
   * 地理位置
   */
  geo: NIM_MsgGEO
} & NIM_BaseSendMsgOptions

export type NIM_SendCustomMsgOptions = {
  /**
   * 自定义消息的消息内容，推荐使用 JSON 序列化字符串
   */
  content: string
} & NIM_BaseSendMsgOptions

export type NIM_SendFileOptions = {
  /**
   * 文件类型。image 图片，video 视频，audio 音频，file 其他文件。
   */
  type: 'video' | 'audio' | 'image' | 'file'
  /**
   * JS 的 File 对象
   *
   * 注：只允许支持 File 的环境下使用。如果是 IE 低版本或者小程序，rn，无法使用这个。
   *
   * 注2: fileInput、file、filePath 只需要填一个
   */
  file?: File
  /**
   * DOM 节点或者节点的 id
   *
   * 注：只允许浏览器环境使用，sdk 会读取该节点下的第一个文件。
   *
   * 注2：fileInput、file、filePath 只需要填一个
   */
  fileInput?: string | HTMLInputElement
  /**
   * 文件临时路径。
   *
   * 注：仅供小程序(5.1.0+)、nodejs(5.4.0+)、react-native(5.3.0+) 使用, 举例小程序通过 wx.chooseImage 或者 wx.startRecord 拿到临时文件路径 filePath 再传入。
   *
   * 注2：fileInput、file、filePath 只需要填一个
   */
  filePath?: string
  /**
   * 限制文件的大小，单位字节.
   *
   * 注：小程序，rn 等环境，由于只有 filePath 而没有 file 具体信息，无法使用这个字段做判断，只能让开发者自行在选择文件是判定。
   */
  maxSize?: number
  /**
   * 开始上传文件的回调。
   *
   * 这个回调接收一个参数叫 upload，调用 upload.abort() 可以取消文件上传。
   */
  beginupload?: (upload: any) => void
  /**
   * 上传进度监听回调
   *
   * 注：IE9 以下不支持上传进度事件，故而回调失效
   */
  uploadprogress?: (obj: NIM_UploadFileProgressObject) => void
  /**
   * 上传完毕的回调
   */
  uploaddone?: (error: Error | null, obj: NIM_UploadFileProgressObject) => void
} & NIM_BaseSendMsgOptions

export type NIM_SendTextOptions = {
  /**
   * 文本消息内容
   */
  text: string
} & NIM_BaseSendMsgOptions

export enum NIM_ENUM_MsgScene {
  p2p,
  team,
  superTeam = 5,
}
export type NIM_MsgScene = keyof typeof NIM_ENUM_MsgScene

export type NIM_UploadFileProgressObject = {
  /**
   * 总大小
   */
  total: number
  /**
   * 已上传大小
   */
  loaded: number
  /**
   * 已上传进度
   */
  percentage: number
  /**
   * 已上传进度的文本描述
   */
  percentageText: string
}

export type NIM_Message = {
  /**
   * 场景
   */
  scene: NIM_MsgScene
  /**
   * 消息发送方, 帐号
   */
  from: string
  /**
   * 消息发送方的昵称
   */
  fromNick?: string
  /**
   * 发送方的设备类型
   */
  fromClientType?: string
  /**
   * 发送端设备id
   */
  fromDeviceId?: string
  /**
   * 消息接收方, 帐号或群id
   */
  to: string
  /**
   * 时间戳
   */
  time: number
  /**
   * 发送方信息更新时间
   */
  userUpdateTime: number
  /**
   * 消息类型
   */
  type: string
  /**
   * 消息所属的会话的ID
   */
  sessionId: string
  /**
   * 聊天对象, 账号或者群id
   */
  target: string
  /**
   * 消息的流向
   *
   * 'in' 代表这是收到的消息.
   * 'out' 代表这是发出的消息
   */
  flow: string
  /**
   * 消息发送状态
   *
   * 'sending' 发送中
   * 'success' 发送成功
   * 'fail' 发送失败
   */
  status: string

  /**
   * 端测生成的消息id, 可作为消息唯一主键使用。
   */
  idClient: string
  /**
   * 服务器用于区分消息用的ID, 用于获取历史消息和获取包含关键词的历史消息。
   *
   * 注：此字段可能没有, 比如说消息被反垃圾过滤了。
   */
  idServer?: string
  /**
   * 文本消息的文本内容. 当 type 为 text 时存在
   */
  text?: string
  /**
   * 文件消息的文件对象. 当 type 为 image, audio, video, file 时存在
   */
  file?: NIM_UploadFileResult
  /**
   * 地理位置消息的地理位置对象. 当 type 为 geo 时存在
   */
  geo?: NIM_MsgGEO
  /**
   * 提醒消息的内容. 当 type 为 tip 时存在
   */
  tip?: string
  /**
   * 自定义消息的消息内容, 开发者可以自行扩展, 建议封装成 JSON 序列化后的字符串. 当 type 为 custom 时存在
   */
  content?: string
  /**
   * 群通知消息的附加信息。当 type 为 notification 时存在
   */
  attach?: StrAnyObj
  /**
   * 该消息在接收方是否应该被静音
   */
  isMuted?: boolean
  /**
   * 是否是重发的消息，默认是 false
   */
  resend?: boolean
  /**
   * 扩展字段
   *
   * 注：推荐传入 JSON 序列化的字符串
   */
  custom?: string
  /**
   * 自定义推送文案
   */
  pushContent?: string
  /**
   * 自定义的推送属性
   *
   * 注：推荐传入 JSON 序列化的字符串
   */
  pushPayload?: string
  /**
   * 特殊推送选项, 只在群会话中使用
   */
  apns?: {
    /**
     * 需要特殊推送的账号列表, 此字段不存在的话表示推送给当前会话内的所有用户
     */
    accounts?: string[]
    /**
     * 需要特殊推送的文案
     */
    content?: string
    /**
     * 是否强制推送, 默认 false
     *
     * true 表示即使推送列表中的用户屏蔽了当前会话（如静音）, 仍能够推送当前这条内容给相应用户
     */
    forcePush?: boolean
  }
  /**
   * 本地数据库自定义扩展字段，开启 db 时有效。
   */
  localCustom?: string
  /**
   * 发送方 'from' 是否在接收方 'to' 的黑名单列表中
   */
  isInBlackList?: boolean
  /**
   * 是否存储云端历史，默认 true
   */
  isHistoryable?: boolean
  /**
   * 是否支持漫游，默认 true
   */
  isRoamingable?: boolean
  /**
   * 是否支持发送者多端同步，默认 true
   */
  isSyncable?: boolean
  /**
   * 是否支持抄送，默认 true
   */
  cc?: boolean
  /**
   * 是否需要推送，默认 true
   */
  isPushable?: boolean
  /**
   * 是否要存离线，默认 true
   */
  isOfflinable?: boolean
  /**
   * 是否计入消息未读数，默认 true
   */
  isUnreadable?: boolean
  /**
   * 是否为应答消息（用于机器人等类似场景等应答消息内容）
   */
  isReplyMsg?: boolean
  /**
   * 群已读消息快照大小（即消息发送时的群人数-1）
   */
  tempTeamMemberCount?: number
  /**
   * 是否需要推送昵称
   */
  needPushNick?: boolean
  /**
   * 是否是本地数据库消息, 默认 false
   */
  isLocal?: boolean
  /**
   * 被回复消息的发送者账号
   */
  replyMsgFromAccount?: string
  /**
   * 被回复消息的接受者账号
   */
  replyMsgToAccount?: string
  /**
   * 被回复消息的时间
   */
  replyMsgTime?: number
  /**
   * 被回复消息的 idServer
   */
  replyMsgIdServer?: string
  /**
   * 被回复消息的 idClient
   */
  replyMsgIdClient?: string
  /**
   * thread 消息的发送者账号
   */
  threadMsgFromAccount?: string
  /**
   * thread消息的接受者账号
   */
  threadMsgToAccount?: string
  /**
   * thread消息的时间
   */
  threadMsgTime?: number
  /**
   * thread消息的idServer
   */
  threadMsgIdServer?: string
  /**
   * thread消息的idClient
   */
  threadMsgIdClient?: string
  /**
   * 该消息是否已被撤回或单向删除，获取 thread 消息列表时会用到
   */
  delete?: boolean
  /**
   * 服务器第三方回调的扩展字段
   */
  callbackExt?: string
  /**
   * 开发者自定义的消息子类型，格式为大于0的整数
   */
  subType?: number
  /**
   * 环境变量，用于指向不同的抄送、第三方回调等配置
   */
  env?: string
  /**
   * 易盾反垃圾结果。
   *
   * 注：若开启了易盾反垃圾，并且针对文本或图片如果被反垃圾策略匹配中，端测会透传此反垃圾结果字段。
   */
  yidunAntiSpamRes: string
}

export type NIM_UploadFileResult = {
  /**
   * 文件名
   */
  name: string
  /**
   * 文件 url
   */
  url: string
  /**
   * 文件后缀
   */
  ext: string
  /**
   * 文件大小，单位字节
   */
  size?: number
  /**
   * 宽度。
   */
  w?: number
  /**
   * 高度
   */
  h?: number
  /**
   * 音频/视频 文件的时长
   */
  dur?: number
  /**
   * 图片的转向
   */
  orientation?: string
  /**
   * 音频解码格式
   */
  audioCodec?: string
  /**
   * 视频解码格式
   */
  videoCodec?: string
  /**
   * 音视频文件的容器
   */
  container?: string
  /**
   * 文件短链
   */
  // _url_safe?: string
}

export type NIM_MsgGEO = {
  /**
   * 地点名
   */
  title: string
  /**
   * 纬度坐标
   */
  lat: number
  /**
   * 经度坐标
   */
  lng: number
}
