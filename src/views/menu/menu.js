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

export default {
  getMenuList,
  getMenuTree
}
