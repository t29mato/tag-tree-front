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
      <template #[`item.attributes.name_ja`]="{ item }">
        <v-chip :to="item.id">
          {{ item.attributes.name_ja }}
        </v-chip>
      </template>
      <template #[`item.attributes.name_en`]="{ item }">
        <v-chip :to="item.id">
          {{ item.attributes.name_en }}
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
  Tag,
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
      tags: [] as Tag[],
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
        { text: 'タグ名', value: 'attributes.name_ja', sortable: false },
        { text: 'Tag Name', value: 'attributes.name_en', sortable: false },
        { text: 'ツリーID', value: 'relationships.nodes', sortable: false },
      ]
    },
  },
  watch: {
    options() {
      this.loadTags()
    },
    keyword() {
      this.loadTags()
    },
  },
  created() {
    this.loadTags()
  },
  methods: {
    async loadTags() {
      try {
        const { data: response } = await this.apiClient.listApiTags(
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
