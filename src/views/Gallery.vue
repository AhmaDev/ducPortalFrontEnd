<template>
  <div class="pa-10" id="gallery">
    <v-app-bar app>
      <v-toolbar-title>معرض الصور</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="selectImage()">
        <v-icon>la-plus</v-icon>
      </v-btn>
    </v-app-bar>

    <v-row>
      <v-col v-for="photo in photos" :key="photo.idGallary" cols="12" md="3">
        <v-card>
          <v-img height="200" :src="$baseUrl + photo.image"></v-img>
          <v-card-actions>
            <v-btn @click="deleteImage(photo.idGallary)" block color="error"> حذف </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <vue-bottom-sheet max-width="70%" max-height="90%" ref="uploadsBottomSheet">
      <Uploads :isDialog="true" @clicked="setImagePath" />
    </vue-bottom-sheet>
  </div>
</template>

<script>
import Uploads from "../components/Upload.vue";

export default {
  components: {
    Uploads,
  },
  data: () => ({
    photos: [],
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      let loading = this.$loading.show();
      this.$http
        .get("photos/section/" + this.userInfo.sectionId)
        .then((res) => {
          this.photos = res.data;
        })
        .finally(() => loading.hide());
    },
    selectImage() {
      this.$refs.uploadsBottomSheet.open();
    },
    setImagePath(path) {
      this.$refs.uploadsBottomSheet.close();
      this.save(path);
    },
    save(path) {
      let loading = this.$loading.show();
      this.$http
        .post("photos", {
          sectionId: this.userInfo.sectionId,
          image: path,
        })
        .then(() => {
          this.$toast.open({
            type: "success",
            message: "تم التحديث",
            duration: 3000,
          });
          this.fetch();
        })
        .finally(() => loading.hide());
    },
    deleteImage(id) {
      let loading = this.$loading.show();
      this.$http.delete("photos/" + id).then(() => {
        this.$toast.open({
          type: "success",
          message: "تم التحديث",
          duration: 3000,
        });
        this.fetch();
      }).finally(() => loading.hide());
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