import { createStore } from 'vuex'

import global from './global'
import sdk from './sdk'
import session from './session'
import message from './message'
import messageLog from './messageLog'
import systemMessage from './systemMessage'
import event from './event'

const store = createStore({
  ...global,
  modules: {
    sdk,
    session,
    message,
    messageLog,
    systemMessage,
    event,
  },
})

export default store
