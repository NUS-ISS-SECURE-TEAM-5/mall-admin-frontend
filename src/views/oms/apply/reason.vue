<template>
   
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Data list</span>
      <el-button size="mini" @click="handleAdd" class="btn-add"
        >添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="returnReasonTable"
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column
          type="selection"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column label="Serial number" width="80" align="center">
          <template v-slot="{ row }">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="Reason Type" align="center">
          <template v-slot="{ row }">{{ row.name }}</template>
        </el-table-column>
        <el-table-column label="Sort" width="100" align="center">
          <template v-slot="{ row }">{{ row.sort }}</template>
        </el-table-column>
        <el-table-column label="Is available" align="center">
          <template v-slot="{ row, $index }">
            <el-switch
              v-model="row.status"
              @change="handleStatusChange($index, row)"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="Add time" width="180" align="center">
          <template v-slot="{ row }">{{
            row.createTime | formatCreateTime
          }}</template>
        </el-table-column>
        <el-table-column label="Operation" width="160" align="center">
          <template v-slot="{ row, $index }">
            <el-button size="mini" @click="handleUpdate($index, row)"
              >Edit</el-button
            >
            <el-button size="mini" @click="handleDelete($index, row)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType"
        placeholder="Batch operation"
      >
        <el-option
          v-for="item in operateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate"
        type="primary"
        size="small"
      >
        Confirm
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5, 10, 15]"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="Add a reason for return"
      :model-value="dialogVisible"
      @update:model-value="(val) => (dialogVisible = val)"
      width="30%"
    >
      <el-form :model="returnReason" ref="reasonForm" label-width="150px">
        <el-form-item label="Reason type:">
          <el-input v-model="returnReason.name" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="Sort: ">
          <el-input v-model="returnReason.sort" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="Enable: ">
          <el-switch
            v-model="returnReason.status"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleConfirm">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { formatDate } from "@/utils/date";
import {
  fetchList,
  deleteReason,
  updateStatus,
  addReason,
  getReasonDetail,
  updateReason,
} from "@/api/returnReason";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
};
const defaultReturnReason = {
  name: null,
  sort: 0,
  status: 1,
  createTime: null,
};
export default {
  name: "returnReasonList",
  data() {
    return {
      list: null,
      total: null,
      multipleSelection: [],
      listLoading: true,
      listQuery: Object.assign({}, defaultListQuery),
      operateType: null,
      operateOptions: [
        {
          label: "Delete",
          value: 1,
        },
      ],
      dialogVisible: false,
      returnReason: Object.assign({}, defaultReturnReason),
      operateReasonId: null,
    };
  },
  created() {
    this.getList();
  },
  filters: {
    formatCreateTime(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
  },
  methods: {
    handleAdd() {
      this.dialogVisible = true;
      this.operateReasonId = null;
      this.returnReason = Object.assign({}, defaultReturnReason);
    },
    handleConfirm() {
      if (this.operateReasonId == null) {
        //添加操作
        addReason(this.returnReason).then((response) => {
          this.dialogVisible = false;
          this.operateReasonId = null;
          this.$message({
            message: "Added successfully!",
            type: "success",
            duration: 1000,
          });
          this.getList();
        });
      } else {
        //编辑操作
        updateReason(this.operateReasonId, this.returnReason).then(
          (response) => {
            this.dialogVisible = false;
            this.operateReasonId = null;
            this.$message({
              message: "Edidted successfully!",
              type: "success",
              duration: 1000,
            });
            this.getList();
          }
        );
      }
    },
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.operateReasonId = row.id;
      getReasonDetail(row.id).then((response) => {
        this.returnReason = response.data;
      });
    },
    handleDelete(index, row) {
      let ids = [];
      ids.push(row.id);
      this.deleteReason(ids);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      let param = new URLSearchParams();
      param.append("status", row.status);
      param.append("ids", ids);
      updateStatus(param).then((response) => {
        this.$message({
          message: "Status edited successfully",
          type: "success",
        });
      });
    },
    handleBatchOperate() {
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: "Please select the entry to operate",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      if (this.operateType === 1) {
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        this.deleteReason(ids);
      }
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
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    deleteReason(ids) {
      this.$confirm("Do you want to perform the delete operation?", "Prompt", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids", ids);
        deleteReason(params).then((response) => {
          this.$message({
            message: "Delete successfully!",
            type: "success",
            duration: 1000,
          });
          this.listQuery.pageNum = 1;
          this.getList();
        });
      });
    },
  },
};
</script>
<style scoped>
.input-width {
  width: 80%;
}
</style>
