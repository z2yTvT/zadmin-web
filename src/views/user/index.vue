<template>
  <div>
    <el-card shadow="always" style="margin: 10px;">
      <div class="searchForm">
        <el-form ref="formRef" :model="formQueryData">
          <el-row :gutter="24" style="display: flex;">
            <el-col :span="8">
              <el-form-item
                label="请输入用户昵称"
                label-width="120px"
              >
                <el-input
                  v-model="formQueryData.nickname"
                  placeholder="用户昵称"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" @click="getUserList">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <el-card>
          <el-button type="success" @click="showAdd">新增用户</el-button>
        </el-card>
      </div>
      <el-table
        :data="list"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="用户ID" width="95">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="用户昵称" align="center">
          <template slot-scope="scope">
            {{ scope.row.nickname }}
          </template>
        </el-table-column>
        <el-table-column label="登录账号" align="center">
          <template slot-scope="scope">
            {{ scope.row.userName }}
          </template>
        </el-table-column>
<!--        <el-table-column label="所属角色" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            {{ scope.row.roleName }}-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column label="状态" width="95" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.userStatus == 0">启用</div>
            <div v-if="scope.row.userStatus == 1">禁用</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建日期" width="95">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260">
          <template slot-scope="scope">
            <span>{{ scope.row }}</span>
            <span style="cursor: pointer"><el-tag @click="showEdit(scope.row)">修改</el-tag></span>
            <span style="cursor: pointer"><el-tag @click="showRelateRole(scope.row)">关联角色</el-tag></span>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="float:right" v-show="total > 0">
        <el-pagination
          layout="prev,pager,next"
          :total="total"
          :current-page="formQueryData.pageIndex"
          :page-size="formQueryData.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurPageChange"
        />
      </div>
    </el-card>
    <el-dialog
      title="用户信息修改"
      :visible.sync="showEditDia"
      width="40%">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickname">
              <el-input v-model="editForm.nickname" placeholder="请输入用户昵称" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="userName">
              <el-input v-model="editForm.userName" placeholder="请输入用户名称" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-select
                v-model="editForm.userStatus"
                placeholder="全部"
                clearable
                style="width: 200px"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDia = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="新增用户"
      :visible.sync="showAddDia"
      width="40%">

      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickname">
              <el-input v-model="addForm.nickname" placeholder="请输入用户昵称" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="userName">
              <el-input v-model="addForm.userName" placeholder="请输入用户名称" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-select
                v-model="addForm.userStatus"
                placeholder="全部"
                clearable
                style="width: 200px"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDia = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="关联角色"
      :visible.sync="relateRoleDia"
      width="40%">

      <el-table
        ref="multipleTable"
        :data="allRole"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>

       <span slot="footer" class="dialog-footer">
        <el-button @click="relateRoleDia = false">取 消</el-button>
        <el-button type="primary" @click="relateSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from './user'

export default {
  name: 'User',
  data() {
    return {
      total: 0,
      formQueryData: {
        nickname: '',
        createTimeS: '',
        createTimeE: '',
        pageSize: 10,
        pageIndex: 1
      },
      list: [],
      showEditDia: false,
      showAddDia: false,
      editForm:{
        'id': 0,
        'nickname': '',
        'userName': '',
        'userStatus': 0
      },
      addForm:{
        'id': 0,
        'nickname': '',
        'userName': '',
        'userStatus': 0
      },
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
          { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
      },
      statusOptions: [
        { label: "启用", value: "0" },
        { label: "禁用", value: "1" },
      ],
      allRole:[],
      userCurRole:[],
      relateRoleForm:{
        id: 0,
        roleIds: []
      },
      relateRoleDia:false,

    }
  },
  created() {
    this.getUserList()
  },
  methods: {

    handleSelectionChange(e){
      this.relateRoleForm.roleIds = e.map(item => item.id)
    },
    async showRelateRole(row){
      await api.getRoleByUid(row.id).then(response =>{
        this.userCurRole = response.data
      })
      await api.getAllRole().then(response => {
        this.allRole = response.data
      })

      const curIdsSet = new Set(this.userCurRole.map(item => item.id));
      this.$nextTick(function(){
          this.allRole.forEach(row => {
            if(curIdsSet.has(row.id)){
              this.$refs.multipleTable.toggleRowSelection(row,true);
            }
          })
      })
      this.relateRoleForm.id = row.id
      this.relateRoleDia = true;
    },
    relateSubmit(){
      api.relateUserRole(this.relateRoleForm).then(res => {
        if(res.code == 200){
          this.relateRoleDia = false
        }
      })
    },
    addSubmit(){
      this.$refs['addForm'].validate(valid =>{
        if(valid){
          api.addUser(this.addForm).then(res => {
            if(res.code == 200){
              this.showAddDia = false
            }
          })
        }
      })
    },
    showAdd(){
      this.showAddDia = true
      this.addForm.userStatus = this.statusOptions[0].value
    },
    editSubmit(){
      this.$refs['editForm'].validate(valid => {
        if(valid){
          api.editUser(this.editForm).then(res => {
            if(res.code == 200){
              this.showEditDia = false
            }
          })
        }
      })
    },
    showEdit(row){
      this.editForm.userStatus = this.statusOptions[row.userStatus].value
      this.editForm.nickname = row.nickname
      this.editForm.userName = row.userName
      this.editForm.id = row.id
      this.showEditDia = true
    },
    handleCurPageChange(curPage) {
      this.pageIndex = curPage
    },
    handleSizeChange(size) {
      this.formQueryData.pageSize = size
      this.getUserList()
    },
    getUserList() {
      const param = this.formQueryData
      api.getUserList(param).then(response => {
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
