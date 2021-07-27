<template>
  <v-container>
    <v-card>
      <v-container>
        <v-card-title>{{ tag.attributes.name_ja }}</v-card-title>
        <v-text-field v-model="updatedNameJa" label="タグ名"></v-text-field>
        <v-text-field v-model="updatedNameEn" label="Tag Name"></v-text-field>
        <v-card-actions>
          <v-btn text color="success" @click="updateTag()"> 更新する </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
    <v-snackbar v-model="snackbar">
      更新に成功しました
      <template #action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { StarrydataApiFactory, Tag } from 'starrydata-api-client'

export default Vue.extend({
  async asyncData({ params }) {
    const apiClient = StarrydataApiFactory(
      undefined,
      process.env.STARRYDATA_API_URL
    )
    const { data: tag } = (await apiClient.retrieveApiTagsId(params.id)).data
    return {
      tag,
      updatedNameJa: tag.attributes.name_ja,
      updatedNameEn: tag.attributes.name_en,
    }
  },
  data() {
    return {
      tag: {} as Tag,
      apiClient: StarrydataApiFactory(
        undefined,
        process.env.STARRYDATA_API_URL
      ),
      updatedNameJa: '',
      updatedNameEn: '' as string | undefined,
      snackbar: false,
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
          await this.apiClient.retrieveApiTagsId(this.$route.params.id)
        ).data
        this.tag = tag
        this.updatedNameJa = tag.attributes.name_ja
        this.updatedNameEn = tag.attributes.name_en
      } catch (error) {
        window.alert(
          JSON.stringify(error.response.data.errors) ||
            '予期しないエラーです。管理者に問い合わせください。'
        )
      } finally {
        //
      }
    },
    async updateTag() {
      try {
        await this.apiClient.partialUpdateApiTagsId(this.$route.params.id, {
          data: {
            type: 'Tag',
            id: this.$route.params.id,
            attributes: {
              name_ja: this.updatedNameJa,
              name_en: this.updatedNameEn,
            },
          },
        })
        this.snackbar = true
      } catch (error) {
        window.alert(
          JSON.stringify(error.response.data.errors) ||
            '予期しないエラーです。管理者に問い合わせください。'
        )
      } finally {
        this.loadTag()
        //
      }
    },
  },
})
</script>
