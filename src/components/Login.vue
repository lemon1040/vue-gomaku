<template>
  <div class="login-contain">
    <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="120px" class="login-form">
      <el-form-item  prop="userId" >
        <el-input v-model="loginForm.userId" placeholder="请输入ID"></el-input>
      </el-form-item>
      <el-form-item  prop="pwd" >
        <el-input type="password" v-model="loginForm.pwd" show-password="" placeholder="请输入密码" @keyup.enter.native="login(this.loginForm)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login('loginForm')" style="width:48%;float: left;"  v-loading="isLoading">登录</el-button>
        <el-button type="info" @click="playWithMyself" style="width:48%;float: right;" >自闭模式</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import store from '../store/store'
  import {AXIOS} from '../http-config/http'
  export default {
    name: 'Login',
    data () {
      const checkUsername = (rule, value, callback) => {
        if (!value) {
          callback(new Error('Please input userId'))
        } else if (!/^[0-9]*$/.test(value)) {
          callback(new Error('Please input correct id'))
        } else {
          callback()
        }
      }
      const checkPwd = (rule, value, callback) => {
        if (!value) {
          callback(new Error('Please input pwd'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          userId: '',
          pwd: ''
        },
        rules: {
          userId: [
            { validator: checkUsername, trigger: 'blur' }
          ],
          pwd: [
            {validator: checkPwd, trigger: 'blur'}
          ]
        },
        isLoading: false,
        state: store.state
      }
    },
    methods: {
      login (form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            // try to connect the server in 2s
            this.isLoading = true
            AXIOS.post('/' + 'login', {
              'userId': this.loginForm.userId,
              'pwd': this.loginForm.pwd
            })
              // msg and succ
              .then(response => {
                setTimeout(() => {
                  this.isLoading = false
                  if (!response.data.succ) {
                    this.notify('失败', response.data.msg, 'warning')
                  } else {
                    // identify successfully and store the login information
                    store.state.userId = this.loginForm.userId
                    this.$router.push('/menu/play')
                  }
                }, 1000)
                // identify failed
              })
              .catch(error => {
                this.notify('失败', 'There is something wrong with server', 'warning')
                this.isLoading = false
                console.log(error)
              })
              // .finally(() => {
              //   this.isLoading = false
              // })
          }
        })
      },
      playWithMyself () {
        this.$router.push('/menu/play')
      },
      notify (title, msg, type) {
        this.$notify({
          title: title,
          message: msg,
          type: type
        })
      }
    }
  }
</script>

<style scoped>
  .login-form {
    position: absolute;
    left: 0;
    right: 120px;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 0 auto;
  }
</style>
