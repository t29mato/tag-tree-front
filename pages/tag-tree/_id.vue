<template>
  <v-container>
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
            :to="{ path: './tags/' + item.tag_id }"
          >
            {{ item.name_ja }}
          </v-chip>

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
                >{{ tag.attributes && tag.attributes.name_ja }}</v-chip
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
  Tag,
  StarrydataApiFactory,
  TagTreeAttributes,
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
      allTree: [] as TagTreeAttributes[],
      AddedTree: {} as TagTreeAttributes,
      updatedTree: {} as TagTreeAttributes,
      deletedTree: {} as TagTreeAttributes,
      shouldShowNodeDeleteDialog: false,
      newName: '',
      updatedName: '',
      filteredTags: [] as Tag[],
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
    openNodeDeleteDialog(e: TagTreeAttributes) {
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
        await this.apiClient.destroyApiNodesId(this.deletedTree.node_id)
        this.shouldShowNodeDeleteDialog = false
      } catch {
        //
      } finally {
        this.refreshTree()
      }
    },
    showAddTagField(tree: TagTreeAttributes) {
      this.AddedTree = tree
      this.newName = ''
    },
    closeAddTagField() {
      this.AddedTree = {} as TagTreeAttributes
      this.newName = ''
    },
    async loadTree() {
      try {
        // ルートIDが1のため
        const { data: tagTree } = (
          await this.apiClient.retrieveApiTagTreeId(
            this.$route.params.id || '1'
          )
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
          await this.apiClient.retrieveApiTagTreeId(this.AddedTree.node_id)
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
          await this.apiClient.listApiTags(
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
    async addNode(tag: Tag) {
      // TODO: 祖先に子供がいるかどうかの判定を行うかどうか。
      if (this.AddedTree.tag_id === tag.id) {
        window.alert(`親ノードと同じタグの子を登録することはできません。`)
        return
      }
      if (
        this.AddedTree.children.map((child) => child.tag_id).includes(tag.id)
      ) {
        window.alert(
          `既に「${this.AddedTree.name_ja}」ノードに「${tag.attributes?.name_ja}」タグは登録されています。`
        )
        return
      }
      try {
        await this.apiClient.createApiNodes({
          data: {
            type: 'Node',
            attributes: {
              parent: {
                type: 'Node',
                id: this.AddedTree.node_id,
              },
              tag: {
                type: 'Tag',
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
          .map((tag) => tag.attributes?.name_ja)
          .includes(this.newName)
      ) {
        window.alert(`${this.newName}は既に登録されているタグです。`)
      }
      try {
        const { data: newTag } = (
          await this.apiClient.createApiTags({
            data: {
              type: 'Tag',
              attributes: {
                name_ja: this.newName,
              },
            },
          })
        ).data
        await this.apiClient.createApiNodes({
          data: {
            type: 'Node',
            attributes: {
              parent: {
                type: 'Node',
                id: this.AddedTree.node_id,
              },
              tag: newTag,
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
