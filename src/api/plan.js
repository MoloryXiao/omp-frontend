import request from '@/utils/request'

export function getMonthPlanList(params) {
  return request({
    url: '/api/plan/month_plans',
    method: 'get',
    params
  })
}

export function increaseTimes(id) {
  return request({
    url: '/api/plan/month_plans/' + id + '/increase_times/',
    method: 'post'
  })
}

export function decreaseTimes(id) {
  return request({
    url: '/api/plan/month_plans/' + id + '/decrease_times/',
    method: 'post'
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

export function weekPlanStatusInversion(id) {
  return request({
    url: '/api/plan/week_plans/' + id + '/status_inversion/',
    method: 'post'
  })
}
