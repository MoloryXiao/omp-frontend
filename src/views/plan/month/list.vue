<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-date-picker v-model="listQuery.year" type="year" placeholder="选择年"></el-date-picker> -->
      {{ listQuery.month }}月-月计划视图：<br><br>
      <el-date-picker v-model="datePickerTime" :clearable="false" :editable="false" type="month" placeholder="选择日期" format="yyyy-MM" value-format="yyyy-MM" style="width:140px; margin-right: 12px;" @change="updateModelYearMonth('ListQuery')" />
      <el-select v-model="listQuery.task_type" placeholder="任务类型" clearable style="width: 130px; margin-right: 12px;" class="filter-item">
        <el-option v-for="item in taskTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-input v-model="listQuery.task_name" placeholder="任务名称" clearable style="width: 200px; margin-right: 12px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>
    <br>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" min-width="65">
        <template slot-scope="scope">
          {{ (listQuery.page-1)*listQuery.limit+(scope.$index+1) }}
        </template>
      </el-table-column>
      <el-table-column label="任务项" min-width="150" align="left" header-align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.task_type | taskTypeFilter" size="mini" effect="plain">{{ taskTypeNameList[scope.row.task_type] }}</el-tag>
          <el-tooltip effect="dark" placement="top-end">
            <div slot="content" style="white-space: pre-wrap;">{{ scope.row.prize }}</div>
            <span>&nbsp;&nbsp;{{ scope.row.task_name }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="当前/目标" min-width="70" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.completed_times }}/{{ scope.row.target_times }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前进度" min-width="230" align="left" header-align="center">
        <template slot-scope="scope">
          <el-progress
            :percentage="Math.floor(scope.row.completed_times/scope.row.target_times*100)"
            :status="progressStatus(scope.row.completed_times/scope.row.target_times*100, scope.row.status)"
            :color="progressColors"
          />
        </template>
      </el-table-column>
      <el-table-column label="查看详情" min-width="60" align="center">
        <template slot-scope="scope">
          <router-link :to="'/objectManage/month-list/detail/'+scope.row.id">
            <el-link type="primary" size="mini">查看</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" min-width="50" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ statusNameList[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="110" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.status==1" size="mini" icon="el-icon-plus" circle @click="increaseTimes(row.id)" />
          <el-button v-if="row.status==1" size="mini" icon="el-icon-minus" circle @click="decreaseTimes(row.id)" />
          <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="handleUpdate(row)" />
          <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete" circle @click="deleConfirm(row)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes="[5,10,15,20,30,50]" style="float:right;" @pagination="fetchData" />

    <!-- 新增/修改 弹窗 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style="padding-bottom: 30px;">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="105px" style="width: 430px; margin-left:50px;">
        <el-form-item label="月份:" prop="month">
          <el-date-picker v-model="dialogMonthPicker" :clearable="false" type="month" placeholder="选择日期" format="yyyy-MM" value-format="yyyy-MM" style="width:140px;" @change="updateModelYearMonth('Dialog')" />
        </el-form-item>
        <el-form-item label="任务名称:" prop="task_name">
          <el-input v-model="temp.task_name" placeholder="任务项名称" />
        </el-form-item>
        <el-form-item label="任务类型:" prop="task_type">
          <el-select v-model="temp.task_type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in taskTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标次数:" prop="target_times">
          <el-input v-model="temp.target_times" placeholder="目标完成次数" />
        </el-form-item>
        <el-form-item label="当前次数:" prop="completed_times">
          <el-input v-model="temp.completed_times" placeholder="当前已完成次数" />
        </el-form-item>
        <el-form-item label="奖励机制:" prop="reward_mechanism">
          <el-select v-model="temp.reward_mechanism" class="filter-item" placeholder="请选择" @change="chooseRewardMechanism()">
            <el-option v-for="item in rewardMechanismOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in temp.multi_stages"
          v-show="temp.reward_mechanism === 2"
          :key="domain.key"
          :label="'阶段 ' + (index+1) + '('+(domain.complete_num/temp.target_times*100).toFixed(0)+'%):'"
          :prop="'multi_stages.' + index + '.complete_num'"
        >
          <el-input v-model="domain.complete_num" :placeholder="'阶段次数'" style="width: 90px;" />
          <el-select v-model="domain.reward_type" class="filter-item" placeholder="奖项" style="width: 78px; margin:0px 12px;">
            <el-option v-for="item in rewardTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
          x
          <el-input v-model="domain.reward_num" placeholder="个数" style="width: 65px; margin: 0px 12px;" />
          <el-button v-if="index != 0" size="mini" icon="el-icon-minus" circle @click.prevent="removeDomain(domain)" />
          <el-button v-if="index === 0" size="mini" icon="el-icon-plus" circle @click="addDomain" />
        </el-form-item>
        <el-form-item v-show="temp.reward_mechanism === 1" label="奖品选择:" prop="reward_one">
          <el-select v-model="temp.reward_one" class="filter-item" placeholder="请选择">
            <el-option v-for="item in rewardTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态:" prop="task_type">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择">
            <el-option v-for="item in statusTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMonthPlanList, increaseTimes, decreaseTimes, createMonthPlan, updateMonthPlan, deleteMonthPlan } from '@/api/plan'
import Pagination from '@/components/Pagination'

const taskTypeOptions = [
  { key: 1, display_name: '学习' },
  { key: 2, display_name: '工作' },
  { key: 3, display_name: '生活' },
  { key: 4, display_name: '规划' }
]

const statusTypeOptions = [
  { key: 1, display_name: '1-开启' },
  { key: 0, display_name: '0-停止' }
]

const rewardMechanismOptions = [
  { key: 1, display_name: '一次性' },
  { key: 2, display_name: '阶段性' }
]

const rewardTypeOptions = [
  { key: 0, display_name: '无' },
  { key: 1, display_name: 'SP' },
  { key: 2, display_name: 'MP' },
  { key: 3, display_name: 'BP' },
  { key: 4, display_name: 'LP' }
]

const rewardTypeArr = ['无', 'SP', 'MP', 'BP', 'LP']

const taskTypeNameList = ['none', '学习', '工作', '生活', '规划']
const statusNameList = ['停止', '开启']

export default {
  components: { Pagination },
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
    const date = new Date()
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 15,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        task_type: undefined,
        task_name: undefined
      },
      datePickerTime: date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString(),
      dialogMonthPicker: date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString(),
      progressColors: [
        { color: '#909399', percentage: 20 }, // <20 灰色
        { color: '#e6a23c', percentage: 60 }, // <60 黄色
        { color: '#1989fa', percentage: 95 }, // <95 蓝色
        { color: '#5cb87a', percentage: 100 } // <100 绿色
      ],
      taskTypeNameList,
      statusNameList,
      taskTypeOptions,
      statusTypeOptions,
      rewardMechanismOptions,
      rewardTypeOptions,
      temp: {
        id: undefined,
        year: '',
        month: '',
        task_name: '',
        task_type: '',
        target_times: '',
        completed_times: '',
        reward_mechanism: 1,
        multi_stages: [{
          complete_num: '',
          reward_type: '',
          reward_num: ''
        }],
        todo_list: {},
        reward_one: 0,
        status: 0
      },
      dialogFormVisible: false,
      deleConfDialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑月目标',
        create: '创建月目标'
      },
      rules: {
        month: [{ required: true, message: '月份必填', trigger: 'change' }],
        task_name: [{ required: true, message: '任务名称必填', trigger: 'blur' }],
        task_type: [{ required: true, message: '任务类型必填', trigger: 'change' }],
        target_times: [
          { required: true, message: '目标次数必填', trigger: 'blur' },
          {
            validator: function(rule, value, callback) {
              if (/^[0-9]*$/.test(value) === false) {
                callback(new Error('请输入正确的数字'))
              } else {
                callback()
              }
            }, trigger: 'blur'
          }
        ],
        completed_times: [
          { required: true, message: '已完成次数必填', trigger: 'blur' },
          {
            validator: function(rule, value, callback) {
              if (/^[0-9]*$/.test(value) === false) {
                callback(new Error('请输入正确的数字'))
              } else {
                callback()
              }
            }, trigger: 'blur'
          }
        ],
        reward_mechanism: [{ required: true, message: '奖励机制必填', trigger: 'blur' }],
        reward_one: [{ required: true, message: '奖品必填', trigger: 'blur' }],
        status: [{ required: true, message: '状态必填', trigger: 'change' }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getMonthPlanList(this.listQuery).then(response => {
        this.list = response.results
        this.total = response.count
        for (var i = 0; i < response.results.length; i++) {
          this.list[i]['prize'] = '奖品列表：\n'
          if (this.list[i].multi_stages) {
            this.list[i].multi_stages = JSON.parse(this.list[i].multi_stages)
            console.log(this.list[i].multi_stages)
            console.log(this.list[i].multi_stages[0])
            console.log(this.list[i].multi_stages[0]["reward_num"])
            // console.log(int(this.list[i].multi_stages[0]["reward_num"]))
            for (var j = 0; j < this.list[i].multi_stages.length; j++) {
              let complete_num = this.list[i].multi_stages[j]['complete_num']
              let reward_num = this.list[i].multi_stages[j]['reward_num']
              let reward_type = this.list[i].multi_stages[j]['reward_type']
              let reward_str = ''
              // 如果奖品类型为无，则不显示奖品个数后缀
              if (reward_type === 0) {
                reward_str = rewardTypeArr[reward_type]
              } else {
                reward_str = rewardTypeArr[reward_type] + ' x ' + reward_num + '个'
              }
              this.list[i]['prize'] += complete_num + '次 ' + reward_str + '\n'
            }
          } else {
            this.list[i].multi_stages = [{
              key: Date.now(),
              complete_num: '',
              reward_type: '',
              reward_num: ''
            }]
          }
          if (this.list[i].todo_list) {
            this.list[i].todo_list = JSON.parse(this.list[i].todo_list)
            this.list[i].reward_one = this.list[i].todo_list['reward_select']
            this.list[i]['prize'] += rewardTypeArr[this.list[i].todo_list['reward_select']] + ' x 1'
          }
        }
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    progressStatus(value, status) {
      if (status === 0) {
        return 'exception'
      }
      if (value === 100) {
        return 'success'
      }
    },
    resetTemp() {
      const date = new Date()
      this.temp = {
        id: undefined,
        year: date.getFullYear().toString(),
        month: (date.getMonth() + 1).toString(),
        task_name: '',
        task_type: '',
        target_times: '',
        completed_times: '',
        reward_mechanism: 1,
        multi_stages: [{
          key: Date.now(),
          complete_num: '',
          reward_type: '',
          reward_num: 1
        }],
        todo_list: {},
        reward_one: 0,
        status: 1
      }
      this.dialogMonthPicker = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var tempData = Object.assign({}, this.temp)
          if (tempData.reward_mechanism === 1) {
            tempData.multi_stages = ''
            tempData.todo_list = {
              'reward_select': tempData.reward_one,
              'todo_list_detail': []
            }
            tempData.todo_list = JSON.stringify(tempData.todo_list)
          } else {
            tempData.todo_list = ''
            tempData.multi_stages = JSON.stringify(tempData.multi_stages)
          }
          console.log(tempData.todo_list)
          console.log(tempData)
          createMonthPlan(tempData).then(() => {
            // this.list.push(this.temp)
            this.dialogFormVisible = false
            this.fetchData()
            this.$notify({
              title: '成功',
              message: '配置新建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      if (this.temp.reward_mechanism === 1) {
        if (this.temp.todo_list) {
          this.temp.reward_one = this.temp.todo_list['reward_select']
        } else {
          this.temp.todo_list = {
            'reward_select': '',
            'todo_list_detail': []
          }
        }
      } else {
        this.temp.todo_list = ''
      }
      this.dialogMonthPicker = row.year + '-' + row.month
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          if (tempData.reward_mechanism === 1) {
            tempData.multi_stages = ''
            if (!tempData.todo_list) {
              tempData.todo_list = {
                'reward_select': tempData.reward_one,
                'todo_list_detail': []
              }
            } else {
              tempData.todo_list['reward_select'] = tempData.reward_one
            }
            tempData.todo_list = JSON.stringify(tempData.todo_list)
          } else {
            tempData.multi_stages = JSON.stringify(tempData.multi_stages)
            tempData.todo_list = ''
          }
          updateMonthPlan(tempData.id, tempData).then(() => {
            // const index = this.list.findIndex(v => v.id === this.temp.id)
            // this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.fetchData()
            this.$notify({
              title: '成功',
              message: '配置修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    deleConfirm(row) {
      const confirm_msg = '此操作将永久删除该任务, 是否继续?'
      this.$confirm(confirm_msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMonthPlan(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.listQuery.page = 1
          this.fetchData()
        }).catch((err) => {
          console.log(err)
          this.$notify({
            title: '失败',
            message: 'unknown error.',
            type: 'error',
            duration: 2000
          })
        })
      })
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
        this.fetchData()
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
        // const index = this.list.findIndex(v => v.id === this.temp.id)
        // this.list.splice(index, 1, this.temp)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '当前次数已减1',
          type: 'success',
          duration: 2000
        })
        this.fetchData()
      }).catch((err) => {
        this.$notify({
          title: '失败',
          message: err.response.data.basic.msg,
          type: 'error',
          duration: 2000
        })
      })
    },
    addDomain() {
      this.temp.multi_stages.push({
        complete_num: '',
        reward_type: '',
        reward_num: 1,
        key: Date.now()
      })
    },
    removeDomain(item) {
      var index = this.temp.multi_stages.indexOf(item)
      if (index !== -1) {
        this.temp.multi_stages.splice(index, 1)
      }
    },
    chooseRewardMechanism() {
      if (!this.temp.target_times) {
        this.temp.reward_mechanism = 1
        this.$message.error('请先填写任务的<目标次数>！')
      } else {
        this.rules.reward_one = []
      }
    },
    updateModelYearMonth(location) {
      if (location === 'ListQuery') {
        this.listQuery.year = this.datePickerTime.substring(0, 4)
        this.listQuery.month = this.datePickerTime.substring(5)
        this.fetchData()
      } else if (location === 'Dialog') {
        this.temp.year = this.dialogMonthPicker.substring(0, 4)
        this.temp.month = this.dialogMonthPicker.substring(5)
      }
    }
  }
}
</script>
