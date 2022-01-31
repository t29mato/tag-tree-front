<template>
  <!-- App.vue -->

  <v-app>
    <!-- <v-navigation-drawer app>
      <Sidebar />
    </v-navigation-drawer> -->

    <v-app-bar app>
      <v-btn @click="logout()">logout</v-btn>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>

    <!-- <v-footer app> This is footer </v-footer> -->
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  methods: {
    logout() {
      this.$auth.logout()
      this.$router.push('/login')
    },
  },
})
</script>
