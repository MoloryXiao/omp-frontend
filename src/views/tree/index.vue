<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="任意字符搜索" style="margin-bottom:30px;" />

    <el-tree
      id="treeId"
      ref="prizeTree"
      class="filter-tree"
      show-checkbox
      draggable
      node-key="id"
      :data="data"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :default-expanded-keys="[21, 22, 23, 24]"
      :default-checked-keys="[7, 16, 17,]"
      @check="(click, checked)=>{handleCheckChange(click, checked)}"
    />

  </div>
</template>

<script>
export default {

  data() {
    return {
      filterText: '',
      data: [
        {
          id: 21,
          label: 'Small Prize( In ￥50 )',
          children: [{
            id: 1,
            label: '美食 · 杨枝甘露'
          },
          {
            id: 2,
            label: '美食 · 三层牛肉汉堡'
          },
          {
            id: 3,
            label: '美食 · 麦麦脆汁鸡'
          }]
        },
        {
          id: 22,
          label: 'Medical Prize( ￥50 ~ ￥150 )',
          children: [{
            id: 4,
            label: '日用 · 木质书夹'
          },
          {
            id: 6,
            label: '游戏 · Switch 存储卡512G'
          },
          {
            id: 7,
            label: '日用 · 小米台灯'
          }]
        },
        {
          id: 23,
          label: 'Big Prize( ￥150 ~ ￥500 )',
          children: [{
            id: 8,
            label: '电脑配件 · 内存条1'
          },
          {
            id: 9,
            label: '电脑配件 · 内存条2'
          },
          {
            id: 10,
            label: '电脑配件 · 固态256G'
          },
          {
            id: 11,
            label: '电脑配件 · 机械1T'
          },
          {
            id: 12,
            label: '电脑配件 · 电源'
          },
          {
            id: 13,
            label: '数码 · 小型航拍无人机'
          },
          {
            id: 14,
            label: '其他 · 情侣手表'
          },
          {
            id: 15,
            label: '会员 · 微信读书年度会员'
          },
          {
            id: 16,
            label: '会员 · B 站年度会员'
          },
          {
            id: 17,
            label: '游戏 · Switch 马里奥奥德赛'
          }]
        },
        {
          id: 24,
          label: 'Large Prize( Up ￥500 )',
          children: [{
            id: 18,
            label: '电脑配件 · 显卡1650s'
          },
          {
            id: 19,
            label: '电脑配件 · 主板+CPU'
          },
          {
            id: 20,
            label: '数码 · 读书笔记打印机'
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
      this.$refs.prizeTree.filter(val)
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleCheckChange(click, checked) {
      console.log(checked.checkedKeys)
      console.log('全选', checked.checkedNodes)
      console.log(checked.halfCheckedKeys)
      console.log('半选', checked.halfCheckedNodes)
    }
  }
}
</script>

