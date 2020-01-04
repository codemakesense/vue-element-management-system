<template>
  <div class="home-container">
    <!-- 首页中部用户信息相关区域 -->
    <el-row :gutter="20" class="mgb20">
      <!-- 用户区域 -->
      <el-col :span="8">
        <!-- 用户登录信息区域 -->
        <div class="user-content">
          <el-card class="mgb20" style="height:260px" shadow="hover">
            <div slot="header" class="clearfix">
              <div class="user-info">
                <div class="user-info-avatar"></div>
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
              <div v-if="loginInfo.time==='您是第一次登录'" class="login-info-time">
                <span class="login-text">上次登录的时间:</span>
                {{ loginTime }}
              </div>
              <div v-else class="login-info-time">
                <span class="login-text">上次登录的时间:</span>
                <span>{{ loginInfo.time | dateFormat }}</span>
              </div>
              <div>
                <span class="login-text">上次登录的地点:</span>
                <span>中国广东省</span>
              </div>
            </div>
          </el-card>
        </div>
        <!-- 个人技能区域 -->
        <div class="language-progress">
          <el-card style="height:260px" shadow="hover">
            <div slot="header" class="clearfix">
              <span class="language-progress-title">语言情况</span>
            </div>Vue
            <el-progress :percentage="70" color="#42b983"></el-progress>JavaScript
            <el-progress :percentage="50" color="#f1e05a"></el-progress>CSS
            <el-progress :percentage="30"></el-progress>HTML
            <el-progress :percentage="10" color="#f56c6c"></el-progress>
          </el-card>
        </div>
      </el-col>
      <!-- 商品数据信息区域 -->
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <!-- PV 访问量 / 订单数量 / 商品数量 -->
          <el-col :span="8" v-for="(item, i) in keyData" :key="i">
            <el-card :body-style="{padding: '0px'}" shadow="hover">
              <div class="data-box">
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
        <div class="todo-box">
          <!-- 表单验证区域 -->
          <el-form>
            <el-card style="height:420px" shadow="hover" 退出登录>
              <div slot="header" class="clearfix list-header">
                <!-- 列表头部区域 -->
                <span class="todo-box-title">待办事项</span>
                <!-- 添加待办事项区域 -->
                <el-input
                  v-if="addInputVisible"
                  @keyup.enter.native="$event.target.blur"
                  @blur="handleAddConfirm"
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
                      @blur="handleEditConfirm(scope.row,scope.$index)"
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
        </div>
      </el-col>
    </el-row>
    <!-- 下方 echarts 图表区域 -->
    <el-row :gutter="20" class="chart-container">
      <el-col :span="12">
        <el-card>
          <div class="bar-chart charts" id="main-bar"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div class="line-chart charts" id="main-line"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// 引入echarts插件
import echarts from 'echarts'

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
          title: '今天要修复100个BUG！',
          inputVisible: false,
          isDone: false
        },
        {
          title: '10点前完成订单数据分析。',
          inputVisible: false,
          isDone: true
        },
        {
          title: '14点前提交用户画像报告。',
          inputVisible: false,
          isDone: false
        },
        {
          title: '下班前完成图表功能开发。',
          inputVisible: false,
          isDone: true
        },
        {
          title: '周四前提交本周工作总结。',
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
      editInputRef: '',
      // 柱状图配置和数据对象
      barOption: {
        title: {
          text: '服装日销量'
        },
        tooltip: {},
        legend: {},
        dataset: {
          source: [
            ['product', '风衣', '高跟鞋', '包包'],
            ['1月1日', '40', '30', '50'],
            ['1月2日', '30', '20', '40'],
            ['1月3日', '20', '50', '10'],
            ['1月4日', '34', '52', '17'],
            ['1月5日', '35', '28', '15']
          ]
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {},
        grid: { bottom: '10%' },
        series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
      },
      // 折线图配置和数据对象
      lineOption: {
        title: {
          text: '服装总销量趋势'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['风衣', '高跟鞋', '包包', '手表']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '风衣',
            type: 'line',
            stack: '总量',
            data: [120, 132, 250, 134, 90, 250, 210]
          },
          {
            name: '高跟鞋',
            type: 'line',
            stack: '总量',
            data: [220, 182, 291, 234, 290, 360, 310]
          },
          {
            name: '包包',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 370, 210]
          },
          {
            name: '手表',
            type: 'line',
            stack: '总量',
            data: [320, 332, 301, 334, 390, 380, 320]
          }
        ]
      }
    }
  },
  created() {
    // 获取登录信息
    this.getLoginInfo()
    // 获取待办信息
    this.getTodoList()
  },
  mounted() {
    // 初始化echarts实例
    const barChart = echarts.init(document.getElementById('main-bar'), 'light')
    const lineChart = echarts.init(document.getElementById('main-line'), 'light')
    barChart.setOption(this.barOption)
    lineChart.setOption(this.lineOption)
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
    handleAddConfirm() {
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
    handleEditConfirm(row, index) {
      let oldList = JSON.parse(window.localStorage.getItem('todoList'))
      let oldItem = oldList[index].title
      if (row.title.trim().length === 0) {
        return this.$message.error('请输入待办事项！')
      } else if (row.title === oldItem) {
        row.inputVisible = false
        return
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
.el-input {
  width: 200px;
}

// 通用外底边距20px
.mgb20 {
  margin-bottom: 20px;
}

.user-content {
  .user-info {
    color: #283747;
    display: flex;
    align-items: center;

    .user-info-avatar {
      border-radius: 50%;
      min-width: 100px;
      min-height: 100px;
      background-image: url(http://img3.52toys.com/a8c9106044686e987259af7d79ff2e36);
      background-position: 20% 80%;
      background-size: 160px;
      background-repeat: no-repeat;
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
    font-size: 15px;
    color: grey;

    .login-text {
      margin-right: 30px;
      font-weight: bold;
    }

    .login-info-time {
      margin-bottom: 15px;
    }
  }
}

.language-progress {
  .language-progress-title {
    font-weight: bold;
  }
}

.data-box {
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

.todo-box {
  .todo-box-title {
    font-weight: bold;
  }

  .addInput {
    float: right;
  }

  .todo-list {
    .todo-text {
      font-size: 14.5px;
      color: #34495e;
    }

    .todo-text-done {
      text-decoration: line-through;
      color: #999;
    }
  }
}

.chart-container {
  .el-card {
    display: flex;
    align-items: center;
    justify-content: center;

    .charts {
      width: 550px;
      height: 280px;
    }
  }
}
</style>
