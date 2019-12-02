<template>
  <div class="page-user-chat">
    <van-nav-bar left-arrow @click-left="$router.back()" title="登录"></van-nav-bar>
    <van-cell-group>
        <!-- <van-field :error-message="errMage.errmobile" @touchstart.native.stop="show = true" @blur="checkMobile"  :value="loginForm.mobile" label="手机号" placeholder="请输入手机号" /> -->
        <van-field :error-message="errMage.errmobile" @blur="checkMobile"  v-model="loginForm.mobile" label="手机号" placeholder="请输入手机号" />
        <van-field :error-message="errMage.errcode"  @blur="checkCode" v-model="loginForm.code" label="验证码" placeholder="请输入验证码">
            <van-button class="p5" slot="button" size="mini" type="primary">
                发送验证码
            </van-button>
        </van-field>
    </van-cell-group>
    <div class="btn_box">
        <van-button @click="login()" type="info" block round>登 录</van-button>
    </div>

    <!-- <van-number-keyboard
      v-model="loginForm.mobile"
      :show="show"
      @blur="show = false"
    /> -->
  </div>
</template>

<script>
// 引入登录接口
import { login } from '@/api/user'
// 引入vuex设置用户登录信息数据方法
import { mapMutations } from 'vuex'

export default {
  // watch: {
  //   mobile (newv, oldv) {
  //     if (newv) {
  //       this.checkMobile()
  //     }
  //   }
  // },
  name: 'Login',
  data () {
    return {
      /* // 显示与隐藏数字键盘
      show: false, */
      // 用户登录信息
      loginForm: {
        mobile: '',
        code: ''
      },
      // 错误提示信息
      errMage: {
        errmobile: '',
        errcode: ''
      }
    }
  },
  methods: {
    // 检验手机号
    checkMobile () {
      // 获取手机号信息
      const value = this.loginForm.mobile
      // 判断是否有值
      if (!value) {
        this.errMage.errmobile = '请输入手机号'
        // 再判断格式是否正确
      } else if (!/^1[3-9]\d{9}$/.test(value)) {
        this.errMage.errmobile = '手机号格式不正确'
      } else {
        // 当以上条件都不满足时证明符合条件将错误信息赋值为空
        this.errMage.errmobile = ''
      }
    },
    // 检测验证码
    checkCode () {
      // 获取验证码
      const value = this.loginForm.code
      // 判断是否输入验证码
      if (!value) {
        this.errMage.errcode = '请输入验证码'
        // 再判断格式是否正确
      } else if (!/^\d{6}$/.test(value)) {
        this.errMage.errcode = '验证码格式不正确'
      } else {
        // 当以上条件都不满足时证明符合条件将错误信息赋值为空
        this.errMage.errcode = ''
      }
    },
    ...mapMutations(['updateuser']),
    // 登录
    async login () {
      // 对手机号验证一边
      this.checkMobile()
      // 对验证码验证一遍
      this.checkCode()
      // 判断错误信息  !null = true
      if (!this.errMage.errmobile && !this.errMage.errcode) {
        // 当错误信息都为空时发送请求
        /*
          1. 基于request封装登录的API
          2. 导入API
          3. 调用即可
          4. 获取用户信息
          5. 更新vuex中的user数据
          6. 根据地址栏进行跳转
          7. 提示 成功
          8. 失败 错误提示
        */
        // 利用try catch捕获异常情况的发生,防止请求失败时报错
        try {
          const data = await login(this.loginForm)

          // 利用async 与 await获取响应的数据 data 是对象包含 token与refresh_token
          // 将响应的用户登录信息存入vuex中
          this.updateuser(data)
          // 进行页面的回跳  如果无回跳信息直接跳转到个人中心
          this.$router.push(this.$route.query.redirectUrl || '/user')
          // 提示成功信息
          this.$notify({ type: 'success', message: '登录成功' })
        } catch (e) {
          this.$notify({ type: 'danger', message: '登录失败，请检查用户名密码是否正确' })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.p5{
  padding: 0 5px;
}
.btn_box{
  padding: 10px;
  .van-button{
    height: 32px;
    line-height: 30px;
  }
}
</style>
