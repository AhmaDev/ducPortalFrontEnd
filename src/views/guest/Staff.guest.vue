<template>
  <div class="pa-10" id="guestStaff">
    <v-row>
      <v-col v-for="employee in staff" :key="employee.idStaff" cols="12" md="3">
        <v-card class="pa-5">
          <center>
            <v-avatar color="indigo" size="128">
              <v-img :src="$baseUrl + employee.staffImage"></v-img>
            </v-avatar>
            <br />
            <br />
            <h4>{{ employee.staffName }}</h4>
            <p>{{ employee.staffPosition }}</p>
          </center>
          <v-card-actions>
            <v-btn :to="'staff/' + employee.idStaff" block color="primary"
              >{{$t('profile')}}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  metaInfo() {
    return {
      title: "الكادر",
      titleTemplate: "%s - Dijla University",
      htmlAttrs: {
        lang: "en",
        amp: true,
      },
    };
  },
  data: () => ({
    staff: [],
    isLoading: true,
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$http.get("staff/slug/" + this.$route.params.section).then((res) => {
        this.staff = res.data;
        this.isLoading = false;
      });
    },
  },
};
</script>

<style>
</style>