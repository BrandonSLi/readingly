<template>
  <ul class="table-of-contents">
    <li 
      v-for="item in currentBook.tableOfContents" 
      :key="item.location"
      @click="changeBookLocation(item.location)"
    >
      {{ item.label }}
    </li>
  </ul>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'TableOfContents',
  computed: mapState('reader', ['currentBook']),
  methods: {
    ...mapMutations('reader', ['setCurrentBook']),
    changeBookLocation(location) {
      this.setCurrentBook({ ...this.currentBook, location })
    }
  }
}
</script>

<style lang="scss" scoped>
  ul.table-of-contents {
    height: 100%;
    box-sizing: border-box;
    background-color: var(--theme-bg-color);
    color: var(--theme-text-color);
    list-style: none;
    padding: 24px;
    margin: 0;
    text-align: center;

    li {
      padding: 0.5em;
      border-bottom: 1px solid #dedede;
    }
  }
</style>