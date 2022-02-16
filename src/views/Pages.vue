<template>
  <div id="pages" class="pa-10">
    <v-app-bar app>
      <v-toolbar-title>صفحات القسم</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon :to="'/' + userInfo.sectionSlug + '/dashboard/new/page'">
        <v-icon>la-plus</v-icon>
      </v-btn>
    </v-app-bar>
    <v-card>
      <v-data-table :headers="tableHeader" :items="pages" :loading="isLoading">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon :to="'/' + userInfo.sectionSlug + '/dashboard/edit/page/' + item.idPage">
            <v-icon :title="item.idPost">la-edit</v-icon>
          </v-btn>
          <v-btn icon @click="deletePage(item.idPage)">
            <v-icon color="error" :title="item.idPage">la-trash</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    pages: [],
    isLoading: true,
    tableHeader: [
      { text: "ID", value: "idPage" },
      { text: "عنوان الصفحة", value: "pageTitle" },
      { text: "تاريخ الاضافة", value: "createdAt" },
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
        .get("pages/section/" + this.userInfo.sectionId)
        .then((res) => {
          this.pages = res.data;
        })
        .finally(() => (this.isLoading = false));
    },
    deletePost(id) {
      this.$confirm(
        "لا يمكن التراجع بعد حذف الصفحة",
        "هل انت متأكد من حذف الصفحة ؟",
        "warning"
      ).then(() => {
        let loading = this.$loading.show();
        this.$http
          .delete("pages/" + id)
          .then(() => {
            this.fetch();
            this.$toast.open({
              type: "error",
              message: "تم حذف الصفحة",
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