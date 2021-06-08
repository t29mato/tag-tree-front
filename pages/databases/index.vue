<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      item-key="id"
      class="elevation-1"
    >
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
      { text: 'Database', value: 'Database' },
      { text: 'Papers', value: 'Papers' },
      { text: 'Papers with data', value: 'Papers with data' },
      { text: 'Figures', value: 'Figures' },
      { text: 'Samples', value: 'Samples' },
      { text: 'My lists', value: 'My lists' },
    ]
  }

  items: {
    ID: number
    Database: string
    Papers: number
    'Papers with data': number
    Figures: number
    Samples: number
    'My lists': number
  }[] = [
    {
      Database: 'General DB',
      ID: 1,
      Papers: 30449,
      'Papers with data': 7333,
      Figures: 31480,
      Samples: 40458,
      'My lists': 80,
    },
    {
      Database: 'Thermoelectric Materials',
      ID: 2,
      Papers: 23870,
      'Papers with data': 6319,
      Figures: 29260,
      Samples: 34513,
      'My lists': 1,
    },
    {
      Database: 'Magnetic Materials',
      ID: 3,
      Papers: 4103,
      'Papers with data': 714,
      Figures: 1494,
      Samples: 3849,
      'My lists': 1,
    },
    {
      Database: 'Condensed Matter',
      ID: 4,
      Papers: 394,
      'Papers with data': 132,
      Figures: 509,
      Samples: 1374,
      'My lists': 1,
    },
    {
      Database: 'High Thermal Conductivity Materials',
      ID: 5,
      Papers: 179,
      'Papers with data': 124,
      Figures: 250,
      Samples: 519,
      'My lists': 0,
    },
    {
      Database: 'Piezoelectric Materials',
      ID: 6,
      Papers: 134,
      'Papers with data': 0,
      Figures: 0,
      Samples: 0,
      'My lists': 0,
    },
    {
      Database: 'Hyper Material',
      ID: 7,
      Papers: 76,
      'Papers with data': 55,
      Figures: 146,
      Samples: 262,
      'My lists': 0,
    },
    {
      Database: 'Project TtoH',
      ID: 8,
      Papers: 0,
      'Papers with data': 0,
      Figures: 0,
      Samples: 0,
      'My lists': 0,
    },
  ]
}
</script>
