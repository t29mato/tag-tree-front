<template>
  <v-container>
    <v-card>
      <v-container>
        <v-card-title>{{ tag.attributes.name }}</v-card-title>
        <v-text-field v-model="updatedName"></v-text-field>
        <v-card-actions>
          <v-btn text @click="loadTag()"> 元に戻す </v-btn>
          <v-btn text color="success" @click="updateTag()"> 更新する </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { StarrydataApiFactory, PolymerTag } from 'starrydata-api-client'

export default Vue.extend({
  async asyncData({ params }) {
    const apiClient = StarrydataApiFactory(
      undefined,
      process.env.STARRYDATA_API_URL
    )
    const { data: tag } = (
      await apiClient.retrieveApiPolymerTagsId(params.id)
    ).data
    return { tag, updatedName: tag.attributes.name }
  },
  data() {
    return {
      tag: {} as PolymerTag,
      apiClient: StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      ),
      updatedName: '',
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async loadTag() {
      try {
        const { data: tag } = (
          await this.apiClient.retrieveApiPolymerTagsId(this.$route.params.id)
        ).data
        this.tag = tag
        this.updatedName = tag.attributes.name
      } catch (error) {
        console.error(error)
      } finally {
        //
      }
    },
    async updateTag() {
      try {
        await this.apiClient.partialUpdateApiPolymerTagsId(
          this.$route.params.id,
          {
            data: {
              type: 'PolymerTag',
              id: this.$route.params.id,
              attributes: {
                name: this.updatedName,
              },
            },
          }
        )
      } catch (error) {
        console.error(error)
        //
      } finally {
        this.loadTag()
        //
      }
    },
  },
})
</script>
