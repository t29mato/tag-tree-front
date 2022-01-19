<template>
  <div>
    <v-container>
      <v-row justify="space-between">
        <v-btn-toggle v-model="editMode" mandatory>
          <v-btn>Edit </v-btn>
          <v-btn>Edit & View </v-btn>
          <v-btn>View </v-btn>
        </v-btn-toggle>
        <v-btn @click="saveTree">Save</v-btn>
      </v-row>
      <v-row>
        <v-col v-if="showEditScreen" cols="colsOfViewAndEditScreen">
          <v-textarea
            v-model="treeText"
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
            :error-messages="treeTextErrorMessage"
            @input="handleInputAddedTree"
            @keydown.tab.exact="handleKeyDownTab"
            @keydown.shift.tab.exact="handleKeyDownShiftTab"
          ></v-textarea>
        </v-col>
        <v-col v-if="showViewScreen" cols="colsOfViewAndEditScreen">
          <!-- <v-text-field
            v-show="!isEditMode"
            v-model="filterKeyword"
            label="キーワードでフィルタリング"
            clearable
            clear-icon="mdi-close-circle-outline"
            @input="openAllTree"
          ></v-text-field> -->
          <v-treeview
            ref="allTree"
            :items="[allTree]"
            item-key="node_id"
            :search="filterKeyword"
            :filter="filterAllTree"
          >
            <template slot="label" slot-scope="{ item }">
              <v-chip :color="generateColor(item.tree_level)">
                {{ showTagName(item) }}
              </v-chip>
              <v-chip
                v-if="item.children && item.children.length > 0"
                x-small
                outlined
                >{{ item.children.length }}</v-chip
              >
            </template>
          </v-treeview>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { StarrydataApiFactory, TagTree } from 'starrydata-api-client'
import Axios from 'axios'

interface VTreeView {
  updateAll: (arg0: boolean) => void
}

