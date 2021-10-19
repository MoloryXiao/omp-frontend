<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-descriptions class="margin-top" title="月任务详情" :column="4" border>
          <template slot="extra">
            <el-button type="primary" size="small">编辑</el-button>
          </template>
          <el-descriptions-item :label-style="labelStyle" :content-style="contentStyle">
            <template slot="label">
              <i class="el-icon-user" />
              任务名
            </template>
            第1周规划
          </el-descriptions-item>
          <el-descriptions-item :label-style="labelStyle" :content-style="contentStyle">
            <template slot="label">
              <i class="el-icon-mobile-phone" />
              类型
            </template>
            <el-tag size="small">规划</el-tag>
          </el-descriptions-item>
          <el-descriptions-item :label-style="labelStyle" :content-style="contentStyle">
            <template slot="label">
              <i class="el-icon-location-outline" />
              当前次数
            </template>
            1
          </el-descriptions-item>
          <el-descriptions-item :label-style="labelStyle" :content-style="contentStyle">
            <template slot="label">
              <i class="el-icon-tickets" />
              目标次数
            </template>
            10
          </el-descriptions-item>
          <el-descriptions-item :label-style="labelStyle" :content-style="contentStyle">
            <template slot="label">
              <i class="el-icon-office-building" />
              阶段1(10%)
            </template>
            1
          </el-descriptions-item>
          <el-descriptions-item :label-style="labelStyle" :content-style="contentStyle">
            <template slot="label">
              <i class="el-icon-office-building" />
              阶段2(50%)
            </template>
            5
          </el-descriptions-item>
          <el-descriptions-item :label-style="labelStyle" :content-style="contentStyle">
            <template slot="label">
              <i class="el-icon-office-building" />
              阶段3(70%)
            </template>
            7
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <h4>操作日志</h4>
        <el-timeline>
          <el-timeline-item timestamp="2018/4/12" placement="top">
            <el-card>
              <h4>更新 Github 模板</h4>
              <p>王小虎 提交于 2018/4/12 20:46</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2018/4/3" placement="top">
            <el-card>
              <h4>更新 Github 模板</h4>
              <p>王小虎 提交于 2018/4/3 20:46</p>
              <el-link href="www.baidu.com" type="primary">奖品链接</el-link>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2018/4/2" placement="top">
            <el-card>
              <h4>更新 Github 模板</h4>
              <p>王小虎 提交于 2018/4/2 20:46</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelStyle: {
        'text-align': 'left',
        'width': '80px'
      },
      contentStyle: {
        'text-align': 'left',
        'width': '100px'
      }
    }
  }
}
</script>

<style scoped>
</style>
