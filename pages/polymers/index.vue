<template>
  <v-container>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{
            selectedTree.node_id + ': ' + selectedTree.name
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="dialog = false"> Save </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-card-title>子タグ一覧</v-card-title>
        <v-container>
          <span v-for="child in selectedTree.children" :key="child.node_id">
            <v-chip class="ma-2" close>{{ child.name }}</v-chip>
          </span>
        </v-container>

        <v-divider></v-divider>

        <v-card-title>タグを追加</v-card-title>
        <v-container>
          <v-text-field
            v-model="newName"
            label="Main input"
            hide-details="auto"
            @keydown="loadPolymerTags(newName)"
          ></v-text-field>
        </v-container>

        <span v-for="tag in tags" :key="tag.id">
          <v-chip
            v-if="tag.attributes"
            class="ma-2"
            close
            close-icon="mdi-plus-circle"
            @click:close="addNode(tag)"
            >{{ tag.attributes.name }}</v-chip
          >
        </span>
        <v-divider></v-divider>

        <v-card-title>タグを削除</v-card-title>
        <v-card-actions>
          <v-btn color="error" text @click="deleteItem(selectedTree.id)">
            Delete
          </v-btn>
          <v-btn color="primary" text @click="dialog = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- タグツリーの初期表示を全てOpenにするため -->
    <div v-if="items.length > 0">
      <v-treeview open-all :items="items">
        <template slot="label" slot-scope="{ item }">
          <a @click="openDialog(item)">{{ item.name }}</a>
        </template>
      </v-treeview>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  PolymerTag,
  StarrydataApiFactory,
  PolymerTagTreeAttributes,
} from 'starrydata-api-client'

// FIX: nameは必須のはず
type TreeViewItem = {
  name: string
  // eslint-disable-next-line camelcase
  node_id: string
  // eslint-disable-next-line camelcase
  polymer_tag_id: string
  // eslint-disable-next-line camelcase
  parent_node_id: string
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
      selectedTree: {} as PolymerTagTreeAttributes,
      dialog: false,
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
      this.loadSelectedTree(e.node_id)
    },
    async deleteItem(id: string) {
      const api = StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      )
      try {
        await api.destroyApiFabricationProcessesId(id)
        this.dialog = false
      } catch {
        //
      } finally {
        //
      }
    },
    async loadPolymerTagTree(id?: string) {
      const api = StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      )
      try {
        // ルートIDが1のため
        const { data: tagTree } = (
          await api.retrieveApiPolymerTagTreeId(id || '1')
        ).data
        this.items = [tagTree.attributes]
      } catch {
        //
      } finally {
        //
      }
    },
    async loadSelectedTree(id: string) {
      const api = StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      )
      try {
        // ルートIDが1のため
        const { data: tagTree } = (
          await api.retrieveApiPolymerTagTreeId(id)
        ).data
        this.selectedTree = tagTree.attributes
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
    async addNode(tag: PolymerTag) {
      // TODO: 祖先に子供がいるかどうかの判定を行うかどうか。
      if (this.selectedTree.polymer_tag_id === tag.id) {
        window.alert(`親ノードと同じタグの子を登録することはできません。`)
        return
      }
      if (
        this.selectedTree.children
          .map((child) => child.polymer_tag_id)
          .includes(tag.id)
      ) {
        window.alert(
          `既に「${this.selectedTree.name}」ノードに「${tag.attributes?.name}」タグは登録されています。`
        )
        return
      }
      const api = StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      )
      try {
        await api.createApiPolymerNodes({
          data: {
            type: 'PolymerNode',
            attributes: {
              parent: {
                type: 'PolymerNode',
                id: this.selectedTree.node_id,
              },
              polymer_tag: {
                type: 'PolymerTag',
                id: tag.id,
              },
            },
          },
        })
        this.loadSelectedTree(this.selectedTree.node_id)
      } catch (error) {
        console.error(error)
        //
      } finally {
        //
      }
    },
  },
})
</script>
