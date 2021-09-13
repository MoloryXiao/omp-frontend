<template>
  <div class="hello-container">
    <p class="hello-text">Hello~</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.hello {
  &-container {
    margin: 25px;
  }
  &-text {
    font-size: 18px;
    line-height: 46px;
  }
}
</style>