export default Vue.extend({
  filters: {},
  data() {
    return {
      editMode: 1,
      // REFACTOR: merge allTree and tree into one
      allTree: {} as TagTree,
      tree: {
        name: '',
        key: '',
      },
      apiClient: StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      ),
      filterKeyword: '',
      treeText: '',
      treeTextErrorMessage: '',
      textTree: [] as TagTree[],
    }
  },
  computed: {
    showEditScreen(): boolean {
      const mode = this.editMode
      return mode === 0 || mode === 1
    },
    showViewScreen(): boolean {
      const mode = this.editMode
      return mode === 1 || mode === 2
    },
    colsOfViewAndEditScreen(): number {
      if (this.showViewScreen && this.showEditScreen) {
        return 6
      } else {
        return 12
      }
    },
    // TODO: 同義語も検索対象に加える。APIの修正も必要
    filterAllTree() {
      return (item: TagTree, search: string) => {
        return item.tag_name.includes(search)
      }
    },
  },
  async mounted() {
    const apiClient = StarrydataApiFactory(
      undefined,
      process.env.STARRYDATA_API_URL
    )
    try {
      const token = localStorage.getItem('auth._token.local')
      if (token === null) {
        throw new Error("It couldn't get the token from your local storage")
      }
      const jwt = 'JWT ' + JSON.parse(token).data.access
      const { data: tagTree } = (
        await apiClient.retrieveApiTagTreeId(this.$route.params.id, {
          headers: {
            Authorization: jwt,
          },
        })
      ).data
      this.allTree = tagTree.attributes.tree
      this.tree = {
        name: tagTree.attributes.name,
        key: tagTree.attributes.key,
      }
      this.treeText = this.convertTree2String(this.allTree)
    } catch (error) {
      if (Axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 401:
            this.$auth.logout()
            break
          default:
            window.alert('It failed to download tree' + JSON.stringify(error))
        }
      } else {
        window.alert('It failed to download tree' + JSON.stringify(error))
      }
    } finally {
      //
    }
  },
  methods: {
    async saveTree(): Promise<void> {
      try {
        const token = localStorage.getItem('auth._token.local')
        if (token === null) {
          throw new Error("It couldn't get the token from your local storage")
        }
        const jwt = 'JWT ' + JSON.parse(token).data.access
        await this.apiClient.partialUpdateApiTagTreeId(
          this.$route.params.id,
          {
            data: {
              type: 'TagTreeDetailView',
              id: this.$route.params.id,
              attributes: {
                name: this.tree.name,
                key: this.tree.key,
                tree: this.allTree,
              },
            },
          },
          {
            headers: {
              Authorization: jwt,
            },
          }
        )
      } catch (error) {
        window.alert('ツリーの更新に失敗しました' + JSON.stringify(error))
      } finally {
        //
      }
    },
    pushChildDeeply(child: TagTree, parent: TagTree, deepLevel: number): void {
      if (deepLevel === 1) {
        parent.children.push(child)
      } else {
        if (!parent.children.slice(-1)[0]) {
          throw new Error('Failed to parse')
        }
        deepLevel--
        return this.pushChildDeeply(
          child,
          parent.children.slice(-1)[0],
          deepLevel
        )
      }
    },
    convertTree2String(tree: TagTree): string {
      const result = '\t'.repeat(tree.tree_level) + tree.tag_name
      if (tree.children.length === 0) {
        return result
      }
      return (
        result +
        tree.children
          .map((child) => {
            return '\n' + this.convertTree2String(child)
          })
          .join('')
      )
    },
    convertString2Tree(
      treeText: string,
      current: TagTree | null,
      line: number = 0,
      errors: string[] = []
    ): TagTree {
      const hasNext = treeText.includes('\n')
      const firstLine = hasNext
        ? treeText.substr(0, treeText.indexOf('\n'))
        : treeText
      const breakIndex = treeText.indexOf('\n')
      const restOfLine = treeText.substr(breakIndex + 1)
      const tabLastIndex = firstLine.lastIndexOf('\t')
      const tagName = firstLine.substr(tabLastIndex + 1)
      const tabCount = tabLastIndex === -1 ? 0 : tabLastIndex + 1
      const treeObject: TagTree = {
        tag_name: tagName,
        tree_level: tabCount,
        children: [],
      }

      if (!current) {
        current = treeObject
      } else {
        try {
          this.pushChildDeeply(treeObject, current, tabCount)
        } catch (error) {
          errors.push(`${line}: ${error}`)
        } finally {
          //
        }
      }
      if (hasNext) {
        return this.convertString2Tree(restOfLine, current, line + 1, errors)
      }
      if (errors.length > 0) {
        throw new Error(JSON.stringify(errors))
      }
      return current
    },
    // REFACTOR: This method doesn't need because it return just only name
    showTagName(tree: TagTree): string {
      return tree.tag_name
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
      this.treeTextErrorMessage = message
    },
    hideErrorMessage() {
      this.treeTextErrorMessage = ''
    },
    openAllTree(input: string) {
      const allTree = this.$refs.allTree as unknown as VTreeView
      if (input) {
        allTree.updateAll(true)
      } else {
        allTree.updateAll(false)
      }
    },
    // REFACTOR: 関数名のAddedTreeがtextareと一貫性ないので修正する
    handleInputAddedTree(input: string) {
      // INFO: transnoからのコピーが半角スペース4文字がインデントになるため
      input = input.replace(/ {4}/g, '\t')
      this.hideErrorMessage()
      try {
        const tree = this.convertString2Tree(input, null)
        this.allTree = tree
        const allTree = this.$refs.allTree as unknown as VTreeView
        allTree.updateAll(true)
      } catch (error) {
        console.log('error:', error.message)
        const message = JSON.parse(error.message)
        this.showErrorMessage(message.join('\n'))
      } finally {
        //
      }
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
    async loadTree() {
      try {
        // ルートIDが1のため
        const { data: tagTree } = (
          await this.apiClient.retrieveApiTagTreeId(
            this.$route.params.id || '1'
          )
        ).data
        this.allTree = tagTree.attributes.tree
      } catch (error) {
        window.alert('ツリーの読み込みに失敗しました' + JSON.stringify(error))
      } finally {
        //
      }
    },
  },
})
</script>
