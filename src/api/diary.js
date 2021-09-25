import request from '@/utils/request'

export function detectDiaryData(data) {
  return request({
    url: '/api/diary/detect/',
    method: 'post',
    data
  })
}
