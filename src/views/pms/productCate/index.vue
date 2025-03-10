<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">Data list</span>
      <el-button class="btn-add" @click="handleAddProductCate()" size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="productCateTable"
        style="width: 100%"
        :data="list"
        v-loading="listLoading"
        border
      >
        <el-table-column label="ID" width="100" align="center">
          <template v-slot="{ row }">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="Category Name" align="center">
          <template v-slot="{ row }">{{ row.name }}</template>
        </el-table-column>
        <el-table-column label="Level" width="100" align="center">
          <template v-slot="{ row }">{{ row.level | levelFilter }}</template>
        </el-table-column>
        <el-table-column
          label="Quantity of products"
          width="100"
          align="center"
        >
          <template v-slot="{ row }">{{ row.productCount }}</template>
        </el-table-column>
        <el-table-column label="Units of quantity" width="100" align="center">
          <template v-slot="{ row }">{{ row.productUnit }}</template>
        </el-table-column>
        <el-table-column label="Navigation bar" width="100" align="center">
          <template v-slot="{ row, $index }">
            <el-switch
              @change="handleNavStatusChange($index, row)"
              :active-value="1"
              :inactive-value="0"
              v-model="row.navStatus"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="Whether to display" width="100" align="center">
          <template v-slot="{ row, $index }">
            <el-switch
              @change="handleShowStatusChange($index, row)"
              :active-value="1"
              :inactive-value="0"
              v-model="row.showStatus"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="Sort" width="100" align="center">
          <template v-slot="{ row }">{{ row.sort }}</template>
        </el-table-column>
        <el-table-column label="Settings" width="200" align="center">
          <template v-slot="{ row, $index }">
            <el-button
              size="mini"
              :disabled="row.level | disableNextLevel"
              @click="handleShowNextLevel($index, row)"
              >Check out the following level
            </el-button>
            <el-button size="mini" @click="handleTransferProduct($index, row)"
              >Transfer products
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="200" align="center">
          <template v-slot="{ row }">
            <el-button size="mini" @click="handleUpdate($index, row)"
              >Edit
            </el-button>
            <el-button
              size="mini"
              type="danger"
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
        :page-sizes="[5, 10, 15]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  fetchList,
  deleteProductCate,
  updateShowStatus,
  updateNavStatus,
} from "@/api/productCate";

export default {
  name: "productCateList",
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
    handleAddProductCate() {
      this.$router.push("/pms/addProductCate");
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
    handleNavStatusChange(index, row) {
      let data = new URLSearchParams();
      let ids = [];
      ids.push(row.id);
      data.append("ids", ids);
      data.append("navStatus", row.navStatus);
      updateNavStatus(data).then((response) => {
        this.$message({
          message: "Modification was successful",
          type: "success",
          duration: 1000,
        });
      });
    },
    handleShowStatusChange(index, row) {
      let data = new URLSearchParams();
      let ids = [];
      ids.push(row.id);
      data.append("ids", ids);
      data.append("showStatus", row.showStatus);
      updateShowStatus(data).then((response) => {
        this.$message({
          message: "Modification was successful",
          type: "success",
          duration: 1000,
        });
      });
    },
    handleShowNextLevel(index, row) {
      this.$router.push({
        path: "/pms/productCate",
        query: { parentId: row.id },
      });
    },
    handleTransferProduct(index, row) {
      console.log("handleAddProductCate");
    },
    handleUpdate(index, row) {
      this.$router.push({
        path: "/pms/updateProductCate",
        query: { id: row.id },
      });
    },
    handleDelete(index, row) {
      this.$confirm("Whether to delete the brand", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          deleteProductCate(row.id).then((response) => {
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
            duration: 1000,
          });
        });
    },
  },
  filters: {
    levelFilter(value) {
      if (value === 0) {
        return "Level 1";
      } else if (value === 1) {
        return "level 2";
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
