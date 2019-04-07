<template>
  <div id="search-panel">
    <div id="search-input">
      <el-input placeholder="输入ID或名字搜索用户" v-model="search" class="input-with-select">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="searchUser"></el-button>
      </el-input>
    </div>
    <div id="search-show">
      <i class="el-icon-loading" style="margin-top: 30px" v-if="loading"></i>
      <show-user :user="user"  :state="state" :isfriend="isfriend" v-if="!isEmpty" @notice="notify" ref="show"></show-user>
    </div>
  </div>
</template>

<script>
  import showUser from './showUser'
  import {AXIOS} from '../http-config/http'
  import store from '../store/store'
  export default {
    name: 'Search',
    components: {
      'show-user': showUser
    },
    data () {
      return {
        user: [],
        search: null,
        loading: false,
        state: store.state,
        isfriend: []
      }
    },
    created () {
      AXIOS.get('/Friend?me=' + this.state.userId)
        .then(respond => {
          this.state.friend = respond.data
        })
        .catch(error => {
          this.notify('失败', '获取用户好友列表失败', 'warning')
          console.log(error)
        })
    },
    computed: {
      isEmpty () {
        return this.user.length === 0
      }
    },
    methods: {
      onUserChanged () {
        // 当用户变化时调用，实时更新isfriend数组
        this.isfriend = []
        for (let i = 0; i < this.user.length; i++) {
          let id = this.user[i].userId
          this.isfriend.push(false)
          for (let j = 0; j < this.state.friend.length; j++) {
            if (id === this.state.friend[j].friend) {
              this.isfriend[i] = true
              break
            }
          }
        }
      },
      searchUser () {
        if (!this.search) {
          this.notify('错误', '输入为空或中文', 'danger')
          return
        }
        this.loading = true
        AXIOS.get('/User/?search=' + this.search)
          .then(response => {
            this.user = response.data
            if (this.user.length === 0) {
              this.notify('失败', '无匹配的搜索结果', 'warning')
            } else {
              this.onUserChanged()
            }
          })
          .catch(error => {
            this.notify('失败', 'There is something wrong with server', 'warning')
            console.log(error)
          })
          .finally(() => {
            this.loading = false
          })
      },
      notify (title, msg, type) {
        if (type !== 'error') {
          this.$notify({
            title: title,
            message: msg,
            type: type
          })
        } else {
          this.$notify.error({
            title: title,
            message: msg
          })
        }
      }
    }
  }
</script>

<style scoped>
  #search-panel {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
  }
  #search-input {
    width: 50%;
    margin-left: auto;
    margin-right: auto;
  }
</style>
