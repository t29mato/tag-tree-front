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
import { Component, Vue } from 'vue-property-decorator'
import { DefaultApiFactory, Database } from '@/api/out'

@Component
export default class DatabasesScreen extends Vue {
  sortBy = 'age'
  sortDesc = false
  get headers() {
    return [
      { text: 'ID', value: 'id' },
      { text: 'Database', value: 'attributes.name' },
      { text: 'Papers', value: 'relationships.papers.meta.totalPapers' },
      { text: 'Figures', value: 'relationships.figures.meta.totalFigures' },
      { text: 'Samples', value: 'relationships.samples.meta.totalSamples' },
    ]
  }

  created() {
    const api = DefaultApiFactory(undefined, process.env.STARRYDATA_API_URL)
    const projects = api.getDatabases()
    projects.then((items) => {
      if (items.data.data) {
        const projects: Database[] = items.data.data
        this.items = projects
      }
    })
  }

  items: Database[] = []
}
</script>
