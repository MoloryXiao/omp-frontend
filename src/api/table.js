import request from '@/utils/request'

export function getList(params) {
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
