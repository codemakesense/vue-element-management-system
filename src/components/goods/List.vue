<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索与添加商品区域 -->
      <el-row>
        <el-col :span="8" class="searchArea">
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表区域 -->
      <el-table :data="goodsList" border style="width: 100%" stripe>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="120"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="100"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="150">
          <template v-slot="scope">{{ scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <!-- 操作区域 -->
        <el-table-column label="操作" width="120">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.goods_id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[20, 50, 100, 200]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 编辑对话框区域 -->
    <el-dialog title="编辑商品" :visible.sync="editDialogVisible" width="50%">
      <el-form
        :model="editGoodsForm"
        :rules="editGoodsRules"
        ref="editGoodsFormRef"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodsForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editGoodsForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editGoodsForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editGoodsForm.goods_number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 请求到的商品列表
      goodsList: [],
      // 请求对象
      queryInfo: {
        query: '',
        // 当前的页码
        pagenum: 1,
        // 每页显示的条数
        pagesize: 10
      },
      // 所有的数据项
      total: 1,
      // 控制编辑对话框的显示
      editDialogVisible: false,
      // 编辑商品表单对象
      editGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0
      },
      // 编辑商品表单验证对象
      editGoodsRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      goodsId: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品数据列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 监听 pageSize 改变事件
    handleSizeChange(pageSize) {
      this.queryInfo.pagesize = pageSize
      this.getGoodsList()
    },
    // 监听页码改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 通过ID删除商品
    async removeById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message('已取消删除商品')
      }
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败！')
      }
      this.$message.success('删除商品成功！')
      this.getGoodsList()
    },
    // 点击按钮跳转到添加商品页面
    goAddPage() {
      this.$router.push('/goods/add')
    },
    // 点击展示编辑商品对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据失败')
      }
      this.editGoodsForm = res.data
      this.editDialogVisible = true
      this.goodsId = id
    },
    // 点击确认提交编辑后的商品信息
    async editGoods() {
      const { data: res } = await this.$http.put(
        `goods/${this.goodsId}`,
        this.editGoodsForm
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改商品信息失败！')
      }
      this.getGoodsList()
      this.editDialogVisible = false
      this.$message.success('修改商品信息成功！')
    }
  }
}
</script>
<style lang="less" scoped>
.searchArea {
  margin-right: 20px;
}
.gutter {
  border: 0;
}
.el-table {
  margin-top: 15px;
}
</style>
