<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-sheet color="grey lighten-4" class="pa-4">
      <v-avatar class="mb-4" color="grey darken-1" size="64">

        <input
            style="display: none"
            ref="fileInput"
            type="file"
            accept="image/jpeg, image/jpg, image/png"
            @change="updateIcon"
        >

        <v-icon dark
                @click="changeIcon"
                v-if="!photoUrl">
          mdi-account-circle
        </v-icon>

        <img
            :src="photoUrl"
            alt="John"
            v-if="photoUrl"
            @click="changeIcon"
        >
      </v-avatar>

      <div class="username">{{ auth && auth.displayName }}</div>

    </v-sheet>

    <v-divider></v-divider>

    <v-list>
      <v-list-item v-for="[icon, text, to] in links" :key="icon" :to="to" link>
        <v-list-item-icon>
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="logout" link>
        <v-list-item-icon>
          <v-icon color="blue">
            mdi-logout
          </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import firebase from "@/firebase/firebase";

export default {
  mounted() {
    const path = location.pathname;
    console.log("path", path);

    this.auth = JSON.parse(sessionStorage.getItem('user'))
    console.log("auth", this.auth)
    this.photoUrl = this.auth.photoURL;
  },
  data: () => ({
    drawer: null,
    links: [
      ["mdi-inbox-arrow-down", "Inbox", "/"],
      ["mdi-send", "Send", "/about"],
      ["mdi-delete", "Trash", "/about"],
      ["mdi-alert-octagon", "Spam", "/about"],
    ],
    photoUrl: "",
    auth: null
  }),
  methods: {
    logout() {
      console.log("logout call");

      firebase
          .auth()
          .signOut()
          .then(() => {
            sessionStorage.removeItem('user');
            localStorage.message = "ログアウトしました";
            this.$router.push({path: "/login"});
          })
          .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode, errorMessage);
            // An error happened.
          });
    },
    changeIcon() {
      this.$refs.fileInput.click()
    },
    async updateIcon() {
      const user = await this.getAuth()
      if (!user) {
        sessionStorage.removeItem('user')
        await this.$router.push({path: "/login"});
        return
      }

      //アイコンアップデート
      console.log("update icon", this.$refs.fileInput.files[0])

      const file = this.$refs.fileInput.files[0]
      const filePath = `/user/${file.name}`

      //画像をfirebase storageに保存
      firebase.storage().ref().child(filePath)
          .put(file)
          .then(async (snapshot) => {
            const photoURL = await snapshot.ref.getDownloadURL()
            console.log("getDownloadURL", photoURL, snapshot)

            firebase.auth().onAuthStateChanged(async (user) => {
              if (user) {
                //アイコンアップデート
                await user.updateProfile({
                  photoURL: photoURL
                })
                console.log("onAuthStateChanged", user);
                //セッション更新
                this.auth.photoURL = photoURL
                sessionStorage.setItem('user', JSON.stringify(this.auth));
              }
            });

          })
    },
    async getAuth() {
      return firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          //アイコンアップデート
          return user

        } else {
          //ログイン
          firebase
              .auth()
              .signInWithEmailAndPassword(this.auth.email, this.auth.password)
              .then((result) => {
                console.log(result)
                const user = result.user;
                console.log("user", user);
                const auth = {
                  displayName: user.displayName,
                  email: user.email,
                  uid: user.uid,
                  refreshToken: user.refreshToken
                }

                //user 保存
                sessionStorage.setItem('user', JSON.stringify(auth));
                return result.user
              })
              .catch((error) => {
                console.log(error)
                return false
              })
        }
      });
    }
  },
};
</script>
