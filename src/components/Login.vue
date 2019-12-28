<template>
  <div class="login-container">
    <vue-particles
      class="active-bgd"
      color="#fff"
      :particleOpacity="0.7"
      :particlesNumber="60"
      shapeType="circle"
      :particleSize="4"
      linesColor="#fff"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="2"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    ></vue-particles>
    <div class="left-box"></div>
    <div class="login-box">
      <!-- 头像区域 -->
      <!-- <div class="avatar-box">
        <img src="../assets/艾斯.jpg" />
      </div>-->
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" class="login-form" :rules="loginFormRules" :model="loginForm">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <div class="login-label">用 户 名</div>
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username" class="inputArea"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <div class="login-label">密 码</div>
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
            class="inputArea"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <div class="login-btn">
            <el-button type="primary" @click="login" width="300" round>登 录</el-button>
          </div>
          <div class="reset-btn">
            <el-button type="info" @click="resetLoginForm" round>重 置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [{ required: true, message: '请输入登录名称', trigger: 'blur' }, { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        // 验证密码是否合法
        password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }, { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登录表单内容
    resetLoginForm() {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功!')
        // 1. 将登录成功之后的 token， 保存到客户端的 sessionStorage 中
        //  1.1 项目中除了登录之外的API接口，必须要登录之后才能访问
        //  1.2 token 只应当在浏览器会话阶段生效，关闭浏览器后应该失效，因此不能保存在 loacalStorage 中
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login-container {
  width: 100%;
  height: 100%;
  background-color: #ced3e9;
  background-size: cover;
  .active-bgd {
    height: 100%;
  }
}
.left-box {
  position: absolute;
  left: 36%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  height: 400px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 5px 5px 20px #919191;
  background-image: url('../assets/onepiece2.jpg');
  background-position-x: 60%;
}
.login-box {
  background-color: #fcfcfc;
  width: 320px;
  height: 500px;
  border-radius: 5px;
  position: absolute;
  left: 75%;
  top: 50%;
  opacity: 1;
  transform: translate(-50%, -50%);
  box-shadow: 5px 5px 20px #919191;
  .login-label {
    font-size: 20px;
    font-weight: bold;
    color: #566573;
  }
}
.login-form {
  margin-top: 20%;
  bottom: 0;
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
}
.login-btn {
  margin-top: 50px;
  button.el-button {
    background-color: #4694d6;
    border: none;
  }
}
.reset-btn {
  margin-top: 110px;
}
.el-button {
  position: absolute;
  transform: translate(-50%);
  left: 50%;
  width: 250px;
  font-size: 16px;
}
</style>
