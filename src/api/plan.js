import request from '@/utils/request'

export function getMonthPlanList(params) {
  return request({
    url: '/api/plan/month_plans',
    method: 'get',
    params
  })
}

export function getMonthPlanDetail(id) {
  return request({
    url: '/api/plan/month_plans/' + id,
    method: 'get'
  })
}

export function increaseTimes(id, data) {
  return request({
    url: '/api/plan/month_plans/' + id + '/increase_times/',
    method: 'post',
    data
  })
}

export function decreaseTimes(id, data) {
  return request({
    url: '/api/plan/month_plans/' + id + '/decrease_times/',
    method: 'post',
    data
  })
}

export function createMonthPlan(data) {
  return request({
    url: '/api/plan/month_plans/',
    method: 'post',
    data
  })
}

export function updateMonthPlan(id, data) {
  return request({
    url: '/api/plan/month_plans/' + id + '/',
    method: 'patch',
    data
  })
}

export function deleteMonthPlan(id) {
  return request({
    url: '/api/plan/month_plans/' + id + '/',
    method: 'delete'
  })
}

// 周计划
export function getWeekPlanList(params) {
  return request({
    url: '/api/plan/week_plans',
    method: 'get',
    params
  })
}

export function createWeekPlan(data) {
  return request({
    url: '/api/plan/week_plans/',
    method: 'post',
    data
  })
}

export function updateWeekPlan(id, data) {
  return request({
    url: '/api/plan/week_plans/' + id + '/',
    method: 'patch',
    data
  })
}

export function deleteWeekPlan(id) {
  return request({
    url: '/api/plan/week_plans/' + id + '/',
    method: 'delete'
  })
}

export function weekPlanStatusInversion(id, data) {
  return request({
    url: '/api/plan/week_plans/' + id + '/status_inversion/',
    method: 'post',
    data
  })
}

export function getOperationLog(query) {
  return request({
    url: '/api/statistics/operation_records/',
    method: 'get',
    params: query
  })
}

export function saveTodoList(id, data) {
  return request({
    url: '/api/plan/month_plans/' + id + '/save_todo_list/',
    method: 'post',
    data
  })
}

export function getTodoList(id) {
  return request({
    url: '/api/plan/month_plans/' + id + '/get_todo_list/',
    method: 'get'
  })
}
