<template>
  <div id="newPost" class="pa-10">
    <v-app-bar app>
      <v-toolbar-title>اضافة صفحة جديدة</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="save()" color="success">حفظ</v-btn>
    </v-app-bar>
    <v-card class="pa-5">
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="newPageForm.pageTitle"
            outlined
            hide-details
            label="عنوان الصفحة"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="newPageForm.pageTitleEn"
            outlined
            hide-details
            label="Page Title"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card>
    <br />
    <h2>اللغة العربية</h2>
    <tiptap v-model="newPageForm.pageContent" />
    <br />
    <h2>اللغة الانجليزية</h2>
    <tiptap v-model="newPageForm.pageContentEn" />
  </div>
</template>

<script>
import Tiptap from "../components/Editor.vue";

export default {
  components: {
    Tiptap,
  },
  data: () => ({
    pageId: 0,
    images: [],
    newPageForm: {
      pageTitle: "",
      pageTitleEn: "",
      pageContent: "",
      pageContentEn: "",
      createdBy: 0,
      sectionId: 0,
    },
  }),
  created: function () {
    if (this.$route.params.id != undefined) {
      this.pageId = this.$route.params.id;
      this.fetch();
    }
  },
  methods: {
    fetch: function () {
      let loading = this.$loading.show();
      this.$http
        .get("pages/" + this.pageId)
        .then((res) => {
          this.newPageForm.pageTitle = res.data.pageTitle;
          this.newPageForm.pageTitleEn = res.data.pageTitleEn;
          this.newPageForm.pageContent = res.data.pageContent;
          this.newPageForm.pageContentEn = res.data.pageContentEn;
        })
        .finally(() => loading.hide());
      this.$http.get("pageImages/page/" + this.pageId).then((res) => {
        this.images = res.data;
      });
    },
    selectImage() {
      this.$refs.uploadsBottomSheet.open();
    },
    setImagePath(path) {
      this.$refs.uploadsBottomSheet.close();
      if (this.pageId == 0) {
        this.images.push({
          imagePath: path,
        });
      } else {
        let loading = this.$loading.show();
        this.$http
          .post("pageImages", {
            imagePath: path,
            pageId: this.pageId,
          })
          .then(() => {
            this.$http.get("pageImages/page/" + this.pageId).then((res) => {
              this.images = res.data;
            });
          })
          .finally(() => loading.hide());
      }
    },
    deleteImage(i) {
      if (this.pageId == 0) {
        this.images.splice(i, 1);
      } else {
        let loading = this.$loading.show();
        this.$http
          .delete("pageImages/" + this.images[i].idPageImage)
          .then(() => {
            this.images.splice(i, 1);
          })
          .finally(() => loading.hide());
      }
    },
    save() {
      if (this.newPageForm.pageTitle.length == 0) {
        this.$toast.open({
          type: "error",
          message: "يرجى كتابة عنوان الصفحة",
          duration: 3000,
        });
        return;
      }
      if (this.newPageForm.pageContent.length == 0) {
        this.$toast.open({
          type: "error",
          message: "يرجى كتابة نص الصفحة",
          duration: 3000,
        });
        return;
      }
      if (this.newPageForm.pageTitleEn.length == 0) {
        this.newPageForm.pageTitleEn = this.newPageForm.pageTitle
      }
      if (this.pageId == 0) {
        this.newPageForm.createdBy = this.userInfo.idUser;
        this.newPageForm.sectionId = this.userInfo.sectionId;
        let loading = this.$loading.show();
        this.$http
          .post("pages", {
            page: this.newPageForm,
            images: this.images,
          })
          .then((res) => {
            this.$toast.open({
              type: "success",
              message: "تم التحديث",
              duration: 3000,
            });
            this.$router.push('/' + this.userInfo.sectionSlug + '/dashboard/edit/page/' + res.data.idPage);
            this.pageId = res.data.idPage;
          })
          .finally(() => loading.hide());
      } else {
        let loading = this.$loading.show();
        this.$http
          .put("pages/" + this.pageId, {
            pageTitle: this.newPageForm.pageTitle,
            pageTitleEn: this.newPageForm.pageTitleEn,
            pageContent: this.newPageForm.pageContent,
            pageContentEn: this.newPageForm.pageContentEn,
          })
          .then(() => {
            this.$toast.open({
              type: "success",
              message: "تم التحديث",
              duration: 3000,
            });
          })
          .finally(() => loading.hide());
      }
    },
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

<style scoped>
.images {
  display: inline-block;
  padding: 5px !important;
}
</style>