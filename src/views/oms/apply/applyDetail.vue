<template>
  <div class="detail-container">
    <el-card shadow="never">
      <span class="font-title-medium">Returned goods</span>
      <el-table
        border
        class="standard-margin"
        ref="productTable"
        :data="productList"
      >
        <el-table-column label="Product pictures" width="160" align="center">
          <template v-slot="{ row }">
            <img style="height: 80px" :src="row.productPic" />
          </template>
        </el-table-column>
        <el-table-column label="Product Name" align="center">
          <template v-slot="{ row }">
            <span class="font-small">{{ row.productName }}</span
            ><br />
            <span class="font-small">Product Brand:{{ row.productBrand }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Price/Item ID" width="180" align="center">
          <template v-slot="{ row }">
            <span class="font-small">Price: ${{ row.productRealPrice }}</span
            ><br />
            <span class="font-small">ID: NO.{{ row.productId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Attributes" width="180" align="center">
          <template v-slot="{ row }">{{ row.productAttr }}</template>
        </el-table-column>
        <el-table-column label="Count" width="100" align="center">
          <template v-slot="{ row }">{{ row.productCount }}</template>
        </el-table-column>
        <el-table-column label="Amount" width="100" align="center">
          <template v-slot="{ row }">￥{{ totalAmount }}</template>
        </el-table-column>
      </el-table>
      <div style="float: right; margin-top: 15px; margin-bottom: 15px">
        <span class="font-title-medium">Total amount:</span>
        <span class="font-title-medium color-danger">${{ totalAmount }}</span>
      </div>
    </el-card>
    <el-card shadow="never" class="standard-margin">
      <span class="font-title-medium">Service order information</span>
      <div class="form-container-border">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small"
            >Service order number</el-col
          >
          <el-col class="form-border font-small" :span="18">{{
            orderReturnApply.id
          }}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6"
            >Application Status</el-col
          >
          <el-col class="form-border font-small" :span="18">{{
            orderReturnApply.status | formatStatus
          }}</el-col>
        </el-row>
        <el-row>
          <el-col
            :span="6"
            class="form-border form-left-bg font-small"
            style="height: 50px; line-height: 30px"
            >Order number
          </el-col>
          <el-col
            class="form-border font-small"
            :span="18"
            style="height: 50px"
          >
            {{ orderReturnApply.orderSn }}
            <el-button type="text" size="small" @click="handleViewOrder"
              >Check</el-button
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6"
            >Application time</el-col
          >
          <el-col class="form-border font-small" :span="18">{{
            orderReturnApply.createTime | formatTime
          }}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6"
            >User account</el-col
          >
          <el-col class="form-border font-small" :span="18">{{
            orderReturnApply.memberUsername
          }}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6"
            >Contact</el-col
          >
          <el-col class="form-border font-small" :span="18">{{
            orderReturnApply.returnName
          }}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6"
            >Contact number</el-col
          >
          <el-col class="form-border font-small" :span="18">{{
            orderReturnApply.returnPhone
          }}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6"
            >Reason for return</el-col
          >
          <el-col class="form-border font-small" :span="18">{{
            orderReturnApply.reason
          }}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6"
            >Problem description</el-col
          >
          <el-col class="form-border font-small" :span="18">{{
            orderReturnApply.description
          }}</el-col>
        </el-row>
        <el-row>
          <el-col
            class="form-border form-left-bg font-small"
            :span="6"
            style="height: 100px; line-height: 80px"
            >Pictures
          </el-col>
          <el-col
            class="form-border font-small"
            :span="18"
            style="height: 100px"
          >
            <img
              v-for="item in proofPics"
              style="width: 80px; height: 80px"
              :src="item"
            />
          </el-col>
        </el-row>
      </div>
      <div class="form-container-border">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6"
            >Order amount</el-col
          >
          <el-col class="form-border font-small" :span="18"
            >$ {{ totalAmount }}</el-col
          >
        </el-row>
        <el-row>
          <el-col
            class="form-border form-left-bg font-small"
            :span="6"
            style="height: 52px; line-height: 32px"
            >Confirm refund amount
          </el-col>
          <el-col
            class="form-border font-small"
            style="height: 52px"
            :span="18"
          >
            $
            <el-input
              size="small"
              v-model="updateStatusParam.returnAmount"
              :disabled="orderReturnApply.status !== 0"
              style="width: 200px; margin-left: 10px"
            ></el-input>
          </el-col>
        </el-row>
        <div v-show="orderReturnApply.status !== 3">
          <el-row>
            <el-col
              class="form-border form-left-bg font-small"
              :span="6"
              style="height: 52px; line-height: 32px"
              >Select a delivery point
            </el-col>
            <el-col
              class="form-border font-small"
              style="height: 52px"
              :span="18"
            >
              <el-select
                size="small"
                style="width: 200px"
                :disabled="orderReturnApply.status !== 0"
                v-model="updateStatusParam.companyAddressId"
              >
                <el-option
                  v-for="address in companyAddressList"
                  :key="address.id"
                  :value="address.id"
                  :label="address.addressName"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="form-border form-left-bg font-small" :span="6"
              >Name of the consignee</el-col
            >
            <el-col class="form-border font-small" :span="18">{{
              currentAddress.name
            }}</el-col>
          </el-row>
          <el-row>
            <el-col class="form-border form-left-bg font-small" :span="6"
              >Area</el-col
            >
            <el-col class="form-border font-small" :span="18">{{
              currentAddress | formatRegion
            }}</el-col>
          </el-row>
          <el-row>
            <el-col class="form-border form-left-bg font-small" :span="6"
              >Detailed address</el-col
            >
            <el-col class="form-border font-small" :span="18">{{
              currentAddress.detailAddress
            }}</el-col>
          </el-row>
          <el-row>
            <el-col class="form-border form-left-bg font-small" :span="6"
              >Contact number</el-col
            >
            <el-col class="form-border font-small" :span="18">{{
              currentAddress.phone
            }}</el-col>
          </el-row>
        </div>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status !== 0">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6"
            >Processors</el-col
          >
          <el-col class="form-border font-small" :span="18">{{
            orderReturnApply.handleMan
          }}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6"
            >Processing time</el-col
          >
          <el-col class="form-border font-small" :span="18">{{
            orderReturnApply.handleTime | formatTime
          }}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6"
            >Processing Notes</el-col
          >
          <el-col class="form-border font-small" :span="18">{{
            orderReturnApply.handleNote
          }}</el-col>
        </el-row>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status === 2">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6"
            >Consignee</el-col
          >
          <el-col class="form-border font-small" :span="18">{{
            orderReturnApply.receiveMan
          }}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6"
            >Received time</el-col
          >
          <el-col class="form-border font-small" :span="18">{{
            orderReturnApply.receiveTime | formatTime
          }}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6"
            >Received Notes</el-col
          >
          <el-col class="form-border font-small" :span="18">{{
            orderReturnApply.receiveNote
          }}</el-col>
        </el-row>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status === 0">
        <el-row>
          <el-col
            class="form-border form-left-bg font-small"
            :span="6"
            style="height: 52px; line-height: 32px"
            >Processing Notes</el-col
          >
          <el-col class="form-border font-small" :span="18">
            <el-input
              size="small"
              v-model="updateStatusParam.handleNote"
              style="width: 200px; margin-left: 10px"
            ></el-input>
          </el-col>
        </el-row>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status === 1">
        <el-row>
          <el-col
            class="form-border form-left-bg font-small"
            :span="6"
            style="height: 52px; line-height: 32px"
            >Received Notes</el-col
          >
          <el-col class="form-border font-small" :span="18">
            <el-input
              size="small"
              v-model="updateStatusParam.receiveNote"
              style="width: 200px; margin-left: 10px"
            ></el-input>
          </el-col>
        </el-row>
      </div>
      <div
        style="margin-top: 15px; text-align: center"
        v-show="orderReturnApply.status === 0"
      >
        <el-button type="primary" size="small" @click="handleUpdateStatus(1)"
          >Confirm the return</el-button
        >
        <el-button type="danger" size="small" @click="handleUpdateStatus(3)"
          >Refuse to return</el-button
        >
      </div>
      <div
        style="margin-top: 15px; text-align: center"
        v-show="orderReturnApply.status === 1"
      >
        <el-button type="primary" size="small" @click="handleUpdateStatus(2)"
          >Confirm delivered</el-button
        >
      </div>
    </el-card>
  </div>
</template>
<script>
import { getApplyDetail, updateApplyStatus } from "@/api/returnApply";
import { fetchList } from "@/api/companyAddress";
import { formatDate } from "@/utils/date";

const defaultUpdateStatusParam = {
  companyAddressId: null,
  handleMan: "admin",
  handleNote: null,
  receiveMan: "admin",
  receiveNote: null,
  returnAmount: 0,
  status: 0,
};
const defaultOrderReturnApply = {
  id: null,
  orderId: null,
  companyAddressId: null,
  productId: null,
  orderSn: null,
  createTime: null,
  memberUsername: null,
  returnAmount: null,
  returnName: null,
  returnPhone: null,
  status: null,
  handleTime: null,
  productPic: null,
  productName: null,
  productBrand: null,
  productAttr: null,
  productCount: null,
  productPrice: null,
  productRealPrice: null,
  reason: null,
  description: null,
  proofPics: null,
  handleNote: null,
  handleMan: null,
  receiveMan: null,
  receiveTime: null,
  receiveNote: null,
};
export default {
  name: "returnApplyDetail",
  data() {
    return {
      id: null,
      orderReturnApply: Object.assign({}, defaultOrderReturnApply),
      productList: null,
      proofPics: null,
      updateStatusParam: Object.assign({}, defaultUpdateStatusParam),
      companyAddressList: null,
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getDetail();
  },
  computed: {
    totalAmount() {
      if (this.orderReturnApply != null) {
        return (
          this.orderReturnApply.productRealPrice *
          this.orderReturnApply.productCount
        );
      } else {
        return 0;
      }
    },
    currentAddress() {
      console.log("currentAddress()");
      let id = this.updateStatusParam.companyAddressId;
      if (this.companyAddressList == null) return {};
      for (let i = 0; i < this.companyAddressList.length; i++) {
        let address = this.companyAddressList[i];
        if (address.id === id) {
          return address;
        }
      }
      return null;
    },
  },
  filters: {
    formatStatus(status) {
      if (status === 0) {
        return "Pending";
      } else if (status === 1) {
        return "Returning";
      } else if (status === 2) {
        return "Completed";
      } else {
        return "Rejected";
      }
    },
    formatTime(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    formatRegion(address) {
      let str = address.province;
      if (address.city != null) {
        str += "  " + address.city;
      }
      str += "  " + address.region;
      return str;
    },
  },
  methods: {
    handleViewOrder() {
      this.$router.push({
        path: "/oms/orderDetail",
        query: { id: this.orderReturnApply.orderId },
      });
    },
    getDetail() {
      getApplyDetail(this.id).then((response) => {
        console.log("getDetail");
        this.orderReturnApply = response.data;
        this.productList = [];
        this.productList.push(this.orderReturnApply);
        if (this.orderReturnApply.proofPics != null) {
          this.proofPics = this.orderReturnApply.proofPics.split(",");
        }
        //退货中和完成
        if (
          this.orderReturnApply.status === 1 ||
          this.orderReturnApply.status === 2
        ) {
          this.updateStatusParam.returnAmount =
            this.orderReturnApply.returnAmount;
          this.updateStatusParam.companyAddressId =
            this.orderReturnApply.companyAddressId;
        }
        this.getCompanyAddressList();
      });
    },
    getCompanyAddressList() {
      fetchList().then((response) => {
        console.log("getCompanyAddressList()");
        this.companyAddressList = response.data;
        for (let i = 0; i < this.companyAddressList.length; i++) {
          if (
            this.companyAddressList[i].receiveStatus === 1 &&
            this.orderReturnApply.status === 0
          ) {
            this.updateStatusParam.companyAddressId =
              this.companyAddressList[i].id;
          }
        }
      });
    },
    handleUpdateStatus(status) {
      this.updateStatusParam.status = status;
      this.$confirm("Do you want to do this?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        updateApplyStatus(this.id, this.updateStatusParam).then((response) => {
          this.$message({
            type: "success",
            message: "Operation was successful!",
            duration: 1000,
          });
          this.$router.back();
        });
      });
    },
  },
};
</script>
<style scoped>
.detail-container {
  position: absolute;
  left: 0;
  right: 0;
  width: 1080px;
  padding: 35px 35px 15px 35px;
  margin: 20px auto;
}

.standard-margin {
  margin-top: 15px;
}
.form-border {
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  padding: 10px;
}

.form-container-border {
  border-left: 1px solid #dcdfe6;
  border-top: 1px solid #dcdfe6;
  margin-top: 15px;
}

.form-left-bg {
  background: #f2f6fc;
}
</style>
