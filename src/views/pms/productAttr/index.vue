<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">Data list</span>
      <el-button class="btn-add" @click="addProductAttrCate()" size="mini">
        Add
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="productAttrCateTable"
        style="width: 100%"
        :data="list"
        v-loading="listLoading"
        border
      >
        <el-table-column label="ID" width="100" align="center">
          <template v-slot="{ row }">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="Type Name" align="center">
          <template v-slot="{ row }">{{ row.name }}</template>
        </el-table-column>
        <el-table-column
          label="Number of attributes"
          width="200"
          align="center"
        >
          <template v-slot="{ row }">{{
            row.attributeCount == null ? 0 : row.attributeCount
          }}</template>
        </el-table-column>
        <el-table-column
          label="Number of parameters"
          width="200"
          align="center"
        >
          <template v-slot="{ row }">{{
            row.paramCount == null ? 0 : row.paramCount
          }}</template>
        </el-table-column>
        <el-table-column label="Settings" width="200" align="center">
          <template v-slot="{ row, $index }">
            <el-button size="mini" @click="getAttrList($index, row)"
              >Property List
            </el-button>
            <el-button size="mini" @click="getParamList($index, row)">
              Parameter list
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="200" align="center">
          <template v-slot="{ row, $index }">
            <el-button size="mini" @click="handleUpdate(row)">Edit </el-button>
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
    <el-dialog
      :title="dialogTitle"
      :model-value="dialogVisible"
      @update:model-value="(val) => (dialogVisible = val)"
      :before-close="handleClose"
      width="30%"
    >
      <el-form
        ref="productAttrCatForm"
        :model="productAttrCate"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="Type Name" prop="name">
          <el-input
            v-model="productAttrCate.name"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm('productAttrCatForm')"
          >Confirm</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchList,
  createProductAttrCate,
  deleteProductAttrCate,
  updateProductAttrCate,
} from "@/api/productAttrCate";

export default {
  name: "productAttrCateList",
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 5,
      },
      dialogVisible: false,
      dialogTitle: "",
      productAttrCate: {
        name: "",
        id: null,
      },
      rules: {
        name: [
          {
            required: true,
            message: "Please enter a type name",
            trigger: "blur",
          },
        ],
      },
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
      });
    },
    addProductAttrCate() {
      this.dialogVisible = true;
      this.dialogTitle = "Add Type";
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
    handleDelete(index, row) {
      this.$confirm("Do you want to delete the brand?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          deleteProductAttrCate(row.id).then((response) => {
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
    handleUpdate(row) {
      this.dialogVisible = true;
      this.dialogTitle = "Edit Type";
      this.productAttrCate.name = row.name;
      this.productAttrCate.id = row.id;
    },
    getAttrList(index, row) {
      this.$router.push({
        path: "/pms/productAttrList",
        query: { cid: row.id, cname: row.name, type: 0 },
      });
    },
    getParamList(index, row) {
      this.$router.push({
        path: "/pms/productAttrList",
        query: { cid: row.id, cname: row.name, type: 1 },
      });
    },
    handleConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = new URLSearchParams();
          data.append("name", this.productAttrCate.name);
          if (this.dialogTitle === "Add type") {
            createProductAttrCate(data).then((response) => {
              this.$message({
                message: "Added successfully",
                type: "success",
                duration: 1000,
              });
              this.dialogVisible = false;
              this.getList();
            });
          } else {
            updateProductAttrCate(this.productAttrCate.id, data).then(
              (response) => {
                this.$message({
                  message: "Modified successfully",
                  type: "success",
                  duration: 1000,
                });
                this.dialogVisible = false;
                this.getList();
              }
            );
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleClose() {
      if (!this.dialogVisible && this.$refs.productAttrCatForm) {
        this.$refs.productAttrCatForm.clearValidate();
      }
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
