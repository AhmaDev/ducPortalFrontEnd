<template>
  <div v-if="staff != null" id="staffProfile" class="pa-10">
    <v-container fluid>
      <v-layout column>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-flex class="mb-4">
                  <center>
                    <v-avatar size="164" class="mr-4">
                      <img :src="$baseUrl + staff.staffImage" alt="Avatar" />
                    </v-avatar>
                    <br /><br />
                    <h2>{{ staff.staffName }}</h2>
                    <br />
                    <p>{{ staff.staffPosition }}</p>
                  </center>
                </v-flex>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col cols="12" md="9">
                <v-list>
                  <v-list-item two-line>
                    <v-list-item-avatar>
                      <v-icon>la-info-circle</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title> {{$t('cv')}} </v-list-item-title>
                      <v-list-item-subtitle>
                        <a :href="staff.cvLink" target="_BLANK">{{
                          staff.cvLink
                        }}</a>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>

                  <v-list-item two-line>
                    <v-list-item-avatar>
                      <v-icon>la-newspaper</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title> Scopus </v-list-item-title>
                      <v-list-item-subtitle>
                        <a :href="staff.scopusLink" target="_BLANK">{{
                          staff.scopusLink
                        }}</a>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>

                  <v-list-item two-line>
                    <v-list-item-avatar>
                      <v-icon>la-graduation-cap</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title> Google Scholar </v-list-item-title>
                      <v-list-item-subtitle>
                        <a :href="staff.scholarLink" target="_BLANK">{{
                          staff.scholarLink
                        }}</a>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>

                  <v-list-item two-line>
                    <v-list-item-avatar>
                      <v-icon>la-envelope</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title> {{$t('email')}} </v-list-item-title>
                      <v-list-item-subtitle>
                        <a
                          :href="'mailto:' + staff.staffEmail + '@duc.edu.iq'"
                          target="_BLANK"
                        >
                          {{ staff.staffEmail }}@duc.edu.iq
                        </a>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    staff: null,
    isLoading: true,
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$http
        .get("staff/" + this.$route.params.id)
        .then((res) => {
          this.staff = res.data;
        })
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>

<style>
</style>