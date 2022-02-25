<template>
  <div id="footer">
    <v-footer dark padless>
      <v-card
        width="100%"
        flat
        tile
        class="dark lighten-1 white--text text-center"
      >
        <v-card-text class="white--text pt-0"> </v-card-text>
        <img style="filter: grayscale(1); opacity: 0.4;" :src="$baseUrl + section.sectionLogo" height="200" alt="">
        <v-divider></v-divider>

        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} — <strong>Dijlah University</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </div>
</template>

<script>
export default {
  props: {
    section: Object,
  },
};
</script>

<style>
</style>