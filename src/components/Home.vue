<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="header-left">
        <div class="toggle-button" @click="toggleCollapse">
          <i :class="collapseIcon"></i>
        </div>
        <div class="title-text">后台管理系统</div>
      </div>
      <!-- 右边用户头像区域 -->
      <div class="header-right">
        <!-- 用户头像区域 -->
        <div class="user-info-avatar"></div>
        <!-- 下拉菜单区域 -->
        <el-dropdown trigger="click">
          <span class="el-dropdown-link" style="color:white">
            admin
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-link
                href="https://github.com/codemakesense/vue-element-management-system.git"
                target="_blank"
                :underline="false"
              >项目仓库</el-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <span @click="signOut">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#324157"
          text-color="#D5D8DC"
          active-text-color="#20a0ff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <!-- 前端添加数据 -->
          <el-menu-item @click="saveNavState('/welcome')" index="/welcome">
            <i class="iconfont iconhome" style="font-size: 26px"></i>
            <span class="menu-item-text">{{ otherMenuItem.welcome.authName }}</span>
          </el-menu-item>
          <!-- 后台拉取数据 -->
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
      isCollapse: true,
      // 被激活的链接地址
      activePath: '',
      collapseIcon: 'el-icon-s-fold',
      // 手动添加的菜单项
      otherMenuItem: {
        welcome: {
          authName: '系统首页',
          id: 98
        },
        practise: {
          authName: '功能练习',
          id: 99,
          children: [
            {
              authName: '拖拽组件',
              id: 89,
              path: 'drag'
            }
          ]
        }
      }
    }
  },
  created() {
    // 页面创建的时候获取列表
    this.getMenuList()
    // 页面创建的时候获取被激活的子菜单的地址
    this.getActivePath()
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
      this.menulist.push(this.otherMenuItem.practise)
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
    },
    // 获取默认激活的菜单
    getActivePath() {
      let pathInSession = window.sessionStorage.getItem('activePath')
      if (pathInSession !== null) {
        this.activePath = pathInSession
      } else if (pathInSession === null) {
        this.activePath = '/welcome'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
  min-width: 1000px;
}
.el-header {
  background-color: #242f42;
  display: flex;
  justify-content: space-between;
  font-size: 22px;
  color: white;
  align-items: center;
  padding: 0;

  .header-left {
    display: flex;
    align-items: center;

    .title-text {
      font-size: 18px;
      padding-bottom: 2px;
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

  .header-right {
    margin-right: 20px;
    font-size: 15px;
    display: flex;
    width: 150px;
    height: 60px;
    align-items: center;
    justify-content: space-evenly;

    .user-info-avatar {
      border-radius: 50%;
      width: 35px;
      height: 35px;
      background-image: url(http://img3.52toys.com/a8c9106044686e987259af7d79ff2e36);
      background-position: 20% 80%;
      background-size: 55px;
      background-repeat: no-repeat;
    }

    .el-dropdown {
      cursor: pointer;
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

  .menu-item-text {
    margin-left: 4px;
  }
}

.el-main {
  background-color: #f0f0f0;
}
</style>
