<template>
  <div>
    <el-card shadow="always" style="margin: 10px;">
      <div class="searchForm">
        <el-form ref="formRef" :model="formQueryData">
          <el-row :gutter="24" style="display: flex;">
            <el-col :span="8">
              <el-form-item
                label="请输入菜单名称"
                label-width="120px"
              >
                <el-input
                  v-model="formQueryData.menuName"
                  placeholder="菜单名称"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" @click="getMenuList">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <el-card>
          <el-button type="success" @click="showAddDia">新增菜单</el-button>
        </el-card>
      </div>
      <el-table
        :data="menuList"
        highlight-current-row
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        row-key="id"
        border
        default-expand-all
      >
        <el-table-column
          label="菜单名称"
          prop="menuName"
          align="center"/>

        <el-table-column label="菜单类型" align="center" width="150">
          <template #default="scope">
            {{ scope.row.menuType }}
          </template>
        </el-table-column>
        <el-table-column
          label="权限标识"
          align="center"
          width="200"
          prop="perm"
        />
        <el-table-column
          label="权限标识"
          align="center"
          width="200"
          prop="path"
        />
        <el-table-column label="状态" align="center" width="150">
          <template #default="scope">
            <el-tag v-if="scope.row.hidden === 0" type="success">显示</el-tag>
            <el-tag v-else type="info">隐藏</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="排序" align="center" width="100" prop="menuSort" />

        <el-table-column
          label="创建时间"
          align="center"
          width="200"
          prop="createTime"
        >
        </el-table-column>

        <el-table-column
          label="修改时间"
          align="center"
          width="200"
          prop="updateTime"
        >
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <span style="cursor: pointer"><el-tag @click="showEdit(scope.row)">修改</el-tag></span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :title="diaTittle"
      :visible.sync="updateDia"
      width="40%">

      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="父级菜单" prop="pId">
          <el-tree
            v-model="formData.parentId"
            placeholder="选择上级菜单"
            :data="menuOptions"
            filterable
            check-strictly
            :render-after-expand="false"
          />
        </el-form-item>

        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="formData.name" placeholder="请输入菜单名称" />
        </el-form-item>

        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group
            v-model="formData.menuType"
            @change="handleMenuTypeChange"
          >
            <el-radio label="1">目录</el-radio>
            <el-radio label="2" >菜单</el-radio>
            <el-radio label="3">按钮</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="路由路径"
          prop="path"
          v-if="formData.menuType == 1 || formData.menuType == 2"
        >
          <el-input
            v-if="formData.menuType == '1'"
            v-model="formData.path"
            placeholder="/system  (目录以/开头)"
          />
          <el-input v-else v-model="formData.path" placeholder="user" />
        </el-form-item>

        <!-- 组件页面完整路径 -->
        <el-form-item
          v-if="formData.menuType == '2'"
          label="页面路径"
          prop="component"
        >
          <el-input
            v-model="formData.component"
            placeholder="system/user/index"
            style="width: 95%"
          >
          </el-input>
        </el-form-item>

        <!-- 权限标识 -->
        <el-form-item
          v-if="formData.menuType == 3"
          label="权限标识"
          prop="perm"
        >
          <el-input v-model="formData.perm" placeholder="sys:user:add" />
        </el-form-item>


        <el-form-item label="跳转路由" v-if="formData.menuType == 1">
          <el-input v-model="formData.redirect" placeholder="跳转路由" />
        </el-form-item>

        <el-form-item label="状态" v-if="formData.menuType !== 3">
          <el-radio-group v-model="formData.hidden">
            <el-radio :label="0">显示</el-radio>
            <el-radio :label="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="formData.sort"
            style="width: 100px"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDia = false">取 消</el-button>
        <el-button type="primary" @click="showAddDia">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from './menu.js'

export default {
  name: "menu",
  data() {
    return{
      formData:{
        menuType: 2,
        hidden: 0,
        menuName: '',
        perm: '',
        pId: '',
        component: '',
        menuSort: '',
      },
      rules: {
        parentId: [{ required: true, message: '请选择顶级菜单', trigger: 'blur' }],
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
        path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
        component: [
          { required: true, message: '请输入组件完整路径', trigger: 'blur' },
        ],
      },
      diaTittle: '',
      formQueryData: {
        menuName:''
      },
      menuList:[],
      updateDia: false,
      menuOptions:[]
    }
  },
  created() {
    this.getMenuList()
  },
  methods:{
    handleMenuTypeChange(e){
      this.formData.menuType = Number(e)
    },
    showEdit(row){
      this.diaTittle = '修改菜单'
      this.showUpdateDia()
    },
    showAddDia(){
      this.diaTittle = '新增菜单'
      this.showUpdateDia()
    },
    showUpdateDia(){
      this.updateDia = true;
      api.getMenuTree().then(res => {
        this.menuOptions = res.data
      })
    },
    getMenuList(){
      api.getMenuList(this.formQueryData).then(response => {
        const res = response.data;
        this.menuList = res;
      })
    }
  }
}
</script>

<style scoped>

</style>
