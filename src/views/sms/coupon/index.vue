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
          ><el-form-item label="Coupon name:">
            <el-input
              v-model="listQuery.name"
              class="input-width"
              placeholder="Coupon Name"
            ></el-input>
          </el-form-item>
          <el-form-item label="Coupon Type:">
            <el-select
              v-model="listQuery.type"
              placeholder="All"
              Clearable
              class="input-width"
            >
              <el-option
                v-for="item in typeOptions"
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
      <el-button size="mini" class="btn-add" @click="handleAdd()"
        >Add</el-button
      >
    </el-card>
    <div class="table-container">
      <el-table
        ref="couponTable"
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
          <template v-slot="{ row }">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="Coupon name" align="center">
          <template v-slot="{ row }">{{ row.name }}</template>
        </el-table-column>
        <el-table-column label="Coupon Type" width="100" align="center">
          <template v-slot="{ row }">{{ row.type | formatType }}</template>
        </el-table-column>
        <el-table-column label="Products available" width="100" align="center">
          <template v-slot="{ row }">{{
            row.useType | formatUseType
          }}</template>
        </el-table-column>
        <el-table-column label="Threshold for use" width="140" align="center">
          <template v-slot="{ row }"
            >Full {{ row.minPoint }} elements available</template
          >
        </el-table-column>
        <el-table-column label="Face value " width="100" align="center">
          <template v-slot="{ row }">{{ row.amount }}Menu</template>
        </el-table-column>
        <el-table-column label="Applicable platform" width="100" align="center">
          <template v-slot="{ row }">{{
            row.platform | formatPlatform
          }}</template>
        </el-table-column>
        <el-table-column label="Validity period" width="180" align="center">
          <template v-slot="{ row }"
            >{{ row.startTime | formatDate }}to{{
              row.endTime | formatDate
            }}</template
          >
        </el-table-column>
        <el-table-column label="state" width="100" align="center">
          <template v-slot="{ row }">{{ row.endTime | formatStatus }}</template>
        </el-table-column>
        <el-table-column label="operate" width="180" align="center">
          <template v-slot="{ row, $index }">
            <el-button size="mini" type="text" @click="handleView($index, row)"
              >Check</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate($index, row)"
            >
              Edit</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleDelete($index, row)"
              >Delete</el-button
            >
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
  </div>
</template>
<script>
import { fetchList, deleteCoupon } from "@/api/coupon";
import { formatDate } from "@/utils/date";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  name: null,
  type: null,
};
const defaultTypeOptions = [
  {
    label: "Coupons are given for the whole audience",
    value: 0,
  },
  {
    label: "Member coupon",
    value: 1,
  },
  {
    label: "Shopping coupon",
    value: 2,
  },
  {
    label: "Register coupon",
    value: 3,
  },
];
export default {
  name: "couponList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      typeOptions: Object.assign({}, defaultTypeOptions),
      list: null,
      total: null,
      listLoading: false,
      multipleSelection: [],
    };
  },
  created() {
    this.getList();
  },
  filters: {
    formatType(type) {
      for (let i = 0; i < defaultTypeOptions.length; i++) {
        if (type === defaultTypeOptions[i].value) {
          return defaultTypeOptions[i].label;
        }
      }
      return "";
    },
    formatUseType(useType) {
      if (useType === 0) {
        return "Universal for the whole audience";
      } else if (useType === 1) {
        return "Specify classification";
      } else {
        return "Specified product";
      }
    },
    formatPlatform(platform) {
      if (platform === 1) {
        return "mobile platform";
      } else if (platform === 2) {
        return "PC platform";
      } else {
        return "full platform";
      }
    },
    formatDate(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    formatStatus(endTime) {
      let now = new Date().getTime();
      let endDate = new Date(endTime);
      if (endDate > now) {
        return "Not expired";
      } else {
        return "Expired";
      }
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
      this.$router.push({ path: "/sms/addCoupon" });
    },
    handleView(index, row) {
      this.$router.push({ path: "/sms/couponHistory", query: { id: row.id } });
    },
    handleUpdate(index, row) {
      this.$router.push({ path: "/sms/updateCoupon", query: { id: row.id } });
    },
    handleDelete(index, row) {
      this.$confirm("Is it necessary to delete it?", "Prompt", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          deleteCoupon(row.id).then((response) => {
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
<style scoped>
.input-width {
  width: 203px;
}
</style>
