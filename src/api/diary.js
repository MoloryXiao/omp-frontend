import request from '@/utils/request'

export function detectDiaryData(data) {
  return request({
    url: '/api/diary/detect/',
    method: 'post',
    data
  })
}

export function saveDiaryData(data) {
  return request({
    url: '/api/diary/diaries/',
    method: 'post',
    data
  })
}

export function getDiaryData(query) {
  return request({
    url: '/api/diary/diaries/',
    method: 'get',
    params: query
  })
}
