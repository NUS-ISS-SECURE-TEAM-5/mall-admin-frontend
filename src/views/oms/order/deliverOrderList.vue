<template>
   
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Shipping list</span>
    </el-card>
    <div class="table-container">
      <el-table ref="deliverOrderTable" style="width: 100%" :data="list" border>
        <el-table-column label="Order number" width="180" align="center">
          <template v-slot="{ row }">{{ row.orderSn }}</template>
        </el-table-column>
        <el-table-column label="consignee" width="180" align="center">
          <template v-slot="{ row }">{{ row.receiverName }}</template>
        </el-table-column>
        <el-table-column label="phone number" width="160" align="center">
          <template v-slot="{ row }">{{ row.receiverPhone }}</template>
        </el-table-column>
        <el-table-column label="postal code" width="160" align="center">
          <template v-slot="{ row }">{{ row.receiverPostCode }}</template>
        </el-table-column>
        <el-table-column label="Shipping address" align="center">
          <template v-slot="{ row }">{{ row.address }}</template>
        </el-table-column>
        <el-table-column label="Delivery method" width="160" align="center">
          <template v-slot="{ row }">
            <el-select
              placeholder="Please choose a logistics company"
              v-model="row.deliveryCompany"
              size="small"
            >
              <el-option
                v-for="item in companyOptions"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="Logistics Order Number"
          width="180"
          align="center"
        >
          <template v-slot="{ row }">
            <el-input size="small" v-model="row.deliverySn"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 15px; text-align: center">
        <el-button @click="cancel">Cancel</el-button>
        <el-button @click="confirm" type="primary">Confirm</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { deliveryOrder } from "@/api/order";
const defaultLogisticsCompanies = [
  "顺丰快递",
  "圆通快递",
  "中通快递",
  "韵达快递",
];
export default {
  name: "deliverOrderList",
  data() {
    return {
      list: [],
      companyOptions: defaultLogisticsCompanies,
    };
  },
  created() {
    try {
      const listData = this.$route.query.list;
      if (listData) {
        this.list = JSON.parse(listData); // 反序列化为数组
      } else {
        this.list = [];
      }
    } catch (error) {
      console.error("Failed to parse order data:", error);
      this.list = [];
    }
  },
  methods: {
    cancel() {
      this.$router.back();
    },
    confirm() {
      this.$confirm("Do you want to perform a shipping operation?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          deliveryOrder(this.list).then((response) => {
            this.$router.back();
            this.$message({
              type: "success",
              message: "Successful shipment!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Delivery cancelled",
          });
        });
    },
  },
};
</script>
<style></style>
