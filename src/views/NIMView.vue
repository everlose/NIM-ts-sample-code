<template>
  <div class="nim">
    <div class="session-wrap">
      <div
        class="session-item"
        :class="{
          'session-item--active':
            currentSession && currentSession.id === session.id,
        }"
        v-for="session in sessionListInOrder"
        :key="session.id"
        @click="setCurrSession(session)"
      >
        <div class="session-primary">
          <p class="primary-text">{{ session.id }}</p>
          <p class="primary-desc">{{ session.lastMsgShow }}</p>
        </div>
        <div class="session-extra">
          <div class="session-time">
            {{ session.updateTimeShow }}
          </div>
          <div v-show="session.unread > 0" class="session-unread">
            {{ session.unread }}
          </div>
        </div>
      </div>
    </div>
    <div class="chat-wrap">
      <div class="chat-msgs-wrap">
        <button @click="loadMore" v-if="currentMessagesTag.hasMore">
          加载下一页
        </button>
        <div v-else style="color: #999">没有更多消息了.....</div>
        <div
          v-for="msg in currentMessages"
          :key="msg.idClient"
          class="msg-item"
          :class="{
            'msg-item__me': msg.flow === 'out',
            'msg-item__you': msg.flow === 'in',
          }"
        >
          <div v-if="msg.type === 'timeTag'" class="msg-time">
            ---- {{ msg.showText }} ----
          </div>
          <div v-else-if="msg.type === 'tip'" class="msg-tip">
            {{ msg.showText }}
          </div>
          <div
            v-else-if="msg.type === 'notification' && msg.scene === 'team'"
            class="msg-notification"
          >
            {{ msg.showText }}
          </div>
          <div v-else class="msg-main">
            <div class="msg-main-head" v-if="msg.avatar">
              <img class="head-img-circle" :src="msg.avatar" />
            </div>
            <div class="msg-main-user" v-else-if="msg.type !== 'notification'">
              <em class="user-text">{{ msg.showTime }}</em
              >{{ msg.from }}
            </div>

            <div class="msg-main-text-box">
              <div class="msg-main-text" v-html="msg.showText"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-editor">
        <textarea
          v-model="formState.text"
          class="editor-textarea"
          placeholder="请输入"
        ></textarea>
        <button class="editor-btn" @click="onSubmit">发送</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  reactive,
  UnwrapRef,
  onUnmounted,
  onMounted,
  toRaw,
} from 'vue'
import { useStore } from 'vuex'
import { sortBy } from 'lodash'
import { NIM_Session } from '@/3rd/NIM_Web_SDK_v8.9.100/SessionInterface'
import { formatDate, getMessageDescribe } from '@/utils'
import { NIM_Message } from '@/3rd/NIM_Web_SDK_v8.9.100/MessageInterface'
import { StrAnyObj } from '@/3rd/NIM_Web_SDK_v8.9.100/types'

interface FormState {
  type: string
  text: string
}

export default {
  setup() {
    const store = useStore()
    // 在此加工的按 updateTime 排序的 session，并且处理下展示的 lastMsgShow 和 格式化时间
    const sessionListInOrder = computed(() => {
      const temp = sortBy(
        store.state.session.sessions,
        (item) => -item.updateTime
      )
      return temp.map((sessionItem: NIM_Session) => {
        const item: any = { ...sessionItem }

        item.updateTimeShow = formatDate(item.updateTime, true)
        if (item.lastMsg) {
          item.lastMsgShow = getMessageDescribe(item.lastMsg)
        }
        return item
      })
    })

    // 当前选中的会话
    const currentSession = computed(() =>
      store.state.session.currentSessionId
        ? store.state.session.sessions[store.state.session.currentSessionId]
        : {}
    )

    // 当前选中的会话的消息
    const currentMessages = computed(() => {
      if (!store.state.session.currentSessionId) {
        return []
      }
      const tempMsgs =
        store.state.messageLog.msgLog[store.state.session.currentSessionId]
      if (!tempMsgs) {
        return []
      }
      return tempMsgs.map((sessionMsg: NIM_Message) => {
        let item: StrAnyObj = { ...sessionMsg }
        item.showText = getMessageDescribe(sessionMsg)
        return item
      })
    })

    const currentMessagesTag = computed(
      () =>
        store.state.messageLog.msgLogTag[
          store.state.session.currentSessionId
        ] || {}
    )

    // 表单元素
    const formState: UnwrapRef<FormState> = reactive({
      type: 'text',
      text: '',
    })

    onMounted(async () => {
      await store.dispatch('sdk/nimLogin', {
        appKey: '45c6af3c98409b18a84451215d0bdd6e',
        account: 'cs1',
        token: 'e10adc3949ba59abbe56e057f20f883e',
        // appKey: 'fe416640c8e8a72734219e1847ad2547',
        // account: 'cs1',
        // token: 'e10adc3949ba59abbe56e057f20f883e',
      })
    })

    onUnmounted(async () => {
      await store.dispatch('sdk/nimDestroy')
    })

    return {
      sessionListInOrder,
      formState,
      currentSession,
      currentMessages,
      currentMessagesTag,
      onMounted,
      onUnmounted,
      // 表单相关
      onSubmit: () => {
        const formdata = toRaw(formState)
        if (formdata.type === 'text') {
          store.dispatch('message/sendText', {
            text: formdata.text,
            scene: currentSession.value.scene,
            to: currentSession.value.to,
          })
          formdata.text = ''
        } else if (formdata.type === 'file') {
          // todo sendFile
        }
      },
      setCurrSession: (session: NIM_Session) => {
        store.dispatch('session/setCurrentSession', {
          session,
          store,
        })
      },
      loadMore: () => {
        store.dispatch('messageLog/getHistoryMsgs', currentSession.value.id)
      },
    }
  },
}
</script>

