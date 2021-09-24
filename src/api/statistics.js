import request from '@/utils/request'

export function getDailyTimeData() {
  return request({
    url: '/api/statistics/daily_time',
    method: 'get'
  })
}
