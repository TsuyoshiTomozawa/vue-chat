<template>
  <v-app id="inspire">
    <sidebar />
    <v-main>
      <v-container class="py-8 px-6" fluid>
        <v-row>
          <v-col cols="12">
            <v-card>
              <!-- <v-subheader>{{ card }}</v-subheader> -->

              <v-list two-line>
                <template v-for="(data, index) in messages">
                  <v-list-item :key="index">
                    <v-list-item-avatar color="grey darken-1">
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <!-- <v-list-item-title>Message! {{ n }}</v-list-item-title> -->

                      <v-list-item-subtitle class="message">
                        {{ data.message }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <!-- <form> -->
      <v-textarea
        v-model="body"
        append-icon="mdi-comment"
        class="mx-2"
        auto-grow
        label="メッセージを送信する"
        rows="3"
      ></v-textarea>
      <v-btn class="mr-4" type="submit" :disabled="invalid" @click="submit">
        submit
      </v-btn>
      <v-btn @click="clear">
        clear
      </v-btn>
      <!-- </form> -->
    </v-main>
  </v-app>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
// import Chat from "@/components/Chat.vue";

import firebase from "@/firebase/firebase";
import Sidebar from "../components/layouts/Sidebar.vue";

export default {
  components: { Sidebar },
  async created() {
    let user_id = this.$route.query.user_id;
    console.log("user_id", user_id);

    const chatRef = firebase.firestore().collection("chats");
    const snapshot = await chatRef.get();
    console.log(snapshot);
    if (snapshot.empty) {
      return;
    }

    snapshot.forEach((doc) => {
      console.log(doc.data());
      this.messages.push(doc.data());
    });
  },
  data: () => ({
    body: "",
    drawer: null,
    links: [
      ["mdi-inbox-arrow-down", "Inbox"],
      ["mdi-send", "Send"],
      ["mdi-delete", "Trash"],
      ["mdi-alert-octagon", "Spam"],
    ],
    messages: [],
    // invalid: false,
  }),
  computed: {
    invalid() {
      console.log("checkText call", this.body);
      if (!this.body) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    clear() {
      console.log("clear");
      this.body = "";
    },
    submit() {
      console.log("submit", this.body);
      // this.messages.push({ message: this.body });
      this.messages.unshift({ message: this.body });
      this.body = "";
    },
  },
};
</script>

<style scoped>
.message {
  text-align: left;
}
</style>
