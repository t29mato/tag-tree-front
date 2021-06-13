<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      item-key="ID"
      class="elevation-1"
    >
      <template #[`item.papers`]="{ item }">
        <p>{{ item.papers + ' (' + item.papersWithData + ')' }}</p>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { DefaultApiFactory, Database } from '@/api/out'

export default Vue.extend({
  data() {
    return {
      sortBy: 'age',
      sortDesc: false,
      items: [] as Database[],
    }
  },
  computed: {
    headers() {
      return [
        { text: 'ID', value: 'id' },
        { text: 'Database', value: 'attributes.name' },
        { text: 'Papers', value: 'relationships.papers.meta.totalPapers' },
        { text: 'Figures', value: 'relationships.figures.meta.totalFigures' },
        { text: 'Samples', value: 'relationships.samples.meta.totalSamples' },
      ]
    },
  },
  created() {
    const api = DefaultApiFactory(undefined, process.env.STARRYDATA_API_URL)
    const projects = api.getDatabases()
    projects.then((items) => {
      if (items.data.data) {
        const projects = items.data.data
        this.items = projects
      }
    })
  },
})
</script>
