<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="任意字符搜索" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
    />

  </div>
</template>

<script>
export default {

  data() {
    return {
      filterText: '',
      data2: [
        {
          label: '杭银消金',
          children: [{
            label: '产品',
            children: [
              {
                label: '周东颖 (dongyin.zhou)'
              }, {
                label: '杨志彬 (beck.yang)'
              }
            ]
          },
          {
            label: '开发',
            children: [{
              label: '王文豪 (wenhao.wang)'
            }]
          },
          {
            label: '测试',
            children: [{
              label: '肖沐磊 (lette.xiao)'
            }]
          }]
        },
        {
          label: '甘肃银行',
          children: [{
            label: '产品',
            children: [
              {
                label: '白定超 (steve.bai)'
              },
              {
                label: '杨倩 (zoey.yang)'
              }
            ]
          },
          {
            label: '开发',
            children: [{
              label: '马锐 (rui.ma)'
            }]
          },
          {
            label: '测试',
            children: [{
              label: '肖沐磊 (lette.xiao)'
            }]
          }]
        },
        {
          label: '兰州银行',
          children: [{
            label: '产品',
            children: [
              {
                label: '王嘉铭 (chloe.wang)'
              },
              {
                label: '龙建宇 (beck.yang)'
              }
            ]
          },
          {
            label: '开发',
            children: [{
              label: '何凌宇 (lingyu.he)'
            }]
          },
          {
            label: '测试',
            children: [{
              label: '肖沐磊 (lette.xiao)'
            }]
          }]
        }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>

