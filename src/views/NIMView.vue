<template>
  <div class="nim">
    <div>会话列表：</div>
    <div v-for="session in sessionList" :key="session.id">
      {{ session.id }}, {{ session.unread }}
      {{ session.lastMsg && session.lastMsg.text }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onUnmounted, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const sessionList = computed(() => store.state.session.sessionList)

    onMounted(async () => {
      await store.dispatch('sdk/nimLogin', {
        appKey: '45c6af3c98409b18a84451215d0bdd6e',
        account: 'cs1',
        token: 'e10adc3949ba59abbe56e057f20f883e',
        store,
      })
    })

    onUnmounted(async () => {
      await store.dispatch('sdk/nimDestroy')
    })

    return {
      sessionList,
      onMounted,
      onUnmounted,
    }
  },
}
</script>
