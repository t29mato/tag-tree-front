<template>
  <div class="container">
    this is databases list screen
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => {
    return {
      json: ''
    }
  },
  mounted() {
    console.log("It's mounted.")
    if (localStorage.json) {
      this.json = localStorage.json;
    }
  },
  watch: {
    json(newJson) {
      console.log("It's called json")
      localStorage.json = newJson;
    }
  }
})
</script>
