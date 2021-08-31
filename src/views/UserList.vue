<template>
  <v-app id="inspire">
    <sidebar />
    <v-app-bar app shrink-on-scroll>
      <v-toolbar-title>ユーザー一覧</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col v-for="n in 24" :key="n" cols="4">
            <!-- <v-card height="200"></v-card> -->
            <router-link :to="{ path: '/chat', query: { user_id: n } }"
              ><v-avatar color="grey lighten-2" size="128"></v-avatar
            ></router-link>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Sidebar from "../components/layouts/Sidebar.vue";
import firebase from "@/firebase/firebase";
export default {
  components: { Sidebar },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      console.log("logging...");
      console.log("user", user);
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        console.log("uid", uid);
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  },
  //
};
</script>
