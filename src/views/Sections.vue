<template>
  <div id="sections">
    <v-app-bar app>
      <v-toolbar-title> الاقسام </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="addNewSectionDialog = true">
        <v-icon> la-plus </v-icon>
      </v-btn>
    </v-app-bar>

    <div class="pa-10">
      <v-row>
        <v-col v-for="section in sections" :key="section.idSection" cols="3">
          <v-card>
            <v-card-image>
              <v-img :src="$baseUrl + section.sectionLogo" />
            </v-card-image>
            <v-card-title>{{ section.sectionName }}</v-card-title>
            <v-card-actions>
              <v-btn
                :to="
                  '/' +
                  section.sectionSlug +
                  '/dashboard/section/' +
                  section.idSection
                "
                block
                color="primary"
              >
                تعديل
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-dialog persistent width="500" v-model="addNewSectionDialog">
      <v-card>
        <v-card-title class="text-h5"> اضافة قسم جديد </v-card-title>
        <v-card-text dir="ltr">
          <br />
          <v-text-field
            v-model="newSectionForm.sectionName"
            outlined
            label="اسم القسم"
          ></v-text-field>
          <v-text-field
            v-model="newSectionForm.sectionNameEn"
            outlined
            label="اسم القسم باللغة الانجليزية"
          ></v-text-field>
          <v-text-field
            :rules="[rules.slug]"
            prefix="https://portal.duc.edu.iq/"
            outlined
            v-model="newSectionForm.sectionSlug"
            label="رابط القسم"
          ></v-text-field>
          <v-btn color="primary" block @click="selectImage()"
            >اختيار صورة
          </v-btn>
          <center>
            <img
              v-if="newSectionForm.sectionLogo != ''"
              :src="$baseUrl + newSectionForm.sectionLogo"
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
        </v-card-text>
        <v-card-actions>
          <v-btn color="success" @click="addNewSection()">اضافة</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" outlined @click="addNewSectionDialog = false"
            >الغاء</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Uploads from "../components/Upload.vue";

const slugPattern = /^[a-z](-?[a-z])*$/;

export default {
  name: "Sections",
  components: {
    Uploads,
  },
  data: () => ({
    sections: [],
    addNewSectionDialog: false,
    newSectionForm: {
      sectionName: "",
      sectionNameEn: "",
      sectionSlug: "",
      sectionLogo: "",
    },
    rules: {
      slug: (value) => {
        return (
          slugPattern.test(value) || "لا يمكن استخدام الرموز والمسافات والارقام"
        );
      },
    },
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      let loading = this.$loading.show();
      this.$http
        .get("sections")
        .then((res) => {
          this.sections = res.data;
        })
        .finally(() => loading.hide());
    },
    addNewSection() {
      if (this.newSectionForm.sectionName.length == 0) {
        this.$toast.open({
          type: "error",
          message: "يرجى كتابة اسم القسم",
          duration: 3000,
        });
        return;
      }
      if (slugPattern.test(this.newSectionForm.sectionSlug) == false) {
        this.$toast.open({
          type: "error",
          message: "لا يمكن استخدام الرموز والمسافات والارقام",
          duration: 3000,
        });
        return;
      }
      if (this.newSectionForm.sectionLogo == "") {
        this.$toast.open({
          type: "error",
          message: "يرجى اختيار صورة القسم",
          duration: 3000,
        });
        return;
      }
      let loading = this.$loading.show();
      this.$http
        .post("sections", {
          sectionName: this.newSectionForm.sectionName,
          sectionNameEn: this.newSectionForm.sectionNameEn,
          sectionSlug: this.newSectionForm.sectionSlug,
          sectionLogo: this.newSectionForm.sectionLogo,
          vision: "...",
          about: "...",
          message: "...",
          goals: "...",
        })
        .then(() => {
          this.$toast.open({
            type: "success",
            message: "تم اضافة القسم",
            duration: 3000,
          });
          this.fetch();
          this.newSectionForm.sectionName = "";
          this.newSectionForm.sectionSlug = "";
          this.newSectionForm.sectionLogo = "";
          this.addNewSectionDialog = false;
        })
        .finally(() => loading.hide());
    },
    selectImage() {
      this.$refs.uploadsBottomSheet.open();
    },
    setImagePath(path) {
      this.$refs.uploadsBottomSheet.close();
      this.newSectionForm.sectionLogo = path;
    },
  },
};
</script>

<style>
</style>