<template>
  <div>
    <Header />
    <b-container>
      <b-table
        :items="items"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        responsive="sm"
      >
        <template #cell(Database)="data">
          <nuxt-link to="data.value.ID">{{ data.value.Name }}</nuxt-link>
        </template>
      </b-table>

      <div>
        Sorting By: <b>{{ sortBy }}</b
        >, Sort Direction:
        <b>{{ sortDesc ? 'Descending' : 'Ascending' }}</b>
      </div>
    </b-container>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      sortBy: 'age',
      sortDesc: false,
      fields: [
        { key: 'Database', sortable: true },
        { key: 'Papers', sortable: true },
        { key: 'Papers with data', sortable: true },
        { key: 'Figures', sortable: true },
        { key: 'Samples', sortable: true },
        { key: 'My lists', sortable: true },
      ],
      items: [
        {
          Database: {
            Name: 'General DB',
            ID: 1,
          },
          Papers: 30449,
          'Papers with data': 7333,
          Figures: 31480,
          Samples: 40458,
          'My lists': 80,
          path: '/databases/1',
        },
        {
          Database: {
            Name: 'Thermoelectric Materials',
            ID: 2,
          },
          Papers: 23870,
          'Papers with data': 6319,
          Figures: 29260,
          Samples: 34513,
          'My lists': 1,
        },
        {
          Database: {
            Name: 'Magnetic Materials',
            ID: 3,
          },
          Papers: 4103,
          'Papers with data': 714,
          Figures: 1494,
          Samples: 3849,
          'My lists': 1,
        },
        {
          Database: {
            Name: 'Condensed Matter',
            ID: 4,
          },
          Papers: 394,
          'Papers with data': 132,
          Figures: 509,
          Samples: 1374,
          'My lists': 1,
        },
        {
          Database: {
            Name: 'High Thermal Conductivity Materials',
            ID: 5,
          },
          Papers: 179,
          'Papers with data': 124,
          Figures: 250,
          Samples: 519,
          'My lists': 0,
        },
        {
          Database: {
            Name: 'Piezoelectric Materials',
            ID: 6,
          },
          Papers: 134,
          'Papers with data': 0,
          Figures: 0,
          Samples: 0,
          'My lists': 0,
        },
        {
          Database: {
            Name: 'Hyper Material',
            ID: 7,
          },
          Papers: 76,
          'Papers with data': 55,
          Figures: 146,
          Samples: 262,
          'My lists': 0,
        },
        {
          Database: {
            Name: 'Project TtoH',
            ID: 8,
          },
          Papers: 0,
          'Papers with data': 0,
          Figures: 0,
          Samples: 0,
          'My lists': 0,
        },
      ],
    }
  },
}
</script>
