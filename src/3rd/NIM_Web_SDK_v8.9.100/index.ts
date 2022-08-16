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
  constructor(__options: NIM_GetInstanceOptions) {
    super()
  }
  static getInstance(_options: NIM_GetInstanceOptions): NIM {
    return new NIM(_options)
  }
  getLocalSession(_options: NIM_GetLocalSessionOptions): void {
    throw new Error('Method not implemented.')
  }
  getLocalSessions(_options: NIM_GetLocalSessionsOptions): void {
    throw new Error('Method not implemented.')
  }
  resetSessionUnread(
    _sessionId: string,
    _done?: (err: Error | null, failedSessionId: string) => void
  ): void {
    throw new Error('Method not implemented.')
  }
  resetSessionsUnread(_sessionIds: string[]): void {
    throw new Error('Method not implemented.')
  }
  resetAllSessionUnread(): void {
    throw new Error('Method not implemented.')
  }
  getHistoryMsgs(_options: NIM_GetHistoryMsgsOptions): void {
    throw new Error('Method not implemented.')
  }
  sendFile(_options: NIM_SendFileOptions): void {
    throw new Error('Method not implemented.')
  }
  sendCustomMsg(_options: NIM_SendCustomMsgOptions): void {
    throw new Error('Method not implemented.')
  }
  sendGEO(_options: NIM_SendGEOOptions): void {
    throw new Error('Method not implemented.')
  }
  sendTipMsg(_options: NIM_SendTipMsgOptions): void {
    throw new Error('Method not implemented.')
  }
  resendMsg(_options: NIM_ResendMsgOptions): void {
    throw new Error('Method not implemented.')
  }
  sendText(_options: NIM_SendTextOptions): void {
    throw new Error('Method not implemented.')
  }
  sendCustomSysMsg(_options: NIM_SendCustomSysMsgOptions): void {
    throw new Error('Method not implemented.')
  }
  publishEvent(_options: NIM_PublishEventOptions): void {
    throw new Error('Method not implemented.')
  }
  subscribeEvent(_options: NIM_SubscribeEventOptions): void {
    throw new Error('Method not implemented.')
  }
  unSubscribeEventsByAccounts(
    _options: NIM_UnSubscribeEventsByAccountsOptions
  ): void {
    throw new Error('Method not implemented.')
  }
  unSubscribeEventsByType(_options: NIM_UnSubscribeEventsByTypeOptions): void {
    throw new Error('Method not implemented.')
  }
  querySubscribeEventsByAccounts(
    _options: NIM_QuerySubscribeEventsByAccountsOptions
  ): void {
    throw new Error('Method not implemented.')
  }
  querySubscribeEventsByType(
    _options: NIM_QuerySubscribeEventsByTypeOptions
  ): void {
    throw new Error('Method not implemented.')
  }
  logout(): void {
    throw new Error('Method not implemented.')
  }
  disconnect(_options: NIM_DisconnectOptions): void {
    throw new Error('Method not implemented.')
  }
  destroy(_options: NIM_DestroyOptions): void {
    throw new Error('Method not implemented.')
  }
  connect(_options: { done?: NIM_DefaultDoneFn<StrAnyObj> }): void {
    throw new Error('Method not implemented.')
  }
  kick(_options: NIM_KickOptions): void {
    throw new Error('Method not implemented.')
  }
}
