<template>
  <div class="app-container">
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
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" min-width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" class-name="status-col" min-width="80" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.user_type | userTypeFilter">{{ scope.row.introduction }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="220" class-name="small-padding fixed-width">
        <!-- <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='2'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template> -->
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getInfo } from '@/api/user'

export default {
  filters: {
    userTypeFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'gray'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getInfo().then(response => {
        this.list = response.results
        this.total = response.count
        this.listLoading = false
      })
    }
  }
}
</script>
