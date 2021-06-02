<template>
  <div class="flex items-start justify-between">
    <Sidebar></Sidebar>
    <div class="flex flex-col w-full md:space-y-4">
      <Header></Header>
      <div class="overflow-auto h-screen pb-24 px-4 md:px-6">
        <div class="overflow-auto">
          <b-pagination
            v-model="currentPage"
            :total-rows="rows()"
            :per-page="perPage"
            aria-controls="my-table"
          ></b-pagination>

          <p class="mt-3">Current Page: {{ currentPage }}</p>

          <b-table
            id="my-table"
            :items="items"
            :per-page="perPage"
            :current-page="currentPage"
            small
          ></b-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PaperList extends Vue {
  perPage = 3
  currentPage = 1
  items: {
    SID: number
    title: string
    authors: string
    identifier: string
    DOI: string
    figures: number
    samples: number
  }[] = [
    {
      SID: 1,
      title:
        'Decoupling Interrelated Parameters for Designing High Performance Thermoelectric Materials',
      authors: 'C. Xiao, Z. Li, K. Li, P. Huang, Y. Xie,',
      identifier: '00000001_Xiao_2014',
      DOI: '10.1021/ar400290f',
      figures: 1,
      samples: 1,
    },
    {
      SID: 2,
      title:
        'Decoupling Interrelated Parameters for Designing High Performance Thermoelectric Materials',
      authors: 'C. Xiao, Z. Li, K. Li, P. Huang, Y. Xie,',
      identifier: '00000001_Xiao_2014',
      DOI: '10.1021/ar400290f',
      figures: 1,
      samples: 1,
    },
    {
      SID: 3,
      title:
        'Decoupling Interrelated Parameters for Designing High Performance Thermoelectric Materials',
      authors: 'C. Xiao, Z. Li, K. Li, P. Huang, Y. Xie,',
      identifier: '00000001_Xiao_2014',
      DOI: '10.1021/ar400290f',
      figures: 1,
      samples: 1,
    },
    {
      SID: 4,
      title:
        'Decoupling Interrelated Parameters for Designing High Performance Thermoelectric Materials',
      authors: 'C. Xiao, Z. Li, K. Li, P. Huang, Y. Xie,',
      identifier: '00000001_Xiao_2014',
      DOI: '10.1021/ar400290f',
      figures: 1,
      samples: 1,
    },
    {
      SID: 5,
      title:
        'Decoupling Interrelated Parameters for Designing High Performance Thermoelectric Materials',
      authors: 'C. Xiao, Z. Li, K. Li, P. Huang, Y. Xie,',
      identifier: '00000001_Xiao_2014',
      DOI: '10.1021/ar400290f',
      figures: 1,
      samples: 1,
    },
    {
      SID: 6,
      title:
        'Decoupling Interrelated Parameters for Designing High Performance Thermoelectric Materials',
      authors: 'C. Xiao, Z. Li, K. Li, P. Huang, Y. Xie,',
      identifier: '00000001_Xiao_2014',
      DOI: '10.1021/ar400290f',
      figures: 1,
      samples: 1,
    },
  ]

  public rows() {
    return this.items.length
  }
}
</script>
