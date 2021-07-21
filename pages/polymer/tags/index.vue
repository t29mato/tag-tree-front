<template>
  <div>
    <v-text-field v-model="keyword" placeholder="タグ名"></v-text-field>
    <v-data-table
      :headers="headers"
      :items="tags"
      item-key="ID"
      :server-items-length="pagination.count"
      :options.sync="options"
      :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
    >
      <template #[`item.attributes.name`]="{ item }">
        <v-chip>
          {{ item.attributes.name }}
        </v-chip>
      </template>
      <template #[`item.relationships.nodes`]="{ item }">
        <nuxt-link
          v-for="node in item.relationships.nodes.data"
          :key="node.id"
          :to="{ path: '/polymer/tag-tree/' + node.id }"
          class="mr-3"
          >{{ node.id }}</nuxt-link
        >
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  StarrydataApiFactory,
  PolymerTag,
  MetaPagination,
} from 'starrydata-api-client'

interface DataOptions {
  page: number
  itemsPerPage: number
  sortBy: string[]
  sortDesc: boolean[]
  groupBy: string[]
  groupDesc: boolean[]
  multiSort: boolean
  mustSort: boolean
}

export default Vue.extend({
  data() {
    return {
      sortBy: 'age',
      sortDesc: false,
      tags: [] as PolymerTag[],
      pagination: {} as MetaPagination,
      options: { itemsPerPage: 20 } as DataOptions,
      apiClient: StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      ),
      keyword: '',
    }
  },
  computed: {
    headers() {
      return [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'タグ名', value: 'attributes.name', sortable: false },
        { text: 'ツリーID', value: 'relationships.nodes', sortable: false },
      ]
    },
  },
  watch: {
    options() {
      this.loadPolymerTags()
    },
    keyword() {
      this.loadPolymerTags()
    },
  },
  created() {
    this.loadPolymerTags()
  },
  methods: {
    async loadPolymerTags() {
      try {
        const { data: response } = await this.apiClient.listApiPolymerTags(
          undefined,
          undefined,
          this.options.page,
          this.options.itemsPerPage,
          undefined,
          this.keyword
        )
        this.tags = response.data
        this.pagination = response.meta.pagination
      } catch (error) {
        console.error(error)
      } finally {
        //
      }
    },
  },
})
</script>
