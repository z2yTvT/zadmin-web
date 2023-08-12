import request from '@/utils/request'

export function getRoleList(data) {
  return request({
    url: '/role/getRoleList',
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
export function getSelectedMenus(rid) {
  return request({
    url: '/menu/getSelectedMenus/?rid=' + rid,
    method: 'get',
  })
}

export function relateRoleMenus(data) {
  return request({
    url: '/role/relateRoleMenus',
    method: 'post',
    data
  })
}



export default {
  getRoleList,
  getMenuTree,
  getSelectedMenus,
  relateRoleMenus
}
