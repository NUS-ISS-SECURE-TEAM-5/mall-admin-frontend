<template>
   
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>Filter search</span>
        <el-button
          style="float: right"
          type="primary"
          @click="handleSearchList()"
          size="small"
        >
          Query Search
        </el-button>
        <el-button
          style="float: right; margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >
          Reset
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form
          :inline="true"
          :model="listQuery"
          size="small"
          label-width="140px"
        >
          <el-form-item label="Input Search:">
            <el-input
              v-model="listQuery.keyword"
              class="input-width"
              placeholder="Account/Name"
              Clearable
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Data List</span>
      <el-button
        size="mini"
        class="btn-add"
        @click="handleAdd()"
        style="margin-left: 20px"
        >Add</el-button
      >
    </el-card>
    <div class="table-container">
      <el-table
        ref="adminTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="ID" width="100" align="center">
          <template v-slot="{ row }">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="Username" align="center">
          <template v-slot="{ row }">{{ row.username }}</template>
        </el-table-column>
        <el-table-column label="Nickname" align="center">
          <template v-slot="{ row }">{{ row.nickName }}</template>
        </el-table-column>
        <el-table-column label="Email " align="center">
          <template v-slot="{ row }">{{ row.email }}</template>
        </el-table-column>
        <el-table-column label="Add time" width="160" align="center">
          <template v-slot="{ row }">{{
            row.createTime | formatDateTime
          }}</template>
        </el-table-column>
        <el-table-column label="Last login" width="160" align="center">
          <template v-slot="{ row }">{{
            row.loginTime | formatDateTime
          }}</template>
        </el-table-column>
        <el-table-column label="Status" width="140" align="center">
          <template v-slot="{ row, $index }">
            <el-switch
              @change="handleStatusChange($index, row)"
              :active-value="1"
              :inactive-value="0"
              v-model="row.status"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="180" align="center">
          <template v-slot="{ row, $index }">
            <el-button size="mini" type="text" @click="handleSelectRole(row)"
              >Assign roles
            </el-button>
            <el-button size="mini" type="text" @click="handleUpdate(row)">
              edit
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete($index, row)"
              >Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[10, 15, 20]"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      :title="isEdit ? 'Edit user' : 'Add user'"
      :model-value="dialogVisible"
      @update:model-value="(val) => (dialogVisible = val)"
      width="40%"
    >
      <el-form :model="admin" ref="adminForm" label-width="150px" size="small">
        <el-form-item label="Username">
          <el-input v-model="admin.username" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="Nickname">
          <el-input v-model="admin.nickName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="admin.email" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input
            v-model="admin.password"
            type="password"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="Note">
          <el-input
            v-model="admin.note"
            type="textarea"
            :rows="5"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="Whether to enable: ">
          <el-radio-group v-model="admin.status">
            <el-radio :label="1">Yes</el-radio>
            <el-radio :label="0">No</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small"
          >Cancel</el-button
        >
        <el-button type="primary" @click="handleDialogConfirm()" size="small"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="assign role"
      :model-value="allocDialogVisible"
      @update:model-value="(val) => (allocDialogVisible = val)"
      width="30%"
    >
      <el-select
        v-model="allocRoleIds"
        multiple
        placeholder="Please select"
        size="small"
        style="width: 80%"
      >
        <el-option
          v-for="item in allRoleList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allocDialogVisible = false" size="small"
          >Cancel</el-button
        >
        <el-button
          type="primary"
          @click="handleAllocDialogConfirm()"
          size="small"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchList,
  createAdmin,
  updateAdmin,
  updateStatus,
  deleteAdmin,
  getRoleByAdmin,
  allocRole,
} from "@/api/login";
import { fetchAllRoleList } from "@/api/role";
import { formatDate } from "@/utils/date";

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null,
};
const defaultAdmin = {
  id: null,
  username: null,
  password: null,
  nickName: null,
  email: null,
  note: null,
  status: 1,
};
export default {
  name: "adminList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      admin: Object.assign({}, defaultAdmin),
      isEdit: false,
      allocDialogVisible: false,
      allocRoleIds: [],
      allRoleList: [],
      allocAdminId: null,
    };
  },
  created() {
    this.getList();
    this.getAllRoleList();
  },
  filters: {
    formatDateTime(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.admin = Object.assign({}, defaultAdmin);
    },
    handleStatusChange(index, row) {
      this.$confirm("Do you want to modify this status?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          updateStatus(row.id, { status: row.status }).then((response) => {
            this.$message({
              type: "success",
              message: "Modification was successful!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Cancel modification",
          });
          this.getList();
        });
    },
    handleDelete(index, row) {
      this.$confirm("Do you want to delete the user?", "Prompt", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          deleteAdmin(row.id).then((response) => {
            this.$message({
              type: "success",
              message: "Delete successfully!",
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Undeleted",
          });
        });
    },
    handleUpdate(row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.admin = Object.assign({}, row);
    },
    handleDialogConfirm() {
      this.$confirm("Do you want to confirm?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        if (this.isEdit) {
          updateAdmin(this.admin.id, this.admin).then((response) => {
            this.$message({
              message: "Modification was successful!",
              type: "success",
            });
            this.dialogVisible = false;
            this.getList();
          });
        } else {
          createAdmin(this.admin).then((response) => {
            this.$message({
              message: "Added successfully!",
              type: "success",
            });
            this.dialogVisible = false;
            this.getList();
          });
        }
      });
    },
    handleAllocDialogConfirm() {
      this.$confirm("Do you want to confirm?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        let params = new URLSearchParams();
        params.append("adminId", this.allocAdminId);
        params.append("roleIds", this.allocRoleIds);
        allocRole(params).then((response) => {
          this.$message({
            message: "Assignment is successful!",
            type: "success",
          });
          this.allocDialogVisible = false;
        });
      });
    },
    handleSelectRole(row) {
      this.allocAdminId = row.id;
      this.allocDialogVisible = true;
      this.getRoleListByAdmin(row.id);
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    getAllRoleList() {
      fetchAllRoleList().then((response) => {
        this.allRoleList = response.data;
      });
    },
    getRoleListByAdmin(adminId) {
      getRoleByAdmin(adminId).then((response) => {
        let allocRoleList = response.data;
        this.allocRoleIds = [];
        if (allocRoleList != null && allocRoleList.length > 0) {
          for (let i = 0; i < allocRoleList.length; i++) {
            this.allocRoleIds.push(allocRoleList[i].id);
          }
        }
      });
    },
  },
};
</script>
<style></style>
