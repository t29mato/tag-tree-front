<template>
  <v-container>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ selectedItem.id + ': ' + selectedItem.name }}
        </v-card-title>

        <v-card-text> text text text text text text text text </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-input v-model="parentId"></v-input>
          <v-btn color="error" text @click="createItem()"> Create </v-btn>

          <v-btn color="error" text @click="deleteItem(selectedItem.id)">
            Delete
          </v-btn>
          <v-btn color="primary" text @click="dialog = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-treeview :items="items">
      <template slot="label" slot-scope="{ item }">
        <a @click="openDialog(item)">{{ item.name }}</a>
      </template>
    </v-treeview>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  DefaultApiFactory,
  FabricationProcess,
  FabricationProcessesData,
} from '@/api/out'

// FIX: nameは必須のはず
type TreeViewItem = {
  id: string
  name: string
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
      selectedItem: {} as TreeViewItem,
      dialog: false,
      parentId: '',
    }
  },
  computed: {},
  created() {
    this.loadFabricationProcesses()
  },
  methods: {
    openDialog(e: TreeViewItem) {
      this.dialog = true
      this.selectedItem = e
    },
    async deleteItem(id: string) {
      const api = DefaultApiFactory(undefined, process.env.STARRYDATA_API_URL)
      try {
        await api.deleteFabricationProcessesFabricationProcessId(id)
        this.dialog = false
        this.loadFabricationProcesses()
      } catch {
        //
      } finally {
        //
      }
    },
    async createItem() {
      const item: FabricationProcessesData = {
        type: 'FabricationProcess',
        id: '', // FIXME: nullableのはず
        attributes: {
          name_ja: this.selectedItem.name,
          parent_id: {
            type: 'FabricationProcess',
            id: this.selectedItem.id,
          },
        },
      }
      const api = DefaultApiFactory(undefined, process.env.STARRYDATA_API_URL)
      try {
        await api.postFabricationProcesses({ data: item })
        this.dialog = false
        this.loadFabricationProcesses()
      } catch {
        //
      } finally {
        //
      }
    },
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
