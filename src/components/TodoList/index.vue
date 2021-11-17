<template>
  <section class="todoapp">
    <header class="header">
      <input class="new-todo" autocomplete="off" placeholder="待办清单" @keyup.enter="addTodo">
    </header>
    <section v-show="todoListDetail.length" class="main">
      <input id="toggle-all" :checked="allChecked" class="toggle-all" type="checkbox">
      <label for="toggle-all" />
      <ul class="todo-list">
        <todo
          v-for="(todo, index) in filteredTodos"
          :key="index"
          :todo="todo"
          @toggleTodo="toggleTodo"
          @editTodo="editTodo"
          @deleteTodo="deleteTodo"
        />
      </ul>
    </section>
    <!-- footer -->
    <!-- <footer v-show="todos.length" class="footer">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ remaining | pluralize('item') }} left
      </span>
      <ul class="filters">
        <li v-for="(val, key) in filters" :key="key">
          <a :class="{ selected: visibility === key }" @click.prevent="visibility = key">{{ key | capitalize }}</a>
        </li>
      </ul>
    </footer> -->
    <footer style="margin-top: 10px; text-align:right;">
      <el-button type="success" size="small" style="margin:10px; padding:8px;" @click="resetTodo">重置</el-button>
      <el-button type="primary" size="small" style="margin:10px; padding:8px;" @click="saveTodo">保存</el-button>
    </footer>
  </section>
</template>

<script>
import Todo from './Todo.vue'
import { saveTodoList, getTodoList } from '@/api/plan'

const STORAGE_KEY = 'todos'
const filters = {
  all: todos => todos,
  active: todos => todos.filter(todo => !todo.done),
  completed: todos => todos.filter(todo => todo.done)
}
export default {
  components: { Todo },
  filters: {
    pluralize: (n, w) => n === 1 ? w : w + 's',
    capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
  },
  props: {
    taskId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      visibility: 'all',
      filters,
      // todoListDetail: JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || defalutList
      todoListDetail: []
    }
  },
  computed: {
    allChecked() {
      return this.todoListDetail.every(todo => todo.done)
    },
    filteredTodos() {
      return filters[this.visibility](this.todoListDetail)
    },
    remaining() {
      return this.todoListDetail.filter(todo => !todo.done).length
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getTodoList(this.taskId).then(rsp => {
        this.todoListDetail = JSON.parse(rsp.data)['todo_list_detail']
      })
    },
    setLocalStorage() {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todoListDetail))
    },
    addTodo(e) {
      const text = e.target.value
      if (text.trim()) {
        this.todoListDetail.push({
          text,
          done: false
        })
        this.setLocalStorage()
      }
      e.target.value = ''
    },
    toggleTodo(val) {
      val.done = !val.done
      this.setLocalStorage()
    },
    deleteTodo(todo) {
      this.todoListDetail.splice(this.todoListDetail.indexOf(todo), 1)
      this.setLocalStorage()
    },
    editTodo({ todo, value }) {
      todo.text = value
      this.setLocalStorage()
    },
    clearCompleted() {
      this.todoListDetail = this.todoListDetail.filter(todo => !todo.done)
      this.setLocalStorage()
    },
    toggleAll({ done }) {
      this.todoListDetail.forEach(todo => {
        todo.done = done
        this.setLocalStorage()
      })
    },
    saveTodo() {
      var data = { 'todo_list': this.todoListDetail }
      saveTodoList(this.taskId, data).then(() => {
        this.$notify({
          title: '成功',
          message: '数据保存成功',
          type: 'success',
          duration: 2000
        })
      }).catch((err) => {
        this.$notify({
          title: '失败',
          message: err.response.data.basic.msg,
          type: 'error',
          duration: 2000
        })
      })
    },
    resetTodo() {
      getTodoList(this.taskId).then(rsp => {
        this.todoListDetail = JSON.parse(rsp.data)['todo_list_detail']
        this.$notify({
          title: '成功',
          message: '数据重置成功',
          type: 'success',
          duration: 2000
        })
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

<style lang="scss">
  @import './index.scss';
</style>
