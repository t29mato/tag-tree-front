<template>
  <v-container>
    <v-treeview :items="items"></v-treeview>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { DefaultApiFactory, FabricationProcess } from '@/api/out'

type TreeViewItem = {
  id?: string
  name?: string
  children?: TreeViewItem[]
}

export default Vue.extend({
  filters: {
    truncate(text: string, end: number): string {
      if (text.length > end) {
        return text.slice(0, end) + '...'
      }
      return text
    },
  },
  data() {
    return {
      items: [] as TreeViewItem[],
    }
  },
  computed: {},
  created() {
    this.loadFabricationProcesses()
  },
  methods: {
    generateTree(
      treeViewItem: TreeViewItem,
      fabricationProcesses: FabricationProcess[]
    ): TreeViewItem {
      const children = fabricationProcesses
        .filter((fabricationProcess) => {
          return (
            fabricationProcess.relationships?.parent_id?.data?.id ===
            treeViewItem.id
          )
        })
        .map((value) => {
          return {
            id: value.id,
            name: value.attributes?.name_ja,
          }
        })
      treeViewItem.children = children.map((child) =>
        this.generateTree(child, fabricationProcesses)
      )
      return treeViewItem
    },
    async loadFabricationProcesses() {
      const api = DefaultApiFactory(undefined, process.env.STARRYDATA_API_URL)
      try {
        const { data: fabricationProcesses } = (
          await api.getFabricationProcesses()
        ).data
        if (fabricationProcesses) {
          const parents = fabricationProcesses
            // 親が存在しないものが親
            .filter((fabricationProcess) => {
              return !fabricationProcess.relationships?.parent_id?.data
            })
            .map((parent) => {
              return {
                id: parent.id,
                name: parent.attributes?.name_ja,
              }
            })
            .map((parent) => {
              return this.generateTree(parent, fabricationProcesses)
            })
          this.items = parents
        }
      } catch {
        //
      } finally {
        //
      }
    },
  },
})
</script>
