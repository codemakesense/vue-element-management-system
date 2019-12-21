<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <div>
        <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      </div>
      <!-- 商品分类列表区 -->
      <!-- <el-table border :data="currentPageList" stripe>
        <el-table-column type="index" label="序列" width="100"></el-table-column>
        <el-table-column label="分类名称" prop="cat_name"></el-table-column>
        <el-table-column label="是否有效" prop="cat_deleted">
          <template v-slot="scope">
            <i class="{scope.row ? el-icon-circle-check : el-icon-circle-close}"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="cat_level"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>-->
      <!-- 商品分类列表区 -->
      <tree-table
        :data="currentPageList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="序列"
        border
        class="tree-table"
        :show-row-hover="false"
      >
        <!-- 是否有效列 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: green"></i>
          <i class="el-icon-error" v-else style="{color:" red }></i>
        </template>
        <!-- 排序列 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" size="mini" type="success">二级</el-tag>
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template slot="operate">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
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
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRefs"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <div class="block">
            <!-- options 用来指定数据源 -->
            <!-- props 用来指定配置对象 -->
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChange"
              clearable
              change-on-select
            ></el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 为 table 指定列的定义，tree-table插件用
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 将当前列定义为模板列
          type: 'template',
          // 当前这一列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 将当前列定义为模板列
          type: 'template',
          // 当前这一列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 将当前列定义为模板列
          type: 'template',
          // 当前这一列使用的模板名称
          template: 'operate'
        }
      ],
      // 从后台获取的商品分类列表
      cateList: [],
      // 当前的页码
      currentPage: 1,
      // 分页大小
      pageSize: 5,
      // 商品分类列表总量
      total: 0,
      // 当前页展示的分页数据
      currentPageList: [],
      // 按分页大小保存的所有商品分类数据
      totalPage: [],
      // 一共多少页
      pageNum: 1,
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类ID
        cat_pid: 0,
        // 当前默认添加分类的等级是1级分类
        cat_level: 0
      },
      // 添加分类表单验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        // 选定的值
        value: 'cat_id',
        // 选择器上看到的数据
        label: 'cat_name',
        // 通过 children 指定二级选择器
        children: 'children',
        // 次级菜单展开方式为 hover
        expandTrigger: 'hover'
      },
      // 选中的父级分类的ID数组
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 发起 http 请求获取商品分类列表数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！')
      }
      this.cateList = res.data
      this.total = this.cateList.length
      this.setCurrentPage()
    },
    // 对http请求回来的列表数据按分页进行保存，并获得当前页码的列表数据
    setCurrentPage() {
      // 根据后台数据的条数和每页显示的数量计算出一共几页
      this.pageNum = Math.ceil(this.cateList.length / this.pageSize) || 1
      // for 循环保存到 totalPage中
      for (let i = 0; i < this.pageNum; i++) {
        this.totalPage[i] = this.cateList.slice(
          this.pageSize * i,
          this.pageSize * (i + 1)
        )
      }
      // 根据 currentPage 值获取当前页码展示数据
      this.currentPageList = this.totalPage[this.currentPage - 1]
    },
    // 监听 pageSize 改变事件
    handleSizeChange(newSize) {
      this.pageSize = newSize
      // 重置当前页码为 1
      this.currentPage = 1
      // 重新按 pageSize 调用一次 setCurrentPage 方法
      this.setCurrentPage()
    },
    // 监听页码改变事件
    handleCurrentChange(newPage) {
      this.currentPage = newPage
      // 根据 newPage 获取当前页码的列表数据
      this.currentPageList = this.totalPage[newPage - 1]
    },
    // 点击按钮展示添加分类的对话框
    showAddCateDialog() {
      // 先获取数据，再展示对话框
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      this.parentCateList = res.data
    },
    // 选择项发生变化触发函数
    parentCateChange() {
      // 如果 selectKeys 数组中的 length > 0 代表选中了父级分类
      // 反之，没用选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 为父级ID赋值
        let length = this.selectedKeys.length
        this.addCateForm.cat_pid = this.selectedKeys[length - 1]
        // 为level赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 为父级ID赋值
        this.addCateForm.cat_pid = 0
        // 为level赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮，添加新的商品分类
    addCate() {
      this.$refs.addCateFormRefs.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品分类失败！')
        }
        this.$message.success('添加商品分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听对话框关闭事件，重置表单诗句
    addCateDialogClosed() {
      this.$refs.addCateFormRefs.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_level = 0
    }
  }
}
</script>
<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
