<template>
  <div 
    class="stopwatch" 
    @click="handleClick"
  >
    {{ formattedTime }}
  </div>
</template>

<script>
import { fromS } from 'hh-mm-ss'

export default {
  name: 'Settings',
  data() {
    return {
      interval: null,
      time: 0,
      isRunning: false
    }
  },
  computed: {
    formattedTime() {
      return fromS(this.time, 'hh:mm:ss')
    }
  },
  methods: {
    handleClick() {
      if (!this.interval) {
        this.interval = setInterval(() => {
          if (this.isRunning) {
            this.time++
          }
        }, 1000)
      }

      this.isRunning = !this.isRunning
    }
  },
  destroyed() {
    clearInterval(this.interval)
  }
}
</script>

<style lang="scss" scoped>
  .stopwatch {
    font-size: 0.9em;
  }
</style>