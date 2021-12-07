<template>
  <v-app>
    <div class="login-box">
      <v-card elevation="24" style="margin:150px;padding:30px;">
        <v-card-title class="login-title">Login</v-card-title>
        <v-card-subtitle>ユーザー情報をご入力ください</v-card-subtitle>
        <v-btn text color="light-blue" to="signup">新規登録はこちら</v-btn>
        <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            style="margin:20px;"
            @submit.prevent
        >
          <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
          ></v-text-field>

          <v-text-field
              v-model="password"
              :rules="passwordRules"
              type="password"
              label="Password"
              required
          ></v-text-field>

          <div style="margin:0 auto;">
            <v-btn
                type="submit"
                class="mr-4"
                style="margin-right:20px"
                @click="submit"
                color="success"
                :disabled="isValid"
            >
              Login
            </v-btn>
            <v-btn @click="reset">
              clear
            </v-btn>
            <v-alert
                dense
                text
                type="success"
                class="success-message"
                v-if="message"
            >
              {{ message }}
            </v-alert>
            <v-alert
                dense
                outlined
                type="error"
                class="error-message"
                v-if="errorMessage"
            >
              {{ errorMessage }}
            </v-alert>
          </div>
        </v-form>
      </v-card>
    </div>
  </v-app>
</template>

<script>
import firebase from "@/firebase/firebase";

export default {
  data: () => ({
    valid: false,
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    password: "",
    passwordRules: [(v) => !!v || "password is required"],
    errorMessage: "",
    message: "",
  }),
  computed: {
    isValid() {
      console.log(this.valid);
      return !this.valid;
    },
  },
  mounted() {
    if (localStorage.message) {
      this.message = localStorage.message;
      localStorage.message = "";
    }
  },
  methods: {
    submit() {
      firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then((result) => {
            console.log("success to login");
            // Signed in
            const user = result.user;
            console.log("user", user);
            const auth = {
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              uid: user.uid,
              refrehToken: user.refreshToken
            }
            //user 保存
            sessionStorage.setItem('user', JSON.stringify(auth));

            let redirectUrl = this.$route.query.redirect
                ? this.$route.query.redirect
                : "/";
            this.$router.push({path: redirectUrl});
          })
          .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode, errorMessage);

            this.errorMessage = "ログインに失敗しました";
          });
    },
    // validate() {
    //   this.$refs.form.validate();
    // },
    reset() {
      this.$refs.form.reset();
    },
    // resetValidation() {
    //   this.$refs.form.resetValidation();
    // },
  },
};
</script>

<style scoped>
.login-box {
  margin: 10px auto;
  padding: 30px;
  width: 50%;
}

.login-title {
  display: inline-block;
}

.messages__message {
  color: red !important;
}

.error-message {
  margin-top: 20px;
}

.success-message {
  margin-top: 20px;
}
</style>
