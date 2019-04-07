<template>
  <div>
    <!--消息提示框-->
    <confirm-box :msg = "'是否要认输并重新开局'" :confirmMsg ="'我方认输'" :cancelMsg="'已取消'"
                 @isConfirm="confirmRestart" ref="confirmBox"></confirm-box>
    <!--棋盘-->
    <div id="board-container" ref="board" @click="boardClick">
      <fireworks ref="fireworks"></fireworks>
      <div>
        <div v-for="(row, rowIndex) in state.board" :key="rowIndex">
          <div
            v-for="(c, colIndex) in row"
            v-if="!!c"
            :key="colIndex"
            @click="defaultClick"
            :class="'chessman ' + (c === 1 ? 'black ' : 'white ') + (isLast(rowIndex, colIndex) ? 'last-step' : '')"
            :style="{
              marginTop: (1.5 + rowIndex*6.53) + '%',
              marginLeft: (1.5 + colIndex*6.53) + '%',
              }">
          </div>
        </div>
        <transition-group name="font">
          <div
            v-if="showStep"
            v-for="(s, index) in state.steps"
            :key="index + 15"
            @click="defaultClick"
            :class="'step ' + (s.role === 1 ? 'wh' : 'black')"
            :style="{
            marginTop: (1.5 + s.position[0]*6.53) + '%',
            marginLeft: (1.5 + s.position[1]*6.53) + '%'
            }">
            {{index+1}}
          </div>
        </transition-group>
      </div>
    </div>
    <!--控制面板-->
    <div id="panel-container">
      <el-dropdown trigger="click" placement="top">
      <span class="el-dropdown-link" ><i class="el-icon-caret-top el-icon--right" v-text="' ' + FirstMan + '先手'"></i>
      </span>
        <el-dropdown-menu slot="dropdown" >
          <el-dropdown-item @click.native="setFirst(true)" :icon="isFirst? 'el-icon-success': ''"
                            :disabled="isBegin" style="float: left">我方先手</el-dropdown-item>
          <el-dropdown-item @click.native="setFirst(false)" :icon="!isFirst? 'el-icon-success': ''"
                            :disabled ="isBegin" style="float: left" >对方先手</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <transition name="fade" mode="out-in">
        <el-button :type=button_type :icon=button_icon class="check-button" :key="button_type"
                   @click="beginGame">{{button_text}}
        </el-button>
      </transition>
      <el-switch style="display: block" v-model="showStep" class="check-button"
        active-color="#13ce66"
        active-text="显示步数"
      >
      </el-switch>
    </div>
    <!--记录面板-->
    <transition name="test" mode="out-in">
      <div id="steps-container" v-if="isBegin">
          <el-table
            :data="tableData"
            style="width: 100%"
            height="500"
            stripe
            :default-sort = "{prop: 'index', order: 'descending'}"
          >
            <el-table-column
              prop="index"
              label="步数"
              sortable
              width="130">
            </el-table-column>
            <el-table-column
              prop="role"
              label="下棋方"
              width="130">
            </el-table-column>
            <el-table-column
              prop="step"
              label="落子位置"
              width="130">
            </el-table-column>
          </el-table>
      </div>
    </transition>
  </div>
</template>

