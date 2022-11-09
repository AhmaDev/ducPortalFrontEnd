<template>
  <div id="upload">
    <v-app-bar>
      <v-toolbar-title> الملفات </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="success" @click="openPicker()">اضافة ملف جديد</v-btn>
      <input
        @change="upload($event)"
        id="filePicker"
        type="file"
        style="display: none"
        multiple
      />
    </v-app-bar>

    <div class="uploadPercent" v-if="uploadPercent != 0">
      {{ uploadPercent }} %
    </div>

    <div class="pa-10">
      <v-row>
        <v-col cols="3" v-for="file in files" :key="file.idUpload">
          <v-hover v-slot:default="{ hover }">
            <v-card class="mx-auto imagePick" color="grey lighten-4">
              <v-img
                v-if="file.mime.match(/^image/)"
                @click="selectImage(file.path)"
                :aspect-ratio="16 / 9"
                :src="checkMime($baseUrl + file.path, file.mime)"
              >
                <v-expand-transition>
                  <div
                    v-if="hover"
                    class="
                      d-flex
                      transition-fast-in-fast-out
                      primary
                      darken-2
                      v-card--reveal
                      display-3
                      white--text
                    "
                    style="height: 100%"
                  >
                    <v-btn
                      v-if="!isDialog"
                      @click="deleteFile(file.idUpload)"
                      rounded
                      color="error"
                    >
                      <v-icon>la-trash</v-icon>
                    </v-btn>
                    <!-- <v-btn
                      v-if="isDialog"
                      @click="selectImage(file.path)"
                      rounded
                      color="success"
                    >
                      <v-icon>la-check</v-icon>
                    </v-btn> -->
                    <v-icon dark>la-check</v-icon>
                  </div>
                </v-expand-transition>
              </v-img>
              <v-img
                v-else
                @click="selectImage(file.path)"
                :aspect-ratio="16 / 9"
                style="background-size: cover !important"
                src="@/assets/file.png"
              >
                <v-expand-transition>
                  <div
                    v-if="hover"
                    class="
                      d-flex
                      transition-fast-in-fast-out
                      primary
                      darken-2
                      v-card--reveal
                      display-3
                      white--text
                    "
                    style="height: 100%"
                  >
                    <v-btn
                      v-if="!isDialog"
                      @click="deleteFile(file.idUpload)"
                      rounded
                      color="error"
                    >
                      <v-icon>la-trash</v-icon>
                    </v-btn>
                    <!-- <v-btn
                      v-if="isDialog"
                      @click="selectImage(file.path)"
                      rounded
                      color="success"
                    >
                      <v-icon>la-check</v-icon>
                    </v-btn> -->
                    <v-icon dark>la-check</v-icon>
                  </div>
                </v-expand-transition>
              </v-img>
              <v-card-text class="fileName">{{
                file.filename == "none" ? file.mime : file.filename
              }}</v-card-text>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "Upload",
  props: {
    isDialog: Boolean,
  },
  data: () => ({
    files: [],
    uploadFiles: [],
    uploadPercent: 0,
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      let apiUploadUrl = "";
      if (this.userInfo.roleName == "Admin") {
        apiUploadUrl = "uploads";
      } else {
        apiUploadUrl = "uploads/section/" + this.userInfo.sectionId;
      }
      let loading = this.$loading.show();
      this.$http
        .get(apiUploadUrl)
        .then((res) => {
          this.files = res.data;
        })
        .finally(() => loading.hide());
    },
    openPicker() {
      document.getElementById("filePicker").click();
    },
    upload(e) {
      this.uploadFiles = [];
      let loading = this.$loading.show();
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      for (let i = 0; i < files.length; i++) {
        this.uploadFiles.push(files[i]);
      }
      let formData = new FormData();
      formData.append("sectionId", this.userInfo.sectionId);
      formData.append("createdBy", this.userInfo.idUser);
      for (let i = 0; i < this.uploadFiles.length; i++) {
        formData.append("file", this.uploadFiles[i]);
      }
      this.$http
        .post("uploads", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            this.uploadPercent = parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
          },
        })
        .then(() => {
          this.fetch();
          this.$toast.open({
            type: "success",
            message: "تم اضافة الملفات",
            duration: 3000,
          });
          this.uploadPercent = 0;
        })
        .finally(() => loading.hide());
    },
    deleteFile(fileId) {
      this.$confirm(
        "لا يمكن التراجع بعد حذف الملف",
        "هل انت متأكد من حذف الملف ؟",
        "warning"
      ).then(() => {
        let loading = this.$loading.show();
        this.$http
          .delete("uploads/" + fileId)
          .then(() => {
            this.fetch();
            this.$toast.open({
              type: "error",
              message: "تم حذف الملف",
              duration: 3000,
            });
          })
          .finally(() => loading.hide());
      });
    },
    selectImage(path) {
      this.$emit("clicked", path);
    },
    checkMime(path, mime) {
      if (mime.match(/^image/)) {
        return path;
      } else {
        return "../assets/file.png";
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
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.95;
  position: absolute;
  width: 100%;
}
.imagePick {
  cursor: pointer;
  transition: 0.3s;
}
.imagePick:hover {
  transform: scale(0.94);
}

.imagePick:hover > .fileName {
  display: none;
}

.uploadPercent {
  position: fixed;
  top: 10px;
  left: 10px;
  font-size: 100px;
  z-index: 10000000000000000;
  color: rgb(180, 109, 3);
}
.fileName {
  position: absolute;
  bottom: 0px;
  width: 100%;
  background-color: #000000ab;
  color: white !important;
  backdrop-filter: blur(0.7) !important;
  transition: 0.3s;
}
</style>