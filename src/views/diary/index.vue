<template>
  <div class="components-container">
    <el-date-picker
      v-model="pickerDate"
      type="date"
      value-format="yyyy-MM-dd"
      placeholder="选择日期"
      style="width:160px;"
      :clearable="false"
      :editable="false"
      @change="calcPickerDateParam()"
    />
    <div class="editor-content">
      <tinymce id="tinymceId" v-model="list.content" :height="400" />
    </div>
    <!-- {{ list.content }} -->
    <el-table
      class="table-container"
      :data="time_total_table"
      border
      style="width: 100%"
    >
      <el-table-column prop="exercise_time" label="今日健身时长" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.exercise_time === 0 ? '0min' : scope.row.exercise_time + 'mins' }}</span>
          <br>
          <span>{{ scope.row.exercise_time &lt; 60 ? '' : numFilter(scope.row.exercise_time/60) + 'hours' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="read_time" label="今日阅读时长" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.read_time === 0 ? '0min' : scope.row.read_time + 'mins' }}</span>
          <br>
          <span>{{ scope.row.read_time &lt; 60 ? '' : numFilter(scope.row.read_time/60) + 'hours' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="study_time" label="今日学习时长" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.study_time === 0 ? '0min' : scope.row.study_time + 'mins' }}</span>
          <br>
          <span>{{ scope.row.study_time &lt; 60 ? '' : numFilter(scope.row.study_time/60) + 'hours' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="work_time" label="今日工作时长" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.work_time === 0 ? '0min' : scope.row.work_time + 'mins' }}</span>
          <br>
          <span>{{ scope.row.work_time &lt; 60 ? '' : numFilter(scope.row.work_time/60) + 'hours' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="plan_time" label="总结回顾时长" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.plan_time === 0 ? '0min' : scope.row.plan_time + 'mins' }}</span>
          <br>
          <span>{{ scope.row.plan_time &lt; 60 ? '' : numFilter(scope.row.plan_time/60) + 'hours' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="recreation_time" label="今日娱乐时长" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.recreation_time === 0 ? '0min' : scope.row.recreation_time + 'mins' }}</span>
          <br>
          <span>{{ scope.row.recreation_time &lt; 60 ? '' : numFilter(scope.row.recreation_time/60) + 'hours' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="daily_time" label="其他日常花销" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.daily_time === 0 ? '0min' : scope.row.daily_time + 'mins' }}</span>
          <br>
          <span>{{ scope.row.daily_time &lt; 60 ? '' : numFilter(scope.row.daily_time/60) + 'hours' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <h4 v-if="time_total_show">时间热力图：</h4>
    <hotpot v-if="hotpot_show" :hotpot-data="hotpot_data" :visible.sync="hotpot_show" />
    <p v-if="time_total_show" style="margin-top: 15px; font-size:15px; color:#909398; line-height:20px;">
      临时SQL：<br>
      INSERT INTO omp_center.t_daily_time_collect(FstrYear, FstrMonth, FstrDay, FuiTotalTimeWork,
      FuiTotalTimeStudy, FuiTotalTimeRead, FuiTotalTimeExercise, FuiTotalTimePlan, FuiTotalTimeAll,
      FuiAverageTimeall, FuiStatus, FuiCreateTime, FuiUpdateTime, FuiUserId) VALUES (
      '{{ list.year }}', '{{ list.month }}', '{{ list.day }}',
      {{ time_total_table[0].work_time }}, {{ time_total_table[0].study_time }},
      {{ time_total_table[0].read_time }}, {{ time_total_table[0].exercise_time }},
      {{ time_total_table[0].plan_time }}, 0, 0, 1, now(), now(), 1);<br>
      UPDATE omp_center.t_daily_time_collect SET FuiTotalTimeAll=FuiTotalTimeWork+FuiTotalTimeStudy+FuiTotalTimeRead+FuiTotalTimeExercise+FuiTotalTimePlan;<br>
      UPDATE omp_center.t_daily_time_collect SET FuiAverageTimeall=(FuiTotalTimeWork+FuiTotalTimeStudy+FuiTotalTimeRead+FuiTotalTimeExercise+FuiTotalTimePlan)/4;
    </p>
    <el-button class="bottom-submit-btn" type="primary" size="small" @click="detectDiary">
      检测
    </el-button>
    <el-button class="bottom-submit-btn" type="success" size="small" @click="saveDiary">
      保存
    </el-button>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Hotpot from '@/components/Hotpot'
import { saveDiaryData, detectDiaryData, getDiaryData } from '@/api/diary'
export default {
  name: 'TinymceDemo',
  components: { Tinymce, Hotpot },
  data() {
    var currentDate = new Date()
    var month = currentDate.getMonth() < 9 ? '0' + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1
    var day = currentDate.getDate() <= 9 ? '0' + currentDate.getDate() : currentDate.getDate()
    return {
      pickerDate: currentDate.getFullYear() + '-' + month + '-' + day,
      list: {
        content:
      `<h3>时间流水记录</h3>
      <table style="border-collapse: collapse; width: 100%;" border="1"> <tbody> <tr> <td style="width: 100%;">&nbsp;</td> </tr> </tbody> </table>`,
        year: currentDate.getFullYear(),
        month: month,
        day: day
      },
      time_total_show: false,
      time_total_table: [{
        exercise_time: 0,
        read_time: 0,
        study_time: 0,
        work_time: 0,
        plan_time: 0,
        recreation_time: 0,
        daily_time: 0
      }],
      hotpot_data: undefined,
      hotpot_show: false
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      var query = {
        'year': this.list.year,
        'month': this.list.month,
        'day': this.list.day
      }
      getDiaryData(query).then((rsp) => {
        console.log(rsp)
        if (rsp.count === 0) {
          this.$message({
            message: query['year'] + '-' + query['month'] + '-' + query['day'] + ' 暂无日记',
            type: 'info',
            duration: '2000'
          })
          this.list.content = `<h3>时间流水记录</h3>
            <table style="border-collapse: collapse; width: 100%;" border="1"> <tbody> <tr> <td style="width: 100%;">&nbsp;</td> </tr> </tbody> </table>`
          this.hotpot_show = false
          this.time_total_show = false
          this.resetTimeTotalTable()
          this.$nextTick(() => {
            window.tinymce.get('tinymceId').setContent(this.list.content)
          })
        } else if (rsp.count === 1) {
          this.$message({
            message: '已加载 ' + query['year'] + '-' + query['month'] + '-' + query['day'] + ' 日记',
            type: 'success',
            duration: '2000'
          })
          if (rsp['results']) {
            var need_message_hint = false
            this.detectDiary(need_message_hint)
            this.list.content = rsp['results'][0].content
            this.$nextTick(() => {
              window.tinymce.get('tinymceId').setContent(this.list.content)
            })
          }
        } else {
          this.$message({
            message: '加载失败，日记条数异常',
            type: 'error',
            duration: '2000'
          })
        }
      })
    },
    calcPickerDateParam() {
      var str_list = this.pickerDate.split('-')
      this.list.year = str_list[0]
      this.list.month = str_list[1]
      this.list.day = str_list[2]
      this.fetchData()
    },
    saveDiary() {
      saveDiaryData(this.list).then((rsp) => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    detectDiary(need_message_hint) {
      this.hotpot_show = false
      detectDiaryData(this.list).then((rsp) => {
        console.log(rsp)
        if (need_message_hint) {
          this.$notify({
            title: '成功',
            message: '检测成功',
            type: 'success',
            duration: 2000
          })
        }
        if (rsp.data['健身']) {
          this.time_total_table[0].exercise_time = rsp.data['健身']
        }
        if (rsp.data['阅读']) {
          this.time_total_table[0].read_time = rsp.data['阅读']
        }
        if (rsp.data['学习']) {
          this.time_total_table[0].study_time = rsp.data['学习']
        }
        if (rsp.data['工作']) {
          this.time_total_table[0].work_time = rsp.data['工作']
        }
        if (rsp.data['规划']) {
          this.time_total_table[0].plan_time = rsp.data['规划']
        }
        if (rsp.data['娱乐']) {
          this.time_total_table[0].recreation_time = rsp.data['娱乐']
        }
        if (rsp.data['日常']) {
          this.time_total_table[0].daily_time = rsp.data['日常']
        }
        if (rsp.data['hotpot']) {
          this.hotpot_data = rsp.data['hotpot']
        }
        this.time_total_show = true
        this.hotpot_show = true
      }).catch((err) => {
        this.$notify({
          title: '失败',
          message: err.response.data.basic.msg,
          type: 'error',
          duration: 2000
        })
      })
    },
    resetTimeTotalTable() {
      this.time_total_table = [{
        exercise_time: 0,
        read_time: 0,
        study_time: 0,
        work_time: 0,
        plan_time: 0,
        recreation_time: 0,
        daily_time: 0
      }]
    },
    numFilter(value) {
      const realVal = parseFloat(value).toFixed(2)
      return realVal
    }
  }
}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
.bottom-submit-btn {
  margin-top: 15px;
  margin-right: 10px;
}
.table-container {
  margin-top: 15px;
}
</style>
