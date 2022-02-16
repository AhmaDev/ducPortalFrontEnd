<template>
  <div v-if="page != null" class="pa-10" id="guestPage">
    <v-card>
      <v-card-text>
        <div v-html="$locale == 'en' ? page.pageContentEn : page.pageContent"></div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  metaInfo() {
    return {
      title: this.title,
      titleTemplate: "%s - Dijla University",
      htmlAttrs: {
        lang: "en",
        amp: true,
      },
    };
  },
  data: () => ({
    title: "",
    page: null,
    isLoading: true,
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$http
        .get("pages/" + this.$route.params.id)
        .then((res) => {
          this.page = res.data;
          this.title = res.data.pageTitle;
        })
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>

<style>
</style>