<style scoped>
.nim {
  display: flex;
  border: 1px solid #999;
  width: 1280px;
  min-height: 500px;
  margin: 0 auto;
}
.session-wrap {
  flex: 0 0 300px;
  border-right: 1px solid #999;
}
.chat-wrap {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
}
.chat-msgs-wrap {
  flex: 1 1 0;
  padding: 20px;
}
.chat-editor {
  position: relative;
  flex: 0 0 200px;
  border-top: 1px solid #999;
}
.editor-textarea {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-style: none;
  resize: none;
}
.editor-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.session-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}
.session-item--active {
  background: green;
}
.session-icon-wrap {
  width: 24px;
}
.session-primary {
  flex: 1 0 0;
  padding: 0 10px;
  overflow: hidden;
}
.session-primary .primary-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.session-primary .primary-desc {
  color: #999;
  font-size: 12px;
}
.session-extra {
  display: flex;
  align-items: center;
}

.session-icon {
  width: 100%;
  vertical-align: top;
}
.session-time {
  font-size: 12px;
}
.session-unread {
  width: 14px;
  height: 14px;
  line-height: 14px;
  padding: 2px;
  font-size: 12px;
  background-color: #f00;
  color: #fff;
  text-align: center;
  border-radius: 50%;
  margin-left: 6px;
}

.msg-item {
  padding: 4px 0 10px 0;
}
.msg-time {
  text-align: center;
  font-size: 12px;
  color: #aaaaaa;
  line-height: 30px;
}
.msg-tip {
  text-align: center;
  font-size: 12px;
  color: #aaaaaa;
  line-height: 30px;
}
.msg-notification {
  text-align: center;
  font-size: 12px;
  color: #aaaaaa;
  line-height: 30px;
}
.msg-item__you .msg-main {
  display: flex;
  flex-direction: flex-start;
  align-items: center;
}
.msg-item__me .msg-main {
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-start;
}
.msg-main-head {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}
.msg-main-head .head-img-circle {
  width: 100%;
  height: 100%;
  vertical-align: top;
}
.msg-main-text-box {
  flex: 1;
}
.msg-item__you .msg-main-text-box {
  text-align: left;
}
.msg-item__me .msg-main-text-box {
  text-align: right;
}
.msg-main-text {
  position: relative;
  display: inline-block;
  padding: 7px 12px;
  margin: 0 10px;
  color: #fff;
  background: #5cacde;
  border-radius: 8px;
  text-align: left;
  max-width: 150px;
  word-break: break-all;
}
.msg-main-text::after {
  content: ' ';
  position: absolute;
  top: 11px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  width: 0;
  height: 0;
}
.msg-item__you .msg-main-text::after {
  right: 100%;
  border-right: 5px solid #5cacde;
}
.msg-item__me .msg-main-text::after {
  left: 100%;
  border-left: 5px solid #5cacde;
}
.msg-main-reply {
  align-self: center;
  user-select: none;
}
</style>
