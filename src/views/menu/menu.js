import request from '@/utils/request'

export function getMenuList(data) {
  return request({
    url: '/menu/getMenuList',
    method: 'post',
    data
  })
}

export function getMenuTree() {
  return request({
    url: '/menu/getMenuTreeOpt',
    method: 'get',
  })
}
export function addMenu(data) {
  return request({
    url: '/menu/addMenu',
    method: 'post',
    data
  })
}

export function getMenuDetail(id) {
  return request({
    url: '/menu/getMenuDetail?id=' + id,
    method: 'get',
  })
}

export function editMenu(data) {
  return request({
    url: '/menu/editMenu',
    method: 'post',
    data
  })
}



export default {
  getMenuList,
  getMenuTree,
  addMenu,
  getMenuDetail,
  editMenu
}

