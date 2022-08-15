import { EventEmitter } from 'eventemitter3'
import {
  EventServiceInterface,
  NIM_PublishEventOptions,
  NIM_QuerySubscribeEventsByAccountsOptions,
  NIM_QuerySubscribeEventsByTypeOptions,
  NIM_SubscribeEventOptions,
  NIM_UnSubscribeEventsByAccountsOptions,
  NIM_UnSubscribeEventsByTypeOptions,
} from './EventInterface'
import {
  MessageInterface,
  NIM_GetHistoryMsgsOptions,
  NIM_ResendMsgOptions,
  NIM_SendCustomMsgOptions,
  NIM_SendFileOptions,
  NIM_SendGEOOptions,
  NIM_SendTextOptions,
  NIM_SendTipMsgOptions,
} from './MessageInterface'
import {
  NIMInterface,
  NIM_DestroyOptions,
  NIM_DisconnectOptions,
  NIM_KickOptions,
} from './NIMInterface'
import {
  NIM_GetLocalSessionOptions,
  NIM_GetLocalSessionsOptions,
  SessionInterface,
} from './SessionInterface'
import {
  NIM_SendCustomSysMsgOptions,
  SystemMessageInterface,
} from './SystemMessageInterface'
import { NIM_DefaultDoneFn, NIM_GetInstanceOptions, StrAnyObj } from './types'

export class NIM
  extends EventEmitter
  implements
    NIMInterface,
    MessageInterface,
    SessionInterface,
    EventServiceInterface,
    SystemMessageInterface
{
  constructor(options: NIM_GetInstanceOptions) {
    super()
  }
  static getInstance(options: NIM_GetInstanceOptions): NIM {
    return new NIM(options)
  }
  getLocalSession(options: NIM_GetLocalSessionOptions): void {
    throw new Error('Method not implemented.')
  }
  getLocalSessions(options: NIM_GetLocalSessionsOptions): void {
    throw new Error('Method not implemented.')
  }
  resetSessionUnread(
    sessionId: string,
    done?: (err: Error | null, failedSessionId: string) => void
  ): void {
    throw new Error('Method not implemented.')
  }
  resetSessionsUnread(sessionIds: string[]): void {
    throw new Error('Method not implemented.')
  }
  resetAllSessionUnread(): void {
    throw new Error('Method not implemented.')
  }
  getHistoryMsgs(options: NIM_GetHistoryMsgsOptions): void {
    throw new Error('Method not implemented.')
  }
  sendFile(options: NIM_SendFileOptions): void {
    throw new Error('Method not implemented.')
  }
  sendCustomMsg(options: NIM_SendCustomMsgOptions): void {
    throw new Error('Method not implemented.')
  }
  sendGEO(options: NIM_SendGEOOptions): void {
    throw new Error('Method not implemented.')
  }
  sendTipMsg(options: NIM_SendTipMsgOptions): void {
    throw new Error('Method not implemented.')
  }
  resendMsg(options: NIM_ResendMsgOptions): void {
    throw new Error('Method not implemented.')
  }
  sendText(options: NIM_SendTextOptions): void {
    throw new Error('Method not implemented.')
  }
  sendCustomSysMsg(options: NIM_SendCustomSysMsgOptions): void {
    throw new Error('Method not implemented.')
  }
  publishEvent(options: NIM_PublishEventOptions): void {
    throw new Error('Method not implemented.')
  }
  subscribeEvent(options: NIM_SubscribeEventOptions): void {
    throw new Error('Method not implemented.')
  }
  unSubscribeEventsByAccounts(
    options: NIM_UnSubscribeEventsByAccountsOptions
  ): void {
    throw new Error('Method not implemented.')
  }
  unSubscribeEventsByType(options: NIM_UnSubscribeEventsByTypeOptions): void {
    throw new Error('Method not implemented.')
  }
  querySubscribeEventsByAccounts(
    options: NIM_QuerySubscribeEventsByAccountsOptions
  ): void {
    throw new Error('Method not implemented.')
  }
  querySubscribeEventsByType(
    options: NIM_QuerySubscribeEventsByTypeOptions
  ): void {
    throw new Error('Method not implemented.')
  }
  logout(): void {
    throw new Error('Method not implemented.')
  }
  disconnect(options: NIM_DisconnectOptions): void {
    throw new Error('Method not implemented.')
  }
  destroy(options: NIM_DestroyOptions): void {
    throw new Error('Method not implemented.')
  }
  connect(options: { done?: NIM_DefaultDoneFn<StrAnyObj> }): void {
    throw new Error('Method not implemented.')
  }
  kick(options: NIM_KickOptions): void {
    throw new Error('Method not implemented.')
  }
}
