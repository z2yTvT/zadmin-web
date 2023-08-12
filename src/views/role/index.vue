<template>
  <div>
    <el-card shadow="always" style="margin: 10px;">
      <div class="searchForm">
        <el-form ref="formRef" :model="formQueryData">
          <el-row :gutter="24" style="display: flex;">
            <el-col :span="8">
              <el-form-item
                label="角色名称"
                label-width="120px"
              >
                <el-input
                  v-model="formQueryData.roleName"
                  placeholder="请输入角色名称"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" @click="getRoleList">查询</el-button>
            </el-col>
          </el-row>
          <el-row>
          </el-row>
        </el-form>
      </div>

      <el-table :data="list"  border fit highlight-current-row>
        <el-table-column align="center" label="角色ID" width="95">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="角色名称" align="center" width="200">
          <template slot-scope="scope">
            {{ scope.row.roleName }}
          </template>
        </el-table-column>
        <el-table-column label="角色标识" align="center" width="200">
          <template slot-scope="scope">
            {{ scope.row.roleKey }}
          </template>
        </el-table-column>
        <el-table-column label="数据权限" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.dataScope }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="95" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.enable == 0">启用</div>
            <div v-if="scope.row.enable == 1">禁用</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建人" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.createUser }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建日期" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <span>{{ scope.row }}</span>
            <span style="cursor: pointer"><el-tag @click="showRoleDetailDia(scope.row)">修改</el-tag></span>
            <span style="cursor: pointer"><el-tag @click="showRelateMenuDia(scope.row)">关联菜单</el-tag></span>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        title="编辑角色"
        :visible.sync="roleDetailDia"
        width="40%">
      </el-dialog>

      <el-dialog
        title="关联菜单"
        :visible.sync="relateMenuDia"
        width="40%">

        <el-tree
          :data="menuOptions"
          show-checkbox
          ref="menu"
          node-key="id"
          :check-strictly="false"
          empty-text="加载中"
          :props="{children: 'children',label: 'label'}"
          :default-checked-keys="selectedMenus"
          highlight-current
          @check-change="menuSelectedChange"
        ></el-tree>

        <span slot="footer" class="dialog-footer">
          <el-button @click="relateMenuDia = false">取 消</el-button>
          <el-button type="primary" @click="relateSubmit">确 定</el-button>
      </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>

import api from './role'

export default {
  name: "index",
  data() {
    return{
      formQueryData:{
        roleName:'',
        pageSize: 10,
        pageIndex: 1
      },
      editForm:{

      },
      total: 0,
      list:[],
      roleDetailDia: false,
      relateMenuDia: false,
      menuOptions: [],
      relateMenuForm:{
        rid: 0,
        mIds:[]
      },
      selectedMenus: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    menuSelectedChange(node,checked){
     if(checked){
       if(!this.selectedMenus.includes(node.id)){
         this.selectedMenus.push(node.id)
         console.log( this.selectedMenus)
       }
     }else{
       this.selectedMenus = this.selectedMenus.filter(id => id !== node.id)
     }
      // console.log(this.selectedMenus)
    },
    getMenuTree(rid){
      api.getMenuTree().then(response => {
        this.menuOptions = response.data
        api.getSelectedMenus(rid).then(res => {
          this.selectedMenus = res.data
          this.$nextTick(() => {
            this.$refs.menu.setCheckedKeys(this.selectedMenus)
          });
        })
      })
    },

    relateSubmit(){
      this.relateMenuForm.mIds =  this.selectedMenus
      console.log(this.relateMenuForm.mIds )
      // api.relateRoleMenus(this.relateMenuForm).then(res => {
      //   if(res.code == '200'){
      //     this.relateMenuDia = false
      //   }
      // })
    },
    showRelateMenuDia(row){
      this.getMenuTree(row.id)
      this.relateMenuForm.rid = row.id
      this.relateMenuDia = true
    },
    showRoleDetailDia(row){
      this.roleDetailDia = true
    },
    getRoleList(){
      const param = this.formQueryData
      api.getRoleList(param).then(response => {
        const res = response.data
        this.list = res.records
        this.total = res.total
      })
    }
  }
}
</script>
<style scoped>

</style>
