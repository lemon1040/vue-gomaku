<template>
  <el-table
    :data=user
    style="width: 100%"
    height="600"
    :row-class-name="tableRowClassName">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="昵称" >
            <span>{{ props.row.name }}</span>
          </el-form-item>
          <el-form-item label="ID">
            <span>{{ props.row.userId }}</span>
          </el-form-item>
          <el-form-item label="获胜次数">
            <span>{{ props.row.winTimes }}</span>
          </el-form-item>
          <el-form-item label="个人介绍">
            <span>{{ props.row.introduction }}</span>
          </el-form-item>
          <el-form-item label="当前状态">
            <span>{{ props.row.online?'在线':'离线'}}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="ID"
      width="160"
      prop="userId">
    </el-table-column>
    <el-table-column
      label="名字"
      prop="name">
    </el-table-column>
    <el-table-column
      label="获胜次数"
      width="200"
      prop="winTimes">
    </el-table-column>
    <el-table-column width="40">
      <template slot-scope="scope">
        <el-tooltip class="item" effect="dark" content="当前用户在线" placement="left-end" >
          <li class="el-icon-check" style="color: #ff8c30" v-if="scope.row.online"></li>
        </el-tooltip>
        <!--<el-button type="success" icon="el-icon-check" circle size="mini" v-show="scope.row.online"></el-button>-->
      </template>
    </el-table-column>
    <el-table-column
      align="right">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleInvite(scope.$index, scope.row)">邀请对战</el-button>
        <el-button
          size="mini"
          :type="isfriend[scope.$index]? 'danger':'success'"
          @click="isfriend[scope.$index]?handleDelete(scope.$index, scope.row):handleAdd(scope.$index, scope.row)">
          <span class="el-icon-loading"  v-if="loading_add"></span>
          {{isfriend[scope.$index]?'删除好友':'添加好友'}}</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import {AXIOS} from '../http-config/http'
  export default {
    name: 'showUser',
    props: [
      'user',
      'friend',
      'state',
      'isfriend'
    ],
    data () {
      return {
        loading_add: false
      }
    },
    methods: {
      sendSocketMessage (message) {
        this.state.websock.send(JSON.stringify(message))
      },
      handleInvite (index, row) {
        this.sendSocketMessage({
          'me': this.state.userId, // 消息发起人标识
          'you': row.userId, // 消息接收者标识
          'request': true, // 请求为true 答复为false
          'accept': false
        })
        this.notify('成功', '邀请已发出', 'success')
      },
      handleAdd (index, row) {
        if (this.state.userId.toString() === row.userId.toString()) {
          this.notify('失败', '您不能添加自己为好友', 'error')
          return
        }
        this.loading_add = true
        AXIOS.post('/Friend/', {
          me: this.state.userId,
          friend: row.userId
        })
          .then(response => {
            this.state.friend.push(response.data)
            this.isfriend[index] = true
            this.notify('成功', '已添加' + response.data.friend + '为好友', 'success')
          })
          .catch(error => {
            this.notify('失败', '添加请求处理失败', 'warning')
            console.log(error)
          })
          .finally(() => { this.loading_add = false })
        console.log(index, row)
      },
      handleDelete (index, row) {
        this.loading_add = true
        let i = this.state.friend.findIndex((element) => {
          return element.me.toString() === this.state.userId.toString() &&
            element.friend.toString() === row.userId.toString()
        })
        if (i === -1) {
          return
        }
        AXIOS.delete('/Friend/' + this.state.friend[i].id + '/')
          .then(response => {
            console.log(response.data)
            this.notify('成功', '已成功删除好友', 'success')
            this.state.friend.splice(i, 1)
            this.isfriend[index] = false
          })
          .catch(error => {
            this.notify('失败', '添加请求处理失败', 'warning')
            console.log(error)
          })
          .finally(() => { this.loading_add = false })
        console.log(index, row)
      },
      tableRowClassName ({row, rowIndex}) {
        if (row.online) {
          return 'success-row'
        }
        return ''
      },
      notify (title, msg, type) {
        this.$emit('notice', title, msg, type)
      }
    }
  }
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #ff8c30
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }

</style>
