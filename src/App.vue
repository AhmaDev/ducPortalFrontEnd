<template>
  <v-app :style="this.$vuetify.theme.dark ? '' : 'background-color: #EEE'">
    <v-navigation-drawer
      :mini-variant="drawer"
      mini-variant-width="72"
      v-if="isLoggedIn"
      app
      :right="$locale == 'ar'"
      permanent
    >
      <div v-if="!drawer" class="pa-2">
        <v-card class="mx-auto" max-width="344" outlined>
          <v-list-item dense>
            <v-list-item-avatar style="border-radius: 0px">
              <Logo v-if="userInfo.roleName == 'Admin'" :width="32" />
              <img :src="$baseUrl + userInfo.sectionLogo" v-else />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="text-h5 mb-1">
                {{ userInfo.userName }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ userInfo.roleName }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="launchDrawer()">
                <v-icon>la-bars</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-card>
      </div>

      <v-list rounded dense>
        <v-list-item v-if="drawer" @click="launchDrawer()">
          <v-list-item-icon>
            <v-icon>la-bars</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <template v-for="item in items">
          <v-list-item
            v-if="
              item.role == 'All' ||
              item.role.split(',').includes(userInfo.roleName)
            "
            :to="item.route"
            :key="item.title"
            link
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                <span>{{ item.title }}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>

      <template v-slot:append>
        <v-list rounded dense>
          <v-list-item @click="logout()">
            <v-list-item-icon>
              <v-icon>la-power-off</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> تسجيل الخروج </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="darkMode()">
            <v-list-item-icon>
              <v-icon v-if="$vuetify.theme.dark">las la-sun</v-icon>
              <v-icon v-if="!$vuetify.theme.dark">las la-moon</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ $vuetify.theme.dark ? "Light mode" : "Dark mode" }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="infoDialog = true">
            <v-list-item-icon>
              <v-icon>la-info-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> v{{ $appVersion }} </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <br />
      </template>
    </v-navigation-drawer>

    <div class="mainContent">
      <v-main>
        <v-container class="pa-0 mainContent" fluid>
          <vue-page-transition name="fade">
            <!-- <Login v-if="!isLoggedIn" /> -->
            <router-view />
          </vue-page-transition>
            <vue-progress-bar></vue-progress-bar>
        </v-container>
      </v-main>
    </div>

    <v-dialog max-width="400" v-model="infoDialog">
      <v-card dir="ltr">
        <v-card-title>University CMS</v-card-title>
        <v-divider></v-divider>
        <br />
        <v-card-text>
          Developed and designed by: <b>Ahmad Faris</b>
          <br />
          Dijla University: IT Section
          <br />
          <br />
          version: {{ $appVersion }}
          <br />
          Send your feedback to:
          <b><a href="mailto:it.head@duc.edu.iq">it.head@duc.edu.iq</a></b>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import Logo from "./components/Logo.vue";
export default {
  name: "App",
  components: {
    Logo,
  },
  data: () => ({
    drawer: false,
    items: [],
    infoDialog: false,
  }),
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/dashboard");
      setTimeout(() => {
        location.reload();
      }, 1000);
    },
    darkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("darkMode", this.$vuetify.theme.dark);
    },
    launchDrawer() {
      this.drawer = !this.drawer;
      localStorage.setItem("drawer", this.drawer);
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
  mounted: function () {
    this.$Progress.finish();
  },
  created: function () {
    this.$Progress.start();

    let isDarkMode = false;
    if (localStorage.getItem("darkMode") == "true") {
      isDarkMode = true;
    }
    if (localStorage.getItem("drawer") == "true") {
      this.drawer = true;
    }
    this.$vuetify.theme.dark = isDarkMode;
    if (this.userInfo != null) {
      this.items = [
        {
          title: this.$t("home"),
          icon: "las la-home",
          route: "/" + this.userInfo.sectionSlug,
          role: "All",
        },
        {
          title: "معلومات القسم",
          icon: "la-user-circle",
          route:
            "/" +
            this.userInfo.sectionSlug +
            "/dashboard/section/" +
            this.userInfo.sectionId,
          role: "Website Editor",
        },
        {
          title: "القوائم",
          icon: "la-file-alt",
          route: "/" + this.userInfo.sectionSlug + "/dashboard/menu/",
          role: "Website Editor",
        },
        {
          title: "الكادر",
          icon: "la-chalkboard-teacher",
          route: "/" + this.userInfo.sectionSlug + "/dashboard/staff",
          role: "Website Editor",
        },
        {
          title: "المواد الدراسية",
          icon: "la-book",
          route: "/" + this.userInfo.sectionSlug + "/dashboard/lessons",
          role: "Website Editor",
        },
        {
          title: "الصفحات",
          icon: "la-file",
          route: "/" + this.userInfo.sectionSlug + "/dashboard/pages",
          role: "Website Editor",
        },
        {
          title: "اخبار القسم",
          icon: "la-newspaper",
          route: "/" + this.userInfo.sectionSlug + "/dashboard/posts",
          role: "Website Editor",
        },
        {
          title: "معرض الصور",
          icon: "la-photo-video",
          route: "/" + this.userInfo.sectionSlug + "/dashboard/gallary",
          role: "Website Editor",
        },
        {
          title: "الاقسام",
          icon: "la-icons",
          route: "/admin/dashboard/sections",
          role: "Admin",
        },
        {
          title: "الملفات",
          icon: "la-file",
          route: "/" + this.userInfo.sectionSlug + "/dashboard/uploads",
          role: "Admin",
        },
        {
          title: "المستخدمين",
          icon: "la-user",
          route: "/admin/dashboard/users",
          role: "Admin",
        },
      ];
    }
    this.$router.beforeEach((to, from, next) => {
      //  does the page we want to go to have a meta.progress object
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress;
        // parse meta tags
        this.$Progress.parseMeta(meta);
      }
      //  start the progress bar
      this.$Progress.start();
      //  continue to next page
      next();
    });
    //  hook the progress bar to finish after we've finished moving router-view
    this.$router.afterEach((to, from) => {
      //  finish the progress bar
      this.$Progress.finish(to, from);
    });
  },
};
</script>

<style src="./style.css"></style>