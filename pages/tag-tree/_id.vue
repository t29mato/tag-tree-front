<template>
  <div>
    <v-dialog v-model="shouldShowAddTreeDialog" hide-overlay>
      <v-card>
        <v-app-bar>
          <v-toolbar-title>{{
            `「${activeTree.name_ja}」タグにタグツリーをまとめて追加`
          }}</v-toolbar-title>
        </v-app-bar>
        <v-container>
          <v-row>
            <v-col cols="6">
              <h4>編集エリア</h4>
              <v-textarea
                v-model="tagTreeText"
                name="input-7-1"
                auto-grow
                :style="{
                  background: 'url(/img/line_number.png)',
                  backgroundAttachment: 'local',
                  'background-repeat': 'no-repeat',
                  paddingLeft: '50px',
                  paddingTop: '2px',
                }"
                :placeholder="`例：子タグは「タブ」。同義語は「 | 」\n親\n\t子供 | 同義語\n\t\t孫 | 同義語1 | 同義語2`"
                :error-messages="tagTreeTextErrorMessage"
                @input="handleInputAddedTree"
                @keydown.tab.exact="handleKeyDownTab"
                @keydown.shift.tab.exact="handleKeyDownShiftTab"
              ></v-textarea>
            </v-col>
            <v-col cols="6">
              <h4>表示エリア</h4>
              <v-treeview ref="addedTree" :items="textTree">
                <template slot="label" slot-scope="{ item }">
                  <v-chip>{{ item.name }}</v-chip>
                  <span class="ma-2">
                    {{ item.synonyms.join(' | ') }}
                  </span>
                </template>
              </v-treeview>
            </v-col>
          </v-row>

          <v-card-actions>
            <v-btn text @click="shouldShowAddTreeDialog = false">
              キャンセル
            </v-btn>
            <v-btn
              text
              :disabled="
                tagTreeText === '' || tagTreeTextErrorMessage.length > 0
              "
              :loading="runningAddTreeJa"
              @click="addTree('ja')"
              >まとめて追加（日）</v-btn
            >
            <v-btn
              text
              :disabled="
                tagTreeText === '' || tagTreeTextErrorMessage.length > 0
              "
              :loading="runningAddTreeEn"
              @click="addTree('en')"
              >まとめて追加（英）</v-btn
            >
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
    <v-dialog v-model="shouldShowSynonymDialog" hide-overlay>
      <v-card>
        <v-app-bar>
          <v-toolbar-title>{{ removedSynonym.name }}</v-toolbar-title>
        </v-app-bar>
        <v-container>
          <v-card-actions>
            <v-btn text @click="shouldShowSynonymDialog = false">
              キャンセル
            </v-btn>
            <v-btn text color="error" @click="removeSynonym(removedSynonym)">
              削除する
            </v-btn>
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
            @input="openAllTree"
          ></v-text-field>
          <v-treeview
            ref="allTree"
            :items="[allTree]"
            item-key="node_id"
            :search="filterKeyword"
            :filter="filterTree"
            activatable
            @update:active="activateTree"
          >
            <template slot="label" slot-scope="{ item }">
              <v-chip class="ma-2" :color="generateColor(item.tree_level)">
                {{ item | tagName }}
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
            <h3>{{ activeTree.name_ja || activeTree.name_en }}</h3>
          </v-chip>
          <v-container>
            <h4>タグ名（日）</h4>
            <v-text-field
              v-model="newTagName.ja"
              append-icon="mdi-content-save"
              @click:append="updateTagName('ja')"
            ></v-text-field>
            <h4>タグ名（英）</h4>
            <v-text-field
              v-model="newTagName.en"
              append-icon="mdi-content-save"
              @click:append="updateTagName('en')"
            ></v-text-field>
            <h4 class="mt-2">同義語（日）</h4>
            <div v-if="activeTag.attributes && activeTag.attributes.synonyms">
              <template v-for="(synonym, index) in activeTagSynonymJa">
                <template v-if="index > 0">|</template>
                <span :key="synonym.name" @click="openSynonymDialog(synonym)"
                  >{{ synonym.name }}
                </span>
              </template>
            </div>
            <div v-if="activeTagSynonymJa.length === 0">なし</div>
            <v-text-field
              v-model="newSynonymName.ja"
              append-icon="mdi-text-box-plus"
              :label="activeTree.name_ja + 'の同義語を追加'"
              class="mb-2"
              @click:append="addTermAndSynonym('ja')"
            ></v-text-field>

            <h4 class="mt-2">同義語（英）</h4>
            <div v-if="activeTag.attributes && activeTag.attributes.synonyms">
              <template v-for="(synonym, index) in activeTagSynonymEn">
                <template v-if="index > 0">|</template>
                <span :key="synonym.name" @click="openSynonymDialog(synonym)"
                  >{{ synonym.name }}
                </span>
              </template>
            </div>
            <div v-if="activeTagSynonymEn.length === 0">なし</div>
            <v-text-field
              v-model="newSynonymName.en"
              append-icon="mdi-text-box-plus"
              :label="activeTree.name_en + 'の同義語（英）を追加'"
              class="mb-2"
              @click:append="addTermAndSynonym('en')"
            ></v-text-field>
          </v-container>

          <h3>{{ `「${activeTree.name_ja}」タグの子タグ` }}</h3>
          <v-container>
            <div v-for="child in activeTree.children" :key="child.node_id">
              <v-chip
                class="mt-2 mr-2 mb-2"
                close
                @click="activateTree([child.node_id])"
                @click:close="openNodeDeleteDialog(child.node_id)"
              >
                {{ child.name_ja || child.name_en }}
              </v-chip>
              <v-chip v-if="child.children.length > 0" x-small>{{
                child.children.length
              }}</v-chip>
            </div>
            <div v-if="activeTree.children.length === 0">なし</div>
            <v-text-field
              v-model="newChildTagName"
              append-icon="mdi-tag-plus"
              :label="`「${activeTree.name_ja}」タグに子タグを１つ追加`"
              @click:append="addTagAndNode"
              @keypress="filterTags()"
            ></v-text-field>
            <div v-for="tag in filteredTags" :key="tag.id">
              <v-chip
                v-if="shouldShowFilteredTag(tag)"
                color="light-green"
                class="mt-2 mr-2 mb-2"
                close
                close-icon="mdi-plus-circle"
                @click:close="addNode(tag)"
                >{{
                  tag.attributes.term_ja && tag.attributes.term_ja.name
                }}</v-chip
              >
            </div>
            <v-btn @click="shouldShowAddTreeDialog = true">
              {{ `「${activeTree.name_ja}」タグにタグツリーをまとめて追加` }}
            </v-btn>
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
  ApiTermsDataAttributes,
} from 'starrydata-api-client'

