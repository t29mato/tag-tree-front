<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      item-key="ID"
      class="elevation-1"
    >
      <template #[`item.papers`]="{ item }">
        <p>{{ item.papers + ' (' + item.papersWithData + ')' }}</p>
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
    papers: number
    papersWithData: number
    Figures: number
    Samples: number
    'My lists': number
  }[] = [
    {
      database: 'General DB',
      ID: 1,
      papers: 30449,
      papersWithData: 7333,
      Figures: 31480,
      Samples: 40458,
      'My lists': 80,
    },
    {
      database: 'Thermoelectric Materials',
      ID: 2,
      papers: 23870,
      papersWithData: 6319,
      Figures: 29260,
      Samples: 34513,
      'My lists': 1,
    },
    {
      database: 'Magnetic Materials',
      ID: 3,
      papers: 4103,
      papersWithData: 714,
      Figures: 1494,
      Samples: 3849,
      'My lists': 1,
    },
    {
      database: 'Condensed Matter',
      ID: 4,
      papers: 394,
      papersWithData: 132,
      Figures: 509,
      Samples: 1374,
      'My lists': 1,
    },
    {
      database: 'High Thermal Conductivity Materials',
      ID: 5,
      papers: 179,
      papersWithData: 124,
      Figures: 250,
      Samples: 519,
      'My lists': 0,
    },
    {
      database: 'Piezoelectric Materials',
      ID: 6,
      papers: 134,
      papersWithData: 0,
      Figures: 0,
      Samples: 0,
      'My lists': 0,
    },
    {
      database: 'Hyper Material',
      ID: 7,
      papers: 76,
      papersWithData: 55,
      Figures: 146,
      Samples: 262,
      'My lists': 0,
    },
    {
      database: 'Project TtoH',
      ID: 8,
      papers: 0,
      papersWithData: 0,
      Figures: 0,
      Samples: 0,
      'My lists': 0,
    },
  ]
}
</script>
