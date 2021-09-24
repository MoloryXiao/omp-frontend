<template>
  <div class="dashboard-editor-container">
    <el-row class="time-tend-container">
      <chart id="c1" height="100%" width="100%" />
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Chart from '@/components/Charts/MixChart'

export default {
  name: 'Dashboard',
  components: { Chart },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  // height: 800px;
  .time-tend-container {
    background:#fff;
    padding:16px 16px 0;
    margin-bottom:32px;
    height:500px;
    width:100%;
    border-radius:5px;
  }
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
