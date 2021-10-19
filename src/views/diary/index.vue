<template>
  <div class="components-container">
    <h4>日期(Date)</h4>
    <el-date-picker
      v-model="pickerDate"
      type="date"
      value-format="yyyy-MM-dd"
      placeholder="选择日期"
      style="width:160px;"
      :clearable="false"
      :editable="false"
      :picker-options="{ firstDayOfWeek: 1 }"
      @change="calcPickerDateParam()"
    />
    <el-row>
      <el-col :span="11">
        <h4>月计划(Month Plan)</h4>
        <el-table
          v-loading="monthListLoading"
          :data="monthListContent"
          element-loading-text="Loading"
          size="mini"
        >
          <el-table-column label="任务项" min-width="250" align="left" header-align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.task_type | taskTypeFilter" size="mini" effect="plain">{{ taskTypeNameList[scope.row.task_type] }}</el-tag>
              <span>&nbsp;&nbsp;{{ scope.row.task_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="当前/目标次数" min-width="120" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.completed_times }}次/{{ scope.row.target_times }}次</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="110" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button v-if="row.status==1" size="mini" icon="el-icon-plus" circle @click="increaseTimes(row.id)" />
              <el-button v-if="row.status==1" size="mini" icon="el-icon-minus" circle @click="decreaseTimes(row.id)" />
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12" :offset="1">
        <h4>周计划(Week Plan)</h4>
        <el-table
          v-loading="weekListLoading"
          :data="weekListContent"
          element-loading-text="Loading"
          size="mini"
        >
          <el-table-column label="任务项" min-width="240" align="left" header-align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.task_type | taskTypeFilter" size="mini" effect="plain">{{ taskTypeNameList[scope.row.task_type] }}</el-tag>
              <span>&nbsp;&nbsp;{{ scope.row.task_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="预计开始/结束" min-width="160" align="center" header-align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.start_date }} - {{ scope.row.end_date }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="状态" min-width="100" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | statusFilter" size="mini">{{ statusNameList[scope.row.status] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="60" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button v-if="row.status==0" type="success" size="mini" icon="el-icon-s-flag" circle @click="statusInversion(row.id)" />
              <el-button v-if="row.status==1" size="mini" icon="el-icon-refresh-left" circle @click="statusInversion(row.id)" />
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <h4>日记录(Daily Recording)</h4>
    <div class="editor-content">
      <tinymce id="tinymceId" v-model="list.content" :height="400" />
    </div>
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
import { getMonthPlanList, increaseTimes, decreaseTimes, getWeekPlanList, weekPlanStatusInversion } from '@/api/plan'
import { getWeekStartAndEndDate } from '@/utils'

const taskTypeNameList = ['none', '学习', '工作', '生活', '规划']
const statusNameList = ['未完成', '已完成']

export default {
  name: 'TinymceDemo',
  components: { Tinymce, Hotpot },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'danger',
        1: 'draft'
      }
      return statusMap[status]
    },
    taskTypeFilter(status) {
      const statusMap = {
        1: 'success', // 学习
        2: 'draft', // 工作
        3: 'warning', // 生活
        4: 'danger' // 规划
      }
      return statusMap[status]
    }
  },
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
      monthListContent: null,
      monthListLoading: true,
      weekListContent: null,
      weekListLoading: true,
      statusNameList,
      taskTypeNameList,
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
    refreshMonthListData() {
      var monthListQuery = {
        page: 1,
        limit: 1000,
        year: this.list.year,
        month: this.list.month
      }
      this.monthListLoading = true
      getMonthPlanList(monthListQuery).then(response => {
        this.monthListContent = response.results
        this.monthListLoading = false
      })
    },
    refreshWeekListData() {
      const dt = this.list.year + '-' + this.list.month + '-' + this.list.day
      const [start_d, end_d] = getWeekStartAndEndDate(dt)
      var weekListQuery = {
        page: 1,
        limit: 1000,
        start_date: start_d,
        end_date: end_d
      }
      this.weekListLoading = true
      getWeekPlanList(weekListQuery).then(response => {
        this.weekListContent = response.results
        this.weekListLoading = false
      })
    },
    refreshDiaryData() {
      var query = {
        'year': this.list.year,
        'month': this.list.month,
        'day': this.list.day
      }
      getDiaryData(query).then((rsp) => {
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
    fetchData() {
      // 获取月计划
      this.refreshMonthListData()
      // 获取周计划
      this.refreshWeekListData()
      // 获取日记
      this.refreshDiaryData()
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
    },
    increaseTimes(index) {
      increaseTimes(index).then(() => {
        // const index = this.list.findIndex(v => v.id === this.temp.id)
        // this.list.splice(index, 1, this.temp)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '当前次数已加1',
          type: 'success',
          duration: 2000
        })
        this.refreshMonthListData()
      }).catch((err) => {
        this.$notify({
          title: '失败',
          message: err.response.data.basic.msg,
          type: 'error',
          duration: 2000
        })
      })
    },
    decreaseTimes(index) {
      decreaseTimes(index).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '当前次数已减1',
          type: 'success',
          duration: 2000
        })
        this.refreshMonthListData()
      }).catch((err) => {
        this.$notify({
          title: '失败',
          message: err.response.data.basic.msg,
          type: 'error',
          duration: 2000
        })
      })
    },
    statusInversion(index) {
      weekPlanStatusInversion(index).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '周计划事项状态更改成功',
          type: 'success',
          duration: 2000
        })
        this.refreshWeekListData()
      }).catch((err) => {
        this.$notify({
          title: '失败',
          message: err.response.data.basic.msg,
          type: 'error',
          duration: 2000
        })
      })
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
