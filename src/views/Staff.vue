<template>
  <div id="staff" class="pa-10">
    <v-app-bar app>
      <v-toolbar-title>الكادر</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="addNewStaffDialog = true">
        <v-icon>la-plus</v-icon>
      </v-btn>
    </v-app-bar>
    <v-card>
      <v-data-table :headers="tableHeader" :items="staff" :loading="isLoading">
        <template v-slot:[`item.staffImage`]="{ item }">
          <v-img
            :src="$baseUrl + item.staffImage"
            height="50px"
            width="50px"
          ></v-img>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            icon
            :to="
              '/' +
              userInfo.sectionSlug +
              '/dashboard/edit/staff/' +
              item.idStaff
            "
          >
            <v-icon :title="item.idStaff">la-edit</v-icon>
          </v-btn>
          <v-btn icon @click="deleteStaff(item.idStaff)">
            <v-icon color="error" title="item.idStaff">la-trash</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog width="500" v-model="addNewStaffDialog" persistent>
      <v-card>
        <v-card-title>اضافة شخص جديد</v-card-title>
        <v-card-text>
          <v-btn color="primary" block @click="selectImage()"
            >اختيار صورة
          </v-btn>
          <br />
          <center>
            <img
              v-if="newStaffForm.staffImage != ''"
              :src="$baseUrl + newStaffForm.staffImage"
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
          <v-text-field
            v-model="newStaffForm.staffName"
            outlined
            label="الاسم"
          ></v-text-field>
          <v-text-field
            v-model="newStaffForm.staffPosition"
            outlined
            label="العنوان الوظيفي"
          ></v-text-field>
          <v-text-field
            v-model="newStaffForm.staffEmail"
            outlined
            label="البريد الالكتروني"
            prefix="duc.edu.iq@"
          ></v-text-field>
          <v-text-field
            v-model="newStaffForm.scopusLink"
            outlined
            label="رابط Scopus"
          ></v-text-field>
          <v-text-field
            v-model="newStaffForm.cvLink"
            outlined
            label="رابط CV"
          ></v-text-field>
          <v-text-field
            v-model="newStaffForm.scholarLink"
            outlined
            label="رابط Scholar"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="addNewStaff()" color="success">اضافة</v-btn>
          <v-spacer> </v-spacer>
          <v-btn @click="addNewStaffDialog = false" color="error">الغاء</v-btn>
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
    staff: [],
    isLoading: true,
    addNewStaffDialog: false,
    tableHeader: [
      { text: "صورة", value: "staffImage" },
      { text: "الاسم", value: "staffName" },
      { text: "العنوان الوظيفي", value: "staffPosition" },
      { text: "الاجراءات", value: "actions" },
    ],
    newStaffForm: {
      staffName: "",
      staffPosition: "",
      staffImage: "",
      cvLink: "",
      scholarLink: "",
      scopusLink: "",
      staffEmail: "",
      sectionId: 0,
    },
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$http
        .get("staff/section/" + this.userInfo.sectionId)
        .then((res) => {
          this.staff = res.data;
        })
        .finally(() => (this.isLoading = false));
    },
    selectImage() {
      this.$refs.uploadsBottomSheet.open();
    },
    setImagePath(path) {
      this.$refs.uploadsBottomSheet.close();
      this.newStaffForm.staffImage = path;
    },
    addNewStaff() {
      this.newStaffForm.sectionId = this.userInfo.sectionId;
      let loading = this.$loading.show();
      this.$http
        .post("staff", this.newStaffForm)
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
    deleteStaff(id) {
      this.$confirm(
        "لا يمكن التراجع بعد حذف المستخدم",
        "هل انت متأكد من حذف المستخدم ؟",
        "warning"
      ).then(() => {
        let loading = this.$loading.show();
        this.$http
          .delete("staff/" + id)
          .then(() => {
            this.fetch();
            this.$toast.open({
              type: "error",
              message: "تم حذف المستخدم",
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