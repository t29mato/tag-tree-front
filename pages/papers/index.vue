<template>
  <div class="flex items-start justify-between">
    <Sidebar></Sidebar>
    <div class="flex flex-col w-full md:space-y-4">
      <Header></Header>
      <div class="overflow-auto h-screen pb-24 px-4 md:px-6">
        <!-- hoge -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PaperList extends Vue {
  sortBy = 'age'
  sortDesc = false
  fields = [
    { key: 'Database', sortable: true },
    { key: 'Papers', sortable: true },
    { key: 'Papers with data', sortable: true },
    { key: 'Figures', sortable: true },
    { key: 'Samples', sortable: true },
    { key: 'My lists', sortable: true },
  ]

  items: {
    Database: { Name: string; ID: number }
    Papers: number
    'Papers with data': number
    Figures: number
    Samples: number
    'My lists': number
  }[] = []
}
</script>
