<template>
  <div v-if="menu != null" id="menuBuilder" class="pa-10">
    <v-app-bar app>
      <v-toolbar-title>القوائم</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="error" @click="deleteMenu(menu.idMenu)">
          حذف القوائم ومحتوياتها
      </v-btn>
    </v-app-bar>
    <v-card style="overflow-x: scroll" class="pa-10">
      <table width="100%">
        <tr>
          <td
            width="100px"
            v-for="link in menuChild(0)"
            :key="link.idMenuContent"
          >
            <v-btn @click="deleteLink(link.idMenuContent)" block color="primary">
              <v-icon left>la-trash</v-icon>
              {{ link.title }}
            </v-btn>
            <v-btn
              v-for="childLink in menuChild(link.idMenuContent)"
              :key="childLink.idMenuContent"
              @click="deleteLink(childLink.idMenuContent)"
              block
              color="success"
              class="my-1"
            >
              <v-icon left>la-trash</v-icon>
              {{ childLink.title }}</v-btn
            >
            <v-btn
              block
              @click="
                addNewLinkForm.parent = link.idMenuContent;
                addNewLinkDialog = true;
              "
            >
              <v-icon left>la-plus</v-icon>
              اضافة رابط جديد
            </v-btn>
          </td>
          <td>
            <v-btn
              @click="
                addNewLinkForm.parent = 0;
                addNewLinkDialog = true;
              "
            >
              <v-icon left>la-plus</v-icon>
              اضافة رابط جديد
            </v-btn>
          </td>
        </tr>
      </table>
    </v-card>

    <v-dialog max-width="500" v-model="addNewLinkDialog">
      <v-card>
        <v-card-title>اضافة رابط جديد</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <br />
          <v-select
            :items="linkTypes"
            item-text="text"
            item-value="value"
            outlined
            label="نوع الرابط"
            v-model="addNewLinkForm.isExternalLink"
          ></v-select>
          <div v-if="addNewLinkForm.isExternalLink == 0">
            <v-autocomplete
              :items="pages"
              v-model="addNewLinkForm.pageId"
              item-value="idPage"
              item-text="pageTitle"
              outlined
              label="اختيار الصفحة"
            ></v-autocomplete>
          </div>
          <div v-else>
            <v-text-field
              outlined
              label="العنوان"
              v-model="addNewLinkForm.title"
            ></v-text-field>
            <v-text-field
              outlined
              label="العنوان الانجليزي"
              v-model="addNewLinkForm.titleEn"
            ></v-text-field>
            <v-text-field
              outlined
              label="الرابط"
              v-model="addNewLinkForm.externalLink"
            ></v-text-field>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn @click="addNewLink()" color="success">اضافة</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="addNewLinkDialog = false" color="error">الغاء</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    menu: null,
    addNewLinkDialog: false,
    addNewLinkForm: {
      title: null,
      titleEn: null,
      pageId: 0,
      isExternalLink: 0,
      externalLink: "#",
      parent: 0,
      menuId: 0,
    },
    linkTypes: [
      { text: "صفحة", value: 0 },
      { text: "رابط خارجي", value: 1 },
    ],
    pages: [],
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      let loading = this.$loading.show();
      this.$http
        .get("menus/section/" + this.userInfo.sectionId)
        .then((res) => {
          this.menu = res.data;
        })
        .catch(() => {
          this.$http
            .post("menus", {
              sectionId: this.userInfo.sectionId,
            })
            .then(() => {
              location.reload();
            });
        })
        .finally(() => loading.hide());
      this.$http.get("pages/section/" + this.userInfo.sectionId).then((res) => {
        this.pages = res.data;
      });
    },
    addNewLink() {
      this.addNewLinkForm.menuId = this.menu.idMenu;
      if (this.addNewLinkForm.isExternalLink == 0) {
        this.addNewLinkForm.title = this.pages.filter(
          (e) => e.idPage == this.addNewLinkForm.pageId
        )[0].pageTitle;
        this.addNewLinkForm.titleEn = this.pages.filter(
          (e) => e.idPage == this.addNewLinkForm.pageId
        )[0].pageTitleEn;
      }
      let loading = this.$loading.show();
      this.$http
        .post("menus/content", this.addNewLinkForm)
        .then(() => {
          this.$toast.open({
            type: "success",
            message: "تم التحديث",
            duration: 3000,
          });
          this.fetch();
          this.addNewLinkDialog = false;
        })
        .finally(() => loading.hide());
    },
    deleteLink(id) {
      this.$confirm(
        "لا يمكن التراجع بعد حذف الرابط",
        "هل انت متأكد من حذف الرابط ؟",
        "warning"
      ).then(() => {
        let loading = this.$loading.show();
        this.$http
          .delete("menus/content/" + id)
          .then(() => {
            this.fetch();
            this.$toast.open({
              type: "error",
              message: "تم حذف الرابط",
              duration: 3000,
            });
          })
          .finally(() => loading.hide());
      });
    },
    deleteMenu(id) {
      this.$confirm(
        "لا يمكن التراجع بعد حذف القائمة",
        "هل انت متأكد من حذف القائمة ؟",
        "warning"
      ).then(() => {
        let loading = this.$loading.show();
        this.$http
          .delete("menus/" + id)
          .then(() => {
            this.fetch();
            this.$toast.open({
              type: "error",
              message: "تم حذف القائمة",
              duration: 3000,
            });
          })
          .finally(() => loading.hide());
      });
    },
    menuChild(child) {
      return this.menu.childs.filter((link) => link.parent == child);
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

<style scoped>
#menuBuilder table tr td {
  vertical-align: top !important;
}
</style>