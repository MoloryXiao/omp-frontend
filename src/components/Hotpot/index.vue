<template>
  <div class="app-container" style="text-align:center;">
    <canvas id="cavsTable" width="320" height="160">
      您的浏览器不支持canvas,请升级浏览器
    </canvas>
  </div>
</template>

<script>

export default {
  name: 'Hotpot',
  props: {
    hotpotData: {
      type: Array,
      required: false,
      default() {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    this.drawCanvas()
  },
  methods: {
    drawCanvas() {
      var canvas = document.getElementById('cavsTable')
      var ctx = canvas.getContext('2d')
      canvas.width = canvas.width * 2
      canvas.height = canvas.height * 2
      ctx.scale(2, 2)

      var color_work = 'rgba(84, 112, 198, 1)'
      var color_study = 'rgba(145, 204, 117, 1)'
      var color_read = 'rgba(252, 132, 82, 1)'
      var color_exercise = 'rgba(0,191,183,1)'
      var color_plan = 'rgb(254, 46, 46, 0.85)'
      var color_daily = 'rgb(144, 144, 144)'
      var color_recreation = 'rgb(218, 129, 245, 0.85)'
      var color_empty = 'white'
      var tube_size = 13
      var color_dict = {
        '工作': color_work,
        '学习': color_study,
        '阅读': color_read,
        '健身': color_exercise,
        '规划': color_plan,
        '日常': color_daily,
        '娱乐': color_recreation,
        'none': color_empty
      }

      for (var row = 0; row < this.hotpotData.length; row++) {
        for (var col = 0; col < this.hotpotData[0].length; col++) {
          ctx.fillStyle = color_dict[this.hotpotData[row][col]]
          ctx.fillRect(col * tube_size, row * tube_size, tube_size, tube_size)
        }
      }

      // 绘制表格
      ctx.strokeStyle = 'rgb(216, 216, 216)'
      for (var i = 0; i <= 12; i++) {
        ctx.beginPath()
        ctx.moveTo(0, tube_size * i)
        ctx.lineTo(tube_size * 24, tube_size * i)
        ctx.stroke()
      }
      for (var j = 0; j <= 24; j++) {
        ctx.beginPath()
        ctx.moveTo(tube_size * j, 0)
        ctx.lineTo(tube_size * j, tube_size * 12)
        ctx.stroke()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
