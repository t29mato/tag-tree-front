<template>
  <v-container>
    <v-dialog v-model="shouldShowNodeDeleteDialog" hide-overlay>
      <v-card>
        <v-app-bar>
          <v-toolbar-title>削除確認</v-toolbar-title>
        </v-app-bar>
        <v-container>
          <v-treeview :items="[deletedTree]">
            <template slot="label" slot-scope="{ item }">
              <v-chip
                class="ma-2"
                :color="generateColor(item.tree_level)"
                :to="{ path: '/tags/' + item.tag_id }"
              >
                {{ item.name_ja }}
              </v-chip>
            </template>
          </v-treeview>
          <v-card-actions>
            <v-btn text @click="shouldShowNodeDeleteDialog = false">
              キャンセル
            </v-btn>
            <v-btn text color="error" @click="deleteTree()"> 削除する </v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
    <v-text-field
      v-model="filterKeyword"
      label="魚類名でフィルタリング"
      clearable
      clear-icon="mdi-close-circle-outline"
    ></v-text-field>
    <v-treeview
      :items="allTree"
      item-key="node_id"
      :search="filterKeyword"
      :filter="filterTree"
      item-text="name_ja"
      :open="[$route.params.id]"
      color="red"
      selectable
    >
      <template slot="label" slot-scope="{ item }">
        <v-chip
          class="ma-2"
          :color="generateColor(item.tree_level)"
          :to="{ path: '/tag-tree/' + item.node_id }"
        >
          {{ item.name_ja }}
        </v-chip>

        <v-btn icon large @click="showAddTagField(item)">追加</v-btn>
        <v-btn icon large @click="openNodeDeleteDialog(item)">削除</v-btn>
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
  async asyncData({ params }) {
    const apiClient = StarrydataApiFactory(
      undefined,
      process.env.STARRYDATA_API_URL
    )
    try {
      // ルートIDが1のため
      const { data: tagTree } = (
        await apiClient.retrieveApiTagTreeId(params.id || '1')
      ).data
      return {
        allTree: [tagTree.attributes],
      }
    } catch {
      //
    } finally {
      //
    }
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
      filterKeyword: '',
    }
  },
  computed: {
    shouldShowNewTag(): boolean {
      return this.newName.length > 0
    },
    filterTree() {
      return (item: TagTreeAttributes, search: string) =>
        item.name_ja.includes(search)
    },
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
        window.alert(
          JSON.stringify(error.response.data.errors) ||
            '予期しないエラーです。管理者に問い合わせください。'
        )
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
        window.alert(
          JSON.stringify(error.response.data.errors) ||
            '予期しないエラーです。管理者に問い合わせください。'
        )
      } finally {
        this.refreshTree()
        //
      }
    },
  },
})
</script>
