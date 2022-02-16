<template>
  <div v-if="post != null" class="pa-10" id="guestPost">
    <v-card>
      <v-img
        :src="$baseUrl + post.postImage"
        height="300px"
        class="white--text align-end"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
      >
        <v-card-title>
          <h2>{{ $locale == "en" ? post.postTitleEn : post.postTitle }}</h2>
        </v-card-title>
      </v-img>

      <v-list dense>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>la-clock</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{$t('postedOn')}} {{ post.createdAt }}</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>la-user</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{$t('postedBy')}} {{ post.createdByName }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-card-text>
        <div v-html="$locale == 'en' ? post.postContentEn : post.postContent"></div>
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
    title: '',
    post: null,
    isLoading: true,
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$http
        .get("posts/" + this.$route.params.id)
        .then((res) => {
          this.post = res.data;
          this.title = res.data.postTitle;
        })
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>

<style>
</style>