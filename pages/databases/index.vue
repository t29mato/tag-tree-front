<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      item-key="ID"
      :loading="loading"
      :loading-text="loadingText"
    >
      <template #[`item.attributes.paper_count`]="{ item }">
        <nuxt-link :to="{ path: '/papers', query: { database: item.id } }">{{
          item.attributes.paper_count
        }}</nuxt-link>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { StarrydataApiFactory, Database } from 'starrydata-api-client'

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
        { text: 'Papers', value: 'attributes.paper_count' },
        { text: 'Figures', value: 'attributes.figure_count' },
        { text: 'Samples', value: 'attributes.sample_count' },
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
      const api = StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      )
      try {
        const { data } = await api.listApiDatabases()
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
