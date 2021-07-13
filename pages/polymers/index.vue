<template>
  <v-container>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ selectedItem.node_id + ': ' + selectedItem.name }}
        </v-card-title>

        <v-card-title>タグを追加</v-card-title>
        <v-container>
          <v-text-field
            v-model="newName"
            label="Main input"
            hide-details="auto"
            @keydown="loadPolymerTags(newName)"
          ></v-text-field>
        </v-container>
        <div v-for="tag in tags" :key="tag.id">
          <v-chip>{{ tag.attributes.name }}</v-chip>
        </div>
        <v-card-actions>
          <v-btn color="error" text @click="addItem()"> Create </v-btn>
        </v-card-actions>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="newName"
            label="Main input"
            hide-details="auto"
          ></v-text-field>

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
import { PolymerTag, StarrydataApiFactory } from 'starrydata-api-client'

// FIX: nameは必須のはず
type TreeViewItem = {
  name: string
  // eslint-disable-next-line camelcase
  node_id: string
  // eslint-disable-next-line camelcase
  tag_id: string
  children: TreeViewItem[]
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
      dialog: true,
      parentId: '',
      newName: '',
      tags: [] as PolymerTag[],
    }
  },
  computed: {},
  created() {
    this.loadPolymerTagTree()
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
        this.loadPolymerTag()
      } catch {
        //
      } finally {
        //
      }
    },
    async addItem() {
      // const item: FabricationProcess = {
      //   id: undefined, // FIXME: nullableのはず
      //   name_ja: this.newName,
      //   parent_id: Number(this.selectedItem.id), // FIXME: 無理なCAST
      // }
      // const api = StarrydataApiFactory(
      //   undefined,load
      //   process.env.STARRYDATA_API_URL
      // )
      try {
        // await api.createApiFabricationProcesses(item)
        this.dialog = false
        this.loadPolymerTagTree()
      } catch {
        //
      } finally {
        //
      }
    },
    async loadPolymerTagTree() {
      const api = StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      )
      try {
        const { data: tagTree } = (await api.retrieveApiPolymerTagTree()).data
        this.items = [tagTree.attributes]
      } catch {
        //
      } finally {
        //
      }
    },
    async loadPolymerTags(name: string) {
      console.log('loadPolymerTags start')
      const api = StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      )
      try {
        const { data: tags } = (
          await api.listApiPolymerTags(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            name
          )
        ).data
        this.tags = tags
        console.log(this.tags)
      } catch {
        //
      } finally {
        //
      }
    },
  },
})
</script>
