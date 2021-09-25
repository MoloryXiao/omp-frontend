<template>
  <div class="components-container">
    <el-date-picker
      v-model="pickerDate"
      type="date"
      value-format="yyyy-MM-dd"
      placeholder="选择日期"
      style="width:160px;"
      :change="calcPickerDateParam()"
    />
    <div class="editor-content">
      <tinymce v-model="list.content" :height="400" />
    </div>
    <!-- <div class="editor-content" v-html="list.content" /> -->
    <el-table
      class="table-container"
      :data="time_total_table"
      border
      style="width: 100%"
    >
      <el-table-column prop="exercise_time" label="今日健身时长" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.exercise_time === 0 ? '0min' : scope.row.exercise_time + 'mins' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="read_time" label="今日阅读时长" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.read_time === 0 ? '0min' : scope.row.read_time + 'mins' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="study_time" label="今日学习时长" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.study_time === 0 ? '0min' : scope.row.study_time + 'mins' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="work_time" label="今日工作时长" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.work_time === 0 ? '0min' : scope.row.work_time + 'mins' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="plan_time" label="总结回顾时长" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.plan_time === 0 ? '0min' : scope.row.plan_time + 'mins' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="none_time" label="无" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.none_time === 0 ? '0min' : scope.row.none_time + 'mins' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="else_time" label="未知分类" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.else_time === 0 ? '0min' : scope.row.else_time + 'mins' }}</span>
        </template>
      </el-table-column>
    </el-table>
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
    <el-button class="bottom-submit-btn" type="primary" size="small" @click="detect">
      检测
    </el-button>
    <el-button class="bottom-submit-btn" type="success" size="small" @click="detect">
      提交
    </el-button>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { detectDiaryData } from '@/api/diary'
export default {
  name: 'TinymceDemo',
  components: { Tinymce },
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
        none_time: 0,
        else_time: 0
      }]
    }
  },
  methods: {
    calcPickerDateParam() {
      var str_list = this.pickerDate.split('-')
      this.list.year = str_list[0]
      this.list.month = str_list[1]
      this.list.day = str_list[2]
    },
    detect() {
      detectDiaryData(this.list).then((rsp) => {
        console.log(rsp)
        this.$notify({
          title: '成功',
          message: '检测成功',
          type: 'success',
          duration: 2000
        })
        this.time_total_table[0].exercise_time = rsp.data['健身']
        this.time_total_table[0].read_time = rsp.data['阅读']
        this.time_total_table[0].study_time = rsp.data['学习']
        this.time_total_table[0].work_time = rsp.data['工作']
        this.time_total_table[0].plan_time = rsp.data['规划']
        this.time_total_table[0].none_time = rsp.data['无']
        this.time_total_table[0].else_time = rsp.data['未知分类']
        this.time_total_show = true
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
