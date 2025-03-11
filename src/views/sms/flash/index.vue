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
          <el-form-item label="Activity name: ">
            <el-input
              v-model="listQuery.keyword"
              class="input-width"
              placeholder="Activity name"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Data list</span>
      <el-button
        size="mini"
        class="btn-add"
        @click="handleAdd()"
        style="margin-left: 20px"
        >Add activity</el-button
      >
      <el-button size="mini" class="btn-add" @click="handleShowSessionList()"
        >Second kill time period list</el-button
      >
    </el-card>
    <div class="table-container">
      <el-table
        ref="flashTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column
          type="selection"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column label="serial number" width="100" align="center">
          <template v-slot="{ row }">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="Activity title" align="center">
          <template v-slot="{ row }">{{ row.title }}</template>
        </el-table-column>
        <el-table-column label="Activity" width="140" align="center">
          <template v-slot="{ row }">{{ row | formatActiveStatus }}</template>
        </el-table-column>
        <el-table-column label="Start time" width="140" align="center">
          <template v-slot="{ row }">{{ row.startDate | formatDate }}</template>
        </el-table-column>
        <el-table-column label="End time" width="140" align="center">
          <template v-slot="{ row }">{{ row.endDate | formatDate }}</template>
        </el-table-column>
        <el-table-column label="Online/Offline" width="200" align="center">
          <template v-slot="{ row }">
            <el-switch
              @change="handleStatusChange($index, row)"
              :active-value="1"
              :inactive-value="0"
              v-model="row.status"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="operate" width="180" align="center">
          <template v-slot="{ row, $index }">
            <el-button
              size="mini"
              type="text"
              @click="handleSelectSession($index, row)"
              >Set up products
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate($index, row)"
            >
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
        :page-sizes="[5, 10, 15]"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="Add activity"
      :model-value="dialogVisible"
      @update:model-value="(val) => (dialogVisible = val)"
      width="40%"
    >
      <el-form
        :model="flashPromotion"
        ref="flashPromotionForm"
        label-width="150px"
        size="small"
      >
        <el-form-item label="Activity title: ">
          <el-input
            v-model="flashPromotion.title"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="Start time:">
          <el-date-picker
            v-model="flashPromotion.startDate"
            type="date"
            placeholder="Please select time"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="End time: ">
          <el-date-picker
            v-model="flashPromotion.endDate"
            type="date"
            placeholder="Please select time"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Online/Offline">
          <el-radio-group v-model="flashPromotion.status">
            <el-radio :label="1">Online</el-radio>
            <el-radio :label="0">Offline</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small"
          >Sure</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchList,
  updateStatus,
  deleteFlash,
  createFlash,
  updateFlash,
} from "@/api/flash";
import { formatDate } from "@/utils/date";

const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  keyword: null,
};
const defaultFlashPromotion = {
  id: null,
  title: null,
  startDate: null,
  endDate: null,
  status: 0,
};
export default {
  name: "flashPromotionList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      flashPromotion: Object.assign({}, defaultFlashPromotion),
      isEdit: false,
    };
  },
  created() {
    this.getList();
  },
  filters: {
    formatActiveStatus(row) {
      let nowDate = new Date();
      let startDate = new Date(row.startDate);
      let endDate = new Date(row.endDate);
      if (
        nowDate.getTime() >= startDate.getTime() &&
        nowDate.getTime() <= endDate.getTime()
      ) {
        return "The activity is underway";
      } else if (nowDate.getTime() > endDate.getTime()) {
        return "Event ended";
      } else {
        return "The activity has not started";
      }
    },
    formatDate(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
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
      this.flashPromotion = Object.assign({}, defaultFlashPromotion);
    },
    handleShowSessionList() {
      this.$router.push({ path: "/sms/flashSession" });
    },
    handleStatusChange(index, row) {
      this.$confirm("Do you want to modify this status?", "Prompt", {
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
      this.$confirm("Do you want to delete the activity?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          deleteFlash(row.id).then((response) => {
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
            message: "Cancel delete",
          });
          this.getList();
        });
    },
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.flashPromotion = Object.assign({}, row);
    },
    handleDialogConfirm() {
      this.$confirm("Do you want to confirm?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        if (this.isEdit) {
          updateFlash(this.flashPromotion.id, this.flashPromotion).then(
            (response) => {
              this.$message({
                message: "The modification was successful!",
                type: "success",
              });
              this.dialogVisible = false;
              this.getList();
            }
          );
        } else {
          createFlash(this.flashPromotion).then((response) => {
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
    handleSelectSession(index, row) {
      this.$router.push({
        path: "/sms/selectSession",
        query: { flashPromotionId: row.id },
      });
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
<style></style>
