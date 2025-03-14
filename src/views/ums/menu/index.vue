<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">Data list</span>
      <el-button class="btn-add" @click="handleAddMenu()" size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="menuTable"
        style="width: 100%"
        :data="list"
        v-loading="listLoading"
        border
      >
        <el-table-column label="ID" width="100" align="center">
          <template v-slot="{ row }">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="Menu Title" align="center">
          <template v-slot="{ row }">{{ row.title }}</template>
        </el-table-column>
        <el-table-column label="Menu Level" width="100" align="center">
          <template v-slot="{ row }">{{ row.level | levelFilter }}</template>
        </el-table-column>
        <el-table-column label="Front-end name " align="center">
          <template v-slot="{ row }">{{ row.name }}</template>
        </el-table-column>
        <el-table-column label="Front-end icon" width="100" align="center">
          <template v-slot="{ row }"
            ><svg-icon :icon-class="row.icon"></svg-icon
          ></template>
        </el-table-column>
        <el-table-column label="Whether to display" width="100" align="center">
          <template v-slot="{ row, $index }">
            <el-switch
              @change="handleHiddenChange($index, row)"
              :active-value="0"
              :inactive-value="1"
              v-model="row.hidden"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="Sort" width="100" align="center">
          <template v-slot="{ row }">{{ row.sort }}</template>
        </el-table-column>
        <el-table-column label="Settings" width="120" align="center">
          <template v-slot="{ row, $index }">
            <el-button
              size="mini"
              type="text"
              :disabled="row.level | disableNextLevel"
              @click="handleShowNextLevel($index, row)"
              >Check out the lower level
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="200" align="center">
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
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[10, 15, 20]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { fetchList, deleteMenu, updateMenu, updateHidden } from "@/api/menu";

export default {
  name: "menuList",
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 5,
      },
      parentId: 0,
    };
  },
  created() {
    this.resetParentId();
    this.getList();
  },
  watch: {
    $route(route) {
      this.resetParentId();
      this.getList();
    },
  },
  methods: {
    resetParentId() {
      this.listQuery.pageNum = 1;
      if (this.$route.query.parentId != null) {
        this.parentId = this.$route.query.parentId;
      } else {
        this.parentId = 0;
      }
    },
    handleAddMenu() {
      this.$router.push("/ums/addMenu");
    },
    getList() {
      this.listLoading = true;
      fetchList(this.parentId, this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
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
    handleHiddenChange(index, row) {
      updateHidden(row.id, { hidden: row.hidden }).then((response) => {
        this.$message({
          message: "Modification was successful",
          type: "success",
          duration: 1000,
        });
      });
    },
    handleShowNextLevel(index, row) {
      this.$router.push({ path: "/ums/menu", query: { parentId: row.id } });
    },
    handleUpdate(index, row) {
      this.$router.push({ path: "/ums/updateMenu", query: { id: row.id } });
    },
    handleDelete(index, row) {
      this.$confirm("Do you want to delete the menu", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          deleteMenu(row.id).then((response) => {
            this.$message({
              message: "Delete successfully",
              type: "success",
              duration: 1000,
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
  },
  filters: {
    levelFilter(value) {
      if (value === 0) {
        return "Level 1";
      } else if (value === 1) {
        return "Level 2";
      }
    },
    disableNextLevel(value) {
      if (value === 0) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style scoped></style>
