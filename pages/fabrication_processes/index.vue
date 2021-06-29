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
          <v-text-field
            v-model="newName"
            label="Main input"
            hide-details="auto"
          ></v-text-field>
          <v-btn color="error" text @click="addItem()"> Create </v-btn>

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
import { StarrydataApiFactory, FabricationProcess } from '@/api/out'

// FIX: nameは必須のはず
type TreeViewItem = {
  id: string
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
      selectedItem: {} as TreeViewItem,
      dialog: false,
      parentId: '',
      newName: '',
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
      const api = StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      )
      try {
        await api.destroyApiFabricationProcessesId(id)
        this.dialog = false
        this.loadFabricationProcesses()
      } catch {
        //
      } finally {
        //
      }
    },
    async addItem() {
      const item: FabricationProcess = {
        id: undefined, // FIXME: nullableのはず
        name_ja: this.newName,
        parent_id: Number(this.selectedItem.id), // FIXME: 無理なCAST
      }
      const api = StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      )
      try {
        await api.createApiFabricationProcesses(item)
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
      const api = StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      )
      try {
        const { data: fabricationProcesses } = (
          await api.listApiFabricationProcesses()
        ).data
        if (fabricationProcesses) {
          const parents = fabricationProcesses
            // 親が存在しないものが親
            .filter((process) => {
              return !process.relationships?.parent_id?.data
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
