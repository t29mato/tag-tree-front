<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      item-key="ID"
      :loading="loading"
      :loading-text="loadingText"
    >
      <template #[`item.relationships.papers.meta.total`]="{ item }">
        <nuxt-link :to="{ path: 'papers', query: { database: item.id } }">{{
          item.relationships.papers.meta.total
        }}</nuxt-link>
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
      loading: true,
      loadingText: 'Loading... Please wait',
    }
  },
  computed: {
    headers() {
      return [
        { text: 'ID', value: 'id' },
        { text: 'Database', value: 'attributes.name' },
        { text: 'Papers', value: 'relationships.papers.meta.total' },
        { text: 'Figures', value: 'relationships.figures.meta.total' },
        { text: 'Samples', value: 'relationships.samples.meta.total' },
      ]
    },
  },
  created() {
    this.loadDatabases()
  },
  methods: {
    async loadDatabases() {
      this.loading = true
      // wait 1 seconds for making a mock look like real applicatin.
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const api = DefaultApiFactory(undefined, process.env.STARRYDATA_API_URL)
      try {
        const { data } = await api.getDatabases()
        if (data.data) {
          this.items = data.data
        }
      } catch (error) {
        alert(
          'Failed to connect with API. If it recovers after reloading, please wait a while and try again'
        )
      } finally {
        this.loading = false
      }
    },
  },
})
</script>
