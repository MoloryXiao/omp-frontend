import request from '@/utils/request'

export function getSummaryReview(params) {
  return request({
    url: '/api/summary/reviews',
    method: 'get',
    params
  })
}

export function saveSummaryData(data) {
  return request({
    url: '/api/summary/reviews/',
    method: 'post',
    data
  })
}
