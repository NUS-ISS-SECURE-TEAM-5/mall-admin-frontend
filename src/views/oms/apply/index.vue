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
          <el-form-item label="Input search:">
            <el-input
              v-model="listQuery.id"
              class="input-width"
              placeholder="Service Order Number"
            ></el-input>
          </el-form-item>
          <el-form-item label="processing status:">
            <el-select
              v-model="listQuery.status"
              placeholder="All"
              Clearable
              class="input-width"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Applying time:">
            <el-date-picker
              class="input-width"
              v-model="listQuery.createTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="Please select time"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="Operator:">
            <el-input
              v-model="listQuery.handleMan"
              class="input-width"
              placeholder="All"
            ></el-input>
          </el-form-item>
          <el-form-item label="processing time:">
            <el-date-picker
              class="input-width"
              v-model="listQuery.handleTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="Please select a time"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Data list</span>
    </el-card>
    <div class="table-container">
      <el-table
        ref="returnApplyTable"
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
        <el-table-column
          label="Service order number"
          width="180"
          align="center"
        >
          <template v-slot="{ row }">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="Applying time" width="180" align="center">
          <template v-slot="{ row }">{{
            row.createTime | formatTime
          }}</template>
        </el-table-column>
        <el-table-column label="User account" align="center">
          <template v-slot="{ row }">{{ row.memberUsername }}</template>
        </el-table-column>
        <el-table-column label="Refund amount" width="180" align="center">
          <template v-slot="{ row }">￥{{ row | formatReturnAmount }}</template>
        </el-table-column>
        <el-table-column label="Application Status" width="180" align="center">
          <template v-slot="{ row }">{{ row.status | formatStatus }}</template>
        </el-table-column>
        <el-table-column label="Processing time" width="180" align="center">
          <template v-slot="{ row }">{{
            row.handleTime | formatTime
          }}</template>
        </el-table-column>
        <el-table-column label="operate" width="180" align="center">
          <template v-slot="{ row, $index }">
            <el-button size="mini" @click="handleViewDetail($index, row)"
              >Check details</el-button
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
        @click="handleBatchOperate()"
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
  </div>
</template>
<script>
import { formatDate } from "@/utils/date";
import { fetchList, deleteApply } from "@/api/returnApply";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  id: null,
  receiverKeyword: null,
  status: null,
  createTime: null,
  handleMan: null,
  handleTime: null,
};
const defaultStatusOptions = [
  {
    label: "pending",
    value: 0,
  },
  {
    label: "Returning",
    value: 1,
  },
  {
    label: "Completed",
    value: 2,
  },
  {
    label: "Rejected",
    value: 3,
  },
];
export default {
  name: "returnApplyList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      statusOptions: Object.assign({}, defaultStatusOptions),
      list: null,
      total: null,
      listLoading: false,
      multipleSelection: [],
      operateType: 1,
      operateOptions: [
        {
          label: "Batch Delete",
          value: 1,
        },
      ],
    };
  },
  created() {
    this.getList();
  },
  filters: {
    formatTime(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    formatStatus(status) {
      for (let i = 0; i < defaultStatusOptions.length; i++) {
        if (status === defaultStatusOptions[i].value) {
          return defaultStatusOptions[i].label;
        }
      }
    },
    formatReturnAmount(row) {
      return row.productRealPrice * row.productCount;
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleViewDetail(index, row) {
      this.$router.push({
        path: "/oms/returnApplyDetail",
        query: { id: row.id },
      });
    },
    handleBatchOperate() {
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: "Please select the application to operate",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      if (this.operateType === 1) {
        //批量删除
        this.$confirm("Do you want to delete it?", "Tip", {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }).then(() => {
          let params = new URLSearchParams();
          let ids = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id);
          }
          params.append("ids", ids);
          deleteApply(params).then((response) => {
            this.getList();
            this.$message({
              type: "success",
              message: "Delete successfully!",
            });
          });
        });
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
  },
};
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>
