<template>
  <div class="container">
    <a href="/wpd/" target="_blank">WebPlotDigitizerを開く</a><br>
    {{ json }}
    <!-- <button v-on:click="hoge()">hoge</button> -->
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
