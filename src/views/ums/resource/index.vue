<template>
   
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>Filter Search</span>
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
          <el-form-item label="Resource Name:">
            <el-input
              v-model="listQuery.nameKeyword"
              class="input-width"
              placeholder="Resource Name"
              Clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="Resource path:">
            <el-input
              v-model="listQuery.urlKeyword"
              class="input-width"
              placeholder="Resource Path"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="Resource Classification:">
            <el-select
              v-model="listQuery.categoryId"
              placeholder="All"
              clearable
              class="input-width"
            >
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
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
        >Add</el-button
      >
      <el-button size="mini" class="btn-add" @click="handleShowCategory()"
        >Resource classification</el-button
      >
    </el-card>
    <div class="table-container">
      <el-table
        ref="resourceTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="ID" width="100" align="center">
          <template v-slot="{ row }">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="Resource name" align="center">
          <template v-slot="{ row }">{{ row.name }}</template>
        </el-table-column>
        <el-table-column label="Resource path " align="center">
          <template v-slot="{ row }">{{ row.url }}</template>
        </el-table-column>
        <el-table-column label="Description" align="center">
          <template v-slot="{ row }">{{ row.description }}</template>
        </el-table-column>
        <el-table-column label="Add time" width="160" align="center">
          <template v-slot="{ row }">{{
            row.createTime | formatDateTime
          }}</template>
        </el-table-column>
        <el-table-column label="Operation" width="140" align="center">
          <template v-slot="{ row, $index }">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate($index, row)"
            >
              Edit
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
      :title="isEdit ? 'Editing a resource' : 'Add a resource'"
      :model-value="dialogVisible"
      @update:model-value="(val) => (dialogVisible = val)"
      width="40%"
    >
      <el-form
        :model="resource"
        ref="resourceForm"
        label-width="150px"
        size="small"
      >
        <el-form-item label="Resource name:">
          <el-input v-model="resource.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="Resource path:">
          <el-input v-model="resource.url" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="Resource classification: ">
          <el-select
            v-model="resource.categoryId"
            placeholder="All"
            Clearable
            style="width: 250px"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Description:">
          <el-input
            v-model="resource.description"
            type="textarea"
            :rows="5"
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
  fetchList,
  createResource,
  updateResource,
  deleteResource,
} from "@/api/resource";
import { listAllCate } from "@/api/resourceCategory";
import { formatDate } from "@/utils/date";

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  nameKeyword: null,
  urlKeyword: null,
  categoryId: null,
};
const defaultResource = {
  id: null,
  name: null,
  url: null,
  categoryId: null,
  description: "",
};
export default {
  name: "resourceList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      resource: Object.assign({}, defaultResource),
      isEdit: false,
      categoryOptions: [],
      defaultCategoryId: null,
    };
  },
  created() {
    this.getList();
    this.getCateList();
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
      this.resource = Object.assign({}, defaultResource);
      this.resource.categoryId = this.defaultCategoryId;
    },
    handleDelete(index, row) {
      this.$confirm("Do you want to delete the resource?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          deleteResource(row.id).then((response) => {
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
            message: "Undelete",
          });
        });
    },
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.resource = Object.assign({}, row);
    },
    handleDialogConfirm() {
      this.$confirm("Do you want to confirm?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        if (this.isEdit) {
          updateResource(this.resource.id, this.resource).then((response) => {
            this.$message({
              message: "The modification was successful!",
              type: "success",
            });
            this.dialogVisible = false;
            this.getList();
          });
        } else {
          createResource(this.resource).then((response) => {
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
    handleShowCategory() {
      this.$router.push({ path: "/ums/resourceCategory" });
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    getCateList() {
      listAllCate().then((response) => {
        let cateList = response.data;
        for (let i = 0; i < cateList.length; i++) {
          let cate = cateList[i];
          this.categoryOptions.push({ label: cate.name, value: cate.id });
        }
        this.defaultCategoryId = cateList[0].id;
      });
    },
  },
};
</script>
<style></style>
