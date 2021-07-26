<template>
  <v-card height="400" width="256" class="mx-auto">
    <v-navigation-drawer permanent>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Starrydata </v-list-item-title>
          <v-list-item-subtitle>
            Plot Mining from Publications
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" :href="item.path">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Sidebar extends Vue {
  items = [
    { title: 'Dashboard', icon: 'mdi-view-dashboard', path: '/' },
    {
      title: '高分子タグツリー',
      icon: 'mdi-image',
      path: '/tag-tree/1',
    },
    { title: 'タグ一覧', icon: 'mdi-image', path: '/tags/' },
    { title: 'Databasees', icon: 'mdi-image', path: '/databases' },
    { title: 'Papers', icon: 'mdi-help-box', path: '/papers' },
    {
      title: 'Fabrication Processes',
      icon: 'mdi-help-box',
      path: '/fabrication_processes',
    },
  ]

  right = null
}
</script>
