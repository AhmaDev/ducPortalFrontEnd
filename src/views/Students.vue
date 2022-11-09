<template>
  <div class="pa-10" id="students">
    <v-app-bar app>
      <v-toolbar-title>الطلاب</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="sync()">
        <v-icon left>la-refresh</v-icon>
        <span>نقل البيانات من السيرفر الرئيسي</span>
      </v-btn>
    </v-app-bar>
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="3">
            <v-text-field
              hint="اضغط Enter للبحث"
              outlined
              dense
              v-model="searchStudent"
              @keypress.enter="search($event)"
              label="ابحث عن رقم جامعي"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-data-table :items="students" items-per-page="100" :headers="headers">
          <template v-slot:[`item.isBlocked`]="{ item }">
            <v-chip
              :color="item.isBlocked == 0 ? 'success' : 'error'"
              class="ma-2"
              small
            >
              <v-icon small left>
                  {{ item.isBlocked == 0 ? "" : "la-ban" }}
              </v-icon>
              {{ item.isBlocked == 0 ? "Active" : item.blockReasonTitle }}
            </v-chip>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
              icon
              x-small
              rounded
              color="error"
              @click="
                banModal = true;
                selectedStundet = item.idStudent;
              "
              small
              v-if="item.isBlocked == 0"
            >
              <v-icon>la-ban</v-icon>
            </v-btn>
            <v-btn
              icon
              x-small
              rounded
              color="success"
              @click="
                selectedStundet = item.idStudent;
                unBlockStudent();
              "
              small
              v-if="item.isBlocked == 1"
            >
              <v-icon>la-check</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="banModal" max-width="600">
      <v-card>
        <v-card-title>حظر الطالب</v-card-title>
        <br />
        <v-card-text>
          <v-combobox
            :items="blockReasons"
            item-text="blockReasonTitle"
            item-value="idBlockReason"
            outlined
            label="سبب الحظر"
            v-model="selectedBlockReasons"
            :hide-no-data="!blockReason"
            :search-input.sync="blockReason"
          >
            <template v-slot:no-data>
              <v-list-item @click="addNewReason(blockReason)">
                <span class="subheading">اضافة</span>
                <v-chip label small>
                  {{ blockReason }}
                </v-chip>
              </v-list-item>
            </template></v-combobox
          >
          <v-btn @click="blockStudent()" color="error" block>حظر</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    students: [],
    allStudents: [],
    selectedStundet: null,
    blockReasons: [],
    searchStudent: null,
    selectedBlockReasons: null,
    blockReason: null,
    banModal: false,
    headers: [
      { text: "اسم الطالب", value: "name" },
      { text: "الرقم الاحصائي", value: "collegeNumber" },
      { text: "الايميل", value: "email" },
      { text: "الجنس", value: "gender" },
      { text: "القسم", value: "sectionName" },
      { text: "المرحلة", value: "level" },
      { text: "الحالة", value: "isBlocked" },
      { text: "الاجراءات", value: "actions" },
    ],
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      let loading = this.$loading.show();
      this.$http
        .get("students")
        .then((res) => {
          this.students = res.data;
          this.allStudents = res.data;
          if (this.searchStudent != null && this.searchStudent != "") {
            this.students = this.allStudents.filter(
              (e) => e.collegeNumber.toString() == this.searchStudent.toString()
            );
          }
        })
        .finally(() => loading.hide());
      this.$http.get("blockReasons").then((res) => {
        this.blockReasons = res.data;
      });
    },
    sync() {
      let loading = this.$loading.show();
      this.$mainServerHttp
        .get("http://10.0.3.55:3100/api/getStudents?studentStatusId=1")
        .then((res) => {
          let bulk = [];
          let students = res.data;
          for (let i = 0; i < students.length; i++) {
            let studentData = [
              students[i].studentName,
              students[i].englishName,
              students[i].mail,
              students[i].sectionId,
              students[i].studentLevel[0].level,
              students[i].studentLevel[0].class,
              students[i].collegeNumber,
              students[i].gender ? "male" : "female",
            ];
            bulk.push(studentData);
          }
          this.$http.post("students/multi", bulk).then(() => {
            this.fetch();
          });
        })
        .catch((err) => {
          this.$toast.open({
            type: "error",
            message: "انت غير متصل بالسيرفر الرئيسي",
            title: err,
            duration: 3000,
          });
        })
        .finally(() => loading.hide());
    },
    search(number) {
      if (number.target.value.length == 0) {
        this.students = this.allStudents;
        return;
      }
      this.students = this.allStudents.filter(
        (e) => e.collegeNumber.toString() == number.target.value.toString()
      );
    },
    addNewReason(reason) {
      let loading = this.$loading.show();
      this.$http
        .post("addBlockReason", {
          blockReasonTitle: reason,
        })
        .then(() => {
          this.$http.get("blockReasons").then((res) => {
            this.blockReasons = res.data;
            this.selectedBlockReasons = res.data.filter(
              (e) => e.blockReasonTitle == reason
            )[0];
            loading.hide();
          });
        });
    },
    blockStudent() {
      let loading = this.$loading.show();
      this.$http
        .put("students/" + this.selectedStundet, {
          isBlocked: 1,
          blockReasonId: this.selectedBlockReasons.idBlockReason,
        })
        .then(() => {
          this.$toast.open({
            type: "success",
            message: "تم حظر الطالب",
            duration: 3000,
          });
          this.fetch();
        })
        .finally(() => loading.hide());
    },
    unBlockStudent() {
      let loading = this.$loading.show();
      this.$http
        .put("students/" + this.selectedStundet, {
          isBlocked: 0,
          blockReasonId: 1,
        })
        .then(() => {
          this.$toast.open({
            type: "success",
            message: "تم فتح الحظر عن الطالب",
            duration: 3000,
          });
          this.fetch();
        })
        .finally(() => loading.hide());
    },
  },
};
</script>

<style>
</style>