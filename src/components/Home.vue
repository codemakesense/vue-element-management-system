<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <div class="toggle-button" @click="toggleCollapse">
          <i :class="collapseIcon"></i>
        </div>
        <div>后台管理系统</div>
        <img src="../assets/logo.png" alt="图标" />
      </div>
      <!-- 退出登录 -->
      <el-button type="info" size="medium" @click="signOut">登出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#324157"
          text-color="#fff"
          active-text-color="#20a0ff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
            class="sub-menu"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区域 -->
      <el-main>
        <!-- Welcome 组件路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconObj: {
        '125': 'el-icon-user',
        '103': 'el-icon-lock',
        '101': 'el-icon-goods',
        '102': 'el-icon-tickets',
        '145': 'el-icon-pie-chart',
        '99': 'el-icon-magic-stick'
      },
      // 默认不折叠菜单
      isCollapse: false,
      // 被激活的链接地址
      activePath: '',
      collapseIcon: 'el-icon-s-fold',
      // 手动添加的菜单项
      otherMenuItem: {
        authName: '功能练习',
        id: 99,
        children: [{ authName: '拖拽组件', id: 89, path: 'drag' }]
      }
    }
  },
  created() {
    // 页面创建的时候获取列表
    this.getMenuList()
    // 页面创建的时候获取被激活的子菜单的地址
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    signOut() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(this.menulist)
      this.menulist.push(this.otherMenuItem)
    },
    // 点击按钮，切换菜单的 折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
      if (this.collapseIcon === 'el-icon-s-fold') {
        this.collapseIcon = 'el-icon-s-unfold'
      } else if (this.collapseIcon === 'el-icon-s-unfold') {
        this.collapseIcon = 'el-icon-s-fold'
      }
    },
    // 点击按钮，将点击的子菜单路径保存到 sessionStorage
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #242f42;
  display: flex;
  justify-content: space-between;
  font-size: 22px;
  color: white;
  align-items: center;
  padding: 0;
  div {
    display: flex;
    align-items: center;
    img {
      width: 22px;
      height: 22px;
      margin-left: 12px;
    }
    .toggle-button {
      width: 64px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .toggle-button:hover {
      background-color: #454e5e;
    }
  }
  .el-button {
    margin-right: 15px;
    border: none;
  }
}
.el-aside {
  background-color: #324157;
  // 左侧菜单右边框优化对齐
  .el-menu {
    border-right: none;
  }
  // .sub-menu {
  //   width: 200px;
  // }
}
.el-main {
  background-color: #eaedf1;
}
</style>
