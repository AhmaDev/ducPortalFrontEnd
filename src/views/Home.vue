<template>
  <div v-if="section != null" id="homePage">
    <Header :menu="menu" :section="section" :logoHeight="logoHeight" />
    <router-view />
    <Footer :section="section" />
  </div>
</template>

<script>
import Header from "../components/main/Header.vue";
import Footer from "../components/main/Footer.vue";

export default {
  name: "Home",
  components: {
    Header,
    Footer,
  },
  data: () => ({
    section: null,
    menu: null,
    isLoading: true,
    logoHeight: 170,
  }),
  created: function () {
    window.addEventListener("scroll", this.handleScroll);
    this.fetch();
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    fetch() {
      this.$http
        .get("sections/slug/" + this.$route.params.section)
        .then((res) => {
          this.section = res.data;
          document.title = this.section.sectionName;
          this.$http
            .get("menus/section/" + this.section.idSection)
            .then((res) => {
              this.menu = res.data;
            });
          this.isLoading = false;
        });
    },
    handleScroll(e) {
      var currentPosition = e.target.documentElement.scrollTop;
      if (currentPosition > 50) {
        this.logoHeight = 50;
      } else {
        this.logoHeight = 170;
      }
    },
  },
};
</script>

<style>
.ducSlide {
  height: 600px;
  width: 100%;
  background-size: cover;
  position: relative;
}
#mainSlider .glide__slide {
  transition: 0.3s;
}

.glide div[data-glide-el="controls"] {
  text-align: center;
}
.glide__slides {
  padding-left: 0 !important;
}
.sliderContent {
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  font-size: 24px;
  color: #fff;
  backdrop-filter: blur(10px);
}
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.8;
  position: absolute;
  width: 100%;
}
</style>