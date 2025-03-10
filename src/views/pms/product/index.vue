<template>
   
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>Filter Search</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small"
        >
          Query results
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
              style="width: 203px"
              v-model="listQuery.keyword"
              placeholder="Product Name"
            ></el-input>
          </el-form-item>
          <el-form-item label="Product item number:">
            <el-input
              style="width: 203px"
              v-model="listQuery.productSn"
              placeholder="Product No."
            ></el-input>
          </el-form-item>
          <el-form-item label="Product Category:">
            <el-cascader
              Clearable
              v-model="selectProductCateValue"
              :options="productCateOptions"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="Product Brand:">
            <el-select
              v-model="listQuery.brandId"
              placeholder="Please select a brand"
              Clearable
            >
              <el-option
                v-for="item in brandOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Setting status:">
            <el-select
              v-model="listQuery.publishStatus"
              placeholder="All"
              clearable
            >
              <el-option
                v-for="item in publishStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Review status:">
            <el-select
              v-model="listQuery.verifyStatus"
              placeholder="All"
              clearable
            >
              <el-option
                v-for="item in verifyStatusOptions"
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
      <el-button class="btn-add" @click="handleAddProduct()" size="mini">
        Add
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="productTable"
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
        <el-table-column label="serial number" width="100" align="center">
          <template #default="{ row }">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="Product pictures" width="120" align="center">
          <template #default="{ row }"
            ><img style="height: 80px" :src="row.pic"
          /></template>
        </el-table-column>
        <el-table-column label="Product Name" align="center">
          <template #default="{ row }">
            <p>{{ row.name }}</p>
            <p>品牌：{{ row.brandName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="Price/item number" width="120" align="center">
          <template #default="{ row }">
            <p>价格：￥{{ row.price }}</p>
            <p>货号：{{ row.productSn }}</p>
          </template>
        </el-table-column>
        <el-table-column label="Label" width="140" align="center">
          <template #default="{ row, $index }">
            <p>
              Publish:
              <el-switch
                @change="handlePublishStatusChange($index, row)"
                :active-value="1"
                :inactive-value="0"
                v-model="row.publishStatus"
              >
              </el-switch>
            </p>
            <p>
              New:
              <el-switch
                @change="handleNewStatusChange($index, row)"
                :active-value="1"
                :inactive-value="0"
                v-model="row.newStatus"
              >
              </el-switch>
            </p>
            <p>
              Recommends:
              <el-switch
                @change="handleRecommendStatusChange($index, row)"
                :active-value="1"
                :inactive-value="0"
                v-model="row.recommandStatus"
              >
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="Sort" width="100" align="center">
          <template #default="{ row }">{{ row.sort }}</template>
        </el-table-column>
        <el-table-column label="SKU Stock" width="100" align="center">
          <template #default="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleShowSkuEditDialog(row)"
              circle
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="Sales" width="100" align="center">
          <template #default="{ row }">{{ row.sale }}</template>
        </el-table-column>
        <el-table-column label="Review status" width="100" align="center">
          <template #default="{ row, $index }">
            <p>{{ row.verifyStatus | verifyStatusFilter }}</p>
            <p>
              <el-button
                type="text"
                @click="handleShowVerifyDetail($index, row)"
                >Review details
              </el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="160" align="center">
          <template #default="{ row, $index }">
            <p>
              <el-button size="mini" @click="handleShowProduct($index, row)"
                >Check
              </el-button>
              <el-button size="mini" @click="handleUpdateProduct($index, row)"
                >Edit
              </el-button>
            </p>
            <p>
              <el-button size="mini" @click="handleShowLog($index, row)"
                >Log
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete($index, row)"
                >Delete
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select size="small" v-model="operateType" placeholder="批量Operation">
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
    <el-dialog
      title="Edit Product Information"
      :model-value="editSkuInfo.dialogVisible"
      @update:model-value="(val) => (editSkuInfo.dialogVisible = val)"
      width="40%"
    >
      <span>Product number:</span>
      <span>{{ editSkuInfo.productSn }}</span>
      <el-input
        placeholder="Search by sku number"
        v-model="editSkuInfo.keyword"
        size="small"
        style="width: 50%; margin-left: 20px"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleSearchEditSku"
        ></el-button>
      </el-input>
      <el-table
        style="width: 100%; margin-top: 20px"
        :data="editSkuInfo.stockList"
        border
      >
        <el-table-column label="SKU number" align="center">
          <template #default="{ row }">
            <el-input v-model="row.skuCode"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in editSkuInfo.productAttr"
          :label="item.name"
          :key="item.id"
          align="center"
        >
          <template #default="{ row }">
            {{ getProductSkuSp(row, index) }}
          </template>
        </el-table-column>
        <el-table-column label="Sales price" width="80" align="center">
          <template #default="{ row }">
            <el-input v-model="row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="Product inventory" width="80" align="center">
          <template #default="{ row }">
            <el-input v-model="row.stock"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="Inventory warning value"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-input v-model="row.lowStock"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSkuInfo.dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleEditSkuConfirm"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchList,
  updateDeleteStatus,
  updateNewStatus,
  updateRecommendStatus,
  updatePublishStatus,
} from "@/api/product";
import {
  fetchList as fetchSkuStockList,
  update as updateSkuStockList,
} from "@/api/skuStock";
import { fetchList as fetchProductAttrList } from "@/api/productAttr";
import { fetchList as fetchBrandList } from "@/api/brand";
import { fetchListWithChildren } from "@/api/productCate";

const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 5,
  publishStatus: null,
  verifyStatus: null,
  productSn: null,
  productCategoryId: null,
  brandId: null,
};
export default {
  name: "productList",
  data() {
    return {
      editSkuInfo: {
        dialogVisible: false,
        productId: null,
        productSn: "",
        productAttributeCategoryId: null,
        stockList: [],
        productAttr: [],
        keyword: null,
      },
      operates: [
        {
          label: "Products are on the shelves",
          value: "publishOn",
        },
        {
          label: "Product removed",
          value: "publishOff",
        },
        {
          label: "Set as recommended",
          value: "recommendOn",
        },
        {
          label: "Cancel recommendation",
          value: "recommendOff",
        },
        {
          label: "Set as new product",
          value: "newOn",
        },
        {
          label: "Cancel new product",
          value: "newOff",
        },
        {
          label: "Transfer to classification",
          value: "transferCategory",
        },
        {
          label: "Move into the recycling bin",
          value: "recycle",
        },
      ],
      operateType: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true,
      selectProductCateValue: null,
      multipleSelection: [],
      productCateOptions: [],
      brandOptions: [],
      publishStatusOptions: [
        {
          value: 1,
          label: "Published",
        },
        {
          value: 0,
          label: "Unpublished",
        },
      ],
      verifyStatusOptions: [
        {
          value: 1,
          label: "Approved",
        },
        {
          value: 0,
          label: "Unreviewed",
        },
      ],
    };
  },
  created() {
    this.getList();
    this.getBrandList();
    this.getProductCateList();
  },
  watch: {
    selectProductCateValue: function (newValue) {
      if (newValue != null && newValue.length == 2) {
        this.listQuery.productCategoryId = newValue[1];
      } else {
        this.listQuery.productCategoryId = null;
      }
    },
  },
  filters: {
    verifyStatusFilter(value) {
      if (value === 1) {
        return "Reviewed and approved";
      } else {
        return "Unreviewed";
      }
    },
  },
  methods: {
    getProductSkuSp(row, index) {
      let spData = JSON.parse(row.spData);
      if (spData != null && index < spData.length) {
        return spData[index].value;
      } else {
        return null;
      }
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    getBrandList() {
      fetchBrandList({ pageNum: 1, pageSize: 100 }).then((response) => {
        this.brandOptions = [];
        let brandList = response.data.list;
        for (let i = 0; i < brandList.length; i++) {
          this.brandOptions.push({
            label: brandList[i].name,
            value: brandList[i].id,
          });
        }
      });
    },
    getProductCateList() {
      fetchListWithChildren().then((response) => {
        let list = response.data;
        this.productCateOptions = [];
        for (let i = 0; i < list.length; i++) {
          let children = [];
          if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
              children.push({
                label: list[i].children[j].name,
                value: list[i].children[j].id,
              });
            }
          }
          this.productCateOptions.push({
            label: list[i].name,
            value: list[i].id,
            children: children,
          });
        }
      });
    },
    handleShowSkuEditDialog(row) {
      this.editSkuInfo.dialogVisible = true;
      this.editSkuInfo.productId = row.id;
      this.editSkuInfo.productSn = row.productSn;
      this.editSkuInfo.productAttributeCategoryId =
        row.productAttributeCategoryId;
      this.editSkuInfo.keyword = null;
      fetchSkuStockList(row.id, { keyword: this.editSkuInfo.keyword }).then(
        (response) => {
          this.editSkuInfo.stockList = response.data;
        }
      );
      if (row.productAttributeCategoryId != null) {
        fetchProductAttrList(row.productAttributeCategoryId, { type: 0 }).then(
          (response) => {
            this.editSkuInfo.productAttr = response.data.list;
          }
        );
      }
    },
    handleSearchEditSku() {
      fetchSkuStockList(this.editSkuInfo.productId, {
        keyword: this.editSkuInfo.keyword,
      }).then((response) => {
        this.editSkuInfo.stockList = response.data;
      });
    },
    handleEditSkuConfirm() {
      if (
        this.editSkuInfo.stockList == null ||
        this.editSkuInfo.stockList.length <= 0
      ) {
        this.$message({
          message: "No sku information yet",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      this.$confirm("Whether to modify", "Tip", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        updateSkuStockList(
          this.editSkuInfo.productId,
          this.editSkuInfo.stockList
        ).then((response) => {
          this.$message({
            message: "修改成功",
            type: "success",
            duration: 1000,
          });
          this.editSkuInfo.dialogVisible = false;
        });
      });
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleAddProduct() {
      this.$router.push({ path: "/pms/addProduct" });
    },
    handleBatchOperate() {
      if (this.operateType == null) {
        this.$message({
          message: "Please select Operation type",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: "Please select the product you want to operate",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      this.$confirm("Do you want to perform this batch operation?", "Tip", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        switch (this.operateType) {
          case this.operates[0].value:
            this.updatePublishStatus(1, ids);
            break;
          case this.operates[1].value:
            this.updatePublishStatus(0, ids);
            break;
          case this.operates[2].value:
            this.updateRecommendStatus(1, ids);
            break;
          case this.operates[3].value:
            this.updateRecommendStatus(0, ids);
            break;
          case this.operates[4].value:
            this.updateNewStatus(1, ids);
            break;
          case this.operates[5].value:
            this.updateNewStatus(0, ids);
            break;
          case this.operates[6].value:
            break;
          case this.operates[7].value:
            this.updateDeleteStatus(1, ids);
            break;
          default:
            break;
        }
        this.getList();
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handlePublishStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updatePublishStatus(row.publishStatus, ids);
    },
    handleNewStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updateNewStatus(row.newStatus, ids);
    },
    handleRecommendStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updateRecommendStatus(row.recommandStatus, ids);
    },
    handleResetSearch() {
      this.selectProductCateValue = [];
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleDelete(index, row) {
      this.$confirm("Do you want to perform DeleteOperation?", "Tip", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          let ids = [];
          ids.push(row.id);
          this.updateDeleteStatus(1, ids);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Canceled Delete",
            duration: 1000,
          });
        });
    },
    handleUpdateProduct(index, row) {
      this.$router.push({ path: "/pms/updateProduct", query: { id: row.id } });
    },
    handleShowProduct(index, row) {
      console.log("handleShowProduct", row);
    },
    handleShowVerifyDetail(index, row) {
      console.log("handleShowVerifyDetail", row);
    },
    handleShowLog(index, row) {
      console.log("handleShowLog", row);
    },
    updatePublishStatus(publishStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("publishStatus", publishStatus);
      updatePublishStatus(params).then((response) => {
        this.$message({
          message: "Modification was successful",
          type: "success",
          duration: 1000,
        });
      });
    },
    updateNewStatus(newStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("newStatus", newStatus);
      updateNewStatus(params).then((response) => {
        this.$message({
          message: "Modification was successful",
          type: "success",
          duration: 1000,
        });
      });
    },
    updateRecommendStatus(recommendStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("recommendStatus", recommendStatus);
      updateRecommendStatus(params).then((response) => {
        this.$message({
          message: "Modification was successful",
          type: "success",
          duration: 1000,
        });
      });
    },
    updateDeleteStatus(deleteStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("deleteStatus", deleteStatus);
      updateDeleteStatus(params).then((response) => {
        this.$message({
          message: "Delete was successful",
          type: "success",
          duration: 1000,
        });
      });
      this.getList();
    },
  },
};
</script>
<style></style>
