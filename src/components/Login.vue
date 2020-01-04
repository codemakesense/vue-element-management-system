<template>
  <!-- 布局区域 -->
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <!-- 动态背景区域 -->
      <vue-particles
        class="active-bgd"
        color="#3498DB"
        :particleOpacity="0.7"
        :particlesNumber="60"
        shapeType="circle"
        :particleSize="3"
        linesColor="#3498DB"
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
    </el-header>
    <!-- 中间内容区域 -->
    <el-main>
      <div class="login-container">
        <!-- 左侧图片区域 -->
        <div class="login-pic-1" v-if="showPicOrText===0">
          <p class="pic-info">插图来自网络</p>
        </div>
        <div class="login-pic-2" v-else-if="showPicOrText===1">
          <div class="login-pic-text">
            <p class="login-pic-title">因为热爱，所以前行。</p>
            <p>要使整个人生都过得舒适、愉快，</p>
            <p>这是不可能的，</p>
            <p>因为人类必须具备一种</p>
            <p>能应付逆境的态度。</p>
            <p>—— 卢梭</p>
            <p class="pics-info">插图来自网络</p>
          </div>
          <div class="login-pic-img img-1" :style="{ backgroundImage: `url(${picsURL})` }"></div>
        </div>
        <div class="login-pic-2" v-else-if="showPicOrText===2">
          <div class="login-pic-text">
            <p class="login-pic-title">因为热爱，所以前行。</p>
            <p>人生犹如一本书,</p>
            <p>愚蠢者草草翻过,</p>
            <p>聪明人细细阅读,</p>
            <p>为何如此,</p>
            <p>因为他们只能读它一次。</p>
            <p>—— 保罗</p>
            <p class="pics-info">插图来自网络</p>
          </div>
          <div class="login-pic-img img-2" :style="{ backgroundImage: `url(${picsURL})` }"></div>
        </div>
        <div class="login-pic-2" v-else-if="showPicOrText===3">
          <div class="login-pic-text">
            <p class="login-pic-title">因为热爱，所以前行。</p>
            <p>当所有想的说的</p>
            <p>要的爱的</p>
            <p>都挤在心脏</p>
            <p>行李箱里装不下我</p>
            <p>想去的远方</p>
            <p class="pics-info">摘自《牧马城市》</p>
            <p class="pics-info pics-info-a">
              <a href="https://y.qq.com/n/yqq/singer/001BHDR33FZVZ0.html" target="_blank">听更多毛不易的音乐</a>
            </p>
          </div>
          <div class="login-pic-img img-3" :style="{ backgroundImage: `url(${picsURL})` }"></div>
        </div>
        <div class="login-box">
          <div class="login-box-label">Vue后台管理Demo</div>
          <!-- 登录表单区域 -->
          <el-form ref="loginFormRef" class="login-form" :rules="loginFormRules" :model="loginForm">
            <!-- 用户名 -->
            <el-form-item prop="username">
              <div class="login-label">用 户 名</div>
              <el-input
                prefix-icon="iconfont icon-user"
                v-model="loginForm.username"
                class="inputArea"
                placeholder="请输入用户名"
              ></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
              <div class="login-label">密 码</div>
              <el-input
                prefix-icon="iconfont icon-3702mima"
                v-model="loginForm.password"
                type="password"
                class="inputArea"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
            <!-- 按钮区域 -->
            <el-form-item class="btns">
              <div class="login-btn">
                <el-button type="primary" @click="login" width="300">登 录</el-button>
              </div>
              <div class="reset-btn">
                <el-button type="info" @click="resetLoginForm">重 置</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-main>
    <!-- 底部区域 -->
    <el-footer>
      <div class="footer-text">
        <a href="http://github.com/codemakesense" class="footer-link" target="_blank">My Github</a>
        |
        <a
          href="http://codemakesense.github.io"
          class="footer-link"
          target="_blank"
        >My Blog</a>
        |
        <a
          href="http://github.com/codemakesense/vue-element-management-system"
          class="footer-link"
          target="_blank"
        >项目 Github</a>
        |
        <span>Codeing by 吕亮（Simon）since 2019 Dec</span>
      </div>
    </el-footer>
  </el-container>
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
      },
      // 控制登录左侧区域显示整张图片还是文字
      showPicOrText: 0,
      // 控制登录左侧区域图片URL
      picsURL: ''
    }
  },
  created() {
    this.showWitchPic()
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
        // 1. 如果是第一次登录，就储存session "您是第一次登录"
        // 2.1 如果不是第一次登录，就保存当前登录时间到 thisLoginTime
        // 2.2 重新登录时，保存当前登录时间到 thisloginTime
        let lastLoginTime = window.localStorage.getItem('lastLoginTime')
        let thisLoginTime = window.localStorage.getItem('thisLoginTime')
        // 上次登录时间为空，则为第一次登录
        if (lastLoginTime === null) {
          window.localStorage.setItem('lastLoginTime', '您是第一次登录')
          window.localStorage.setItem('thisLoginTime', new Date())
          // 否则为第二次登录，并覆盖登录时间
        } else {
          window.localStorage.setItem('lastLoginTime', thisLoginTime)
          window.localStorage.setItem('thisLoginTime', new Date())
        }
        this.$router.push('/home')
      })
    },
    // 控制随机展示登录左侧区域图片和文字
    showWitchPic() {
      var picNum = Math.floor(Math.random() * 4)
      console.log(picNum)
      if (picNum === 0) {
        this.showPicOrText = 0
        console.log('showPicOrText：' + this.showPicOrText)
        return
      } else if (picNum === 1) {
        this.showPicOrText = 1
        console.log('showPicOrText：' + this.showPicOrText)
        this.picsURL = 'http://p.60du.cn/userfiles/sfiles/2019-11-30/157508523675984.png'
      } else if (picNum === 2) {
        this.showPicOrText = 2
        this.picsURL = 'https://img.moegirl.org/common/4/40/%E4%B8%87%E8%8A%B1.png'
      } else if (picNum === 3) {
        this.showPicOrText = 3
        this.picsURL = 'http://pic.90sjimg.com/design/00/09/72/14/58b3fbb340e7c.png!/fwfh/800x800/quality/90/unsharp/true/compress/true'
      }
    }
  }
}
</script>
<style lang="less" scoped>
@bgc: #eff4fa;

