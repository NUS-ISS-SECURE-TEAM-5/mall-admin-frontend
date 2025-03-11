<template>
   
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Data list</span>
      <el-button
        size="mini"
        class="btn-add"
        @click="handleSelectProduct()"
        style="margin-left: 20px"
        >Add</el-button
      >
    </el-card>
    <div class="table-container">
      <el-table
        ref="productRelationTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="serial number" width="100" align="center">
          <template v-slot="{ row }">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="Product Name" align="center">
          <template v-slot="{ row }">{{ row.product.name }}</template>
        </el-table-column>
        <el-table-column label="Product number" width="140" align="center">
          <template v-slot="{ row }">NO.{{ row.product.productSn }}</template>
        </el-table-column>
        <el-table-column label="Product price" width="100" align="center">
          <template v-slot="{ row }">￥{{ row.product.price }}</template>
        </el-table-column>
        <el-table-column label="Remaining quantity" width="100" align="center">
          <template v-slot="{ row }">{{ row.product.stock }}</template>
        </el-table-column>
        <el-table-column label="Flash sale price" width="100" align="center">
          <template v-slot="{ row }">
            <p v-if="row.flashPromotionPrice !== null">
              ￥{{ row.flashPromotionPrice }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="Number of seckills" width="100" align="center">
          <template v-slot="{ row }">{{ row.flashPromotionCount }}</template>
        </el-table-column>
        <el-table-column
          label="Limited purchase quantity"
          width="100"
          align="center"
        >
          <template v-slot="{ row }">{{ row.flashPromotionLimit }}</template>
        </el-table-column>
        <el-table-column label="Sort" width="100" align="center">
          <template v-slot="{ row }">{{ row.sort }}</template>
        </el-table-column>
        <el-table-column label="operate" width="100" align="center">
          <template v-slot="{ row, $index }">
            <el-button size="mini" type="text" @click="handleUpdate(row)"
              >edit
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
      title="Select Product"
      :model-value="selectDialogVisible"
      @update:model-value="(val) => (selectDialogVisible = val)"
      width="50%"
    >
      <el-input
        v-model="dialogData.listQuery.keyword"
        style="width: 250px; margin-bottom: 20px"
        size="small"
        placeholder="Product Name Search"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleSelectSearch()"
        ></el-button>
      </el-input>
      <el-table
        :data="dialogData.list"
        @selection-change="handleDialogSelectionChange"
        border
      >
        <el-table-column
          type="selection"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column label="Product Name" align="center">
          <template v-slot="{ row }">{{ row.name }}</template>
        </el-table-column>
        <el-table-column label="Product number" width="160" align="center">
          <template v-slot="{ row }">NO.{{ row.productSn }}</template>
        </el-table-column>
        <el-table-column label="price" width="120" align="center">
          <template v-slot="{ row }">￥{{ row.price }}</template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleDialogSizeChange"
          @current-change="handleDialogCurrentChange"
          layout="prev, pager, next"
          :current-page.sync="dialogData.listQuery.pageNum"
          :page-size="dialogData.listQuery.pageSize"
          :page-sizes="[5, 10, 15]"
          :total="dialogData.total"
        >
        </el-pagination>
      </div>
      <div style="clear: both"></div>
      <div slot="footer">
        <el-button size="small" @click="selectDialogVisible = false"
          >Cancel</el-button
        >
        <el-button
          size="small"
          type="primary"
          @click="handleSelectDialogConfirm()"
          >Sure</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="Edit flash sale product information"
      :model-value="editDialogVisible"
      @update:model-value="(val) => (editDialogVisible = val)"
      width="40%"
    >
      <el-form
        :model="flashProductRelation"
        ref="flashProductRelationForm"
        label-width="150px"
        size="small"
      >
        <el-form-item label="Product Name:">
          <span>{{ flashProductRelation.product.name }}</span>
        </el-form-item>
        <el-form-item label="Article number:">
          <span>NO.{{ flashProductRelation.product.productSn }}</span>
        </el-form-item>
        <el-form-item label="Product price:">
          <span>￥{{ flashProductRelation.product.price }}</span>
        </el-form-item>
        <el-form-item label="Flash sale price:">
          <el-input
            v-model="flashProductRelation.flashPromotionPrice"
            class="input-width"
          >
            <template slot="prepend">￥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="Remaining quantity:">
          <span>{{ flashProductRelation.product.stock }}</span>
        </el-form-item>
        <el-form-item label="Number of seckills:">
          <el-input
            v-model="flashProductRelation.flashPromotionCount"
            class="input-width"
          ></el-input>
        </el-form-item>
        <el-form-item label="Limited purchase quantity:">
          <el-input
            v-model="flashProductRelation.flashPromotionLimit"
            class="input-width"
          ></el-input>
        </el-form-item>
        <el-form-item label="Sort by:">
          <el-input
            v-model="flashProductRelation.sort"
            class="input-width"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small"
          >Cancel</el-button
        >
        <el-button
          type="primary"
          @click="handleEditDialogConfirm()"
          size="small"
          >Sure</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchList,
  createFlashProductRelation,
  deleteFlashProductRelation,
  updateFlashProductRelation,
} from "@/api/flashProductRelation";
import { fetchList as fetchProductList } from "@/api/product";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  flashPromotionId: null,
  flashPromotionSessionId: null,
};
export default {
  name: "flashPromotionProductRelationList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      selectDialogVisible: false,
      dialogData: {
        list: null,
        total: null,
        multipleSelection: [],
        listQuery: {
          keyword: null,
          pageNum: 1,
          pageSize: 5,
        },
      },
      editDialogVisible: false,
      flashProductRelation: {
        product: {},
      },
    };
  },
  created() {
    this.listQuery.flashPromotionId = this.$route.query.flashPromotionId;
    this.listQuery.flashPromotionSessionId =
      this.$route.query.flashPromotionSessionId;
    this.getList();
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleSelectProduct() {
      this.selectDialogVisible = true;
      this.getDialogList();
    },
    handleUpdate(row) {
      this.editDialogVisible = true;
      this.flashProductRelation = Object.assign({}, row);
    },
    handleDelete(index, row) {
      this.$confirm("Do you want to delete the product?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          deleteFlashProductRelation(row.id).then((response) => {
            this.$message({
              type: "success",
              message: "Delete successfully!",
            });
            this.getList();
          });
        })
        .catch(() => {});
    },
    handleSelectSearch() {
      this.getDialogList();
    },
    handleDialogSizeChange(val) {
      this.dialogData.listQuery.pageNum = 1;
      this.dialogData.listQuery.pageSize = val;
      this.getDialogList();
    },
    handleDialogCurrentChange(val) {
      this.dialogData.listQuery.pageNum = val;
      this.getDialogList();
    },
    handleDialogSelectionChange(val) {
      this.dialogData.multipleSelection = val;
    },
    handleSelectDialogConfirm() {
      if (this.dialogData.multipleSelection < 1) {
        this.$message({
          message: "Please select a record",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      let selectProducts = [];
      for (let i = 0; i < this.dialogData.multipleSelection.length; i++) {
        selectProducts.push({
          productId: this.dialogData.multipleSelection[i].id,
          flashPromotionId: this.listQuery.flashPromotionId,
          flashPromotionSessionId: this.listQuery.flashPromotionSessionId,
        });
      }
      this.$confirm("Use to add?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        createFlashProductRelation(selectProducts).then((response) => {
          this.selectDialogVisible = false;
          this.dialogData.multipleSelection = [];
          this.getList();
          this.$message({
            type: "success",
            message: "Added successfully!",
          });
        });
      });
    },
    handleEditDialogConfirm() {
      this.$confirm("Do you want to confirm?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        updateFlashProductRelation(
          this.flashProductRelation.id,
          this.flashProductRelation
        ).then((response) => {
          this.$message({
            message: "Modification was successful!",
            type: "success",
          });
          this.editDialogVisible = false;
          this.getList();
        });
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
    getDialogList() {
      fetchProductList(this.dialogData.listQuery).then((response) => {
        this.dialogData.list = response.data.list;
        this.dialogData.total = response.data.total;
      });
    },
  },
};
</script>
<style scoped>
.operate-container {
  margin-top: 0;
}
.input-width {
  width: 200px;
}
</style>
