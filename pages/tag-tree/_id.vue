<template>
  <div>
    <v-dialog v-model="shouldShowNodeDeleteDialog" hide-overlay>
      <v-card>
        <v-app-bar>
          <v-toolbar-title>削除確認</v-toolbar-title>
        </v-app-bar>
        <v-container>
          <v-treeview :items="[deletedTree]">
            <template slot="label" slot-scope="{ item }">
              <v-chip class="ma-2" :to="{ path: '/tags/' + item.tag_id }">
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
    <v-container>
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="filterKeyword"
            label="キーワードでフィルタリング"
            clearable
            clear-icon="mdi-close-circle-outline"
          ></v-text-field>
          <v-treeview
            :items="[allTree]"
            item-key="node_id"
            :search="filterKeyword"
            :filter="filterTree"
            item-text="name_ja"
            activatable
            @update:active="activateTree"
          >
            <template slot="label" slot-scope="{ item }">
              <v-chip class="ma-2" :color="generateColor(item.tree_level)">
                {{ item.name_ja }}
              </v-chip>
              <v-chip v-if="item.children.length > 0" x-small>{{
                item.children.length
              }}</v-chip>
            </template>
          </v-treeview>
        </v-col>
        <v-col v-if="activeTree.children" cols="6">
          <v-list dense>
            <h2>{{ activeTree.name_ja }}</h2>
            <v-text-field
              v-model="newName"
              append-outer-icon="mdi-new-box"
              class="ml-2"
              label="タグを追加"
              @click:append-outer="addTagAndNode"
              @keypress="filterTags()"
            ></v-text-field>
            <div class="ml-1">
              <div v-for="tag in filteredTags" :key="tag.id">
                <v-chip
                  color="primary"
                  class="ma-2"
                  close
                  close-icon="mdi-plus-box"
                  @click:close="addNode(tag)"
                  >{{
                    tag.attributes.term_ja && tag.attributes.term_ja.name
                  }}</v-chip
                >
              </div>
              <!-- 右側を固定する -->
              <div v-for="child in activeTree.children" :key="child.node_id">
                <v-chip
                  class="ma-2"
                  close
                  @click:close="openNodeDeleteDialog(child.node_id)"
                >
                  {{ child.name_ja }}
                </v-chip>
                <v-chip v-if="child.children.length > 0" x-small>{{
                  child.children.length
                }}</v-chip>
              </div>
            </div>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </div>
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
    showIfNumberIsOverOne(num: number): string {
      if (num === 0) {
        return ''
      }
      return String(num)
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
        allTree: tagTree.attributes,
      }
    } catch {
      //
    } finally {
      //
    }
  },
  data() {
    return {
      allTree: {} as TagTreeAttributes,
      AddedTree: {} as TagTreeAttributes,
      updatedTree: {} as TagTreeAttributes,
      deletedTree: {} as TagTreeAttributes,
      shouldShowNodeDeleteDialog: false,
      activeTree: {} as TagTreeAttributes,
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
    activateTree(ids: string[]) {
      const activatedTreeId = ids[0]
      const searchTreeById = (
        targetTreeId: string,
        rootTree: TagTreeAttributes
      ) => {
        let targetTree: TagTreeAttributes = {} as TagTreeAttributes
        const search = (tree: TagTreeAttributes): void => {
          // INFO: ID指定で検索してるのでtargetTreeが複数になることはないので、見つかった時点で再帰終了
          if (targetTree.node_id) {
            return
          }
          if (!tree) {
            return
          }
          if (tree.node_id === targetTreeId) {
            targetTree = tree
          }
          tree.children.map((child) => search(child))
        }
        search(rootTree)
        return targetTree
      }
      this.activeTree = searchTreeById(activatedTreeId, this.allTree)
    },
    generateColor(treeLevel: number): string {
      // INFO: https://iro-color.com/colorchart/tint/rainbow-color.html
      const colors = [
        '#F5B090',
        '#FCD7A1',
        '#FFF9B1',
        '#A5D4AD',
        '#A3BCE2',
        '#A59ACA',
        '#CFA7CD',
      ]
      // INFO: ツリーレベルが1から開始するので、順番通りにするため1を引いた
      return colors[(treeLevel - 1) % 7]
    },
    async openNodeDeleteDialog(nodeId: string) {
      this.shouldShowNodeDeleteDialog = true
      try {
        const { data: tagTree } = (
          await this.apiClient.retrieveApiTagTreeId(nodeId)
        ).data
        this.deletedTree = tagTree.attributes
      } catch {
        //
      } finally {
        //
      }
    },
    refreshTree() {
      this.loadSelectedTree()
      this.loadTree()
      this.filterTags()
      this.loadActiveTree()
    },
    async deleteTree() {
      this.$nuxt.$loading.start()
      try {
        await this.apiClient.destroyApiNodesId(this.deletedTree.node_id)
        this.shouldShowNodeDeleteDialog = false
      } catch {
        //
      } finally {
        this.refreshTree()
        this.$nuxt.$loading.finish()
      }
    },
    async loadTree() {
      try {
        // ルートIDが1のため
        const { data: tagTree } = (
          await this.apiClient.retrieveApiTagTreeId(
            this.$route.params.id || '1'
          )
        ).data
        this.allTree = tagTree.attributes
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
    async loadActiveTree() {
      try {
        const { data: tagTree } = (
          await this.apiClient.retrieveApiTagTreeId(this.activeTree.node_id)
        ).data
        this.activeTree = tagTree.attributes
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
      if (this.activeTree.tag_id === tag.id) {
        window.alert(`親ノードと同じタグの子を登録することはできません。`)
        return
      }
      if (
        this.activeTree.children.map((child) => child.tag_id).includes(tag.id)
      ) {
        window.alert(
          `既に「${this.activeTree.name_ja}」ノードに「${tag.attributes.term_ja.name}」タグは登録されています。`
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
                id: this.activeTree.node_id,
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
      // TODO: 既に登録されているタグでもそのまま登録できるようにする。
      if (
        this.filteredTags
          .map((tag) => tag.attributes.term_ja.name)
          .includes(this.newName)
      ) {
        window.alert(`${this.newName}は既に登録されているタ
        グです。`)
        return
      }
      try {
        const { data: newTerm } = (
          await this.apiClient.createApiTerms({
            data: {
              type: 'Term',
              attributes: {
                name: this.newName,
                language: 'ja',
              },
            },
          })
        ).data
        const { data: newTag } = (
          await this.apiClient.createApiTags({
            data: {
              type: 'Tag',
              attributes: {
                term_ja_id: newTerm.id,
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
                id: this.activeTree.node_id,
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
