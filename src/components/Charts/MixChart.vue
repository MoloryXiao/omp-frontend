<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'
import { getDailyTimeData } from '@/api/statistics'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      chart: null,
      data_show: {
        'x_var': [],
        'work': [],
        'study': [],
        'exercise': [],
        'read': [],
        'plan': [],
        'average': []
      },
      data_count: 0
    }
  },
  mounted() {
    this.fetchData()
    // this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    fetchData() {
      getDailyTimeData().then(response => {
        this.data_count = response.count
        response.results.forEach((item, index) => {
          var date = new Date(item.year + '-' + item.month + '-' + item.day)
          var week = '周' + '日一二三四五六'.charAt(date.getDay())
          this.data_show['x_var'].push(item.year + '-' + item.month + '-' + item.day + '\n' + week)
          this.data_show['work'].push(item.total_time_work)
          this.data_show['study'].push(item.total_time_study)
          this.data_show['exercise'].push(item.total_time_exercise)
          this.data_show['read'].push(item.total_time_read)
          this.data_show['plan'].push(item.total_time_plan)
          this.data_show['average'].push(item.average_time_all)
        })
        this.initChart()
      })
    },
    initChart() {
      // this.fetchData()
      this.chart = echarts.init(document.getElementById(this.id))
      const xData = this.data_show['x_var']
      this.chart.setOption({
        backgroundColor: 'white',
        title: {
          text: '单天时间分布趋势图',
          x: 'center',
          top: '12',
          textStyle: {
            color: '#90979c',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        // 图释栏
        legend: {
          x: '5%', // 图释栏距左位置
          top: '13%', // 图释栏距顶位置
          textStyle: {
            color: '#90979c'
          },
          data: ['工作', '学习', '阅读', '健身', '规划', '平均']
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false // 数据列是否以线划分
          },
          axisTick: {
            show: true // X轴数据点是否标点
          },
          splitArea: {
            show: false // 横向数据列样式是否颜色间隔展示
          },
          axisLabel: {
            interval: 0
          },
          data: xData
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            show: false // 横向数据线是否展示
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false // Y轴数据点是否标点
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: true // 纵向数据列样式是否颜色间隔展示
          }
        }],
        dataZoom: [{
          show: true,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 30,
          startValue: this.data_count - 6,
          endValue: this.data_count,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%', // 伸缩边框大小
          handleStyle: {
            color: '#d3dee5'
          },
          textStyle: {
            color: '#fff' },
          borderColor: '#90979c'
        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        series: [{
          name: '工作',
          type: 'bar',
          // stack: 'total',
          itemStyle: {
            normal: {
              color: 'rgba(84, 112, 198, 0.8)',
              barBorderRadius: 0,
              label: {
                show: true,
                textStyle: {
                  color: '#fff'
                },
                position: 'insideTop', // 数字展示位置 top:数据条外顶 insideTop:数据条内顶
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.data_show['work']
        },
        {
          name: '学习',
          type: 'bar',
          // stack: 'total',
          itemStyle: {
            normal: {
              color: 'rgba(145, 204, 117, 0.8)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.data_show['study']
        },
        {
          name: '阅读',
          type: 'bar',
          // stack: 'total',
          itemStyle: {
            normal: {
              color: 'rgba(252, 132, 82, 0.8)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.data_show['read']
        },
        {
          name: '健身',
          type: 'bar',
          // stack: 'total',
          itemStyle: {
            normal: {
              color: 'rgba(0,191,183,0.5)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.data_show['exercise']
        }, {
          name: '规划',
          type: 'bar',
          // stack: 'total', // 是否堆叠到total组
          barMaxWidth: 30, // 数据条宽度
          barGap: '10%', // 数据条间隔
          itemStyle: {
            normal: {
              color: 'rgba(255,144,128,1)',
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.data_show['plan']
        }, {
          name: '平均',
          type: 'line',
          // stack: 'total',
          symbolSize: 10,
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: 'rgba(252,230,48,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.data_show['average']
        }
        ]
      })
    }
  }
}
</script>
