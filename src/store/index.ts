import { createStore } from 'vuex'

import global from './global'
import sdk from './sdk'
import session from './session'
import message from './message'
import messageLog from './messageLog'

const store = createStore({
  ...global,
  modules: {
    sdk,
    session,
    message,
    messageLog,
  },
})

export default store
