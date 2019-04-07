<template>
  <div v-loading="loading">
    <div id="myFriend">
      <show-user :user="myFriend" :state="state" :isfriend="isfriend" @notice="notify"></show-user>
    </div>
  </div>
</template>

<script>
  import showUser from './showUser'
  import store from '../store/store'
  import {AXIOS} from '../http-config/http'
  export default {
    name: 'Friend',
    components: {
      'show-user': showUser
    },
    data () {
      return {
        loading: true,
        state: store.state,
        isfriend: [],
        myFriend: []
      }
    },
    created () {
      AXIOS.get('/Friend?me=' + this.state.userId)
        .then(respond => {
          this.state.friend = respond.data
          this.initFriend()
        })
        .catch(error => {
          this.notify('失败', '获取用户好友列表失败', 'warning')
          console.log(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    computed: {
      isEmpty () {
        return this.user.length === 0
      }
    },
    methods: {
      initFriend () {
        for (let i = 0; i < this.state.friend.length; i++) {
          AXIOS.get('/User/' + this.state.friend[i].friend)
            .then(respond => {
              console.log(respond.data)
              this.myFriend.push(respond.data)
            })
            .catch(error => {
              this.notify('失败', '获取用户好友列表详情失败', 'warning')
              console.log(error)
            })
          this.isfriend.push(true)
        }
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
  #myFriend {
    width: 80%;
    position: relative;
    margin-left: auto;
    margin-right: auto;
  }
</style>
