<template>
  <div class="login-contain">
    <el-form :model="loginForm" status-icon :rules="rules" ref="form" label-width="120px" class="login-form">
      <el-form-item  prop="username" >
        <el-input v-model="loginForm.username" placeholder="请输入昵称"></el-input>
      </el-form-item>
      <el-form-item  prop="pwd" >
        <el-input type="password" ref="pwdTable" v-model="loginForm.pwd"  placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item  prop="pwd_again" >
        <el-input type="password" v-model="loginForm.pwd_again" show-password='' placeholder="再次确认密码" @keyup.enter.native="register(this.loginForm)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="register('form')" v-loading="isLoading" style="width:100%;">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import store from '../store/store'
  import {AXIOS} from '../http-config/http'
  export default {
    name: 'register',
    data () {
      const checkUsername = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入昵称'))
        } else {
          callback()
        }
      }
      const checkPwd = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'))
        } else {
          callback()
        }
      }
      const checkPwdAgain = (rule, value, callback) => {
        if (value && value !== this.loginForm.pwd) {
          this.show = true
          callback(new Error('两次输入密码不匹配'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          username: '',
          pwd: '',
          pwd_again: ''
        },
        rules: {
          username: [
            { validator: checkUsername, trigger: 'blur' }
          ],
          pwd: [
            {validator: checkPwd, trigger: 'blur'}
          ],
          pwd_again: [
            {validator: checkPwdAgain, trigger: 'blur'}
          ]
        },
        isLoading: false,
        state: store.state,
        show: false
      }
    },
    methods: {
      register (form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            // try to connect the server in 2s
            this.isLoading = true
            AXIOS.post('/User/', {
              'username': this.loginForm.username,
              'pwd': this.loginForm.pwd
            })
              .then(response => {
                setTimeout(() => {
                  this.isLoading = false
                  // identify successfully and store the login information
                  store.state.userId = response.data.userId
                  this.tellMsg('请牢记', '您新申请的账户ID为：' + store.state.userId)
                  this.$router.push('/menu/play')
                }, 1000)
                // identify failed
              })
              .catch(error => {
                this.notify('失败', 'There is something wrong with server', 'warning')
                this.isLoading = false
                console.log(error)
              })
          }
        })
      },
      notify (title, msg, type) {
        this.$notify({
          title: title,
          message: msg,
          type: type
        })
      },
      tellMsg (title, msg) {
        this.$alert(msg, title, {
          confirmButtonText: '确定'
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
