<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-button type="primary" @click="showAddDialog">添加角色</el-button>
      <!-- 角色列表区域 -->
      <el-table border stripe :data="rolesList">
        <!-- 展开行 -->
        <el-table-column type="expand" width="50" label="详情">
          <template v-slot="scope">
            <!-- 渲染一级权限 -->
            <el-row
              :key="item1.id"
              v-for="(item1, i1) in scope.row.children"
              :class="['bdbottom', i1 === 0 ? 'bdtop': '', 'vcenter']"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限 -->
                    <el-tag
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >{{ item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="序列" width="50"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="deleteRole(scope.row.id)"
            >删除</el-button>
            <el-button
              icon="el-icon-setting"
              type="warning"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框区域 -->
    <el-dialog
      :title="operateType.name + '角色'"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="dialogClosed"
    >
      <!-- 添加角色验证表单区域 -->
      <el-form :model="addRoleForm" :rules="addRoleRules" ref="addRoleFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="operateType.method==='add'? addRole():editRole()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件展示区 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 通过 http 请求获取的角色列表数据
      rolesList: [],
      // 操作类型对象： 添加还是编辑
      operateType: {
        name: '',
        method: ''
      },
      // 添加或编辑角色的表单对象
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色的表单验证对象
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 通过 http 请求获取的所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象，用于确定值的传递规则
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 展开树时默认选中的节点ID值
      defKeys: [105, 116],
      // 当前即将分配权限的角色ID
      roleId: '',
      // 控制添加角色对话框的显示
      addRoleDialogVisible: false
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = res.data
      console.log(this.rolesList)
    },
    // 根据ID删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm('是否确认删除权限？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message('取消了删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      // this.getRolesList()
      role.children = res.data
      this.$message.success('删除权限成功')
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 通过 http 请求获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      // 把获取到的权限数据保存到 data 中
      this.rightsList = res.data
      //  递归获取三级节点的 ID
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取所有角色下三级权限的ID，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      // 将准备 post 给后台的权限分配ID保存到 keys中
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 为 keys 以 字符串 ',' 分隔
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }
      this.$message.success('分配权限成功！')
      // 刷新角色列表
      this.getRolesList()
      // 关闭对话框
      this.setRightDialogVisible = false
    },
    // 点击显示添加角色的对话框
    showAddDialog() {
      this.operateType.name = '添加'
      this.operateType.method = 'add'
      this.addRoleDialogVisible = true
    },
    // 点击按钮确认添加角色
    async addRole() {
      const { data: res } = await this.$http.post('roles', this.addRoleForm)
      if (res.meta.status !== 201) {
        return this.$message.error('添加角色失败！')
      }
      this.getRolesList()
      this.addRoleDialogVisible = false
      this.$message.success('添加角色成功！')
    },
    // 监听添加/编辑角色对话框关闭事件
    dialogClosed() {
      this.$refs.addRoleFormRef.resetFields()
      this.addRoleForm = {}
    },
    // 点击显示编辑角色对话框
    async showEditDialog(id) {
      this.operateType.name = '编辑'
      this.operateType.method = 'edit'
      this.roleId = id
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败！')
      }
      this.addRoleForm = res.data
      console.log(this.addRoleForm)
      this.addRoleDialogVisible = true
    },
    // 点击确定提交编辑角色操作
    async editRole() {
      console.log(this.addRoleForm.id)
      const { data: res } = await this.$http.put(`roles/${this.roleId}`, {
        roleName: this.addRoleForm.roleName,
        roleDesc: this.addRoleForm.roleDesc
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改角色失败！')
      }
      this.getRolesList()
      this.addRoleDialogVisible = false
      this.$message.success('修改角色成功！')
    },
    // 点击按钮删除角色
    deleteRole(id) {
      this.$http.delete(`roles/${id}`).then(res => {
        const response = res.data
        if (response.meta.status !== 200) {
          this.$message.error('删除角色失败！')
        }
        this.getRolesList()
        this.$message.success('删除角色成功！')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
.el-table{
  margin-top: 15px;
}
</style>