interface VTreeView {
  updateAll: (arg0: boolean) => void
}

type Language = 'ja' | 'en'

interface TextTree {
  name: string
  synonyms: string[]
  children: TextTree[]
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
    tagName(tree: TagTreeAttributes): string {
      if (tree.name_ja) {
        return tree.name_ja
      }
      if (tree.name_en) {
        return tree.name_en
      }
      return ''
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
    } catch (error) {
      window.alert('ツリーの読み込みに失敗しました' + JSON.stringify(error))
    } finally {
      //
    }
  },
  data() {
    return {
      allTree: {} as TagTreeAttributes,
      deletedTree: {} as TagTreeAttributes,
      removedSynonym: {} as TermAttributes,
      shouldShowNodeDeleteDialog: false,
      shouldShowSynonymDialog: false,
      shouldShowAddTreeDialog: false,
      activeTreeId: '',
      activeTag: {} as Tag,
      newChildTagName: '',
      newTagName: {
        ja: '',
        en: '',
      },
      newSynonymName: {
        ja: '',
        en: '',
      },
      filteredTags: [] as Tag[],
      apiClient: StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      ),
      filterKeyword: '',
      tagTreeText: '',
      tagTreeTextErrorMessage: '',
      textTree: [] as TextTree[],
      runningAddTreeJa: false,
      runningAddTreeEn: false,
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
    activeTree(): TagTreeAttributes {
      if (!this.activeTreeId) {
        return this.allTree
      }
      let targetTree: TagTreeAttributes = {} as TagTreeAttributes
      const search = (treeId: string, tree: TagTreeAttributes): void => {
        // INFO: ID指定で検索してるのでtargetTreeが複数になることはないので、見つかった時点で再帰終了
        if (targetTree.node_id) {
          return
        }
        if (!tree) {
          return
        }
        if (tree.node_id === treeId) {
          targetTree = tree
        }
        tree.children.map((childTree) => search(treeId, childTree))
      }
      search(this.activeTreeId, this.allTree)
      return targetTree
    },
    activeTagSynonymJa(): ApiTermsDataAttributes[] {
      if (!this.activeTag?.attributes?.synonyms) {
        return []
      }
      return this.activeTag?.attributes?.synonyms.filter(
        (synonym) => synonym.language === 'ja'
      )
    },
    activeTagSynonymEn(): ApiTermsDataAttributes[] {
      if (!this.activeTag?.attributes?.synonyms) {
        return []
      }
      return this.activeTag?.attributes?.synonyms.filter(
        (synonym) => synonym.language === 'en'
      )
    },
  },
  methods: {
    // TODO: 同義語の登録
    async addTree(language: Language) {
      try {
        this.$nuxt.$loading.start()
        if (language === 'ja') {
          this.runningAddTreeJa = true
        } else {
          this.runningAddTreeEn = true
        }
        for (const tree of this.textTree) {
          await this.addTreeRecursively(
            this.activeTree.node_id,
            language === 'ja'
              ? this.activeTree.name_ja
              : this.activeTree.name_en,
            tree,
            language
          )
        }
        this.tagTreeText = ''
        this.textTree = []
        this.shouldShowAddTreeDialog = false
      } catch (error) {
        window.alert(
          JSON.stringify(error.response?.data.errors) ||
            error ||
            '予期しないエラーです。管理者に問い合わせください。'
        )
      } finally {
        await this.loadTree()
        const allTree = this.$refs.allTree as unknown as VTreeView
        allTree.updateAll(true)
        this.$nuxt.$loading.finish()
        if (language === 'ja') {
          this.runningAddTreeJa = false
        } else {
          this.runningAddTreeEn = false
        }
      }
    },
    async addTreeRecursively(
      parentNode: string,
      parentName: string,
      tree: TextTree,
      language: Language
    ) {
      if (parentName === tree.name) {
        throw new Error(
          `親タグ「${parentName}」と子タグ「${tree.name}」の名前が同一です`
        )
      }
      if (tree.name === '') {
        throw new Error('タグ名が空白です')
      }
      const term =
        language === 'ja'
          ? {
              term_ja: {
                name: tree.name,
                language,
              },
            }
          : {
              term_en: {
                name: tree.name,
                language,
              },
            }
      const { data: newTag } = (
        await this.apiClient.createApiTags({
          data: {
            type: 'Tag',
            attributes: term,
          },
        })
      ).data
      await this.apiClient.partialUpdateApiTagsId(newTag.id, {
        data: {
          type: 'Tag',
          id: newTag.id,
          attributes: {
            synonyms: newTag.attributes.synonyms.concat(
              tree.synonyms.map((synonym) => {
                return {
                  name: synonym,
                  language,
                }
              })
            ),
          },
        },
      })
      const { data: newNode } = (
        await this.apiClient.createApiNodes({
          data: {
            type: 'Node',
            attributes: {
              parent: {
                type: 'Node',
                id: parentNode,
              },
              tag: newTag,
            },
          },
        })
      ).data
      if (tree.children.length > 0) {
        for (const child of tree.children) {
          await this.addTreeRecursively(newNode.id, tree.name, child, language)
        }
      }
    },
    handleKeyDownTab(e: KeyboardEvent) {
      e.preventDefault()
      const element = e.target as HTMLInputElement
      const posOfCursor = element.selectionStart
      if (posOfCursor === null) {
        window.alert('カーソル取得できない')
        return
      }
      const currentText = element.value
      const lastLineBreakPos = currentText
        .substr(0, posOfCursor)
        .lastIndexOf('\n')
      element.value =
        currentText.substr(0, lastLineBreakPos + 1) +
        '\t' +
        currentText.substr(lastLineBreakPos + 1)
      element.selectionEnd = posOfCursor + 1
    },
    handleKeyDownShiftTab(e: KeyboardEvent) {
      e.preventDefault()
      const element = e.target as HTMLInputElement
      const posOfCursor = element.selectionStart
      if (posOfCursor === null) {
        window.alert('カーソル取得できない')
        return
      }
      const text = element.value
      const cursorIsFirstLine =
        text.substring(0, posOfCursor).lastIndexOf('\n') === -1
      if (cursorIsFirstLine) {
        let currentLineEnd = text.indexOf('\n')
        if (currentLineEnd === -1) {
          currentLineEnd = text.length
        }
        const tabPos = text.substring(0, currentLineEnd).indexOf('\t')
        if (tabPos === -1) {
          return
        }
        element.value = text.substring(0, tabPos) + text.substring(tabPos + 1)
        element.selectionEnd = posOfCursor - 1
        return
      }

      const currentLineStart =
        text.substring(0, posOfCursor).lastIndexOf('\n') + 1
      // INFO: 最終行の時は改行コードが存在しないのでテキスト長がcurrentLineEndになる
      const currentLineEnd =
        text.substring(currentLineStart).lastIndexOf('\n') === -1
          ? text.length
          : text.substring(currentLineStart).indexOf('\n') + currentLineStart

      const tabInCurrentLine = text
        .substring(currentLineStart, currentLineEnd)
        .indexOf('\t')

      if (tabInCurrentLine === -1) {
        return
      }
      element.value =
        text.substring(0, currentLineStart + tabInCurrentLine) +
        text.substring(currentLineStart + tabInCurrentLine + 1)
      element.selectionEnd = posOfCursor - 1
    },
    showErrorMessage(message: string) {
      this.tagTreeTextErrorMessage = message
    },
    hideErrorMessage() {
      this.tagTreeTextErrorMessage = ''
    },
    tagNameIncludeingSynonyms(name: string, synonyms: string[]): string {
      if (synonyms.length === 0) {
        return name
      }
      return name + synonyms.reduce((prev, cur) => prev + ' | ' + cur, '')
    },
    async updateTagName(language: 'ja' | 'en') {
      let attributes = {}
      switch (language) {
        case 'ja':
          if (this.newTagName.ja === '') {
            window.alert('タグ名を空欄にはできません')
            this.newTagName.ja = this.activeTree.name_ja
            return
          }
          attributes = {
            term_ja: {
              name: this.newTagName.ja,
              language,
            },
          }
          break

        case 'en':
          if (this.newTagName.en === '') {
            window.alert('タグ名（英）を空欄にはできません')
            this.newTagName.en = this.activeTree.name_en
            return
          }
          attributes = {
            term_en: {
              name: this.newTagName.en,
              language,
            },
          }
          break
      }

      try {
        this.$nuxt.$loading.start()
        await this.apiClient.partialUpdateApiTagsId(this.activeTag.id, {
          data: {
            type: 'Tag',
            id: this.activeTag.id,
            attributes,
          },
        })
        await this.loadTree()
      } catch (error) {
        window.alert('タグ名の更新に失敗しました' + JSON.stringify(error))
      } finally {
        this.$nuxt.$loading.finish()
      }
    },
    openAllTree(input: string) {
      const allTree = this.$refs.allTree as unknown as VTreeView
      if (input) {
        allTree.updateAll(true)
      } else {
        allTree.updateAll(false)
      }
    },
    handleInputAddedTree(input: string) {
      // INFO: transnoからのコピーが半角スペース4文字がインデントになるため
      input = input.replace(/ {4}/g, '\t')

      this.hideErrorMessage()
      const textTree = [] as TextTree[]
      const pushChildToChildren = (
        children: TextTree[],
        child: TextTree,
        count: number
      ): void => {
        if (count === 0) {
          if (children.map((item) => item.name).includes(child.name)) {
            throw new Error(`「${child.name}」タグが重複`)
          }
          children.push(child)
          return
        }
        if (!children.slice(-1)[0]) {
          throw new Error('パースに失敗')
        }
        pushChildToChildren(children.slice(-1)[0].children, child, count - 1)
      }
      const errorLines = [] as { lineNumber: number; message: string }[]
      input
        .trimEnd()
        .split('\n')
        .forEach((text, index) => {
          const indentCount = text.search(/\S|$/)
          const words = text
            .trim()
            .split('|')
            .map((item) => item.trim())
          const child = {
            name: words[0],
            synonyms: words.slice(1),
            children: [],
          }
          try {
            // INFO: アクティブタグ（親タグ）と子タグ名が同一の場合にエラー
            if (
              indentCount === 0 &&
              this.activeTree.children
                .map((child) => child.name_ja)
                .concat(this.activeTree.children.map((child) => child.name_en))
                .includes(child.name)
            ) {
              throw new Error(
                `「${
                  this.activeTree.name_ja || this.activeTree.name_en
                }」タグの子タグ「${child.name}」が重複`
              )
            }
            // INFO: 同義語が重複してる場合はエラー
            if (
              Array.from(new Set(child.synonyms)).length !==
              child.synonyms.length
            ) {
              throw new Error('同義語が重複')
            }
            // INFO: 同義語がタグ名と重複してる場合はエラー
            if (child.synonyms.includes(child.name)) {
              throw new Error('タグ名と同義語が重複')
            }
            pushChildToChildren(textTree, child, indentCount)
          } catch (error) {
            errorLines.push({ lineNumber: index + 1, message: error.message })
          } finally {
            //
          }
        })
      if (errorLines.length > 0) {
        this.showErrorMessage(
          errorLines.reduce(
            (prev, cur) => prev + `${cur.lineNumber}.${cur.message} `,
            ''
          )
        )
      }
      this.textTree = textTree
      const addedTree = this.$refs.addedTree as unknown as VTreeView
      addedTree.updateAll(true)
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
      this.newTagName = {
        ja: this.activeTree.name_ja,
        en: this.activeTree.name_en,
      }
      this.loadActiveTag()
    },
    async loadActiveTag() {
      try {
        const { data: tag } = (
          await this.apiClient.retrieveApiTagsId(this.activeTree.tag_id)
        ).data
        this.activeTag = tag
      } catch (error) {
        window.alert('タグの読み込みに失敗しました。' + JSON.stringify(error))
      } finally {
        //
      }
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
      // loadTag(targetTree.tag_id)
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
      this.deletedTree = {} as TagTreeAttributes
      this.shouldShowNodeDeleteDialog = true
      try {
        const { data: tagTree } = (
          await this.apiClient.retrieveApiTagTreeId(nodeId)
        ).data
        this.deletedTree = tagTree.attributes
      } catch (error) {
        window.alert('ツリーの読み込みに失敗しました' + JSON.stringify(error))
      } finally {
        //
      }
    },
    openSynonymDialog(term: TermAttributes) {
      this.removedSynonym = term
      this.shouldShowSynonymDialog = true
    },
    closeSynonymDialog() {
      this.shouldShowSynonymDialog = false
    },
    async deleteTree() {
      this.$nuxt.$loading.start()
      try {
        await this.apiClient.destroyApiNodesId(this.deletedTree.node_id)
        this.shouldShowNodeDeleteDialog = false
        await this.loadTree()
      } catch (error) {
        window.alert('ツリーの削除に失敗しました。' + JSON.stringify(error))
      } finally {
        this.$nuxt.$loading.finish()
      }
    },
    async removeSynonym(term: TermAttributes) {
      this.$nuxt.$loading.start()
      try {
        await this.apiClient.partialUpdateApiTagsId(this.activeTag.id, {
          data: {
            type: 'Tag',
            id: this.activeTag.id,
            attributes: {
              synonyms: this.activeTag.attributes.synonyms.filter((synonym) => {
                return term.name !== synonym.name
              }),
            },
          },
        })
        await this.loadActiveTag()
      } catch (error) {
        window.alert('同義語の削除に失敗しました' + JSON.stringify(error))
      } finally {
        this.closeSynonymDialog()
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
      } catch (error) {
        window.alert('ツリーの読み込みに失敗しました' + JSON.stringify(error))
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
      } catch (error) {
        window.alert('タグの読み込みに失敗しました' + JSON.stringify(error))
      } finally {
        //
      }
    },
    async addNode(tag: Tag) {
      this.$nuxt.$loading.start()
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
        await this.loadTree()
        this.$nuxt.$loading.finish()
      }
    },
    async addTagAndNode() {
      this.$nuxt.$loading.start()
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
        await this.loadTree()
        this.newChildTagName = ''
      } catch (error) {
        window.alert(
          JSON.stringify(error.response.data.errors) ||
            '予期しないエラーです。管理者に問い合わせください。'
        )
      } finally {
        this.$nuxt.$loading.finish()
      }
    },
    async addTermAndSynonym(language: 'ja' | 'en') {
      const newName =
        language === 'ja' ? this.newSynonymName.ja : this.newSynonymName.en
      if (
        this.activeTag.attributes.term_ja &&
        this.activeTag.attributes.term_ja.name === newName
      ) {
        window.alert(`${newName}はタグ名と同じです。`)
        return
      }
      if (
        this.activeTag.attributes.term_en &&
        this.activeTag.attributes.term_en.name === newName
      ) {
        window.alert(`${newName}はタグ名（英）と同じです。`)
        return
      }
      if (
        this.activeTag.attributes.synonyms
          .map((term) => term.name)
          .includes(newName)
      ) {
        window.alert(`${newName}は既に登録されている同義語です。`)
        return
      }
      try {
        this.$nuxt.$loading.start()
        await this.apiClient.partialUpdateApiTagsId(this.activeTag.id, {
          data: {
            type: 'Tag',
            id: this.activeTag.id,
            attributes: {
              synonyms: [
                {
                  name: newName,
                  language,
                },
                ...this.activeTag.attributes.synonyms,
              ],
            },
          },
        })
        await this.loadActiveTag()
        switch (language) {
          case 'ja':
            this.newSynonymName.ja = ''
            break
          case 'en':
            this.newSynonymName.en = ''
        }
      } catch (error) {
        window.alert(
          JSON.stringify(error.response.data.errors) ||
            '予期しないエラーです。管理者に問い合わせください。'
        )
      } finally {
        this.$nuxt.$loading.finish()
      }
    },
  },
})
</script>
