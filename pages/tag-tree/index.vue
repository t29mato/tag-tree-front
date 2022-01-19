<template>
  <div>
    <v-data-table :headers="headers" :items="items" item-key="SID">
      <template #[`item.actions`]="{ item }">
        <nuxt-link :to="{ name: 'tag-tree-id', params: { id: item.id } }">
          <v-icon class="small">mdi-pencil</v-icon>
        </nuxt-link>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { StarrydataApiFactory, TagTree } from 'starrydata-api-client'
import Axios from 'axios'

export default Vue.extend({
  filters: {},
  data() {
    return {
      sortBy: 'SID',
      sortDesc: false,
      items: [] as TagTree[],
      author: '',
      apiClient: StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      ),
    }
  },
  computed: {
    headers() {
      return [
        { text: 'ID', value: 'id' },
        { text: 'Name', value: 'attributes.name' },
        { text: 'Key', value: 'attributes.key' },
        { text: 'Actions', value: 'actions' },
      ]
    },
  },
  mounted() {
    this.apiClient = StarrydataApiFactory(
      undefined,
      process.env.STARRYDATA_API_URL
    )
    this.loadTagTree()
  },
  created() {},
  methods: {
    async loadTagTree() {
      try {
        const { data: tagTree } = (await this.apiClient.listApiTagTree()).data
        this.items = tagTree
      } catch (error) {
        if (Axios.isAxiosError(error)) {
          switch (error.response?.status) {
            case 401:
              this.$auth.logout()
              break
            default:
              window.alert(
                'It failed to download trees' + JSON.stringify(error)
              )
          }
        } else {
          window.alert('It failed to download trees' + JSON.stringify(error))
        }
      } finally {
        //
      }
    },
    toDetailScreen(item) {
      this.$route.path = item.id
    },
  },
})
</script>
