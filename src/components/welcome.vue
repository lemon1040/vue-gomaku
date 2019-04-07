<template>
  <el-container>
    <div class="welcom_contain">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">登录</el-menu-item>
        <el-menu-item index="2">注册</el-menu-item>
      </el-menu>
      <el-main>
        <img src="../assets/logo.png" style="width: 200px">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </div>
  </el-container>
</template>

<script>
  export default {
    name: 'welcome',
    mounted () {
      this.$router.push('/login')
    },
    data () {
      return {
        activeIndex: '1'
      }
    },
    methods: {
      handleSelect (key, keyPath) {
        console.log(key, keyPath)
        if (key === '1') {
          this.$router.push('/login')
        } else {
          this.$router.push('/register')
        }
      }
    },
  }
</script>

<style scoped>
  .welcom_contain{
    position: absolute;
    left: 0;
    right: 120px;
    width: 1000px;
    padding: 35px 35px 15px 35px;
    margin: 0 auto;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

</style>
