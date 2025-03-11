<template>
  <div class="app-container">
    <el-card shadow="never" class="operate-container">
      <i class="el-icon-tickets"></i>
      <span>Data List</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()"
        >Add</el-button
      >
    </el-card>
    <div class="table-container">
      <el-table
        ref="resourceCategoryTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="ID" width="100" align="center">
          <template v-slot="{ row }">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="Name" align="center">
          <template v-slot="{ row }">{{ row.name }}</template>
        </el-table-column>
        <el-table-column label="Creation time" align="center">
          <template v-slot="{ row }">{{
            row.createTime | formatDateTime
          }}</template>
        </el-table-column>
        <el-table-column label="Sort" align="center">
          <template v-slot="{ row }">{{ row.sort }}</template>
        </el-table-column>
        <el-table-column label="Operation" width="180" align="center">
          <template v-slot="{ row, $index }">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate($index, row)"
              >Edit
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
    <el-dialog
      title="Add a category"
      :model-value="dialogVisible"
      @update:model-value="(val) => (dialogVisible = val)"
      width="40%"
    >
      <el-form
        :model="resourceCategory"
        ref="resourceCategoryForm"
        label-width="150px"
        size="small"
      >
        <el-form-item label="Name: ">
          <el-input
            v-model="resourceCategory.name"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="Sort: ">
          <el-input
            v-model="resourceCategory.sort"
            style="width: 250px"
          ></el-input>
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
  </div>
</template>
<script>
import {
  listAllCate,
  createResourceCategory,
  updateResourceCategory,
  deleteResourceCategory,
} from "@/api/resourceCategory";
import { formatDate } from "@/utils/date";
const defaultResourceCategory = {
  name: null,
  sort: 0,
};
export default {
  name: "resourceCategoryList",
  data() {
    return {
      list: null,
      listLoading: false,
      dialogVisible: false,
      isEdit: false,
      resourceCategory: Object.assign({}, defaultResourceCategory),
    };
  },
  created() {
    this.getList();
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
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.resourceCategory = Object.assign({}, defaultResourceCategory);
    },
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.resourceCategory = Object.assign({}, row);
    },
    handleDelete(index, row) {
      this.$confirm("Do you want to delete the category?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          deleteResourceCategory(row.id).then((response) => {
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
    handleDialogConfirm() {
      this.$confirm("Do you want to confirm?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        if (this.isEdit) {
          updateResourceCategory(
            this.resourceCategory.id,
            this.resourceCategory
          ).then((response) => {
            this.$message({
              message: "Modified successfully!",
              type: "success",
            });
            this.dialogVisible = false;
            this.getList();
          });
        } else {
          createResourceCategory(this.resourceCategory).then((response) => {
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
    getList() {
      this.listLoading = true;
      listAllCate({}).then((response) => {
        this.listLoading = false;
        this.list = response.data;
      });
    },
  },
};
</script>
<style></style>
