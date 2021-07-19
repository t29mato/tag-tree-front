<template>
  <v-container>
    <v-dialog v-model="shouldShowTagDetailDialog" hide-overlay>
      <v-card>
        <v-card-title>{{ updatedTree.name }}</v-card-title>
        <v-container>
          <v-text-field v-model="updatedName" label="タグ名"></v-text-field>
          <v-btn @click="updateTag()"> 更新する </v-btn>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- タグツリーの初期表示を全てOpenにするため -->
    <div v-if="allTree.length > 0">
      <v-treeview open-all :items="allTree">
        <template slot="label" slot-scope="{ item }">
          <v-chip class="ma-2" @click="openTagDetailDialog(item)">{{
            item.name
          }}</v-chip>

          <v-btn
            v-if="item.node_id === AddedTree.node_id"
            icon
            large
            @click="closeAddTagField()"
            ><v-icon color="green">mdi-minus-box</v-icon></v-btn
          >
          <v-btn v-else icon large @click="showAddTagField(item)"
            ><v-icon>mdi-plus-box</v-icon></v-btn
          >

          <v-btn icon large @click="deleteTree(item)"
            ><v-icon>mdi-delete</v-icon></v-btn
          >
          <div v-if="item.node_id === AddedTree.node_id" class="ml-sm-5">
            <v-text-field
              v-model="newName"
              class="ml-2"
              @keypress="filterTags()"
            ></v-text-field>
            <div class="ml-1">
              <v-chip
                v-for="tag in filteredTags"
                :key="tag.id"
                color="primary"
                class="ma-2"
                @click="addNode(tag)"
                >{{ tag.attributes && tag.attributes.name }}</v-chip
              >
              <div v-show="shouldShowNewTag">
                <v-chip class="ma-2" color="success" @click="addTagAndNode()">
                  {{ newName }}
                </v-chip>
                <v-icon color="success" large>mdi-new-box</v-icon>
              </div>
            </div>
          </div>
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
      allTree: [] as PolymerTagTreeAttributes[],
      AddedTree: {} as PolymerTagTreeAttributes,
      updatedTree: {} as PolymerTagTreeAttributes,
      shouldShowTagDetailDialog: false,
      newName: '',
      updatedName: '',
      filteredTags: [] as PolymerTag[],
    }
  },
  computed: {
    shouldShowNewTag(): boolean {
      return this.newName.length > 0
    },
  },
  created() {
    this.loadTree()
  },
  methods: {
    openTagDetailDialog(e: PolymerTagTreeAttributes) {
      this.shouldShowTagDetailDialog = true
      this.updatedTree = e
      this.updatedName = this.updatedTree.name
      this.loadSelectedTree()
    },
    refreshTree() {
      this.loadSelectedTree()
      this.loadTree()
      this.filterTags()
    },
    async deleteTree(tree: PolymerTagTreeAttributes) {
      if (
        !window.confirm(
          `「${tree.name}」を本当に削除しますか？削除する場合は対象ノードの子ツリーも同時に削除されます。`
        )
      ) {
        return
      }
      const api = StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      )
      try {
        await api.destroyApiPolymerNodesId(tree.node_id)
        this.refreshTree()
      } catch {
        //
      } finally {
        //
      }
    },
    showAddTagField(tree: PolymerTagTreeAttributes) {
      this.AddedTree = tree
      this.newName = ''
    },
    closeAddTagField() {
      this.AddedTree = {} as PolymerTagTreeAttributes
      this.newName = ''
    },
    async loadTree(id?: string) {
      const api = StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      )
      try {
        // ルートIDが1のため
        const { data: tagTree } = (
          await api.retrieveApiPolymerTagTreeId(id || '1')
        ).data
        this.allTree = [tagTree.attributes]
      } catch {
        //
      } finally {
        //
      }
    },
    async loadSelectedTree() {
      const api = StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      )
      try {
        // ルートIDが1のため
        const { data: tagTree } = (
          await api.retrieveApiPolymerTagTreeId(this.AddedTree.node_id)
        ).data
        this.AddedTree = tagTree.attributes
      } catch {
        //
      } finally {
        //
      }
    },
    async filterTags() {
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
            this.newName
          )
        ).data
        this.filteredTags = tags
      } catch {
        //
      } finally {
        //
      }
    },
    async addNode(tag: PolymerTag) {
      // TODO: 祖先に子供がいるかどうかの判定を行うかどうか。
      if (this.AddedTree.polymer_tag_id === tag.id) {
        window.alert(`親ノードと同じタグの子を登録することはできません。`)
        return
      }
      if (
        this.AddedTree.children
          .map((child) => child.polymer_tag_id)
          .includes(tag.id)
      ) {
        window.alert(
          `既に「${this.AddedTree.name}」ノードに「${tag.attributes?.name}」タグは登録されています。`
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
                id: this.AddedTree.node_id,
              },
              polymer_tag: {
                type: 'PolymerTag',
                id: tag.id,
              },
            },
          },
        })
        this.refreshTree()
      } catch (error) {
        console.error(error)
        //
      } finally {
        //
      }
    },
    async addTagAndNode() {
      if (
        this.filteredTags
          .map((tag) => tag.attributes?.name)
          .includes(this.newName)
      ) {
        window.alert(`${this.newName}は既に登録されているタグです。`)
      }
      const api = StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      )
      try {
        const { data: newTag } = (
          await api.createApiPolymerTags({
            data: {
              type: 'PolymerTag',
              attributes: {
                name: this.newName,
              },
            },
          })
        ).data
        await api.createApiPolymerNodes({
          data: {
            type: 'PolymerNode',
            attributes: {
              parent: {
                type: 'PolymerNode',
                id: this.AddedTree.node_id,
              },
              polymer_tag: newTag,
            },
          },
        })
      } catch (error) {
        console.error(error)
        //
      } finally {
        this.refreshTree()
        //
      }
    },
    async updateTag() {
      const api = StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      )
      try {
        await api.partialUpdateApiPolymerTagsId(this.AddedTree.polymer_tag_id, {
          data: {
            type: 'PolymerTag',
            id: this.AddedTree.polymer_tag_id,
            attributes: {
              name: this.updatedName,
            },
          },
        })
      } catch (error) {
        console.error(error)
        //
      } finally {
        this.refreshTree()
        //
      }
    },
  },
})
</script>
