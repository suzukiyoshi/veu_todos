<template>
  <form class="form-app form-signup" @submit.prevent="signup">
    <div class="alert alert-danger" v-if="error">{{ error }}</div>
    <div class="form-group">
      <label for="email">メールアドレス</label>
      <input v-model="email" type="email" class="form-control" id="email" placeholder="email@example.com">
    </div>
    <div class="form-group">
      <label for="password">パスワード</label>
      <input v-model="password" type="password" class="form-control" id="password" placeholder="Password">
    </div>
    <div class="form-group">
      <label for="password">パスワードの再確認</label>
      <input v-model="password_confirmation" type="password" class="form-control" id="password_confirmation" placeholder="Password Confirmation">
    </div>
    <button type="submit" class="btn btn-primary mb-3">サインアップ</button>
    <div>
      <router-link to="/">サインイン</router-link>
      <br />
      <!-- パスワード忘れ -->
      <router-link to="/forgot_password">パスワードを忘れた方はこちらへ</router-link>
    </div>
  </form>
</template>

<script>
export default {
  name: 'Signup',
  data () {
    return {
      email: '',
      password: '',
      password_confirmation: '',
      error: ''
    }
  },
  created () {
    this.checkSignedIn()
  },
  updated () {
    this.checkSignedIn()
  },
  methods: {
    signup () {
      this.$http.plain.post('/signup', { email: this.email, password: this.password, password_confirmation: this.password_confirmation })
        .then(response => this.signupSuccessful(response))
        .catch(error => this.signupFailed(error))
    },
    signupSuccessful (response) {
      if (!response.data.csrf) {
        this.signupFailed(response)
        return
      }
      // ログインユーザー情報
      this.$http.plain.get('/me')
        .then(meResponse => {
          // ユーザー情報とcsrfをコミット
          this.$store.commit('setCurrentUser', { currentUser: meResponse.data, csrf: response.data.csrf })
          this.error = ''
          this.$router.replace('/todos')
        })
        .catch(error => this.signupFailed(error))
    },
    signupFailed (error) {
      this.error = (error.response && error.response.data && error.response.data.error) || 'Something went wrong'
      this.$store.commit('unsetCurrentUser')
    },
    // state.signedIn = trueならばtodosへリダイレクト
    checkSignedIn () {
      if (this.$store.state.signedIn) {
        this.$router.replace('/todos')
      }
    }
  }
}
</script>
