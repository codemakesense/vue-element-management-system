<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="user-content">
          <!-- 用户登录信息区域 -->
          <el-card class="mgb20" style="height:260px">
            <div slot="header" class="clearfix">
              <div class="user-info">
                <div class="user-info-img">
                  <img src="../assets/艾斯.jpg" alt srcset />
                </div>
                <div class="user-info-label">
                  <div>Simon</div>
                  <div class="user-info-label-github">
                    <span>Github:</span>
                    <a
                      href="http://github.com/codemakesense"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src="../assets/github.jpg" alt />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="login-info">
              <div
                v-if="loginInfo.time==='您是第一次登录'"
                class="login-info-time"
              >您上次登录的时间：{{ loginTime }}</div>
              <div v-else class="login-info-time">
                您上次登录的时间：
                <span>{{ loginInfo.time | dateFormat }}</span>
              </div>
              <div>
                您上次登录的地点：
                <span>星辰大海！</span>
              </div>
            </div>
          </el-card>
        </div>
        <!-- 个人技能区域 -->
        <el-row>
          <el-card style="height:260px">
            <div slot="header" class="clearfix">
              <span>语言情况</span>
            </div>Vue
            <el-progress :percentage="70" color="#42b983"></el-progress>JavaScript
            <el-progress :percentage="50" color="#f1e05a"></el-progress>CSS
            <el-progress :percentage="30"></el-progress>HTML
            <el-progress :percentage="10" color="#f56c6c"></el-progress>
          </el-card>
        </el-row>
      </el-col>
      <!-- 数据信息区域 -->
      <el-col :span="16">
        <el-row :gutter="20">
          <!-- PV 访问量 / 订单数量 / 商品数量 -->
          <el-col :span="8" v-for="(item, i) in keyData" :key="i">
            <el-card :body-style="{padding: '0px'}">
              <div class="data-count">
                <i :class="item.icon"></i>
                <div class="data-text">
                  <div class="data--text-num">{{ item.count }}</div>
                  <div class="data-name">{{ item.title}}</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <!-- 待办列表区域 -->
        <el-row>
          <!-- 表单验证区域 -->
          <el-form>
            <el-card style="height:420px">
              <div slot="header" class="clearfix list-header">
                <!-- 列表头部区域 -->
                <span>待办事项</span>
                <!-- 添加待办事项区域 -->
                <el-input
                  v-if="addInputVisible"
                  @keyup.enter.native="$event.target.blur"
                  @blur="handleAddInputConfirm"
                  v-model="addInputValue"
                  size="small"
                  class="addInput"
                  placeholder="请输入待办事项"
                  ref="addInputRef"
                ></el-input>
                <el-button
                  v-else
                  style="float: right; padding: 3px 0; font-weight:bold"
                  type="text"
                  @click="showAddInput"
                >添加待办</el-button>
              </div>
              <!-- 列表主体区域 -->
              <el-table :show-header="false" :data="localList" class="todo-list" height="300">
                <el-table-column width="50">
                  <template v-slot="scope">
                    <el-checkbox v-model="scope.row.isDone" @change="toggleIsDone(scope.row)"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template v-slot="scope">
                    <!-- 点击切换编辑输入框 -->
                    <el-input
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.title"
                      @keyup.enter.native="$event.target.blur"
                      @blur="handleInputConfirm(scope.row)"
                      size="small"
                      ref="editInputRef"
                    ></el-input>
                    <div
                      v-else
                      class="todo-text"
                      :class="{'todo-text-done': scope.row.isDone}"
                    >{{ scope.row.title}}</div>
                  </template>
                </el-table-column>
                <el-table-column width="100">
                  <template v-slot="scope">
                    <!-- 编辑按钮 -->
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      circle
                      size="mini"
                      class="todo-btn btn-edit"
                      @click="showEditInput(scope.row)"
                    ></el-button>
                    <!-- 删除按钮 -->
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      size="mini"
                      class="todo-btn"
                      @click="deleteItem(scope.$index)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-form>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 记录登录时间和登录地点
      loginInfo: {
        loginTime: '',
        // 未完成的功能
        loginLocation: ''
      },
      // 记录 PV 访问量 / 订单数量 / 商品数量
      keyData: [
        {
          title: '用户访问量',
          count: '10000',
          icon: 'el-icon-user'
        },
        {
          title: '订单数量',
          count: '20000',
          icon: 'el-icon-shopping-cart-2'
        },
        {
          title: '商品数量',
          count: '30000',
          icon: 'el-icon-shopping-bag-2'
        }
      ],
      // 初始的代办列表
      todoList: [
        {
          title: '今天要吃100个汉堡包！',
          inputVisible: false,
          isDone: false
        },
        {
          title: '今天要吃101个汉堡包！',
          inputVisible: false,
          isDone: true
        },
        {
          title: '今天要吃102个汉堡包！',
          inputVisible: false,
          isDone: false
        },
        {
          title: '今天要吃103个汉堡包！',
          inputVisible: false,
          isDone: true
        },
        {
          title: '今天要吃104个汉堡包！',
          inputVisible: false,
          isDone: true
        }
      ],
      // 缓存在本地的待办列表
      localList: [],
      checked: [],
      // 控制添加输入框的显示
      addInputVisible: false,
      // 添加的待办事项
      addItem: {
        title: '',
        inputVisible: false,
        isDone: false
      },
      addInputValue: '',
      // 动态保存获得焦点的 edit input 的 ref
      editInputRef: ''
    }
  },
  created() {
    this.getLoginInfo()
    this.getTodoList()
  },
  methods: {
    getLoginInfo() {
      let lastTime = window.localStorage.getItem('lastLoginTime')
      this.loginInfo.time = lastTime
    },
    // 获取 localStorage 中的待办列表
    getTodoList() {
      if (window.localStorage.getItem('todoList') === null) {
        let str = JSON.stringify(this.todoList)
        window.localStorage.setItem('todoList', str)
        this.localList = this.todoList
        return
      }
      this.localList = JSON.parse(window.localStorage.getItem('todoList'))
    },
    // 点击按钮删除待办事项
    deleteItem(index) {
      this.localList.splice(index, 1)
      let str = JSON.stringify(this.localList)
      window.localStorage.setItem('todoList', str)
      this.getTodoList()
      this.$message.success('删除待办事项成功！')
    },
    // 点击显示添加待办输入框
    showAddInput() {
      this.addInputVisible = true
      // 通过 $nextTick() 异步执行输入框 focus方法
      this.$nextTick(() => {
        this.$refs.addInputRef.$refs.input.focus()
      })
    },
    // 监听添加待办 input 回车获失去焦点事件，添加待办事项
    handleAddInputConfirm() {
      // 如果输入框为空则不添加到localStorage中
      if (this.addInputValue.trim().length === 0) {
        this.addInputValue = ''
        this.addInputVisible = false
        console.log('ok')
        return
      }
      this.addItem.title = this.addInputValue
      this.localList.push(this.addItem)
      let str = JSON.stringify(this.localList)
      window.localStorage.setItem('todoList', str)
      this.getTodoList()
      this.addInputValue = ''
      this.addInputVisible = false
      this.$message.success('添加待办事项成功！')
    },
    // 点击显示编辑输入框
    // 1.点击编辑框 2.拿到当前的ref 3.执行异步 $nextTick 方法
    showEditInput(row) {
      row.inputVisible = true
      this.$nextTick(() => {
        this.$refs.editInputRef.$refs.input.focus()
      })
    },
    // 确认提交编辑待办列表
    handleInputConfirm(row) {
      if (row.title.trim().length === 0) {
        return alert('请输入待办事项')
      }
      row.inputVisible = false
      let str = JSON.stringify(this.localList)
      window.localStorage.setItem('todoList', str)
      this.$message.success('修改待办事项成功！')
    },
    // 点击复选框将data中的localList的isDone保存到localStorage中
    toggleIsDone() {
      let str = JSON.stringify(this.localList)
      window.localStorage.setItem('todoList', str)
    }
  }
}
</script>
<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
}

