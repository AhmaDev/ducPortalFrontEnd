<template>
  <div class="pa-10" id="lessons">
    <v-app-bar app>
      <v-toolbar-title>المواد الدراسية</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="addNewLessonDialog = true">
        <v-icon>la-plus</v-icon>
      </v-btn>
    </v-app-bar>

    <v-row>
      <v-col cols="4">
        <v-card class="pa-10">
          <template v-for="level in levels">
            <v-list-item :key="level.level + '_level'">
              <v-list-item-icon>
                <v-icon> la-folder </v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ level.levelName }}</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="selectLesson(lesson.idLesson)"
              style="margin-right: 30px"
              v-for="lesson in lessons.filter(
                (e) => e.lessonLevel == level.level
              )"
              :key="lesson.idLesson"
            >
              <v-list-item-icon>
                <v-icon> la-file </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ lesson.lessonName }}
              </v-list-item-title>
            </v-list-item>
            <v-divider :key="level.level + '_level_Devider'"></v-divider>
          </template>
        </v-card>
      </v-col>
      <v-col cols="8" v-if="selectedLesson != 0">
        <v-card>
          <v-data-table :items="files" :headers="filesHeader">
            <template v-slot:top>
              <v-row class="pa-5">
                <v-col cols="5">
                  <v-text-field
                    outlined
                    hide-details
                    dense
                    label="تعديل اسم الدرس"
                    @change="changeLessonName($event)"
                    :value="
                      lessons.filter((l) => l.idLesson == selectedLesson)[0]
                        .lessonName
                    "
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-btn block @click="addNewFileDialog = true" color="success"
                    >اضافة ملف جديد</v-btn
                  >
                </v-col>
                <v-col>
                  <v-btn @click="deleteLesson()" color="error"
                    >حذف المادة وجميع الملفات الخاصة بها</v-btn
                  >
                </v-col>
              </v-row>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn :href="$baseUrl + item.url" target="_blank" icon>
                <v-icon :title="item.idPost">la-external-link-alt</v-icon>
              </v-btn>
              <v-btn icon @click="deleteFile(item.idFile)">
                <v-icon color="error" :title="item.idFile">la-trash</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="addNewLessonDialog" persistent max-width="500">
      <v-card>
        <v-card-title> اضافة مادة جديدة </v-card-title>
        <v-divider></v-divider>
        <br />
        <v-card-text>
          <v-text-field
            outlined
            label="اسم المادة"
            v-model="newLessonForm.lessonName"
          ></v-text-field>
          <v-autocomplete
            :items="levels"
            v-model="newLessonForm.lessonLevel"
            item-value="level"
            item-text="levelName"
            outlined
            label="المرحلة الدراسية"
          ></v-autocomplete>
        </v-card-text>
        <v-divider></v-divider>
        <br />
        <v-card-actions>
          <v-btn color="success" @click="addNewLesson()">اضافة</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="addNewLessonDialog = false">الغاء</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-if="lessons.length > 0"
      v-model="addNewFileDialog"
      persistent
      max-width="500"
    >
      <v-card>
        <v-card-title> اضافة ملف جديد للمادة </v-card-title>
        <v-divider></v-divider>
        <br />
        <v-card-text>
          <v-text-field
            outlined
            label="عنوان الدرس"
            v-model="newFileForm.title"
          ></v-text-field>
          <v-btn color="primary" block @click="selectImage()"
            >اختيار ملف
          </v-btn>
          <br />
          <v-text-field
            disabled
            outlined
            :value="$baseUrl + newFileForm.url"
          ></v-text-field>
          <vue-bottom-sheet
            max-width="70%"
            max-height="90%"
            ref="uploadsBottomSheet"
          >
            <Uploads :isDialog="true" @clicked="setImagePath" />
          </vue-bottom-sheet>
        </v-card-text>
        <v-divider></v-divider>
        <br />
        <v-card-actions>
          <v-btn color="success" @click="addNewFile()">اضافة</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="addNewFileDialog = false">الغاء</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Uploads from "../components/Upload.vue";

