<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索输入框区 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="orderList" border>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="100">
          <template v-slot="scope">
            <el-tag v-if="scope.row.pay_status === '1'" type="success">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100">
          <template v-slot="scope">{{ scope.row.is_send }}</template>
        </el-table-column>
        <el-table-column label="下单时间" width="160">
          <template v-slot="scope">{{ scope.row.create_time | dateFormat }}</template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template v-slot="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改地址"
              placement="top"
              :enterable="false"
            >
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditeBox"></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="物流信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-location"
                size="mini"
                @click="showProgressBox"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editeDialogVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRes"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="adress1">
          <!-- 省市区/县级联选择器 -->
          <el-cascader :options="cityDate" v-model="addressForm.adress1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="adress2">
          <el-input v-model="addressForm.adress2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editeDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流信息的对话框 -->
    <el-dialog title="物流信息" :visible.sync="progressDialogVisible" width="50%">
      <!-- Timeline 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in progressInfo"
          :key="index"
          :timestamp="item.time"
        >{{item.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityDate from './citydata.js'
export default {
  data() {
    return {
      // http请求的查询对象
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      },
      // 订单列表信息，按 pagesize 和 pagenum 进行查询
      orderList: [],
      // 订单列表的总项数
      total: 1,
      // 控制修改地址对话框的隐藏与显示
      editeDialogVisible: false,
      // 保存地址表单的对象
      addressForm: {
        adress1: [],
        adress2: ''
      },
      // 地址表单的验证规则对象
      addressFormRules: {
        adress1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        adress2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 全国城市信息
      cityDate,
      // 控制物流信息对话框显示与隐藏
      progressDialogVisible: false,
      // 物流信息数组
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取订单数据失败！')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // 监听 pageSIze 改变事件
    handleSizeChange(pageSize) {
      this.queryInfo.pagesize = pageSize
      this.getOrderList()
    },
    // 监听页码改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 展示修改地址的对话框
    showEditeBox() {
      this.editeDialogVisible = true
    },
    // 关闭修改地址对话框时清空表单内容
    addressDialogClosed() {
      this.$refs.addressFormRes.resetFields()
    },
    // 显示物流信息对话框
    async showProgressBox() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败！')
      }
      this.progressInfo = res.data
      console.log(this.progressInfo)
      this.progressDialogVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
table.el-table__body {
  margin: 0;
}
.el-cascader {
  width: 100%;
}
.el-table {
  margin-top: 15px;
}
</style>