.el-container {
  min-width: 1000px;
}

.el-header {
  background-color: @bgc;
  height: 60px;
  .active-bgd {
    height: 100%;
  }
}

.el-main {
  height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-container {
    display: flex;
    align-items: center;

    .login-pic-1,
    .login-pic-2 {
      width: 570px;
      height: 388px;
      border-radius: 5px;
    }

    .login-pic-1 {
      background-image: url(http://pic.51yuansu.com/pic3/cover/01/67/52/5958274aea269_610.jpg);
      background-repeat: no-repeat;
      background-position-x: center;
      background-size: cover;

      .pic-info {
        font-size: 12px;
        margin-top: 360px;
        margin-left: 480px;
      }
    }

    .login-pic-2 {
      display: flex;
      justify-content: space-between;

      .login-pic-img {
        width: 240px;
        height: 388px;
        background-repeat: no-repeat;
      }

      .img-1 {
        background-position: 30% 80%;
      }

      .img-2 {
        background-position: 35% 120%;
        background-size: 350px;
      }

      .img-3 {
        background-position: 15% 20%;
        background-size: 600px;
      }

      .login-pic-text {
        line-height: 10px;
        font-size: 14px;

        .login-pic-title {
          font-size: 22px;
          color: #6f95ca;
        }

        .pics-info {
          font-size: 12px;
          margin-top: 25px;
        }

        .pics-info-a {
          margin-top: 0;

          a {
            color: grey;
          }

          a:link {
            text-decoration-line: none;
          }

          a:hover {
            text-decoration: underline;
          }
        }

        p {
          font-family: 'lucida Grande', Verdana, 'Microsoft YaHei';
        }
      }
    }

    .login-box {
      border: 1px solid #aebdcd;
      width: 335px;
      height: 388px;
      border-radius: 5px;
      margin-left: 50px;

      div.el-form-item {
        margin-bottom: 0;
      }

      .login-box-label {
        background-color: #f9fbfe;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        padding: 10px 0;
        color: #229954;
        border-bottom: 1px solid #aebdcd;
        height: 35px;
        line-height: 35px;
        border-radius: 5px 5px 0 0;
      }

      .login-label {
        margin-top: 10px;
        font-size: 16px;
        font-weight: bold;
        color: #566573;
      }

      .login-form {
        bottom: 0;
        width: 100%;
        padding: 0 30px;
        box-sizing: border-box;
      }

      .el-button {
        border: none;
        width: 100%;
        font-size: 18px;
      }

      .login-btn {
        margin-top: 20px;

        button.el-button {
          background-color: #5a98de;
        }

        button.el-button:hover {
          background-color: #65a4ce;
        }
      }

      .reset-btn {
        margin-top: 75px;
      }
    }
  }
}

.el-footer {
  height: 35px !important;
  background-color: @bgc;

  .footer-text {
    text-align: center;
    line-height: 35px;
    font-size: 13px;

    a {
      color: #1d77bf;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    span {
      color: grey;
    }
  }
}

.el-button {
  position: absolute;
  transform: translate(-50%);
  left: 50%;
  width: 250px;
  font-size: 16px;
}
</style>
