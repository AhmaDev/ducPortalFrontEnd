<template>
  <div id="editSection" class="pa-10">
    <v-app-bar app>
      <v-toolbar-title>تعديل معلومات القسم</v-toolbar-title>
    </v-app-bar>
    <v-card class="pa-10" v-if="section != null">
      <v-row>
        <v-col cols="12">
          <v-btn color="primary" block @click="selectImage()"
            >اختيار صورة
          </v-btn>
          <center>
            <img
              v-if="section.sectionLogo != ''"
              :src="$baseUrl + section.sectionLogo"
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
            v-model="section.sectionName"
            outlined
            label="اسم القسم"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="section.sectionNameEn"
            outlined
            label="اسم القسم باللغة الانجليزية"
          ></v-text-field>
        </v-col>
        <v-col dir="ltr" cols="4">
          <v-text-field
            v-model="section.sectionSlug"
            outlined
            readonly
            prefix="https://portal.duc.edu.iq/"
            append-icon="mdi-eye"
            @click:append="
              goTo('https://portal.duc.edu.iq/' + section.sectionSlug + '/')
            "
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <div dir="ltr" class="divider divider-center">
            <div class="divider-content">اللغة العربية</div>
          </div>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="6">
          <div dir="ltr" class="divider divider-center">
            <div class="divider-content">اللغة الانجليزية</div>
          </div>
        </v-col>
        <v-col cols="6">
          <h3>عن القسم</h3>
          <br>
          <tiptap
            v-model="section.about"
          ></tiptap>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="6">
          <h3>عن القسم</h3>
          <br>
          <tiptap
            v-model="section.aboutEn"
          ></tiptap>
        </v-col>
        <v-col cols="6">
          <v-textarea
            outlined
            v-model="section.goals"
            label="الاهداف"
          ></v-textarea>
        </v-col>
        <v-divider vertical></v-divider>

        <v-col cols="6">
          <v-textarea
            outlined
            v-model="section.goalsEn"
            label="الاهداف"
          ></v-textarea>
        </v-col>
        <v-col cols="6">
          <v-textarea
            outlined
            v-model="section.message"
            label="الرسالة"
          ></v-textarea>
        </v-col>
        <v-divider vertical></v-divider>

        <v-col cols="6">
          <v-textarea
            outlined
            v-model="section.messageEn"
            label="الرسالة"
          ></v-textarea>
        </v-col>
        <v-col cols="6">
          <v-textarea
            outlined
            v-model="section.vision"
            label="الرؤية"
          ></v-textarea>
        </v-col>
        <v-divider vertical></v-divider>

        <v-col cols="6">
          <v-textarea
            outlined
            v-model="section.visionEn"
            label="الرؤية"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-btn color="success" @click="save()" block>حفظ</v-btn>
    </v-card>
  </div>
</template>

<script>
import Uploads from "../components/Upload.vue";
import Tiptap from "../components/Editor.vue";

export default {
  name: "EditSection",
  components: {
    Uploads,
    Tiptap
  },
  data: () => ({
    section: null,
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      let loading = this.$loading.show();
      this.$http
        .get("sections/" + this.$route.params["id"])
        .then((res) => {
          this.section = res.data;
        })
        .finally(() => loading.hide());
    },
    goTo(link) {
      window.open(link);
    },
    selectImage() {
      this.$refs.uploadsBottomSheet.open();
    },
    setImagePath(path) {
      this.$refs.uploadsBottomSheet.close();
      this.section.sectionLogo = path;
    },
    save() {
      let loading = this.$loading.show();
      this.$http
        .put("sections/" + this.$route.params["id"], this.section)
        .then(() => {
          this.$toast.open({
            type: "success",
            message: "تم تحديث القسم",
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