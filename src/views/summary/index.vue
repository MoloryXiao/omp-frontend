<template>
  <div class="app-container-gray">
    <el-date-picker
      v-model="monthDatePicker"
      :clearable="false"
      :editable="false"
      type="month"
      placeholder="选择日期"
      format="yyyy 年 MM 月"
      value-format="yyyy-MM"
      style="width:150px; margin-bottom: 20px;"
      @change="updateModelYearMonth()"
    />
    <el-card id="monthReview">
      <div slot="header" class="clearfix">
        <span><strong>{{this.queryLimit['month']}}月总结回顾</strong></span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
        <el-button
          v-show="isEditMonth"
          class="el-card-btn"
          type="text"
          @click="cancelEdit('month')"
        >
          取消
        </el-button>
        <el-button
          v-show="isEditMonth"
          class="el-card-btn"
          type="text"
          @click="confirmEdit('month')"
        >
          保存
        </el-button>
        <el-button
          v-show="!isEditMonth"
          class="el-card-btn"
          type="text"
          @click="startEdit('month')"
        >
          编辑
        </el-button>
      </div>
      <div>
        <div v-show="isEditMonth">
          <tinymce id="monthTinymce" v-model="monthTextareaEdit" class="month-tiny-margin" :height="400" />
        </div>
        <div v-show="!isEditMonth" class="month-review-textArea" v-html="monthTextarea" />
      </div>
    </el-card>

    <el-card id="weekReview">
      <div slot="header" class="clearfix">
        <span><strong>{{this.queryLimit['month']}}月各周总结回顾</strong></span>
        <el-button
          v-show="isEditWeek"
          class="el-card-btn"
          type="text"
          @click="cancelEdit('week')"
        >
          取消
        </el-button>
        <el-button
          v-show="isEditWeek"
          class="el-card-btn"
          type="text"
          @click="confirmEdit('week')"
        >
          保存
        </el-button>
        <el-button
          v-show="!isEditWeek"
          class="el-card-btn"
          type="text"
          @click="startEdit('week')"
        >
          编辑
        </el-button>
      </div>
      <el-tabs id="weekReviewTabs" v-model="editableTabsValue" type="card" editable :before-leave="leaveTab" @edit="handleTabsEdit">
        <el-tab-pane
          v-for="(item) in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
          <div v-show="!item.isEdit" class="month-review-textArea" v-html="item.content" />
          <div v-if="item.isEdit">
            <tinymce id="weekTinymce" v-model="item.content" class="week-tiny-margin" :height="400" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getSummaryReview, saveSummaryData } from '@/api/summary'

const monthInitReview = '一、列举完成的目标，以及对应的奖品<br/><br/>' +
  '二、分析未完成目标原因<br/><br/>' +
  '三、本月的个人成长有多少(有什么获得/有什么心得/有什么进步)，工作情况怎么样(需求跟进个数/工作亮点/是否有线上问题/是否可以提效空间/上半年绩效)<br/><br/>' +
  '四、本月有哪些教训或者意见给到下月<br/><br/>' +
  '五、本月各项指标总时长(锻炼/阅读/学习/工作/规划)<br/>有效统计数据条数：<br/>锻炼：<br/>阅读：<br/>学习：<br/>工作：<br/>规划：<br/><br/>'

const weekInitReview = '<strong>本周完成事项（思考提效点）：</strong><br/>' +
'【工作】<br/>' +
'「需求测试」<br/>' +
'1、<br/><br/>' +
'「协助外部」<br/>' +
'1、<br/><br/>' +
'「现网问题」<br/>' +
'无<br/><br/>' +
'「会议参加」<br/>' +
'1、<br/><br/>' +
'「其他」<br/>' +
'1、<br/><br/>' +
'【学习】<br/>' +
'1、<br/><br/>' +
'【生活】<br/>' +
'1、<br/><br/>'

