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
            @input="handleFilterKeyword"
          ></v-text-field>
          <v-treeview
            ref="allTree"
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
              <!-- INFO 魚類ツリーの時だけ魚図鑑のURL表示 -->
              <v-icon
                v-if="allTree.node_id === '4851'"
                class="ml-2"
                @click="openZukanCom(item.node_id)"
                >mdi-fish</v-icon
              >
            </template>
          </v-treeview>
        </v-col>
        <v-col v-if="activeTreeId" cols="6">
          <v-chip large class="mb-2">
            <h3>{{ activeTree.name_ja }}</h3>
          </v-chip>
          <v-container>
            <h4>タグ名</h4>
            <p>{{ activeTree.name_ja }}</p>
            <div v-if="activeTag.attributes">
              <h4 class="mt-2">同義語</h4>
              <template
                v-for="(synonym, index) in activeTag.attributes.synonyms"
              >
                <template v-if="index > 0">|</template>
                <span :key="synonym.name"
                  >{{ synonym.name }}
                  <!-- TODO: 類語削除機能はモーダルで表示する -->
                  <!-- <v-icon :key="synonym.name" @click="removeSynonym(synonym)"
                  >mdi-close</v-icon
                > -->
                </span>
              </template>
              <div v-for="term in filteredTerms" :key="term.id">
                <v-chip
                  v-if="shouldShowFilteredTerm(term)"
                  color="primary"
                  class="ma-2"
                  close
                  close-icon="mdi-plus-box"
                  @click:close="addSynonym(term)"
                  >{{ term.attributes.name }}</v-chip
                >
              </div>
            </div>
            <v-text-field
              v-model="newSynonymName"
              append-outer-icon="mdi-plus-box"
              :label="activeTree.name_ja + 'の同義語を追加'"
              @click:append-outer="addTermAndSynonym"
              @keypress="filterTerms()"
            ></v-text-field>
          </v-container>
          <h3>{{ activeTree.name_ja }}の子タグ</h3>
          <v-container>
            <div v-for="child in activeTree.children" :key="child.node_id">
              <v-chip
                class="mt-2 mr-2 mb-2"
                close
                @click="activateTree([child.node_id])"
                @click:close="openNodeDeleteDialog(child.node_id)"
              >
                {{ child.name_ja }}
              </v-chip>
              <v-chip v-if="child.children.length > 0" x-small>{{
                child.children.length
              }}</v-chip>
            </div>
            <v-text-field
              v-model="newChildTagName"
              append-outer-icon="mdi-plus-box"
              :label="activeTree.name_ja + 'タグに子タグを追加'"
              @click:append-outer="addTagAndNode"
              @keypress="filterTags()"
            ></v-text-field>
            <div v-for="tag in filteredTags" :key="tag.id">
              <v-chip
                v-if="shouldShowFilteredTag(tag)"
                color="primary"
                class="mt-2 mr-2 mb-2"
                close
                close-icon="mdi-plus-box"
                @click:close="addNode(tag)"
                >{{
                  tag.attributes.term_ja && tag.attributes.term_ja.name
                }}</v-chip
              >
            </div>
          </v-container>
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
  Term,
  TermAttributes,
} from 'starrydata-api-client'

