<template>
  <div class="app-container" style="text-align:center;">
    <canvas id="cavsTable" width="420" height="160">
      您的浏览器不支持canvas,请升级浏览器
    </canvas>
  </div>
</template>

<script>

export default {
  name: 'Hotpot',
  data() {
    return {
    }
  },
  mounted() {
    this.drawCanvas()
  },
  methods: {
    drawCanvas() {
      var hotpotData = [
        ['日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常'],
        ['日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常'],
        ['日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常'],
        ['日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '娱乐', '娱乐', '娱乐', '娱乐', '娱乐'],
        ['学习', '学习', '学习', '学习', '工作', '工作', '工作', '工作', '工作', '工作', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '学习', '学习', '学习', '学习', '学习', '学习', '学习'],
        ['学习', '学习', '工作', '工作', '工作', '工作', '工作', '工作', '工作', '工作', '工作', '工作', '学习', '学习', '学习', '学习', '学习', '学习', '工作', '工作', '工作', '工作', '工作', '日常'],
        ['日常', '日常', '日常', '日常', '日常', '健身', '健身', '健身', '健身', '阅读', '阅读', '健身', '健身', '娱乐', '娱乐', '娱乐', '娱乐', '娱乐', '日常', '日常', '日常', '日常', '日常', '日常'],
        ['工作', '工作', '工作', '工作', '工作', '工作', '工作', '工作', '工作', '工作', '工作', '工作', '工作', '工作', '工作', '工作', '工作', '工作', '工作', '工作', '工作', '工作', '工作', '工作'],
        ['工作', '工作', '日常', '日常', '日常', '日常', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习'],
        ['学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '工作', '工作', '工作', '工作', '工作', '学习'],
        ['学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '学习', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常', '日常'],
        ['娱乐', '娱乐', '娱乐', '娱乐', '娱乐', '娱乐', '娱乐', '娱乐', '娱乐', '娱乐', '娱乐', '娱乐', '娱乐', '娱乐', '娱乐', '娱乐', '娱乐', '娱乐', '娱乐', '娱乐', '娱乐', '娱乐', '娱乐', '娱乐']
      ]
      var canvas = document.getElementById('cavsTable')
      var ctx = canvas.getContext('2d')
      canvas.width = canvas.width * 2
      canvas.height = canvas.height * 2
      ctx.scale(2, 2)

      var table_row = 12
      var table_col = 24
      var color_work = 'rgba(84, 112, 198, 1)'
      var color_study = 'rgba(145, 204, 117, 1)'
      var color_read = 'rgba(252, 132, 82, 1)'
      var color_exercise = 'rgba(0,191,183,1)'
      var color_plan = 'rgb(254, 46, 46, 0.85)'
      var color_daily = 'rgb(144, 144, 144)'
      var color_recreation = 'rgb(218, 129, 245, 0.85)'
      var color_empty = 'white'
      var tube_size = 13
      var font_size = 6
      var font_margin = font_size * 6 + 2
      var legend_margin = tube_size
      var legend_padding = tube_size/3
      var color_dict = {
        '日常': color_daily,
        '规划': color_plan,
        '学习': color_study,
        '工作': color_work,
        '阅读': color_read,
        '健身': color_exercise,
        '娱乐': color_recreation,
        'none': color_empty
      }
      var color_dict_len = Object.keys(color_dict).length

      // 绘制 y 轴时间 Tag
      var y_time_tag = ['00:00-02:00', '02:00-04:00', '04:00-06:00', '06:00-08:00', '08:00-10:00', '10:00-12:00', 
        '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-21:00', '22:00-24:00']
      ctx.font = font_size+"px 微软雅黑"
      for(var i = 0; i < y_time_tag.length; i++) {
        ctx.fillText(y_time_tag[i], 0, tube_size-5 + tube_size * i)
      }

      // 绘制图示
      var count = 1
      for(var key in color_dict) {
        ctx.fillStyle = color_dict[key]
        ctx.fillRect(font_margin + table_col * tube_size + legend_margin, tube_size * table_row / color_dict_len * count - tube_size / 2 , tube_size, tube_size)
        ctx.fillStyle = 'black'
        ctx.fillText(
          key, 
          font_margin + table_col * tube_size + legend_margin + tube_size + legend_padding, 
          tube_size * table_row / color_dict_len * count + tube_size - 5 - tube_size / 2
        )
        count += 1
        // 最后一个'none'不处理
        if(count == color_dict_len) {
          break
        }
      }

      // 绘制时间颜色方块
      for (var row = 0; row < hotpotData.length; row++) {
        for (var col = 0; col < hotpotData[0].length; col++) {
          ctx.fillStyle = color_dict[hotpotData[row][col]]
          ctx.fillRect(font_margin + col * tube_size, row * tube_size, tube_size, tube_size)
        }
      }

      // 绘制表格
      ctx.strokeStyle = 'rgb(216, 216, 216)'
      for (i = 0; i <= table_row; i++) {
        ctx.beginPath()
        ctx.moveTo(font_margin + 0, tube_size * i)
        ctx.lineTo(font_margin + tube_size * table_col, tube_size * i)
        ctx.stroke()
      }
      for (var j = 0; j <= table_col; j++) {
        ctx.beginPath()
        ctx.moveTo(font_margin + tube_size * j, 0)
        ctx.lineTo(font_margin + tube_size * j, tube_size * table_row)
        ctx.stroke()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