export default {
  components: {
    Uploads,
  },
  data: () => ({
    addNewLessonDialog: false,
    addNewFileDialog: false,
    files: [],
    filesHeader: [
      { text: "اسم الدرس", value: "title" },
      { text: "الاجراءات", value: "actions" },
    ],
    newLessonForm: {
      lessonName: null,
      lessonLevel: 1,
      sectionId: 0,
    },
    newFileForm: {
      title: null,
      url: null,
      lessonId: 0,
    },
    lessons: [],
    selectedLevel: 1,
    selectedLesson: 0,
    levels: [
      { level: 1, levelName: "المرحلة الاولى" },
      { level: 2, levelName: "المرحلة الثانية" },
      { level: 3, levelName: "المرحلة الثالثة" },
      { level: 4, levelName: "المرحلة الرابعة" },
      { level: 5, levelName: "المرحلة الخامسة" },
    ],
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      let loading = this.$loading.show();
      this.$http
        .get("lessons/section/" + this.userInfo.sectionId)
        .then((res) => {
          this.lessons = res.data;
        })
        .finally(() => loading.hide());
    },
    addNewLesson() {
      let loading = this.$loading.show();
      this.newLessonForm.sectionId = this.userInfo.sectionId;
      this.$http
        .post("lessons", this.newLessonForm)
        .then(() => {
          this.$toast.open({
            type: "success",
            message: "تم التحديث",
            duration: 3000,
          });
          this.fetch();
          this.addNewLessonDialog = false;
          this.newLessonForm = {
            lessonName: null,
            lessonLevel: 1,
            sectionId: 0,
          };
        })
        .finally(() => loading.hide());
    },
    selectLesson(id) {
      this.selectedLesson = id;
      let loading = this.$loading.show();
      this.$http
        .get("files/lesson/" + this.selectedLesson)
        .then((res) => {
          this.files = res.data;
        })
        .finally(() => loading.hide());
    },
    selectImage() {
      this.$refs.uploadsBottomSheet.open();
    },
    setImagePath(path) {
      this.$refs.uploadsBottomSheet.close();
      this.newFileForm.url = path;
    },
    addNewFile() {
      let loading = this.$loading.show();
      this.newFileForm.lessonId = this.selectedLesson;
      this.$http
        .post("files", this.newFileForm)
        .then(() => {
          this.$toast.open({
            type: "success",
            message: "تم التحديث",
            duration: 3000,
          });
          this.newFileForm = {
            title: null,
            url: null,
            lessonId: 0,
          };
          this.selectLesson(this.selectedLesson);
        })
        .finally(() => loading.hide());
    },
    changeLessonName(e) {
      let loading = this.$loading.show();
      this.$http
        .put("lessons/" + this.selectedLesson, {
          lessonName: e,
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
    deleteLesson() {
      this.$confirm(
        "لا يمكن التراجع بعد حذف المادة",
        "هل انت متأكد من حذف المادة ؟",
        "warning"
      ).then(() => {
        let loading = this.$loading.show();
        this.$http
          .delete("lessons/" + this.selectedLesson)
          .then(() => {
            this.fetch();
            this.$toast.open({
              type: "error",
              message: "تم حذف المادة",
              duration: 3000,
            });
            this.selectedLesson = 0;
          })
          .finally(() => loading.hide());
      });
    },
    deleteFile(fileId) {
      this.$confirm(
        "لا يمكن التراجع بعد حذف الدرس",
        "هل انت متأكد من حذف الدرس ؟",
        "warning"
      ).then(() => {
        let loading = this.$loading.show();
        this.$http
          .delete("files/" + fileId)
          .then(() => {
            this.selectLesson(this.selectedLesson);
            this.$toast.open({
              type: "error",
              message: "تم حذف الدرس",
              duration: 3000,
            });
          })
          .finally(() => loading.hide());
      });
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