<template>
  <span></span>
</template>

<script>
  export default {
    name: 'confirmBox',
    props: ['msg', 'confirmMsg', 'cancelMsg'],
    methods: {
      open () {
        this.$confirm(this.msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: this.confirmMsg
          })
          this.$emit('isConfirm', true)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.cancelMsg
          })
          this.$emit('isConfirm', false)
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

</style>
