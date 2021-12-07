<template>
  <v-app>
    <div class="login-box">
      <v-card elevation="24" style="margin:150px;padding:30px; tex">
        <v-card-title class="login-title">SignUp</v-card-title>
        <v-card-subtitle>ユーザー情報をご入力ください</v-card-subtitle>
        <v-btn text color="light-blue" to="login">ログイン画面はこちら</v-btn>
        <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            style="margin:20px;"
            @submit.prevent
        >
          <v-text-field
              v-model="name"
              :rules="nameRules"
              label="UserName"
              required
          ></v-text-field>

          <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
          ></v-text-field>

          <v-text-field
              v-model="password"
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
              Sign Up
            </v-btn>
            <v-btn @click="reset">
              clear
            </v-btn>
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
    max: 5,
    name: "",
    nameRules: [
      (v) => v.length <= 10 || `10文字以内で入力してください`,
    ],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    password: "",
    errorMessage: "",
  }),
  computed: {
    isValid() {
      console.log(this.valid);
      return !this.valid;
    },
  },
  methods: {
    submit() {
      console.log("submit call");

      firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(async (result) => {
            // Signed in


            await result.user.updateProfile({
              displayName: this.name
            })
            console.log("user", result.user);
            console.log("success to create User");

            // alert("success to create User");

            localStorage.message = "新規作成に成功しました";
            this.$router.push({path: "/login"});
          })
          .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode, errorMessage);

            this.errorMessage = "ユーザー登録に失敗しました";
          });
    },
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
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
</style>
