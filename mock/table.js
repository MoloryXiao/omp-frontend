const Mock = require('mockjs')

const data = Mock.mock({
  'items|5': [{
    // id: '@id',
    // title: '@sentence(10, 20)',
    // author: 'name',
    // display_time: '@datetime',
    // pageviews: '@integer(300, 5000)',

    // funder: '@sentence(1, 5)',
    // host: '@sentence(1, 5)',    
    // port: '@integer(4000, 18000)',
    // username: '@sentence(1, 5)',
    // password: '@sentence(1, 5)',
    // path: '@sentence(1, 5)',
    // 'connect_type|1': ['ftp', 'sftp'],
    // 'auth_type|1': ['password', 'key'],
    // 'status|1': ['published', 'draft', 'deleted'],
    // create_time: '@datetime',

    funder: '南山银行',
    host: '183.666.185.88',    
    port: '18666',
    username: 'wangcheng',
    password: 'wangcheng@123',
    path: '/download/font',
    'connect_type|1': ['ftp', 'sftp'],
    'auth_type|1': ['password', 'key'],
    'status|1': ['published', 'draft', 'deleted'],
    create_time: '@datetime'
  }]
})

module.exports = [
  {
    url: '/vue-admin-template/table/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
