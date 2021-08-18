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
    { title: 'ダッシュボード', icon: 'mdi-view-dashboard', path: '/' },
    {
      title: '熱電材料タグツリー',
      icon: 'mdi-image',
      path: '/tag-tree/1',
    },
    {
      title: '魚類タグツリー',
      icon: 'mdi-fish',
      path: '/tag-tree/4851',
    },
    { title: 'タグ', icon: 'mdi-image', path: '/tags/' },
    { title: 'データベース', icon: 'mdi-image', path: '/databases' },
    { title: '論文', icon: 'mdi-image', path: '/papers' },
  ]

  right = null
}
</script>
