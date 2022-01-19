<template>
  <div class="container">
    <a href="/wpd/" target="_blank">WebPlotDigitizerを開く</a><br />
    {{ json }}
    <!-- <button v-on:click="hoge()">hoge</button> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => {
    return {
      json: '',
    }
  },
  watch: {
    json(newJson) {
      console.error("It's called json")
      localStorage.json = newJson
    },
  },
  mounted() {},
})
</script>
