import request from '@/utils/request'

export function getDeptList(data) {
  return request({
    url: '/dept/getDeptList',
    method: 'post',
    data
  })
}

export function getDeptTreeOpt() {
  return request({
    url: '/dept/getDeptTreeOpt',
    method: 'get'
  })
}

export function editDept(data) {
  return request({
    url: '/dept/editDept',
    method: 'post',
    data
  })
}

export function addDept(data) {
  return request({
    url: '/dept/addDept',
    method: 'post',
    data
  })
}

export function getDeptById(id) {
  return request({
    url: '/dept/getDeptById?id=' + id,
    method: 'get'
  })
}


export default {
  getDeptList,
  getDeptTreeOpt,
  editDept,
  addDept,
  getDeptById
}
