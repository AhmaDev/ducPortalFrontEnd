<template>
  <div  class="pa-10" id="guestPage">
    <v-card>
      <v-card-text>
        <div v-if="page != null" style="overflow: auto;" v-html="$locale == 'en' ? page.pageContentEn : page.pageContent"></div>
        <div v-if="isError">
          <center class="pa-10">
            <h1 style="font-size: 72px">😰</h1>
            <br><br>
            <br><br>

            <h1 style="font-size: 72px">404</h1>
            <br><br>
            <h1>لا يوجد نتائج</h1>
          </center>
        </div>
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
    isError: false,
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
        }).catch(() => {
          this.isError = true;
        })
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>

<style>
</style>