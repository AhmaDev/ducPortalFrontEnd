<template>
  <div class="pa-10" v-if="staff != null" id="editStaff">
    <v-app-bar app>
      <v-toolbar-title>{{ staff.staffName }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="save()" icon>
        <v-icon>la-check</v-icon>
      </v-btn>
    </v-app-bar>
    <v-card class="pa-10">
      <v-row>
        <v-col cols="12">
          <v-btn color="primary" block @click="selectImage()"
            >اختيار صورة
          </v-btn>
          <br />
          <center>
            <img
              v-if="staff.staffImage != ''"
              :src="$baseUrl + staff.staffImage"
              height="200px"
            />
          </center>
          <vue-bottom-sheet
            max-width="70%"
            max-height="90%"
            ref="uploadsBottomSheet"
          >
            <Uploads :isDialog="true" @clicked="setImagePath" />
          </vue-bottom-sheet>
        </v-col>
        <v-col cols="4">
          <v-text-field
            outlined
            v-model="staff.staffName"
            label="الاسم"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            outlined
            v-model="staff.staffPosition"
            label="العنوان الوظيفي"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            outlined
            v-model="staff.staffEmail"
            label="البريد الالكتروني"
            prefix="duc.edu.iq@"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            outlined
            v-model="staff.scopusLink"
            label="رابط Scopus"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            outlined
            v-model="staff.cvLink"
            label="CV"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            outlined
            v-model="staff.scholarLink"
            label="رابط Scholar"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import Uploads from "../components/Upload.vue";

export default {
  components: {
    Uploads,
  },
  data: () => ({
    staff: null,
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      let loading = this.$loading.show();
      this.$http
        .get("staff/" + this.$route.params.id)
        .then((res) => {
          this.staff = res.data;
        })
        .finally(() => loading.hide());
    },
    selectImage() {
      this.$refs.uploadsBottomSheet.open();
    },
    setImagePath(path) {
      this.$refs.uploadsBottomSheet.close();
      this.staff.staffImage = path;
    },
    save() {
      let loading = this.$loading.show();
      this.$http
        .put("staff/" + this.$route.params.id, this.staff)
        .then(() => {
          this.$toast.open({
            type: "success",
            message: "تم التحديث",
            duration: 3000,
          });
        })
        .finally(() => loading.hide());
    },
  },
};
</script>

<style>
</style>