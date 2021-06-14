<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      item-key="SID"
      class="elevation-1"
    >
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
import { Contributor, DefaultApiFactory, Paper } from '@/api/out'

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
        { text: 'Figures', value: 'relationships.figures.meta.total' },
        { text: 'Samples', value: 'relationships.samples.meta.total' },
      ]
    },
  },
  created() {
    const api = DefaultApiFactory(undefined, process.env.STARRYDATA_API_URL)
    const papers = api.getPapers()
    papers.then((items) => {
      if (items.data.data) {
        const papers = items.data.data
        this.items = papers
      }
    })
  },
  methods: {
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
