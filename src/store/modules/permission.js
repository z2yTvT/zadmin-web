import { constantRoutes } from '@/router'
import { getRoutes } from '@/api/sys/menu'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roleKeys) {
    return roles.some(role => route.meta.roleKeys.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */

/**
          {
            "name": "/test/2",
            "path": "/test/2",
            "component": "测试组件2",
            "redirect": null,
            "meta": {
                "tittle": "testMenu",
                "icon": "icon2",
                "hidden": true,
                "keepAlive": true,
                "roleIds": []
            },
            "children": []
        }
 */

export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ... route }
    if (hasPermission(roles, tmp)) {
      const component = tmp.component
      if (route.component) {
        if (component === 'Layout') {
          tmp.component = Layout
        } else {
          // 接口组件字符串转换成组件对象
          tmp.component = (resolve) => require([`@/views/${component}`], resolve)
        }
        if (tmp.children) {
          tmp.children = filterAsyncRoutes(tmp.children, roles)
        }
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    console.log(state.routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      getRoutes()
        .then(res => {
          const routes = res.data
          const filterRoutes = filterAsyncRoutes(routes,roles)
          console.log(filterRoutes)
          console.log(roles)
          console.log('filterRoutes')
          commit('SET_ROUTES', filterRoutes)
          resolve(filterRoutes)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
