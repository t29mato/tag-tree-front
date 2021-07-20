<template>
  <v-container>
    <v-dialog v-model="shouldShowTagDetailDialog" hide-overlay>
      <v-card>
        <v-app-bar>
          <v-toolbar-title>{{ updatedTree.name }}</v-toolbar-title>
        </v-app-bar>
        <v-container>
          <v-text-field v-model="updatedName" label="タグ名"></v-text-field>
          <v-card-actions>
            <v-btn text @click="shouldShowTagDetailDialog = false">
              キャンセル
            </v-btn>
            <v-btn text color="success" @click="updateTag()"> 更新する </v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="shouldShowNodeDeleteDialog" hide-overlay>
      <v-card>
        <v-app-bar>
          <v-toolbar-title>削除確認</v-toolbar-title>
        </v-app-bar>
        <v-container>
          <v-treeview open-all :items="[deletedTree]"></v-treeview>
          <v-card-actions>
            <v-btn text @click="shouldShowNodeDeleteDialog = false">
              キャンセル
            </v-btn>
            <v-btn text color="error" @click="deleteTree()"> 削除する </v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- タグツリーの初期表示を全てOpenにするため -->
    <div v-if="allTree.length > 0">
      <v-treeview open-all :items="allTree">
        <template slot="label" slot-scope="{ item }">
          <v-chip
            class="ma-2"
            :color="generateColor(item.tree_level)"
            @click="openTagDetailDialog(item)"
            >{{ item.name }}</v-chip
          >

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

          <v-btn icon large @click="openNodeDeleteDialog(item)"
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
      deletedTree: {} as PolymerTagTreeAttributes,
      shouldShowTagDetailDialog: false,
      shouldShowNodeDeleteDialog: false,
      newName: '',
      updatedName: '',
      filteredTags: [] as PolymerTag[],
      apiClient: StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      ),
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
    generateColor(treeLevel: number): string {
      const colors = [
        '#FFE0B2',
        '#D1C4E9',
        '#BBDEFB',
        '#B2DFDB',
        '#F0F4C3',
        '#FFECB3',
        '#D7CCC8',
      ]
      return colors[treeLevel % 7]
    },
    openTagDetailDialog(e: PolymerTagTreeAttributes) {
      this.shouldShowTagDetailDialog = true
      this.updatedTree = e
      this.updatedName = this.updatedTree.name
      this.loadSelectedTree()
    },
    openNodeDeleteDialog(e: PolymerTagTreeAttributes) {
      this.shouldShowNodeDeleteDialog = true
      this.deletedTree = e
    },
    refreshTree() {
      this.loadSelectedTree()
      this.loadTree()
      this.filterTags()
    },
    async deleteTree() {
      try {
        await this.apiClient.destroyApiPolymerNodesId(this.deletedTree.node_id)
        this.shouldShowNodeDeleteDialog = false
      } catch {
        //
      } finally {
        this.refreshTree()
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
      try {
        // ルートIDが1のため
        const { data: tagTree } = (
          await this.apiClient.retrieveApiPolymerTagTreeId(id || '1')
        ).data
        this.allTree = [tagTree.attributes]
      } catch {
        //
      } finally {
        //
      }
    },
    async loadSelectedTree() {
      try {
        const { data: tagTree } = (
          await this.apiClient.retrieveApiPolymerTagTreeId(
            this.AddedTree.node_id
          )
        ).data
        this.AddedTree = tagTree.attributes
      } catch {
        //
      } finally {
        //
      }
    },
    async filterTags() {
      try {
        const { data: tags } = (
          await this.apiClient.listApiPolymerTags(
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
      try {
        await this.apiClient.createApiPolymerNodes({
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
      try {
        const { data: newTag } = (
          await this.apiClient.createApiPolymerTags({
            data: {
              type: 'PolymerTag',
              attributes: {
                name: this.newName,
              },
            },
          })
        ).data
        await this.apiClient.createApiPolymerNodes({
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
      try {
        await this.apiClient.partialUpdateApiPolymerTagsId(
          this.updatedTree.polymer_tag_id,
          {
            data: {
              type: 'PolymerTag',
              id: this.updatedTree.polymer_tag_id,
              attributes: {
                name: this.updatedName,
              },
            },
          }
        )
        this.shouldShowTagDetailDialog = false
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
