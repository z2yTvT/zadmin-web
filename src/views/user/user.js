import request from '@/utils/request'

export function getUserList(data) {
  return request({
    url: '/user/getUserList',
    method: 'post',
    data
  })
}

export function editUser(data) {
  return request({
    url: '/user/editUser',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data
  })
}


export default {
  getUserList,
  editUser,
  addUser
}