.el-input {
  width: 200px;
}

.addInput {
  float: right;
}

.mgb20 {
  margin-bottom: 20px;
}

.user-content {
  .user-info {
    color: #283747;
    display: flex;
    align-items: center;

    .user-info-img {
      img {
        border-radius: 50%;
        width: 100px;
        height: 100px;
      }
    }

    .user-info-label {
      margin: 0 0 0 40px;
      color: #283747;

      div {
        font-size: 25px;
        font-weight: bold;
      }
      .user-info-label-github {
        display: flex;
        span {
          height: 100%;
          font-size: 20px;
          font-weight: bold;
          line-height: 40px;
        }

        img {
          margin-left: 15px;
          width: 80px;
        }
      }
    }
  }
  .login-info {
    .login-info-time {
      margin-bottom: 20px;
    }
    span {
      font-weight: bold;
    }
  }
}

.data-count {
  display: flex;
  align-items: center;
  height: 100px;

  .el-icon-user,
  .el-icon-shopping-cart-2,
  .el-icon-shopping-bag-2 {
    height: 100px;
    width: 100px;
    font-size: 50px;
    color: #fff;
    text-align: center;
    line-height: 100px;
  }

  .data-text {
    flex: auto;
    font-size: 15px;
    text-align: center;
    justify-content: center;

    .data--text-num {
      font-size: 25px;
      font-weight: bold;
      color: #28b463;
    }

    .data-name {
      color: #85929e;
    }
  }

  .el-icon-user {
    background-color: #3498db;
  }

  .el-icon-shopping-cart-2 {
    background-color: #e67e22;
  }

  .el-icon-shopping-bag-2 {
    background-color: #e74c3c;
  }
}

.progress {
  display: flex;
  justify-content: space-evenly;

  .progress-item {
    text-align: center;
  }
}
.todo-list {
  .todo-text {
    font-size: 14.5px;
    font-weight: bold;
    color: #34495e;
  }
  .todo-text-done {
    text-decoration: line-through;
    color: #999;
  }
}
</style>
