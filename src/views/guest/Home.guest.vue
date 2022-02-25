<template>
  <div v-if="section != null" id="geustHome">
    <div dir="ltr" v-if="sliderPosts.length > 0" id="mainSlider">
      <vue-glide :options="mainSliderOptions">
        <vue-glide-slide
          v-for="post in sliderPosts"
          :key="'Slider_' + post.idPost"
        >
          <router-link :to="'/' + section.sectionSlug + '/post/' + post.idPost">
            <div
              class="ducSlide"
              :style="
                'background-image: url(' + $baseUrl + post.postImage + ')'
              "
            >
              <div class="sliderContent">
                {{ $locale == "en" ? post.postTitleEn : post.postTitle }}
              </div>
            </div>
          </router-link>
        </vue-glide-slide>
      </vue-glide>
    </div>

    <div dir="ltr" class="divider divider-center">
      <div class="divider-content">{{ $t("sectionNews") }}</div>
    </div>

    <div dir="ltr" v-if="posts.length > 0" id="latestNews">
      <vue-glide v-if="posts.length > 0" :options="postsSliderOptions">
        <vue-glide-slide v-for="post in posts" :key="'NEWS_' + post.idPost">
          <v-card
            :to="'/' + section.sectionSlug + '/post/' + post.idPost"
            class="ma-5"
          >
            <v-img
              :src="$baseUrl + post.postImage"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="200px"
            >
              <v-card-title>
                {{ $locale == "en" ? post.postTitleEn : post.postTitle }}
              </v-card-title>
              <v-card-subtitle>
                <v-icon right small dark> la-clock </v-icon>
                <small>{{ post.createdAt }}</small>
              </v-card-subtitle>
            </v-img>
          </v-card>
        </vue-glide-slide>
      </vue-glide>
    </div>

    <div dir="ltr" class="divider divider-center">
      <div class="divider-content">{{ $t("sectionAbout") }}</div>
    </div>

    <v-alert
      class="mx-10"
      color="cyan"
      border="left"
      colored-border
      icon="la-info"
    >
      <pre>
        {{ $locale == "en" ? section.aboutEn : section.about }}
      </pre>
    </v-alert>

    <div dir="ltr" class="divider divider-center">
      <div class="divider-content">{{ $t("sectionMessage") }}</div>
    </div>

    <v-alert
      class="mx-10"
      color="error"
      border="left"
      colored-border
      icon="la-sms"
    >
      <pre>
        {{ $locale == "en" ? section.messageEn : section.message }}
     </pre
      >
    </v-alert>

    <div dir="ltr" class="divider divider-center">
      <div class="divider-content">{{ $t("sectionVision") }}</div>
    </div>

    <v-alert
      class="mx-10"
      color="warning"
      border="left"
      colored-border
      icon="la-eye"
    >
      <pre>
        {{ $locale == "en" ? section.visionEn : section.vision }}
     </pre
      >
    </v-alert>

    <div dir="ltr" class="divider divider-center">
      <div class="divider-content">{{ $t("sectionGoals") }}</div>
    </div>

    <v-alert
      class="mx-10"
      color="success"
      border="left"
      colored-border
      icon="la-check-circle"
    >
      <pre>
        {{ $locale == "en" ? section.goalsEn : section.goals }}
      </pre>
    </v-alert>

    <div dir="ltr" class="divider divider-center">
      <div class="divider-content">{{ $t("sectionPhotos") }}</div>
    </div>

    <div class="px-10">
      <v-row>
        <v-col v-for="photo in photos" :key="photo.idGallary" cols="6" md="2">
          <v-card @click="showImage(photo.image)">
            <v-img :src="$baseUrl + photo.image" height="200"></v-img>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <br /><br /><br /><br />

    <v-dialog v-model="imageModal" width="800">
      <img :src="$baseUrl + selectedImage" width="100%" alt="">
    </v-dialog>
  </div>
</template>

<script>
export default {
  metaInfo() {
    return {
      title: this.title,
      titleTemplate: "%s - Dijla University",
      htmlAttrs: {
        lang: this.$locale,
        amp: true,
      },
    };
  },
  data: () => ({
    title: "",
    section: null,
    sliderPosts: [],
    posts: [],
    photos: [],
    imageModal: false,
    selectedImage: "",
    mainSliderOptions: {
      autoplay: 4000,
      type: "slider",
      perView: 1,
      gap: 0,
      startAt: 0,
      peek: 0,
      hoverpause: false,
      breakpoints: {
        800: {
          peek: 0,
        },
      },
    },
    postsSliderOptions: {
      autoplay: 4000,
      type: "carousal",
      perView: 4,
      gap: 10,
      direction: localStorage.getItem("locale") == "en" ? "ltr" : "rtl",
      startAt: 0,
      peek: 0,
      hoverpause: true,
      breakpoints: {
        800: {
          gap: 0,
          perView: 2,
        },
      },
    },
  }),
  created: function () {
    this.$http
      .get("sections/slug/" + this.$route.params.section)
      .then((res) => {
        this.section = res.data;
        this.title = res.data.sectionName;
        localStorage.setItem("geustSectionInfo", JSON.stringify(this.section));
        this.$http
          .get("posts/slider/section/" + this.section.idSection)
          .then((res) => {
            this.sliderPosts = res.data;
          });
        this.$http
          .get("posts/section/" + this.section.idSection)
          .then((res) => {
            this.posts = res.data;
          });
        this.$http
          .get("photos/section/" + this.section.idSection)
          .then((res) => {
            this.photos = res.data;
          });
      });
  },
  methods: {
    showImage(url) {
      this.selectedImage = url;
      this.imageModal = true;
    }
  }
};
</script>

<style>
</style>