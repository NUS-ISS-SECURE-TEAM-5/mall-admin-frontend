<template>
   
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>Filter search</span>
        <el-button
          style="float: right"
          @click="searchBrandList()"
          type="primary"
          size="small"
        >
          Query results
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form
          :inline="true"
          :model="listQuery"
          size="small"
          label-width="140px"
          ><el-form-item label="Input search:">
            <el-input
              style="width: 203px"
              v-model="listQuery.keyword"
              placeholder="Brand Name/Keyword"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Data list</span>
      <el-button class="btn-add" @click="addBrand()" size="mini">
        Add
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="brandTable"
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
        <el-table-column label="Serial number" width="100" align="center">
          <template v-slot="{ row }">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="Brand Name" align="center">
          <template v-slot="{ row }">{{ row.name }}</template>
        </el-table-column>
        <el-table-column label="Brand First Letter" width="100" align="center">
          <template v-slot="{ row }">{{ row.firstLetter }}</template>
        </el-table-column>
        <el-table-column label="Sort" width="100" align="center">
          <template v-slot="{ row }">{{ row.sort }}</template>
        </el-table-column>
        <el-table-column label="Brand Manufacturer" width="100" align="center">
          <template v-slot="{ row, $index }">
            <el-switch
              @change="handleFactoryStatusChange($index, row)"
              :active-value="1"
              :inactive-value="0"
              v-model="row.factoryStatus"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="Is Display" width="100" align="center">
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
        <el-table-column label="About" width="220" align="center">
          <template v-slot="{ row, $index }">
            <span>Products: </span>
            <el-button
              size="mini"
              type="text"
              @click="getProductList($index, row)"
              >100
            </el-button>
            <span>Comments: </span>
            <el-button
              size="mini"
              type="text"
              @click="getProductCommentList($index, row)"
              >1000
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="200" align="center">
          <template v-slot="{ row, $index }">
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
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType"
        placeholder="Batch Operation"
      >
        <el-option
          v-for="item in operates"
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
  updateShowStatus,
  updateFactoryStatus,
  deleteBrand,
} from "@/api/brand";

export default {
  name: "brandList",
  data() {
    return {
      operates: [
        {
          label: "Show Brand",
          value: "showBrand",
        },
        {
          label: "Hide brand",
          value: "hideBrand",
        },
      ],
      operateType: null,
      listQuery: {
        keyword: null,
        pageNum: 1,
        pageSize: 10,
      },
      list: null,
      total: null,
      listLoading: true,
      multipleSelection: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
        this.totalPage = response.data.totalPage;
        this.pageSize = response.data.pageSize;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleUpdate(index, row) {
      this.$router.push({ path: "/pms/updateBrand", query: { id: row.id } });
    },
    handleDelete(index, row) {
      this.$confirm("Whether to delete the brand", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          deleteBrand(row.id).then((response) => {
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
            message: "Cancelled",
            duration: 1000,
          });
        });
    },
    getProductList(index, row) {
      console.log(index, row);
    },
    getProductCommentList(index, row) {
      console.log(index, row);
    },
    handleFactoryStatusChange(index, row) {
      var data = new URLSearchParams();
      data.append("ids", row.id);
      data.append("factoryStatus", row.factoryStatus);
      updateFactoryStatus(data)
        .then((response) => {
          this.$message({
            message: "Modification was successful",
            type: "success",
            duration: 1000,
          });
        })
        .catch((error) => {
          if (row.factoryStatus === 0) {
            row.factoryStatus = 1;
          } else {
            row.factoryStatus = 0;
          }
        });
    },
    handleShowStatusChange(index, row) {
      let data = new URLSearchParams();
      data.append("ids", row.id);
      data.append("showStatus", row.showStatus);
      updateShowStatus(data)
        .then((response) => {
          this.$message({
            message: "Modification was successful",
            type: "success",
            duration: 1000,
          });
        })
        .catch((error) => {
          if (row.showStatus === 0) {
            row.showStatus = 1;
          } else {
            row.showStatus = 0;
          }
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
    searchBrandList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleBatchOperate() {
      console.log(this.multipleSelection);
      if (this.multipleSelection < 1) {
        this.$message({
          message: "Please select a record",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      let showStatus = 0;
      if (this.operateType === "showBrand") {
        showStatus = 1;
      } else if (this.operateType === "hideBrand") {
        showStatus = 0;
      } else {
        this.$message({
          message: "Please select the batch operation type",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      let ids = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].id);
      }
      let data = new URLSearchParams();
      data.append("ids", ids);
      data.append("showStatus", showStatus);
      updateShowStatus(data).then((response) => {
        this.getList();
        this.$message({
          message: "Modification was successful",
          type: "success",
          duration: 1000,
        });
      });
    },
    addBrand() {
      this.$router.push({ path: "/pms/addBrand" });
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
