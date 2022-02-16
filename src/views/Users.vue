<template>
  <div id="users" class="pa-10">
    <v-app-bar app>
      <v-toolbar-title>المستخدمين</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="addNewUserDialog = true">
          <v-icon>la-plus</v-icon>
      </v-btn>
    </v-app-bar>
    <v-card>
      <v-data-table :loading="isLoading" :items="users" :headers="tableHeader">
        <template v-slot:[`item.userName`]="{ item }">
          <v-text-field
            outlined
            dense
            hide-details
            :value="item.userName"
            @change="changeUserName(item.idUser, $event)"
          ></v-text-field>
        </template>
        <template v-slot:[`item.sectionId`]="{ item }">
          <v-autocomplete
            outlined
            dense
            hide-details
            :items="sections"
            item-text="sectionName"
            item-value="idSection"
            :value="item.sectionId"
            @change="changeSectionId(item.idUser, $event)"
          ></v-autocomplete>
        </template>
        <template v-slot:[`item.roleId`]="{ item }">
          <v-autocomplete
            outlined
            dense
            hide-details
            :items="roles"
            item-text="roleName"
            item-value="idRole"
            :value="item.roleId"
            @change="changeRoleId(item.idUser, $event)"
          ></v-autocomplete>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon @click="changePassword(item.idUser)">
            <v-icon :title="item.idInvoice">mdi-key</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="passwordDialog" width="500">
      <v-card>
        <v-card-title> تغيير كلمة المرور </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="newPasswordField"
            outlined
            hide-details
            type="password"
            label="كلمة المرور الجديدة"
          ></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="changePasswordConfirm()">
            تغيير
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog persistent width="500" v-model="addNewUserDialog">
      <v-card>
        <v-card-title class="text-h5"> اضافة مستخدم جديد </v-card-title>
        <v-card-text>
          <br />
          <v-text-field
            v-model="newUserForm.userName"
            outlined
            label="اسم المستخدم"
          ></v-text-field>
          <v-text-field
            v-model="newUserForm.password"
            outlined
            label="كلمة المرور"
            type="password"
          ></v-text-field>
          <v-autocomplete
            outlined
            label="الدور"
            :items="roles"
            item-text="roleName"
            item-value="idRole"
            v-model="newUserForm.roleId"
          ></v-autocomplete>
          <v-autocomplete
            outlined
            label="القسم"
            :items="sections"
            item-text="sectionName"
            item-value="idSection"
            v-model="newUserForm.sectionId"
          ></v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-btn color="success" @click="addNewUser()">اضافة</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" outlined @click="addNewUserDialog = false"
            >الغاء</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    users: [],
    passwordDialog: false,
    newPasswordField: "",
    sections: [],
    selectedUserId: 0,
    addNewUserDialog: false,
    newUserForm: {
      userName: "",
      password: "",
      sectionId: 0,
      roleId: 0,
    },
    isLoading: true,
    tableHeader: [
      { text: "اسم المستخدم", value: "userName" },
      { text: "الدور", value: "roleId" },
      { text: "القسم", value: "sectionId" },
      { text: "الاجراءات", value: "actions" },
    ],
    roles: [
      { idRole: 1, roleName: "Admin" },
      { idRole: 2, roleName: "Website Editor" },
    ],
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$http
        .get("users")
        .then((res) => {
          this.users = res.data;
        })
        .finally(() => (this.isLoading = false));
      this.$http.get("sections").then((res) => {
        this.sections = res.data;
      });
    },
    changePassword(id) {
      this.selectedUserId = id;
      this.passwordDialog = true;
    },
    changePasswordConfirm() {
      let loading = this.$loading.show();
      this.$http
        .put("users/" + this.selectedUserId, {
          password: this.newPasswordField,
        })
        .then(() => {
          this.$toast.open({
            type: "success",
            message: "تم تغيير كلمة المرور",
            duration: 3000,
          });
          this.passwordDialog = false;
          this.selectedUserId = 0;
          this.newPasswordField = "";
        })
        .finally(() => loading.hide());
    },
    changeUserName(userId, e) {
      let loading = this.$loading.show();
      this.$http
        .put("users/" + userId, {
          userName: e,
        })
        .then(() => {
          this.$toast.open({
            type: "success",
            message: "تم التحديث",
            duration: 3000,
          });
        })
        .finally(() => loading.hide());
    },
    changeSectionId(userId, e) {
      let loading = this.$loading.show();
      this.$http
        .put("users/" + userId, {
          sectionId: e,
        })
        .then(() => {
          this.$toast.open({
            type: "success",
            message: "تم التحديث",
            duration: 3000,
          });
        })
        .finally(() => loading.hide());
    },
    changeRoleId(userId, e) {
      let loading = this.$loading.show();
      this.$http
        .put("users/" + userId, {
          roleId: e,
        })
        .then(() => {
          this.$toast.open({
            type: "success",
            message: "تم التحديث",
            duration: 3000,
          });
        })
        .finally(() => loading.hide());
    },
    addNewUser() {
      if (this.newUserForm.userName.length == 0) {
        this.$toast.open({
          type: "error",
          message: "يرجى كتابة اسم المستخدم",
          duration: 3000,
        });
        return;
      }
      if (this.newUserForm.password.length == 0) {
        this.$toast.open({
          type: "error",
          message: "يرجى كتابة كلمة المرور",
          duration: 3000,
        });
        return;
      }
      if (this.newUserForm.roleId == 0) {
        this.$toast.open({
          type: "error",
          message: "يرجى اختيار دور المستخدم",
          duration: 3000,
        });
        return;
      }
      if (this.newUserForm.sectionId == 0) {
        this.$toast.open({
          type: "error",
          message: "يرجى اختيار قسم المستخدم",
          duration: 3000,
        });
        return;
      }
      let loading = this.$loading.show();
      this.$http
        .post("users", this.newUserForm)
        .then(() => {
          this.fetch();
          this.newUserForm.userName = "";
          this.newUserForm.password = "";
          this.newUserForm.sectionId = 0;
          this.newUserForm.roleId = 0;
          this.addNewUserDialog = false;
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