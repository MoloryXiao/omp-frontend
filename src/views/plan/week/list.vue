<template>
  <div class="app-container">
    <div class="filter-container">
      周计划视图：<br><br>
      <el-date-picker
        v-model="weekPickerTime"
        type="week"
        placeholder="请选择"
        format="yyyy 第 WW 周"
        style="width:180px; margin-right: 12px;"
        value-format="yyyy-MM-dd"
        :clearable="false"
        :picker-options="{ firstDayOfWeek: 1 }"
        @change="updateQuerySEdate()"
      />
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
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          {{ (listQuery.page-1)*listQuery.limit+(scope.$index+1) }}
        </template>
      </el-table-column>
      <el-table-column label="任务项" min-width="400" align="left" header-align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.task_type | taskTypeFilter" size="mini" effect="plain">{{ taskTypeNameList[scope.row.task_type] }}</el-tag>
          <span>&nbsp;&nbsp;{{ scope.row.task_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计开始时间" width="150" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.start_date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计结束时间" width="150" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.end_date }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ statusNameList[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="140" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="handleUpdate(row)" />
          <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete" circle @click="deleConfirm(row)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes="[5,10,15,20,30,50]" style="float:right;" @pagination="fetchData" />

    <!-- 新增/修改 弹窗 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style="padding-bottom: 30px;">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="95px" style="width: 400px; margin-left:50px;">
        <el-form-item label="任务名称:" prop="task_name">
          <el-input v-model="temp.task_name" placeholder="任务项名称" />
        </el-form-item>
        <el-form-item label="任务类型:" prop="task_type">
          <el-select v-model="temp.task_type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in taskTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间:" prop="start_date">
          <el-date-picker
            v-model="temp.start_date"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="{ firstDayOfWeek: 1 }"
          />
        </el-form-item>
        <el-form-item label="结束时间:" prop="end_date">
          <el-date-picker
            v-model="temp.end_date"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="{ firstDayOfWeek: 1 }"
          />
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
import { getWeekPlanList, createWeekPlan, updateWeekPlan, deleteWeekPlan } from '@/api/plan'
import Pagination from '@/components/Pagination'

const taskTypeOptions = [
  { key: 1, display_name: '学习' },
  { key: 2, display_name: '工作' },
  { key: 3, display_name: '生活' },
  { key: 4, display_name: '规划' }
]

const statusTypeOptions = [
  { key: 0, display_name: '0-未完成' },
  { key: 1, display_name: '1-已完成' }
]

const taskTypeNameList = ['none', '学习', '工作', '生活', '规划']
const statusNameList = ['未完成', '已完成']

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'draft',
        1: 'success'
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
        start_date: '',
        end_date: '',
        task_type: undefined,
        task_name: undefined
      },
      weekPickerTime: date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + (date.getDate()).toString(),
      taskTypeNameList,
      statusNameList,
      taskTypeOptions,
      statusTypeOptions,
      temp: {
        id: undefined,
        task_name: '',
        task_type: 1,
        start_date: '',
        end_date: '',
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
        start_date: [{ required: true, message: '预计开始时间必填', trigger: 'change' }],
        end_date: [{ required: true, message: '预计结束时间必填', trigger: 'change' }],
        status: [{ required: true, message: '状态必填', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.updateQuerySEdate()
  },
  methods: {
    getWeekStartAndEndDate(dt) {
      const d1 = new Date(dt)
      // 将星期天从0转为7
      const d1_week = d1.getDay() === 0 ? 7 : d1.getDay()
      // 获取该周周一的日期
      const d2 = new Date(d1.getTime() - (d1_week - 1) * 24 * 3600 * 1000)
      // 获取该周周天的日期
      const d3 = new Date(d1.getTime() + (7 - d1_week) * 24 * 3600 * 1000)
      return [this.formatDate(d2), this.formatDate(d3)]
    },
    formatDate(dt) {
      const year = dt.getFullYear()
      const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1
      const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()
      return year + '-' + month + '-' + day
    },
    updateQuerySEdate() {
      const [start_d, end_d] = this.getWeekStartAndEndDate(this.weekPickerTime)
      this.listQuery.start_date = start_d
      this.listQuery.end_date = end_d
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      getWeekPlanList(this.listQuery).then(response => {
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
      this.dialogWeekPicker = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + (date.getDate()).toString()
      this.temp = {
        id: undefined,
        year: '',
        month: '',
        week: '',
        task_name: '',
        task_type: 1,
        target_times: '',
        completed_times: '',
        status: 0
      }
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
          createWeekPlan(this.temp).then(() => {
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
          updateWeekPlan(tempData.id, tempData).then(() => {
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
        deleteWeekPlan(row.id).then(() => {
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
    }
  }
}
</script>
