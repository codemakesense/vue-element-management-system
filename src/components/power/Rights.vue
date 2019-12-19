<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 权限列表区 -->
      <el-table border :data="currentPageList" stripe>
        <el-table-column type="index" label="序列" width="100"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 用户权限数据列表
      rightsList: [],
      // 请求信息
      queryInfo: {
        type: 'list',
        id: '',
        authName: ''
      },
      // 所有数据条数
      total: 0,
      // 用于分页的所有数据
      totalPage: [],
      // 每页展示的数据量
      pageSize: 5,
      // 一共几页
      pageNum: 1,
      // 当前页展示的数据
      currentPageList: [],
      // 当前页码
      currentPage: 1
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    // 通过 http 请求获取权限列表
    async getRightsList() {
      const { data: res } = await this.$http.get(
        'rights/' + this.queryInfo.type
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      // 将列表保存到内存中
      this.rightsList = res.data
      // 计算数据总数
      this.total = this.rightsList.length
      // 调用设置分页功能
      this.setPageList()
    },
    /* 第二种 http 请求方法， promise
    .get('rights/' + this.queryInfo.type, this.queryInfo)
    .then(res => {
      if (res.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      const response = res.data
      // 将列表保存到内存中
      this.rightsList = response.data
      this.total = this.rightsList.length
    */
    /* 第二种改变权限等级标签的方法，先在 created 阶段保存到 rightsList中， 添加两个新属性用于渲染
      往 rightsList 中添加两个属性 tagName 和 type
      this.rightsList.forEach((item, index) => {
        if (item.level === '0') {
          this.rightsList[index].tagName = '一级'
          this.rightsList[index].type = ''
        } else if (item.level === '1') {
          this.rightsList[index].tagName = '二级'
          this.rightsList[index].type = 'success'
        } else if (item.level === '2') {
          this.rightsList[index].tagName = '三级'
          this.rightsList[index].type = 'warning'
        }
      })
      })
      */
    // 在前端另外进行数据分页
    setPageList() {
      // 根据后台数据的条数和每页显示的数量计算出一共几页
      this.pageNum = Math.ceil(this.rightsList.length / this.pageSize) || 1
      // for 循环将后台请求的数组按页码分组保存到新的数组 totalPage 中
      for (let i = 0; i < this.pageNum; i++) {
        this.totalPage[i] = this.rightsList.slice(
          this.pageSize * i,
          this.pageSize * (i + 1)
        )
      }
      // 根据当前页码决定需要展示的内容
      this.currentPageList = this.totalPage[this.currentPage - 1]
    },
    // 监听 pagesize 改变事件
    handleSizeChange(newSize) {
      // console.log(newsize)
      this.pageSize = newSize
      this.currentPage = 1
      this.setPageList()
    },
    // 监听 页码值 改变事件
    handleCurrentChange(newPage) {
      // console.log(newpage)
      this.currentPage = newPage
      this.currentPageList = this.totalPage[newPage - 1]
    }
  }
}
</script>
<style lang="less" scoped>
</style>
