<template>
  <!-- App.vue -->

  <v-app>
    <!-- <v-navigation-drawer app>
      <Sidebar />
    </v-navigation-drawer> -->

    <v-app-bar app>
      <v-btn @click="$auth.logout()">logout</v-btn>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>
