<template>
  <div class="app-container">
    <p style="font-size: 18px;">用户添加：</p>
    <el-form ref="dataForm" :model="form" label-width="120px" size="medium" title="用户添加：">
      <el-form-item label="姓名">
        <el-col :span="7">
          <el-input v-model="form.name" placeholder="请填写用户姓名" clearable />
        </el-col>
      </el-form-item>
      <el-form-item label="用户名">
        <el-col :span="7">
          <el-input v-model="form.email" placeholder="请填写登录邮箱地址" clearable />
        </el-col>
      </el-form-item>
      <el-form-item label="密码">
        <el-col :span="7">
          <el-input v-model="form.password" show-password clearable placeholder="请填写登录密码" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { userRegister } from '@/api/user'

export default {
  data() {
    return {
      form: {
        email: '@yingzt.com',
        password: '123123',
        name: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          userRegister(this.form).then(() => {
            // this.$notify({
            //   title: '成功',
            //   message: '配置新建成功',
            //   type: 'success',
            //   duration: 2000
            // })
            this.$message({
              message: '已新增!',
              type: 'success'
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

