<template>
  <form class="form-app form-forgot-password" @submit.prevent="submit">
    <div class="alert alert-info" v-if="notice">{{ notice }}</div>
    <div class="alert alert-danger" v-if="error">{{ error }}</div>
    <div class="form-group">
      <label for="email">登録済みのメールアドレス</label>
      <input v-model="email" type="email" class="form-control" id="email" placeholder="email@example.com">
    </div>
    <button type="submit" class="btn btn-primary mb-3">パスワードをリセットする</button>
    <div>
      <router-link to="/">サインイン</router-link>
      <br />
      <router-link to="/signup">サインアップ</router-link>
    </div>
  </form>
</template>

<script>
export default {
  name: 'ForgotPassword',
  data () {
    return {
      email: '',
      error: '',
      notice: ''
    }
  },
  methods: {
    submit () {
      this.$http.plain.post('/password_resets', { email: this.email })
        .then(() => this.submitSuccessful())
        .catch(error => this.submitFailed(error))
    },
    submitSuccessful () {
      this.notice = 'パスワード再設定のメールが送信されました.'
      this.error = ''
      this.email = ''
    },
    submitFailed (error) {
      this.error = (error.response && error.response.data && error.response.data.error) || ''
    }
  }
}
</script>
