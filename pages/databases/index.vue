<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      item-key="ID"
      class="elevation-1"
    >
      <template #[`item.papers`]="{ item }">
        <p>{{ item }}</p>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class DatabasesScreen extends Vue {
  sortBy = 'age'
  sortDesc = false
  get headers() {
    return [
      { text: 'ID', value: 'ID' },
      { text: 'Database', value: 'database' },
      { text: 'Papers', value: 'papers' },
      { text: 'Figures', value: 'Figures' },
      { text: 'Samples', value: 'Samples' },
      { text: 'My lists', value: 'My lists' },
    ]
  }

  items: {
    ID: number
    database: string
    papers: {
      count: number
      countWithData: number
    }
    Figures: number
    Samples: number
    'My lists': number
  }[] = [
    {
      database: 'General DB',
      ID: 1,
      papers: {
        count: 30449,
        countWithData: 7333,
      },
      Figures: 31480,
      Samples: 40458,
      'My lists': 80,
    },
    {
      database: 'Thermoelectric Materials',
      ID: 2,
      papers: {
        count: 23870,
        countWithData: 6319,
      },
      Figures: 29260,
      Samples: 34513,
      'My lists': 1,
    },
    {
      database: 'Magnetic Materials',
      ID: 3,
      papers: {
        count: 4103,
        countWithData: 714,
      },
      Figures: 1494,
      Samples: 3849,
      'My lists': 1,
    },
    {
      database: 'Condensed Matter',
      ID: 4,
      papers: {
        count: 394,
        countWithData: 132,
      },
      Figures: 509,
      Samples: 1374,
      'My lists': 1,
    },
    {
      database: 'High Thermal Conductivity Materials',
      ID: 5,
      papers: {
        count: 179,
        countWithData: 124,
      },
      Figures: 250,
      Samples: 519,
      'My lists': 0,
    },
    {
      database: 'Piezoelectric Materials',
      ID: 6,
      papers: {
        count: 134,
        countWithData: 0,
      },
      Figures: 0,
      Samples: 0,
      'My lists': 0,
    },
    {
      database: 'Hyper Material',
      ID: 7,
      papers: {
        count: 76,
        countWithData: 55,
      },
      Figures: 146,
      Samples: 262,
      'My lists': 0,
    },
    {
      database: 'Project TtoH',
      ID: 8,
      papers: {
        count: 0,
        countWithData: 0,
      },
      Figures: 0,
      Samples: 0,
      'My lists': 0,
    },
  ]
}
</script>