export default {
  components: { Tinymce },
  data() {
    const date = new Date()
    return {
      editableTabsValue: 'Week 1',
      editableTabs: [{
        title: '第 1 周',
        name: 'Week 1',
        content: weekInitReview,
        isEdit: false
      }],
      isEditMonth: false,
      isEditWeek: false,
      monthTextarea: monthInitReview,
      monthTextareaEdit: '',
      monthDatePicker: date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString(),
      queryLimit: {
        page: 1,
        limit: 1,
        year: date.getFullYear(),
        month: date.getMonth() + 1
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    resetPageContent() {
      this.monthTextarea = monthInitReview
      this.editableTabs = [{
        title: '第 1 周',
        name: 'Week 1',
        content: weekInitReview,
        isEdit: false
      }]
      this.editableTabsValue = 'Week 1'
      this.isEditMonth = false
      this.isEditWeek = false
    },
    fetchData() {
      getSummaryReview(this.queryLimit).then(response => {
        if (response.count != 0) {
          this.monthTextarea = response.results[0].month_review
          this.editableTabs = JSON.parse(response.results[0].weeks_review)
          this.editableTabsValue = 'Week 1'
          this.$message({
            message: this.queryLimit['year'] + '-' + this.queryLimit['month'] + ' 回顾记录加载成功',
            type: 'success',
            duration: '2000'
          })
        } else {
          this.resetPageContent()
          this.$message({
            message: this.queryLimit['year'] + '-' + this.queryLimit['month'] + ' 暂无生效的回顾记录',
            type: 'info',
            duration: '2000'
          })
        }
      })
    },
    updateModelYearMonth() {
      this.queryLimit.year = this.monthDatePicker.substring(0, 4)
      this.queryLimit.month = this.monthDatePicker.substring(5)
      this.fetchData()
    },
    leaveTab(activeName, oldActiveName) {
      let leaveFlag = true
      this.editableTabs.forEach((tab, index) => {
        if (tab.name === oldActiveName && tab.isEdit) {
          this.$message({
            type: 'error',
            message: '请先退出 ' + (oldActiveName) + ' 的编辑状态！'
          })
          leaveFlag = false
        }
      })
      return leaveFlag
    },
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        if (this.isEditWeek) {
          this.$message({
            type: 'error',
            message: '请先退出编辑状态！'
          })
          return
        }
        const newTabName = 'Week ' + (this.editableTabs.length + 1)
        this.editableTabs.push({
          title: '第 ' + (this.editableTabs.length + 1) + ' 周',
          name: newTabName,
          content: weekInitReview,
          isEdit: false
        })
        this.editableTabsValue = newTabName
      }
      if (action === 'remove') {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const tabs = this.editableTabs
          var activeName = this.editableTabsValue
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                const nextTab = tabs[index + 1] || tabs[index - 1]
                if (nextTab) {
                  activeName = nextTab.name
                }
              }
            })
          }
          this.editableTabsValue = activeName
          this.editableTabs = tabs.filter(tab => tab.name !== targetName)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }
    },
    cancelEdit(action) {
      if (action === 'month') {
        this.isEditMonth = false
        // TODO: 取消没有恢复原数据，待修复
        this.monthTextareaEdit = this.monthTextarea
      } else {
        this.editableTabs.forEach((tab, index) => {
          if (tab.name === this.editableTabsValue) {
            tab.isEdit = false
            this.isEditWeek = false
          }
        })
      }
    },
    saveSummary() {
      const data = {
        'year': this.queryLimit.year,
        'month': this.queryLimit.month,
        'month_review': this.monthTextarea,
        'weeks_review': JSON.stringify(this.editableTabs)
      }
      saveSummaryData(data).then((rsp) => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    confirmEdit(action) {
      if (action === 'month') {
        this.isEditMonth = false
        this.monthTextarea = this.monthTextareaEdit
      } else {
        this.editableTabs.forEach((tab, index) => {
          if (tab.name === this.editableTabsValue) {
            tab.isEdit = false
            this.isEditWeek = false
          }
        })
      }
      this.saveSummary()
    },
    startEdit(action) {
      if (action === 'month') {
        this.isEditMonth = true
        this.monthTextareaEdit = Object.assign(this.monthTextarea)
        console.log(this.monthTextarea)
        console.log(this.monthTextareaEdit)
      } else {
        this.editableTabs.forEach((tab, index) => {
          if (tab.name === this.editableTabsValue) {
            tab.isEdit = true
            this.isEditWeek = true
          }
        })
        this.$nextTick(() => {
          document.getElementById('weekReviewTabs').scrollIntoView(true)
          console.log(this.editableTabs)
        })
      }
    }
  }
}
</script>

<style>
.month-review-textArea {
  white-space: pre-wrap;
  font-size: 14px;
  font-family: '宋体';
  line-height: 25px;
  padding: 0px 10px;
}
.divider-style {
  margin-top: -10px;
  margin-bottom: -18px;
}
#monthReview {
  min-height: 400px;
  margin-bottom: 30px;
}
#weekReview {
  min-height: 400px;
  padding: 0px 10px;
}
#weekReviewTabs {
  margin-bottom: 50px;
}
.month-tiny-margin {
  margin-top: 15px;
  margin-bottom: 40px;
  
}
.week-tiny-margin {
  margin-bottom: 50px;;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.el-card-btn {
  float: right;
  margin-right: 35px;
  padding: 3px 0;
}
</style>
