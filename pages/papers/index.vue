<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="6">
          <v-select
            v-model="database"
            :items="databases"
            item-value="id"
            item-text="attributes.name"
            label="Database"
          ></v-select>
        </v-col>
        <!-- TODO: 後々、検索機能を追加したときに利用する枠組み -->
        <!-- <v-col cols="12" sm="6">
          <v-text-field v-model="author" label="Authors"></v-text-field>
        </v-col> -->
      </v-row>
    </v-container>

    <v-data-table :headers="headers" :items="items" item-key="SID">
      <template #[`item.attributes.authors`]="{ item }">
        {{ makeAuthorsOneLine(item.attributes.authors) }}
      </template>
      <template #[`item.attributes.title`]="{ item }">
        {{ item.attributes.title | truncate(120) }}
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Contributor,
  DefaultApiFactory,
  Paper,
  PaperRelationshipsDatabasesData,
  Database,
} from '@/api/out'

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
      sortBy: 'SID',
      sortDesc: false,
      items: [] as Paper[],
      database: '',
      databases: [] as Database[],
      author: '',
    }
  },
  computed: {
    headers() {
      return [
        { text: 'SID', value: 'id' },
        { text: 'DOI', value: 'attributes.DOI' },
        { text: 'title', value: 'attributes.title' },
        { text: 'author', value: 'attributes.authors' },
        { text: 'Journal', value: 'attributes.container_title' },
        { text: 'Publisher', value: 'attributes.publisher' },
        {
          text: 'Databases',
          value: 'relationships.databases.data',
          align: ' d-none',
          // TODO: filteringはAPIの責務にするので、後々削除する。そうしないと数万オブジェクトの配列をメモリに展開することになるので。
          filter: (databases: PaperRelationshipsDatabasesData[]) => {
            if (!this.database) {
              return true
            }
            return databases.some((database) => {
              return database.id === this.database
            })
          },
        },
        { text: 'Figures', value: 'relationships.figures.meta.total' },
        { text: 'Samples', value: 'relationships.samples.meta.total' },
      ]
    },
  },
  created() {
    if (typeof this.$route.query.database === 'string') {
      this.database = this.$route.query.database
    }
    this.loadPapers()
    this.loadDatabases()
  },
  methods: {
    async loadPapers() {
      const api = DefaultApiFactory(undefined, process.env.STARRYDATA_API_URL)
      try {
        const { data: papers } = (await api.getPapers()).data
        if (papers) {
          this.items = papers
        }
      } catch {
        //
      } finally {
        //
      }
    },
    async loadDatabases() {
      const api = DefaultApiFactory(undefined, process.env.STARRYDATA_API_URL)
      try {
        const { data: projects } = (await api.getDatabases()).data
        if (projects) {
          this.databases = projects
        }
      } catch {
        //
      } finally {
        //
      }
    },
    makeAuthorsOneLine(authors: Contributor[]): string {
      return authors.reduce((prev, cur, index, array) => {
        const result = prev + cur.family + ' ' + cur.given
        if (index === array.length - 1) {
          return result
        }
        return result + ', '
      }, '')
    },
  },
})
</script>
