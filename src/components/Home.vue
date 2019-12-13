<template>
  <div>
    Home 组件
    <el-button type="info" @click="signOut">登出</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    signOut() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