<script>
  import confirmBox from './confirmBox'
  import store from '../store/store'
  import fireworks from './fireworks'
  export default {
    name: 'Board',
    components: {
      'confirmBox': confirmBox,
      'fireworks': fireworks
    },
    computed: {
      tableData () {
        const arr = []
        for (let index = 0, len = this.state.steps.length; index < len; index++) {
          let role
          switch (this.state.steps[index].role) {
          case 1:role = '黑棋'
                 break
          case 2:role = '白棋'
                 break
          }
          arr.push({
            index: index,
            role: role,
            step: '[' + this.state.steps[index].position[0] + ', ' + this.state.steps[index].position[1] + ']'
          })
        }
        return arr
      }
    },
    data () {
      return {
        state: store.state,
        FirstMan: '我方',
        isBegin: false,
        isWaiting: false,
        isEnd: false,
        isFirst: true,
        showStep: true,
        button_type: 'success',
        button_icon: 'el-icon-check',
        button_text: '开局'
      }
    },
    methods: {
      defaultClick (e) {
        this.$refs.confirmBox.notify('失败', '当前位置已经有棋子辣', 'warning')
        e.preventDefault()
        e.stopPropagation()
      },
      boardClick (e) {
        if (!this.isBegin || this.isEnd) {
          return
        }
        let y = e.offsetX
        let x = e.offsetY
        let width = this.$refs.board.clientWidth
        let offset = width * 0.044
        let step = width * 0.065
        x = Math.floor((x + offset) / step) - 1
        y = Math.floor((y + offset) / step) - 1
        this.setChess([x, y], this.state.role, e)
      },
      setChess (position, role, e) {
        // 放置棋子于棋盘上
        let x = position[0]
        let y = position[1]
        if (this.state.board[x][y] !== 0) {
          throw new Error('当前位置已经有棋子')
        }
        this.$refs.fireworks.clickThis(e.offsetX, e.offsetY)
        store.setStep({
          position: [x, y],
          role: role
        })
        console.log(this.state.board)
      },
      setFirst (isFirst) {
        this.isFirst = isFirst
        if (isFirst) {
          this.FirstMan = '我方'
          this.state.role = 1
        } else {
          this.FirstMan = '对方'
          this.state.role = 2
        }
      },
      confirmRestart (is) {
        if (is) {
          // 确认认输
          this.reBeginGame()
        }
      },
      beginGame () {
        if (this.isBegin) {
          if (this.isEnd) { // 游戏结束重新开盘
            this.reBeginGame()
          } else {
            // 游戏未结束触发弹出框
            this.$refs.confirmBox.open()
          }
          return
        }
        this.isBegin = true
        this.button_type = 'info'
        this.button_icon = 'el-icon-refresh'
        this.button_text = '重新开局'
      },
      reBeginGame () {
        this.isBegin = false
        this.button_type = 'success'
        this.button_icon = 'el-icon-check'
        this.button_text = '开局'
        store.init()
      },
      isLast (i, j) {
        if (this.state.steps.length === 0) {
          return false
        }
        const position = this.state.steps[this.state.steps.length - 1].position
        return i === position[0] && j === position[1]
      }
    }
  }
</script>

<style  scoped>
  #board-container {
    width: 37rem;
    height: 37rem;
    margin: 0 auto;
    float: left;
    position: relative;
    background-image: url("/static/img/board.jpg");
    background-size: 100%;
  }
  #panel-container {
    width: 7rem;
    height: 37rem;
    margin-left: 5%;
    margin-top: 5%;
    float: left;
  }
  #steps-container {
    float: right;
    position: center;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .check-button {
    margin-top: 40%;
  }
  .chessman, .step {
    position: absolute;
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    border-radius: 50%;
    font-size: 1.2rem;
    user-select: none;
  }
  .chessman {
    top: 0;
    bottom: 0;
    background-color: black;
  }
  .white {
    background-color: white;
  }
  .step {
    color: black;
  }
  .wh {
    color: white;
  }
  .last-step {
    box-shadow: 0 0 0 .4rem rgba(255, 0, 0, 0.4);
    animation: pulse 1.2s infinite;
  }
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.8);
    }
    70% {
      box-shadow: 0 0 0 .6rem rgba(255, 0, 0, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
    }
  }
  .fade-enter-active {
    transition: all .3s ease;
  }
  .fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .fade-enter, .fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }

  .test-enter,
  .test-leave-to{
    opacity: 0;
    transform: translateX(100px);
  }
  .test-enter-active,
  .test-leave-active{
    transition: all 1s ease;
  }

  .font-enter-active, .font-leave-active {
    transition: opacity .5s;
  }
  .font-enter, .font-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
