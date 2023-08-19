<template>
  <div>
    <el-card shadow="always" style="margin: 10px;">
      <div class="searchForm">
        <el-form ref="formRef" :model="formQueryData">
          <el-row :gutter="24" style="display: flex;">
            <el-col :span="8">
              <el-form-item
                label="请输入部门名称"
                label-width="120px"
              >
                <el-input
                  v-model="formQueryData.deptName"
                  placeholder="部门名称"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" @click="getDeptList">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <el-card>
          <el-button type="success" @click="showAddDia">新增部门</el-button>
        </el-card>
      </div>

      <el-table
        :data="deptList"
        highlight-current-row
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        row-key="id"
        border
      >
        <el-table-column
          label="部门名称"
          prop="deptName"
          align="center"/>


        <el-table-column label="是否启用" align="center" width="150">
          <template #default="scope">
            <el-tag v-if="scope.row.enabled === 0" type="success">启用</el-tag>
            <el-tag v-else type="info">停用</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="排序" align="center" width="100" prop="deptSort" />

        <el-table-column
          label="创建时间"
          align="center"
          width="200"
          prop="createTime"
        >
        </el-table-column>

        <el-table-column
          label="创建人"
          align="center"
          width="200"
          prop="createUser"
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
      :visible.sync="saveDia"
      width="40%">


      <el-form
        ref="dataFormRef"
        :model="saveFormData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="父级部门" prop="pId">
          <el-cascader
            :options="deptOpt"
            :show-all-levels="false"
            :props="defaultProps"
            @change="setPid"
          >
          </el-cascader>
        </el-form-item>

        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="saveFormData.deptName" placeholder="请输入部门名称" />
        </el-form-item>

        <el-form-item label="是否启用">
          <el-radio-group v-model="saveFormData.enabled">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="saveFormData.deptSort"
            style="width: 100px"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
      </el-form>

       <span slot="footer" class="dialog-footer">
        <el-button @click="saveDia = false">取 消</el-button>
        <el-button type="primary" @click="saveDept">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import api from './dept'

export default {
  name: "index",
  data(){
    return {
      saveFormData:{
        id : 0,
        deptName: '',
        pId: 0,
        enabled: 0,
        deptSort: 0
      },
      rules: {
        pId: [{ required: true, message: '请选择顶级部门', trigger: 'blur' }],
        deptName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
      },
      defaultProps: {
        label: 'label',
        value: 'id',
        checkStrictly: true,
        children: 'children',
      },
      diaTittle:'',
      saveType:0,
      deptOpt: [],
      deptList: [],
      saveDia:false,
      formQueryData: {
        deptName:''
      },
    }
  },
  created() {
    this.getDeptList()
  },
  methods: {

    showSaveDia(){
      this.saveDia = true
      api.getDeptTreeOpt().then(res => {
        const topD = { id: 0, label: '顶级部门', children: res.data };
        this.deptOpt.push(topD)
      })
    },

    showEdit(e){
      api.getDeptById(e.id).then(res => {
        if(res.code == '200'){
          this.saveFormData = res.data
          this.saveType = 2
          this.showSaveDia();
        }
      })
    },

    showAddDia(){
      this.saveType = 1
      this.showSaveDia()
    },

    saveDept(){
      if(this.saveType === 1){
        api.addDept(this.saveFormData).then(res => {
          if(res.code == '200'){
            this.saveDia = false;
          }
        })
      }
      if(this.saveType === 2){
        api.editDept(this.saveFormData).then(res => {
          if(res.code == '200'){
            this.saveDia = false;
          }
        })
      }
    },

    setPid(e){
      console.log(e)
      this.saveFormData.pId = e[e.length - 1];
    },

    getDeptList(){
      api.getDeptList(this.formQueryData).then(res => {
        if(res.code == '200'){
          this.deptList = res.data
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
