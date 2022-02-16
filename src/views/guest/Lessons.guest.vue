<template>
  <div class="pa-10" id="lessons">
    <v-row align="start">
      <v-col cols="12" md="4">
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
              :style=" $locale == 'en' ? 'margin-left: 30px' :'margin-right: 30px'"
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
      <v-col cols="12" md="8" v-if="selectedLesson != 0">
        <v-card>
          <v-data-table :items="files" :headers="filesHeader">
            <template v-slot:top>
              <v-row class="pa-5">
                <v-col cols="5">
                  {{
                    lessons.filter((l) => l.idLesson == selectedLesson)[0]
                      .lessonName
                  }}
                </v-col>
              </v-row>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                :href="$baseUrl + item.url"
                target="_blank"
                color="success"
              >
                <v-icon left :title="item.idPost">la-download</v-icon>
                تحميل
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  metaInfo() {
    return {
      title: "المواد الدراسية",
      titleTemplate: "%s - Dijla University",
      htmlAttrs: {
        lang: "en",
        amp: true,
      },
    };
  },
  data: () => ({
    files: [],
    filesHeader: [
      { text: "اسم الدرس", value: "title" },
      { text: "الاجراءات", value: "actions" },
    ],
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
        .get("lessons/slug/" + this.$route.params.section)
        .then((res) => {
          this.lessons = res.data;
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
  },
};
</script>

<style>
</style>