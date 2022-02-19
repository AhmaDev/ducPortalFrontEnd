<template>
  <div id="newPost" class="pa-10">
    <v-app-bar app>
      <v-toolbar-title>اضافة خبر جديد</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="save()" color="success">حفظ</v-btn>
    </v-app-bar>
    <v-card class="pa-10">
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="newPostForm.postTitle"
            outlined
            label="عنوان الخبر"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="newPostForm.postTitleEn"
            outlined
            label="Post Title"
          ></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-btn color="primary" block @click="selectImage()"
            >اختيار صورة
          </v-btn>
          <v-btn
            v-if="newPostForm.postImage != ''"
            color="error"
            block
            @click="newPostForm.postImage = ''"
            >حذف الصورة
          </v-btn>
          <vue-bottom-sheet
            max-width="70%"
            max-height="90%"
            ref="uploadsBottomSheet"
          >
            <Uploads :isDialog="true" @clicked="setImagePath" />
          </vue-bottom-sheet>
        </v-col>
        <v-col cols="3">
          <center>
            <img
              v-if="newPostForm.postImage != ''"
              :src="$baseUrl + newPostForm.postImage"
              width="100%"
            />
          </center>
        </v-col>
        <v-col cols="12">
          <v-switch
            v-model="newPostForm.isSlider"
            :true-value="1"
            :false-value="0"
            label="سلايدر"
          ></v-switch>
        </v-col>
        <v-col cols="12">
          <h2>اللغة العربية</h2>
          <tiptap v-model="newPostForm.postContent" />
        </v-col>
        <v-col cols="12">
          <h2>اللغة الانجليزية</h2>
          <tiptap v-model="newPostForm.postContentEn" />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import "tinymce/tinymce";
import "tinymce/themes/silver";
import "tinymce/icons/default";
import "tinymce/skins/ui/oxide/skin.css";
import Tiptap from "../components/Editor.vue";
import Uploads from "../components/Upload.vue";

export default {
  components: {
    Tiptap,
    Uploads,
  },
  data: () => ({
    postId: 0,
    newPostForm: {
      postImage: "",
      postTitle: "",
      postTitleEn: "",
      postContent: "",
      postContentEn: "",
      createdBy: 0,
      sectionId: 0,
      isSlider: 0,
    },
  }),
  created: function () {
    if (this.$route.params.id != undefined) {
      this.postId = this.$route.params.id;
      this.fetch();
    }
  },
  methods: {
    fetch: function () {
      let loading = this.$loading.show();
      this.$http
        .get("posts/" + this.postId)
        .then((res) => {
          this.newPostForm.postTitle = res.data.postTitle;
          this.newPostForm.postTitleEn = res.data.postTitleEn;
          this.newPostForm.postContent = res.data.postContent;
          this.newPostForm.postContentEn = res.data.postContentEn;
          this.newPostForm.postImage = res.data.postImage;
          this.newPostForm.isSlider = res.data.isSlider;
        })
        .finally(() => loading.hide());
    },
    selectImage() {
      this.$refs.uploadsBottomSheet.open();
    },
    setImagePath(path) {
      this.$refs.uploadsBottomSheet.close();
      this.newPostForm.postImage = path;
    },
    save() {
      if (this.newPostForm.postTitle.length == 0) {
        this.$toast.open({
          type: "error",
          message: "يرجى كتابة عنوان الخبر",
          duration: 3000,
        });
        return;
      }
      if (this.newPostForm.postContent.length == 0) {
        this.$toast.open({
          type: "error",
          message: "يرجى كتابة نص الخبر",
          duration: 3000,
        });
        return;
      }
      if (this.newPostForm.postTitleEn.length == 0) {
        this.newPostForm.postTitleEn = this.newPostForm.postTitle;
      }

      if (this.postId == 0) {
        this.newPostForm.createdBy = this.userInfo.idUser;
        this.newPostForm.sectionId = this.userInfo.sectionId;
        let loading = this.$loading.show();
        this.$http
          .post("posts", this.newPostForm)
          .then((res) => {
            this.$toast.open({
              type: "success",
              message: "تم التحديث",
              duration: 3000,
            });
            this.$router.push('/' + this.userInfo.sectionSlug + '/dashboard/edit/post/' + res.data.idPost);
            this.postId = res.data.idPost;
          })
          .finally(() => loading.hide());
      } else {
        let loading = this.$loading.show();
        this.$http
          .put("posts/" + this.postId, {
            postTitle: this.newPostForm.postTitle,
            postTitleEn: this.newPostForm.postTitleEn,
            postContent: this.newPostForm.postContent,
            postContentEn: this.newPostForm.postContentEn,
            postImage: this.newPostForm.postImage,
            isSlider: this.newPostForm.isSlider,
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

<style>
</style>