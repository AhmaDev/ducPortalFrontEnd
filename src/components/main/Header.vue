<template>
  <div id="header">
    <v-app-bar
      :color="$vuetify.theme.dark ? '#222222C7' : '#FFFFFFCB'"
      style="backdrop-filter: blur(10px)"
      prominent
      shrink-on-scroll
      app
    >
      <v-btn @click="darkMode()" v-if="$vuetify.theme.dark" icon>
        <v-icon>la-sun</v-icon>
      </v-btn>
      <v-btn @click="darkMode()" v-if="!$vuetify.theme.dark" icon>
        <v-icon>la-moon</v-icon>
      </v-btn>
      <v-menu open-on-hover bottom offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-translate</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="setLocale('ar')" link>
            <v-list-item-title>العربية</v-list-item-title>
          </v-list-item>
          <v-list-item @click="setLocale('en')" link>
            <v-list-item-title>English</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-spacer></v-spacer>
      <img
        style="
          transition: 300ms;
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
        "
        :src="$baseUrl + section.sectionLogo"
        alt=""
        :height="logoHeight"
      />
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>la-youtube</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>la-instagram</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>la-twitter</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>la-facebook</v-icon>
      </v-btn>
      <template v-slot:extension>
        <v-tabs show-arrows v-if="menu != null" centered>
          <v-tab :to="'/' + section.sectionSlug + '/home'">{{$t('home')}}</v-tab>
          <v-tab :to="'/' + section.sectionSlug + '/staff'">{{$t('staff')}}</v-tab>
          <v-tab :to="'/' + section.sectionSlug + '/lessons'"
            >{{$t('lessons')}}</v-tab
          >
          <v-tab
            :href="
              link.isExternalLink == 1
                ? link.externalLink
                : '/' + section.sectionSlug + '/page/' + link.pageId
            "
            v-for="link in menuChild(0)"
            :key="link.idMenuContent"
          >
            <v-menu open-on-hover offset-y>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">
                  {{ $locale == "en" ? link.titleEn : link.title }}
                  <v-icon
                    left
                    v-if="menuChild(link.idMenuContent).length > 0"
                    size="12"
                    >la-angle-down</v-icon
                  >
                </span>
              </template>
              <v-list v-if="menuChild(link.idMenuContent).length > 0">
                <v-list-item
                  :href="
                    item.isExternalLink == 1
                      ? item.externalLink
                      : '/' + section.sectionSlug + '/page/' + item.pageId
                  "
                  v-for="item in menuChild(link.idMenuContent)"
                  :key="item.idMenuContent"
                >
                  <v-list-item-title>{{ $locale == "en" ? item.titleEn : item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  props: {
    section: Object,
    menu: Object,
    logoHeight: Number,
  },
  data: () => ({}),
  methods: {
    menuChild(child) {
      return this.menu.childs.filter((link) => link.parent == child);
    },
    darkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("darkMode", this.$vuetify.theme.dark);
    },
    setLocale(lang) {
      localStorage.setItem("locale", lang);
      location.reload();
    },
  },
};
</script>

<style>
</style>