interface VTreeView {
  updateAll: (arg0: boolean) => void
}

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
      activeTreeId: '',
      activeTag: {} as Tag,
      newChildTagName: '',
      newSynonymName: '',
      updatedName: '',
      filteredTags: [] as Tag[],
      filteredTerms: [] as Term[],
      apiClient: StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      ),
      filterKeyword: '',
    }
  },
  computed: {
    shouldShowNewTag(): boolean {
      return this.newChildTagName.length > 0
    },
    filterTree() {
      return (item: TagTreeAttributes, search: string) => {
        if (!item.name_ja) {
          return false
        }
        return item.name_ja.includes(search)
      }
    },
  },
  methods: {
    handleFilterKeyword(input: string) {
      const allTree = this.$refs.allTree as unknown as VTreeView
      if (input) {
        allTree.updateAll(true)
      } else {
        allTree.updateAll(false)
      }
    },
    openZukanCom(id: string) {
      window.open('https://zukan.com/fish/internal' + id)
    },
    // INFO: 同じ親に同じ子を複数登録するのはできないので事前に非表示にするため
    shouldShowFilteredTag(tag: Tag): boolean {
      return !this.activeTree.children
        .map((child) => child.name_ja)
        .includes(tag.attributes.term_ja.name || '')
    },
    // INFO: 同じタグに同じ同義語を登録するのはできないので。
    shouldShowFilteredTerm(term: Term): boolean {
      return !this.activeTag.relationships.synonyms_ids.data
        .map((synonym) => synonym.id)
        .includes(term.id)
    },
    activateTree(ids: string[]) {
      const activatedTreeId = ids[0]
      this.activeTreeId = activatedTreeId
      this.activeTree = this.searchTreeById(activatedTreeId, this.allTree)
    },
    loadActiveTag() {
      this.activeTree = this.searchTreeById(this.activeTreeId, this.allTree)
    },
    searchTreeById(targetTreeId: string, rootTree: TagTreeAttributes) {
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
      const loadTag = async (tagId: string) => {
        try {
          const { data: tag } = (await this.apiClient.retrieveApiTagsId(tagId))
            .data
          this.activeTag = tag
        } catch {
          //
        } finally {
          //
        }
      }
      loadTag(targetTree.tag_id)
      return targetTree
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
    // TODO: APIコールせずにツリーを表示できるように修正
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
      // this.loadTree()
      this.filterTags()
      this.loadActiveTree()
      this.filterTerms()
      this.loadActiveTag()
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
    async removeSynonym(term: TermAttributes) {
      try {
        await this.apiClient.partialUpdateApiTagsId(this.activeTag.id, {
          data: {
            type: 'Tag',
            id: this.activeTag.id,
            attributes: {
              synonyms: this.activeTag.attributes.synonyms.filter((synonym) => {
                console.log(term.name !== synonym.name)
                return term.name !== synonym.name
              }),
            },
          },
        })
      } catch {
        //
      } finally {
        //
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
    // REFACTOR: 使っていないメソッドなので削除してもよさそう。
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
    // TODO: loadActiveTreeは使っていないので削除する
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
      if (!this.newChildTagName) {
        this.filteredTags = []
        return
      }
      try {
        const { data: tags } = (
          await this.apiClient.listApiTags(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            this.newChildTagName
          )
        ).data
        this.filteredTags = tags
      } catch {
        //
      } finally {
        //
      }
    },
    async filterTerms() {
      if (!this.newSynonymName) {
        this.filteredTerms = []
        return
      }
      try {
        const { data: terms } = (
          await this.apiClient.listApiTerms(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            this.newSynonymName
          )
        ).data
        this.filteredTerms = terms
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
    async addTagAndNode() {
      // TODO: 既に登録されているタグでもそのまま登録できるようにする。
      if (
        this.filteredTags
          .map((tag) => tag.attributes.term_ja.name)
          .includes(this.newChildTagName)
      ) {
        window.alert(`${this.newChildTagName}は既に登録されているタグです。`)
        return
      }
      try {
        const { data: newTag } = (
          await this.apiClient.createApiTags({
            data: {
              type: 'Tag',
              attributes: {
                term_ja: {
                  name: this.newChildTagName,
                  language: 'ja',
                },
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
    async addSynonym(term: Term) {
      // TODO: 祖先に子供がいるかどうかの判定を行うかどうか。
      if (this.activeTree.name_ja === term.attributes.name) {
        window.alert(`親タグと同じ名前のものは登録できません。`)
        return
      }
      if (
        this.activeTag.attributes.synonyms
          .map((synonym) => synonym.name)
          .includes(term.attributes.name)
      ) {
        window.alert(`既に同名の同義語が登録されています。`)
        return
      }
      try {
        await this.apiClient.partialUpdateApiTagsId(this.activeTag.id, {
          data: {
            type: 'Tag',
            id: this.activeTag.id,
            attributes: {
              synonyms: [
                term.attributes,
                ...this.activeTag.attributes.synonyms,
              ],
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
        this.refreshTree()
      }
    },
    // REFACTOR: addSynonymと重複箇所あるのでリファくタできないか
    async addTermAndSynonym() {
      this.$nuxt.$loading.start()
      // TODO: 既に登録されているタグでもそのまま登録できるようにする。
      if (
        this.filteredTerms
          .map((term) => term.attributes.name)
          .includes(this.newSynonymName)
      ) {
        window.alert(`${this.newSynonymName}は既に登録されている用語です。`)
        return
      }
      try {
        await this.apiClient.partialUpdateApiTagsId(this.activeTag.id, {
          data: {
            type: 'Tag',
            id: this.activeTag.id,
            attributes: {
              synonyms: [
                {
                  name: this.newSynonymName,
                  language: 'ja',
                },
                ...this.activeTag.attributes.synonyms,
              ],
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
        this.$nuxt.$loading.finish()
      }
    },
  },
})
</script>
