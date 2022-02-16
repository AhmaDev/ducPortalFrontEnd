<template>
  <div id="posts" class="pa-10">
    <v-app-bar app>
      <v-toolbar-title>اخبار القسم</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon :to="'/' + userInfo.sectionSlug + '/dashboard/new/post'">
        <v-icon>la-plus</v-icon>
      </v-btn>
    </v-app-bar>
    <v-card>
      <v-data-table :headers="tableHeader" :items="posts" :loading="isLoading">
        <template v-slot:[`item.postImage`]="{ item }">
          <v-img
            :src="$baseUrl + item.postImage"
            height="50px"
            width="100px"
          ></v-img>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon :to="'/' + userInfo.sectionSlug + '/dashboard/edit/post/' + item.idPost">
            <v-icon :title="item.idPost">la-edit</v-icon>
          </v-btn>
          <v-btn icon @click="deletePost(item.idPost)">
            <v-icon color="error" :title="item.idPost">la-trash</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    posts: [],
    isLoading: true,
    tableHeader: [
      { text: "ID", value: "idPost" },
      { text: "صورة الخبر", value: "postImage" },
      { text: "عنوان الخبر", value: "postTitle" },
      { text: "تاريخ الخبر", value: "createdAt" },
      { text: "بواسطة", value: "createdByName" },
      { text: "الاجراءات", value: "actions" },
    ],
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$http
        .get("posts/section/" + this.userInfo.sectionId)
        .then((res) => {
          this.posts = res.data;
        })
        .finally(() => (this.isLoading = false));
    },
    deletePost(id) {
      this.$confirm(
        "لا يمكن التراجع بعد حذف الخبر",
        "هل انت متأكد من حذف الخبر ؟",
        "warning"
      ).then(() => {
        let loading = this.$loading.show();
        this.$http
          .delete("posts/" + id)
          .then(() => {
            this.fetch();
            this.$toast.open({
              type: "error",
              message: "تم حذف الخبر",
              duration: 3000,
            });
          })
          .finally(() => loading.hide());
      });
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    userInfo() {
      return this.$store.getters.getLoginInfo;
    },
  },
};
</script>

<style>
</style>