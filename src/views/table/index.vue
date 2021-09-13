<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-date-picker v-model="listQuery.year" type="year" placeholder="选择年"></el-date-picker> -->
      {{ listQuery.month }}月-月计划视图：<br><br>
      <el-date-picker v-model="datePickerTime" type="month" placeholder="选择日期" format="yyyy-MM" value-format="yyyy-MM" style="width:140px; margin-right: 12px;" :change="updateModelYearMonth('ListQuery')" />
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
          <span>&nbsp;&nbsp;{{ scope.row.task_name }}</span>
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
        <template>
          <el-link type="primary" size="mini">查看</el-link>
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

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes="[5,10,20,50,100]" style="float:right;" @pagination="fetchData" />

  </div>
</template>

<script>
import { getList, increaseTimes, decreaseTimes, createMonthPlan, updateMonthPlan, deleteMonthPlan } from '@/api/table'
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
        limit: 10,
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
      temp: {
        id: undefined,
        year: '',
        month: '',
        task_name: '',
        task_type: undefined,
        target_times: '',
        completed_times: '',
        status
      },
      dialogFormVisible: false,
      deleConfDialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑月目标',
        create: '创建月目标'
      },
      rules: {
        dialogMonthPicker: [{ required: true, message: '月份必填', trigger: 'change' }],
        task_name: [{ required: true, message: '任务名称必填', trigger: 'blur' }],
        task_type: [{ required: true, message: '任务类型必填', trigger: 'change' }],
        target_times: [{ required: true, message: '目标次数必填', trigger: 'blur' }],
        completed_times: [{ required: true, message: '已完成次数必填', trigger: 'blur' }],
        status: [{ required: true, message: '状态必填', trigger: 'change' }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    updateModelYearMonth(location) {
      if (location === 'ListQuery') {
        this.listQuery.year = this.datePickerTime.substring(0, 4)
        this.listQuery.month = this.datePickerTime.substring(5)
      } else if (location === 'Dialog') {
        this.temp.year = this.dialogMonthPicker.substring(0, 4)
        this.temp.month = this.dialogMonthPicker.substring(5)
      }
    },
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.results
        this.total = response.count
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
        year: '',
        month: '',
        task_name: '',
        task_type: undefined,
        target_times: '',
        completed_times: ''
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
          this.temp.status = 1
          createMonthPlan(this.temp).then(() => {
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
    }
  }
}
</script>
