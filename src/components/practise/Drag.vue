<template>
  <div>
    <el-card>
      <!-- 开源组件链接区域 -->
      <el-alert title="功能引用说明" type="info" :closable="false" show-icon>
        拖拽功能由开源组件VueDraggable（基于Sortable.js）提供，Github地址为
        <el-link
          type="primary"
          href="https://github.com/SortableJS/Vue.Draggable"
          target="_blank"
        >Vue.Draggable</el-link>
      </el-alert>
      <div class="draggable-container">
        <!-- 待办区域 -->
        <div class="todo-board">
          <p class="board-title">Todo</p>
          <draggable
            v-model="todoList"
            :group="todoGroupOption"
            ghost-class="ghost"
            animation="200"
            class="draggable-box"
            @remove="removeHandle"
            id="Todo"
          >
            <div v-for="(item, i) in todoList" :key="i" class="draggable-items">{{ item.title }}</div>
          </draggable>
        </div>
        <!-- 开发中区域 -->
        <div class="doing-board">
          <p class="board-title">Doing</p>
          <draggable
            v-model="doingList"
            :group="doingGroupOption"
            ghost-class="ghost"
            animation="200"
            class="draggable-box"
            ref="doingBoxRef"
            @remove="removeHandle"
            id="Doing"
          >
            <div v-for="(item, i) in doingList" :key="i" class="draggable-items">{{ item.title }}</div>
          </draggable>
        </div>
        <!-- 已完成区域 -->
        <div class="done-board">
          <p class="board-title">Done</p>
          <draggable
            v-model="doneList"
            :group="doneGroupOption"
            ghost-class="ghost"
            animation="200"
            class="draggable-box"
            @remove="removeHandle"
            id="Done"
          >
            <div v-for="(item, i) in doneList" :key="i" class="draggable-items">{{ item.title }}</div>
          </draggable>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  data() {
    return {
      todoList: [
        {
          title: '开发首页组件'
        },
        {
          title: '开发用户组件'
        },
        {
          title: '开发商品组件'
        },
        {
          title: '开发权限组件'
        }
      ],
      doingList: [
        {
          title: '开发数据统计组件'
        },
        {
          title: '测试最新功能'
        }
      ],
      doneList: [
        {
          title: '开发登录组件'
        },
        {
          title: '开发应用布局组件'
        },
        {
          title: '开发功能练习组件'
        }
      ],
      // todo区域配置对象
      todoGroupOption: {
        name: 'draggableBox'
      },
      // doing区域配置对象
      doingGroupOption: {
        name: 'draggableBox'
      },
      // done区域配置对象
      doneGroupOption: {
        name: 'draggableBox'
      }
    }
  },
  created() {},
  methods: {
    // 监控拖拽从一个列表到另一个列表结束事件
    removeHandle(evt) {
      this.$message.success(`从${evt.from.id} 移动到 ${evt.to.id}`)
    }
  }
}
</script>
<style lang="less" scoped>
.draggable-container {
  display: flex;
  align-items: center;
  justify-content: left;

  .todo-board,
  .doing-board,
  .done-board {
    max-width: 320px;
    min-width: 300px;
    height: 500px;
    margin: 20px 10px;
    background-color: #eff1f5;
    border-radius: 5px;
    border: 1px solid #d6dbdf;

    .board-title {
      margin-left: 20px;
      font-weight: bold;
    }

    .draggable-box {
      height: 500px;
      overflow-y: scroll;
      -ms-overflow-style: none;
      overflow: -moz-scrollbars-none;
    }

    .draggable-box::-webkit-scrollbar {
      width: 0px;
    }

    .draggable-items {
      border: 1px solid #d6dbdf;
      margin: 10px 15px;
      padding-left: 20px;
      line-height: 45px;
      height: 45px;
      background-color: white;
      border-radius: 5px;
      cursor: pointer;
    }

    .draggable-items:hover {
      border: 1px solid #3498db;
    }
  }

  .ghost {
    color: white;
  }
}
</style>
