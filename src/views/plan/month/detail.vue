<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-descriptions class="margin-top" title="月任务详情" :column="4" border>
          <!-- <template slot="extra">
            <el-button type="primary" size="small">编辑</el-button>
          </template> -->
          <el-descriptions-item :label-style="labelStyle" :content-style="contentStyle">
            <template slot="label">
              <i class="el-icon-user" />
              任务名
            </template>
            {{ header_info['task_name'] }}
          </el-descriptions-item>
          <el-descriptions-item :label-style="labelStyle" :content-style="contentStyle">
            <template slot="label">
              <i class="el-icon-mobile-phone" />
              类型
            </template>
            <el-tag size="small">{{ taskTypeNameList[header_info['task_type']] }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item :label-style="labelStyle" :content-style="contentStyle">
            <template slot="label">
              <i class="el-icon-location-outline" />
              当前次数
            </template>
            {{ header_info['completed_times'] }}
          </el-descriptions-item>
          <el-descriptions-item :label-style="labelStyle" :content-style="contentStyle">
            <template slot="label">
              <i class="el-icon-tickets" />
              目标次数
            </template>
            {{ header_info['target_times'] }}
          </el-descriptions-item>
          <el-descriptions-item
            v-for="(domain, index) in header_info['multi_stages']"
            :key="domain.key"
            :label-style="labelStyle"
            :content-style="contentStyle"
          >
            <template slot="label">
              <i class="el-icon-office-building" />
              阶段{{ index+1 }}({{ (domain.complete_num/header_info['target_times']).toFixed(2)*100 }}%)
            </template>
            {{ domain.complete_num }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <el-row style="margin-top: 25px;">
      <!-- TODO LIST MODE -->
      <el-col v-if="header_info['reward_mechanism'] == 1" :span="12">
        <todo-list :taskId="header_info['id']" />
      </el-col>
      <el-col v-if="header_info['reward_mechanism'] == 2 && showOperationLog" :span="12">
        <el-calendar>
          <template
            slot="dateCell"
            slot-scope="{date}"
          >
            <!-- slot-scope="{date, data}" -->
            <p :class="getDateFormat(date, 'yyyy/MM/dd') ? 'is-selected' :''">
              {{ date.getDate() }}
            </p>
          </template>
        </el-calendar>
      </el-col>
      <el-col v-if="showOperationLog" :span="10" :offset="1">
        <h4>操作日志</h4>
        <el-timeline>
          <el-timeline-item v-for="(record_list, key, index) in opLogsDict" :key="index" :timestamp="key" placement="top">
            <el-card v-for="(item, i) in record_list" :key="i" style="margin-top: 12px;">
              <h4>{{ item.operation_remark }}</h4>
              <p>{{ item.operator }} 于 {{ item.create_time }} 操作</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getMonthPlanDetail, getOperationLog } from '@/api/plan'
import { dateFormat } from '@/utils'
import TodoList from '@/components/TodoList'

const taskTypeNameList = ['none', '学习', '工作', '生活', '规划']

export default {
  components: {
    TodoList
  },
  data() {
    return {
      labelStyle: {
        'text-align': 'left',
        'width': '80px'
      },
      contentStyle: {
        'text-align': 'left',
        'width': '100px'
      },
      header_info: {},
      taskTypeNameList,
      opLogsListContent: [],
      opLogsDict: { },
      opLogsCount: 0,
      showOperationLog: false
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.fetchData(id)
  },
  methods: {
    fetchData(id) {
      getMonthPlanDetail(id).then(response => {
        this.header_info = response
        if (this.header_info.multi_stages) {
          this.header_info.multi_stages = JSON.parse(this.header_info.multi_stages)
        } else {
          this.header_info.multi_stages = ''
        }
        if (this.header_info.todo_list) {
          this.header_info.todo_list = JSON.parse(this.header_info.todo_list)
        }
      })
      var query = {
        'object_category': 1,
        'object_id': id
      }
      getOperationLog(query).then(response => {
        this.opLogsListContent = response.results
        this.opLogsCount = response.count
        if (this.opLogsCount !== 0) {
          this.showOperationLog = true
        }
        this.operationLogHandle()
      })
    },
    getDateFormat(d, format) {
      return Object.prototype.hasOwnProperty.call(this.opLogsDict, dateFormat(d, format))
    },
    operationLogHandle() {
      for (const item of this.opLogsListContent) {
        const nameArr = item.operator.split('@')
        item.operator = nameArr[0]
        const d = new Date(item.create_time)
        item.create_time = dateFormat(d, 'yyyy/MM/dd hh:mm')
        const item_date = dateFormat(d, 'yyyy/MM/dd')
        if (!Object.prototype.hasOwnProperty.call(this.opLogsDict, item_date)) {
          const arr = []
          arr.push(item)
          this.opLogsDict[item_date] = arr
        } else {
          this.opLogsDict[item_date].push(item)
        }
      }
    }
  }
}
</script>

<style scoped>
.is-selected {
  background-color: rgba(103, 194, 58, 0.9);
  color: white;
}
</style>
