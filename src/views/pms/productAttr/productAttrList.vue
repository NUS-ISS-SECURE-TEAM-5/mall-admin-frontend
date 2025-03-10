<template>
   
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">Data list</span>
      <el-button class="btn-add" @click="addProductAttr()" size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="productAttrTable"
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
        <el-table-column label="ID" width="100" align="center">
          <template v-slot="{ row }">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="Attribute name" width="140" align="center">
          <template v-slot="{ row }">{{ row.name }}</template>
        </el-table-column>
        <el-table-column label="Product Type" width="140" align="center">
          <template v-slot="{ row }">{{ $route.query.cname }}</template>
        </el-table-column>
        <el-table-column
          label="Is the attribute optional?"
          width="120"
          align="center"
        >
          <template v-slot="{ row }">{{
            row.selectType | selectTypeFilter
          }}</template>
        </el-table-column>
        <el-table-column
          label="How to enter attribute values"
          width="150"
          align="center"
        >
          <template v-slot="{ row }">{{
            row.inputType | inputTypeFilter
          }}</template>
        </el-table-column>
        <el-table-column label="Optional value list" align="center">
          <template v-slot="{ row }">{{ row.inputList }}</template>
        </el-table-column>
        <el-table-column label="Sort" width="100" align="center">
          <template v-slot="{ row }">{{ row.sort }}</template>
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
import { fetchList, deleteProductAttr } from "@/api/productAttr";

export default {
  name: "productAttrList",
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 5,
        type: this.$route.query.type,
      },
      operateType: null,
      multipleSelection: [],
      operates: [
        {
          label: "Delete",
          value: "deleteProductAttr",
        },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.$route.query.cid, this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    addProductAttr() {
      this.$router.push({
        path: "/pms/addProductAttr",
        query: { cid: this.$route.query.cid, type: this.$route.query.type },
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleBatchOperate() {
      if (this.multipleSelection < 1) {
        this.$message({
          message: "Please select a record",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      if (this.operateType !== "deleteProductAttr") {
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
      this.handleDeleteProductAttr(ids);
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
    handleUpdate(index, row) {
      this.$router.push({
        path: "/pms/updateProductAttr",
        query: { id: row.id },
      });
    },
    handleDeleteProductAttr(ids) {
      this.$confirm("Whether to delete the attribute", "tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        let data = new URLSearchParams();
        data.append("ids", ids);
        deleteProductAttr(data).then((response) => {
          this.$message({
            message: "Delete successfully",
            type: "success",
            duration: 1000,
          });
          this.getList();
        });
      });
    },
    handleDelete(index, row) {
      let ids = [];
      ids.push(row.id);
      this.handleDeleteProductAttr(ids);
    },
  },
  filters: {
    inputTypeFilter(value) {
      if (value === 1) {
        return "Select from the list";
      } else {
        return "Manual input";
      }
    },
    selectTypeFilter(value) {
      if (value === 1) {
        return "single choice";
      } else if (value === 2) {
        return "multiple choice";
      } else {
        return "unique";
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
