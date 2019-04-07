<template>
  <div id="menu-container">
    <el-container>
      <el-header class="header" >
        <h1  class="header-front">Gomoku King</h1>
      </el-header>
      <el-container>
        <el-aside width="200px" >
          <div style="margin-top: 50%">
            <el-menu
              default-active="1"
              class="el-menu-demo"
              active-text-color="#ffd04b"
              @open="handleOpen"
              @close="handleClose"
              @select="handleSelect">
              <el-menu-item index="1" >
                <i class="el-icon-sort"></i>
                <span slot="title" class="menu-front" v-text="Msg_play"></span>
              </el-menu-item>
              <el-menu-item index="2" :disabled="disabled">
                <i class="el-icon-phone"></i>
                <span slot="title" class="menu-front">我的好友</span>
              </el-menu-item>
              <el-menu-item index="3" :disabled="disabled">
                <i class="el-icon-menu"></i>
                <span slot="title" class="menu-front">搜索用户</span>
              </el-menu-item>
              <el-menu-item index="4" :disabled="disabled">
                <i class="el-icon-news"></i>
                <span slot="title" class="menu-front">我的信息</span>
              </el-menu-item>
              <el-menu-item index="5" >
                <i class="el-icon-arrow-left"></i>
                <span slot="title" class="menu-front" v-text="Msg_login"></span>
              </el-menu-item>
            </el-menu>
          </div>
        </el-aside>
        <el-container>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="board-title">{{card}}</span>
              <el-button style="float: right; padding: 3px 0;color: #ffd04b" type="text">操作按钮</el-button>
            </div>
            <el-main>
              <transition name="slide-fade">
                <keep-alive exclude="Friend">
                  <router-view ></router-view>
                </keep-alive>
              </transition>
            </el-main>
          </el-card>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import store from '../store/store'
  import {AXIOS} from '../http-config/http'
  export default {
    name: 'Menu',
    data () {
      return {
        disabled: false,
        Msg_play: '对战',
        Msg_login: '切换账号',
        card: '对战',
        state: store.state
      }
    },
    mounted () {
      if (!store.state.userId) {
        this.disabled = true
        this.Msg_play = this.Msg_play + '(离线)'
        this.Msg_login = '去登录'
      } else {
        store
          .initSocket(
            'ws://localhost:8000/api/ws/hall',
            e => {
              let data = JSON.parse(e.data)
              let message = data['message']
              if (message.you.toString() === this.state.userId.toString()) {
                // 如果邀请的是自己，就调用处理请求函数
                if (message.request) {
                  this.handleRequest(message.me)
                } else {
                  this.handleResponse(message)
                }
              }
              // this.$notify({
              //   title: data['message'].x,
              //   message: data['message'].y,
              //   type: 'warning'
              // })
          })
      }
    },
    destroyed () {
      this.state.websock.close()
      store.logout()
      this.userLogout()
    },
    methods: {
      sendSocketMessage (message) {
        this.state.websock.send(JSON.stringify(message))
      },
      handleRequest (id) {
        this.$confirm(id + ' 想邀请你切磋棋艺', '提示', {
          confirmButtonText: '欣然从往',
          cancelButtonText: '残忍拒绝',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '已接受邀请'
          })
          this.sendSocketMessage({
            'me': this.state.userId, // 消息发起人标识
            'you': id, // 消息接收者标识
            'request': false, // 请求为true 答复为false
            'accept': true
          })
          // 进入两人竞技场
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已拒绝'
          })
          this.sendSocketMessage({
            'me': this.state.userId, // 消息发起人标识
            'you': id, // 消息接收者标识
            'request': false, // 请求为true 答复为false
            'accept': false
          })
        })
      },
      handleResponse (message) {
        let word = ''
        if (message.accept) {
          this.$notify({
            title: '成功',
            message: word,
            type: 'success'
          })
        } else {
          this.$notify({
            title: '失败',
            message: word,
            type: 'warning'
          })
        }
      },
      userLogout () {
        if (this.state.userId) {
          AXIOS.get('/logout/?userId=' + this.state.userId)
            .then(respond => {
              this.state.friend = respond.data
            })
            .catch(error => {
              this.notify('失败', '退出出现错误', 'warning')
              console.log(error)
            })
        }
      },
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      },
      handleSelect: function (index, indexPath) {
        switch (index) {
        case '1': {
          this.card = '对战'
          this.$router.push('/menu/play')
          break
        }
        case '2': {
          this.card = '我的好友'
          this.$router.push('/menu/friend')
          break
        }
        case '3': {
          this.card = '搜索'
          this.$router.push('/menu/search')
          break
        }
        case '4': {
          this.card = '关于我'
          this.$router.push('/menu/me')
          break
        }
        case '5' : {
          this.userLogout()
          store.logout()
          this.$router.push('/')
          break
        }
        }
      }
    }
  }
</script>

<style scoped>
  #menu-container {
    font-family: 'Roboto',arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 0;
  }
  .header {
    /*background-color: #545c64;*/
    width: 100%;
    margin:0;
    top: 0;
    box-shadow: rgba(0, 0, 0, 0.1) 0 6px 36px 0;
  }
  .header-front {
    margin-block-start: 0.5em;
    margin-block-end: 0.5em;
    font-family: 'Roboto',arial,sans-serif;
    font-size: 24px;
    font-weight: normal;
    line-height: 32px;
    padding-left: 28px;
    /*color:#409EFF;*/
    color: #ffd04b;
  }
  .menu-front {
    font-family: Hiragino Sans GB,'Roboto',arial,sans-serif;
    font-weight: normal;
    font-size: 15px;
  }
  .box-card {
    width: 100%;
    height: 700px;
    margin: 10px;
  }
  .board-title {
    font-family: 微软雅黑,'Roboto',arial,sans-serif;
    font-weight: inherit;
    font-size: 20px;
    color: #409EFF;
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }

</style>
