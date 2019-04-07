<template>
    <span></span>
</template>

<script>
  import store from '../store/store'
  export default {
    name: 'hallSocket',
    data () {
      return {
        state: store.state
      }
    },
    destroyed () {
      this.websock.close() // 离开路由之后断开websocket连接
    },
    methods: {
      initWebSocket (url) { // 初始化weosocket
        this.state.websock = new WebSocket(url)
        this.state.websock.onmessage = this.websocketonmessage
        this.state.websock.onopen = this.websocketonopen
        this.state.websock.onerror = this.websocketonerror
        this.state.websock.onclose = this.websocketclose
      },
      websocketonopen () { // 连接建立之后执行send方法发送数据
        console.log('socket open')
      },
      websocketonerror () { // 连接建立失败重连
        console.log('socket error')
      },
      websocketonmessage (e) { // 数据接收
        console.log(this.$qs.parse(e.data))
      },
      websocketsend (Data) { // 数据发送
        this.websock.send(JSON.stringify(Data))
        console.log(JSON.stringify(Data))
      },
      websocketclose (e) { // 关闭
        this.websock.close()
        console.log('断开连接 ', e)
      }
    }
  }
</script>

<style scoped>

</style>
