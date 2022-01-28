<template>
  <div>
    <v-sheet elevation="3">
      <div class="text-end pa-2">
        <v-dialog v-model="shouldShowModal" width="500">
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on"> Add </v-btn>
          </template>

          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Add TagTree
            </v-card-title>

            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="newTagTreeName"
                  :counter="64"
                  label="Name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="newTagTreeKey"
                  :counter="32"
                  label="Key"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                :disabled="!isValidated"
                text
                @click="createTagTree"
                >Save</v-btn
              >
              <v-btn color="grey" text @click="shouldShowModal = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <v-data-table :headers="headers" :items="items" item-key="SID">
        <template #[`item.actions`]="{ item }">
          <nuxt-link :to="{ name: 'tag-tree-id', params: { id: item.id } }">
            <v-icon class="small">mdi-pencil</v-icon>
          </nuxt-link>
        </template>
      </v-data-table>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { TagTreeApiFactory, TagTree } from 'tag-tree-api-client'
import Axios from 'axios'

export default Vue.extend({
  filters: {},
  data() {
    return {
      sortBy: 'SID',
      sortDesc: false,
      items: [] as TagTree[],
      author: '',
      apiClient: TagTreeApiFactory(undefined, process.env.tagTreeApiUrl),
      shouldShowModal: false,
      newTagTreeName: '',
      newTagTreeKey: '',
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
    isValidated(): boolean {
      const nameLength = this.newTagTreeName.length
      const keyLength = this.newTagTreeKey.length
      if (nameLength === 0 || nameLength > 64) {
        return false
      }
      if (keyLength === 0 || keyLength > 32) {
        return false
      }
      return true
    },
  },
  mounted() {
    this.apiClient = TagTreeApiFactory(undefined, process.env.tagTreeApiUrl)
    this.loadTagTree()
    console.log('tagTreeApiUrl', process.env.tagTreeApiUrl)
    console.log('AUTH_API_URL', process.env.AUTH_API_URL)
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
    async createTagTree() {
      await this.apiClient.createApiTagTree({
        data: {
          type: 'TagTreeListView',
          attributes: {
            name: this.newTagTreeName,
            key: this.newTagTreeKey,
          },
        },
      })
      this.loadTagTree()
      this.shouldShowModal = false
    },
  },
})
</script>
