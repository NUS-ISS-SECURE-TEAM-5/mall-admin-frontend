<template>
   
  <div class="detail-container">
    <div>
      <el-steps
        :active="formatStepStatus(order.status)"
        finish-status="success"
        align-center
      >
        <el-step
          title="Submit an order"
          :description="formatTime(order.createTime)"
        ></el-step>
        <el-step
          title="Pay order"
          :description="formatTime(order.paymentTime)"
        ></el-step>
        <el-step
          title="Platform Shipping"
          :description="formatTime(order.deliveryTime)"
        ></el-step>
        <el-step
          title="Confirm receipt"
          :description="formatTime(order.receiveTime)"
        ></el-step>
        <el-step
          title="Complete Evaluation"
          :description="formatTime(order.commentTime)"
        ></el-step>
      </el-steps>
    </div>
    <el-card shadow="never" style="margin-top: 15px">
      <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
        <span class="color-danger"
          >当前订单状态：{{ order.status | formatStatus }}</span
        >
        <div class="operate-button-container" v-show="order.status === 0">
          <el-button size="mini" @click="showUpdateReceiverDialog"
            >修改收货人信息</el-button
          >
          <el-button size="mini" @click="showUpdateMoneyDialog"
            >修改费用信息</el-button
          >
          <el-button size="mini" @click="showMessageDialog"
            >发送站内信</el-button
          >
          <el-button size="mini" @click="showCloseOrderDialog"
            >关闭订单</el-button
          >
          <el-button size="mini" @click="showMarkOrderDialog"
            >备注订单</el-button
          >
        </div>
        <div class="operate-button-container" v-show="order.status === 1">
          <el-button size="mini" @click="showUpdateReceiverDialog"
            >修改收货人信息</el-button
          >
          <el-button size="mini" @click="showMessageDialog"
            >发送站内信</el-button
          >
          <el-button size="mini">取消订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog"
            >备注订单</el-button
          >
        </div>
        <div
          class="operate-button-container"
          v-show="order.status === 2 || order.status === 3"
        >
          <el-button size="mini" @click="showLogisticsDialog"
            >订单跟踪</el-button
          >
          <el-button size="mini" @click="showMessageDialog"
            >发送站内信</el-button
          >
          <el-button size="mini" @click="showMarkOrderDialog"
            >备注订单</el-button
          >
        </div>
        <div class="operate-button-container" v-show="order.status === 4">
          <el-button size="mini" @click="handleDeleteOrder"
            >Delete Order</el-button
          >
          <el-button size="mini" @click="showMarkOrderDialog"
            >备注订单</el-button
          >
        </div>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">Basic information</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">Order number</el-col>
          <el-col :span="4" class="table-cell-title"
            >Shipping order flow number</el-col
          >
          <el-col :span="4" class="table-cell-title">User account</el-col>
          <el-col :span="4" class="table-cell-title">Payment method</el-col>
          <el-col :span="4" class="table-cell-title">Order source</el-col>
          <el-col :span="4" class="table-cell-title">Order Type</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{ order.orderSn }}</el-col>
          <el-col :span="4" class="table-cell">None yet</el-col>
          <el-col :span="4" class="table-cell">{{
            order.memberUsername
          }}</el-col>
          <el-col :span="4" class="table-cell">{{
            order.payType | formatPayType
          }}</el-col>
          <el-col :span="4" class="table-cell">{{
            order.sourceType | formatSourceType
          }}</el-col>
          <el-col :span="4" class="table-cell">{{
            order.orderType | formatOrderType
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell-title">Delivery method</el-col>
          <el-col :span="4" class="table-cell-title"
            >Logistics Order Number</el-col
          >
          <el-col :span="4" class="table-cell-title"
            >Automatically confirm delivery time</el-col
          >
          <el-col :span="4" class="table-cell-title"
            >Outstanding coins are available for orders</el-col
          >
          <el-col :span="4" class="table-cell-title"
            >Orders can get growth value</el-col
          >
          <el-col :span="4" class="table-cell-title"
            >Activity information</el-col
          >
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{
            order.deliveryCompany | formatNull
          }}</el-col>
          <el-col :span="4" class="table-cell">{{
            order.deliverySn | formatNull
          }}</el-col>
          <el-col :span="4" class="table-cell"
            >{{ order.autoConfirmDay }}天</el-col
          >
          <el-col :span="4" class="table-cell">{{ order.integration }}</el-col>
          <el-col :span="4" class="table-cell">{{ order.growth }}</el-col>
          <el-col :span="4" class="table-cell">
            <el-popover
              placement="top-start"
              title="Activity information"
              width="200"
              trigger="hover"
              :content="order.promotionInfo"
            >
              <span slot="reference">{{
                order.promotionInfo | formatLongText
              }}</span>
            </el-popover>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">Consignee information</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">Consignee</el-col>
          <el-col :span="6" class="table-cell-title">Mobile number</el-col>
          <el-col :span="6" class="table-cell-title">Postal Code</el-col>
          <el-col :span="6" class="table-cell-title">Shipping address</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{ order.receiverName }}</el-col>
          <el-col :span="6" class="table-cell">{{
            order.receiverPhone
          }}</el-col>
          <el-col :span="6" class="table-cell">{{
            order.receiverPostCode
          }}</el-col>
          <el-col :span="6" class="table-cell">{{
            order | formatAddress
          }}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">Product Information</span>
      </div>
      <el-table
        ref="orderItemTable"
        :data="order.orderItemList"
        style="width: 100%; margin-top: 20px"
        border
      >
        <el-table-column label="Product picture " width="120" align="center">
          <template v-slot="{ row }">
            <img :src="row.productPic" style="height: 80px" />
          </template>
        </el-table-column>
        <el-table-column label="Product name" align="center">
          <template v-slot="{ row }">
            <p>{{ row.productName }}</p>
            <p>Brand: {{ row.productBrand }}</p>
          </template>
        </el-table-column>
        <el-table-column label="Price/item number" width="120" align="center">
          <template v-slot="{ row }">
            <p>price: ${{ row.productPrice }}</p>
            <p>Serial number:{{ row.productSn }}</p>
          </template>
        </el-table-column>
        <el-table-column label="Attributes" width="120" align="center">
          <template v-slot="{ row }">
            {{ row.productAttr | formatProductAttr }}
          </template>
        </el-table-column>
        <el-table-column label="Quantity" width="120" align="center">
          <template v-slot="{ row }">
            {{ row.productQuantity }}
          </template>
        </el-table-column>
        <el-table-column label="Total" width="120" align="center">
          <template v-slot="{ row }">
            ${{ row.productPrice * row.productQuantity }}
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right; margin: 20px">
        合计：<span class="color-danger">￥{{ order.totalAmount }}</span>
      </div>
      <div style="margin-top: 60px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">Cost information</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">Product Total</el-col>
          <el-col :span="6" class="table-cell-title">Freight</el-col>
          <el-col :span="6" class="table-cell-title">Coupon</el-col>
          <el-col :span="6" class="table-cell-title">Point deduction</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell"
            >￥{{ order.totalAmount }}</el-col
          >
          <el-col :span="6" class="table-cell"
            >￥{{ order.freightAmount }}</el-col
          >
          <el-col :span="6" class="table-cell"
            >-￥{{ order.couponAmount }}</el-col
          >
          <el-col :span="6" class="table-cell"
            >-￥{{ order.integrationAmount }}</el-col
          >
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">Event offer</el-col>
          <el-col :span="6" class="table-cell-title">Discount amount</el-col>
          <el-col :span="6" class="table-cell-title">Total order amount</el-col>
          <el-col :span="6" class="table-cell-title"
            >Amount of payablet of payable</el-col
          >
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell"
            >-${{ order.promotionAmount }}</el-col
          >
          <el-col :span="6" class="table-cell"
            >-${{ order.discountAmount }}</el-col
          >
          <el-col :span="6" class="table-cell">
            <span class="color-danger"
              >${{ order.totalAmount + order.freightAmount }}</span
            >
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger"
              >${{
                order.payAmount + order.freightAmount - order.discountAmount
              }}</span
            >
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">Operation infomation</span>
      </div>
      <el-table
        style="margin-top: 20px; width: 100%"
        ref="orderHistoryTable"
        :data="order.historyList"
        border
      >
        <el-table-column label="Operator" width="120" align="center">
          <template v-slot="{ row }">
            {{ row.operateMan }}
          </template>
        </el-table-column>
        <el-table-column label="Create time" width="160" align="center">
          <template v-slot="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="Order Status" width="120" align="center">
          <template v-slot="{ row }">
            {{ row.orderStatus | formatStatus }}
          </template>
        </el-table-column>
        <el-table-column label="Payment Status" width="120" align="center">
          <template v-slot="{ row }">
            {{ row.orderStatus | formatPayStatus }}
          </template>
        </el-table-column>
        <el-table-column label="Delivery Status" width="120" align="center">
          <template v-slot="{ row }">
            {{ row.orderStatus | formatDeliverStatus }}
          </template>
        </el-table-column>
        <el-table-column label="Note" align="center">
          <template v-slot="{ row }">
            {{ row.note }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="Modify the consignee's information"
      :visible.sync="receiverDialogVisible"
      width="40%"
    >
      <el-form :model="receiverInfo" ref="receiverInfoForm" label-width="150px">
        <el-form-item label="Consignee's name:">
          <el-input
            v-model="receiverInfo.receiverName"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="Mobile phone number: ">
          <el-input v-model="receiverInfo.receiverPhone" style="width: 200px">
          </el-input>
        </el-form-item>
        <el-form-item label="Postal Code:">
          <el-input
            v-model="receiverInfo.receiverPostCode"
            style="width: 200px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="Area: ">
          <v-distpicker
            :province="receiverInfo.receiverProvince"
            :city="receiverInfo.receiverCity"
            :area="receiverInfo.receiverRegion"
            @selected="onSelectRegion"
          ></v-distpicker>
        </el-form-item>
        <el-form-item label="Detailed address:">
          <el-input
            v-model="receiverInfo.receiverDetailAddress"
            type="textarea"
            rows="3"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="receiverDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleUpdateReceiverInfo"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="Modify the fee information"
      :visible.sync="moneyDialogVisible"
      width="40%"
    >
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">Total product</el-col>
          <el-col :span="6" class="table-cell-title">Freight</el-col>
          <el-col :span="6" class="table-cell-title">Coupon</el-col>
          <el-col :span="6" class="table-cell-title">Point deduction</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">${{ order.totalAmount }}</el-col>
          <el-col :span="6" class="table-cell">
            <el-input v-model.number="moneyInfo.freightAmount" size="mini"
              ><template slot="prepend">$</template></el-input
            >
          </el-col>
          <el-col :span="6" class="table-cell"
            >-${{ order.couponAmount }}</el-col
          >
          <el-col :span="6" class="table-cell"
            >-${{ order.integrationAmount }}</el-col
          >
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">Event Discounts</el-col>
          <el-col :span="6" class="table-cell-title">Discount amount</el-col>
          <el-col :span="6" class="table-cell-title">Total order amount</el-col>
          <el-col :span="6" class="table-cell-title">Amount of payable</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell"
            >-${{ order.promotionAmount }}</el-col
          >
          <el-col :span="6" class="table-cell">
            <el-input v-model.number="moneyInfo.discountAmount" size="mini"
              ><template slot="prepend">-$</template></el-input
            >
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger"
              >${{ order.totalAmount + moneyInfo.freightAmount }}</span
            >
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger"
              >${{
                order.payAmount +
                moneyInfo.freightAmount -
                moneyInfo.discountAmount
              }}</span
            >
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="moneyDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleUpdateMoneyInfo"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="Send in-site messages"
      :visible.sync="messageDialogVisible"
      width="40%"
    >
      <el-form :model="message" ref="receiverInfoForm" label-width="150px">
        <el-form-item label="Title: ">
          <el-input v-model="message.title" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="Content: ">
          <el-input v-model="message.content" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="messageDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSendMessage">Confirm</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Close Order"
      :visible.sync="closeDialogVisible"
      width="40%"
    >
      <el-form :model="closeInfo" label-width="150px">
        <el-form-item label="Note: ">
          <el-input v-model="closeInfo.note" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleCloseOrder">Confirm</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Note order"
      :visible.sync="markOrderDialogVisible"
      width="40%"
    >
      <el-form :model="markInfo" label-width="150px">
        <el-form-item label="Note: ">
          <el-input v-model="markInfo.note" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="markOrderDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleMarkOrder">Confirm</el-button>
      </span>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>
<script>
import {
  getOrderDetail,
  updateReceiverInfo,
  updateMoneyInfo,
  closeOrder,
  updateOrderNote,
  deleteOrder,
} from "@/api/order";
import LogisticsDialog from "@/views/oms/order/components/logisticsDialog";
import { formatDate } from "@/utils/date";
import VDistpicker from "v-distpicker";
const defaultReceiverInfo = {
  orderId: null,
  receiverName: null,
  receiverPhone: null,
  receiverPostCode: null,
  receiverDetailAddress: null,
  receiverProvince: null,
  receiverCity: null,
  receiverRegion: null,
  status: null,
};
export default {
  name: "orderDetail",
  components: { VDistpicker, LogisticsDialog },
  data() {
    return {
      id: null,
      order: {},
      receiverDialogVisible: false,
      receiverInfo: Object.assign({}, defaultReceiverInfo),
      moneyDialogVisible: false,
      moneyInfo: {
        orderId: null,
        freightAmount: 0,
        discountAmount: 0,
        status: null,
      },
      messageDialogVisible: false,
      message: { title: null, content: null },
      closeDialogVisible: false,
      closeInfo: { note: null, id: null },
      markOrderDialogVisible: false,
      markInfo: { note: null },
      logisticsDialogVisible: false,
    };
  },
  created() {
    this.id = this.list = this.$route.query.id;
    getOrderDetail(this.id).then((response) => {
      this.order = response.data;
    });
  },
  filters: {
    formatNull(value) {
      if (value === undefined || value === null || value === "") {
        return "None Yet";
      } else {
        return value;
      }
    },
    formatLongText(value) {
      if (value === undefined || value === null || value === "") {
        return "None Yet";
      } else if (value.length > 8) {
        return value.substr(0, 8) + "...";
      } else {
        return value;
      }
    },
    formatPayType(value) {
      if (value === 1) {
        return "Alipay";
      } else if (value === 2) {
        return "Wechat";
      } else {
        return "Not paid";
      }
    },
    formatSourceType(value) {
      if (value === 1) {
        return "APP Order";
      } else {
        return "PC Order";
      }
    },
    formatOrderType(value) {
      if (value === 1) {
        return "Flash sale order";
      } else {
        return "normal order";
      }
    },
    formatAddress(order) {
      let str = order.receiverProvince;
      if (order.receiverCity != null) {
        str += "  " + order.receiverCity;
      }
      str += "  " + order.receiverRegion;
      str += "  " + order.receiverDetailAddress;
      return str;
    },
    formatStatus(value) {
      if (value === 1) {
        return "Waiting for shipment";
      } else if (value === 2) {
        return "Shipped";
      } else if (value === 3) {
        return "Completed";
      } else if (value === 4) {
        return "Close";
      } else if (value === 5) {
        return "Invalid order";
      } else {
        return "payment";
      }
    },
    formatPayStatus(value) {
      if (value === 0) {
        return "Not paid";
      } else if (value === 4) {
        return "Refunded";
      } else {
        return "paid";
      }
    },
    formatDeliverStatus(value) {
      if (value === 0 || value === 1) {
        return "Not shipped";
      } else {
        return "Shipped";
      }
    },
    formatProductAttr(value) {
      if (value == null) {
        return "";
      } else {
        let attr = JSON.parse(value);
        let result = "";
        for (let i = 0; i < attr.length; i++) {
          result += attr[i].key;
          result += ":";
          result += attr[i].value;
          result += ";";
        }
        return result;
      }
    },
  },
  methods: {
    onSelectRegion(data) {
      this.receiverInfo.receiverProvince = data.province.value;
      this.receiverInfo.receiverCity = data.city.value;
      this.receiverInfo.receiverRegion = data.area.value;
    },
    formatTime(time) {
      if (time == null || time === "") {
        return "";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    formatStepStatus(value) {
      if (value === 1) {
        //待发货
        return 2;
      } else if (value === 2) {
        //已发货
        return 3;
      } else if (value === 3) {
        //已完成
        return 4;
      } else {
        //待付款、已关闭、无限订单
        return 1;
      }
    },
    showUpdateReceiverDialog() {
      this.receiverDialogVisible = true;
      this.receiverInfo = {
        orderId: this.order.id,
        receiverName: this.order.receiverName,
        receiverPhone: this.order.receiverPhone,
        receiverPostCode: this.order.receiverPostCode,
        receiverDetailAddress: this.order.receiverDetailAddress,
        receiverProvince: this.order.receiverProvince,
        receiverCity: this.order.receiverCity,
        receiverRegion: this.order.receiverRegion,
        status: this.order.status,
      };
    },
    handleUpdateReceiverInfo() {
      this.$confirm("Do you want to modify the receipt information?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        updateReceiverInfo(this.receiverInfo).then((response) => {
          this.receiverDialogVisible = false;
          this.$message({
            type: "success",
            message: "Modification was successful!",
          });
          getOrderDetail(this.id).then((response) => {
            this.order = response.data;
          });
        });
      });
    },
    showUpdateMoneyDialog() {
      this.moneyDialogVisible = true;
      this.moneyInfo.orderId = this.order.id;
      this.moneyInfo.freightAmount = this.order.freightAmount;
      this.moneyInfo.discountAmount = this.order.discountAmount;
      this.moneyInfo.status = this.order.status;
    },
    handleUpdateMoneyInfo() {
      this.$confirm("Do you want to modify the fee information?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        updateMoneyInfo(this.moneyInfo).then((response) => {
          this.moneyDialogVisible = false;
          this.$message({
            type: "success",
            message: "Modification was successful!",
          });
          getOrderDetail(this.id).then((response) => {
            this.order = response.data;
          });
        });
      });
    },
    showMessageDialog() {
      this.messageDialogVisible = true;
      this.message.title = null;
      this.message.content = null;
    },
    handleSendMessage() {
      this.$confirm("Do you want to send a message in the site?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        this.messageDialogVisible = false;
        this.$message({
          type: "success",
          message: "Send successfully!",
        });
      });
    },
    showCloseOrderDialog() {
      this.closeDialogVisible = true;
      this.closeInfo.note = null;
      this.closeInfo.id = this.id;
    },
    handleCloseOrder() {
      this.$confirm("Do you want to close it?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids", [this.closeInfo.id]);
        params.append("note", this.closeInfo.note);
        closeOrder(params).then((response) => {
          this.closeDialogVisible = false;
          this.$message({
            type: "success",
            message: "The order closed successfully!",
          });
          getOrderDetail(this.id).then((response) => {
            this.order = response.data;
          });
        });
      });
    },
    showMarkOrderDialog() {
      this.markOrderDialogVisible = true;
      this.markInfo.id = this.id;
      this.closeOrder.note = null;
    },
    handleMarkOrder() {
      this.$confirm("Do you want to note the order?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        let params = new URLSearchParams();
        params.append("id", this.markInfo.id);
        params.append("note", this.markInfo.note);
        params.append("status", this.order.status);
        updateOrderNote(params).then((response) => {
          this.markOrderDialogVisible = false;
          this.$message({
            type: "success",
            message: "Order note successful!",
          });
          getOrderDetail(this.id).then((response) => {
            this.order = response.data;
          });
        });
      });
    },
    handleDeleteOrder() {
      this.$confirm("Do you want to perform the delete operation?", "Prompt", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids", [this.id]);
        deleteOrder(params).then((response) => {
          this.$message({
            message: "Delete successfully!",
            type: "success",
            duration: 1000,
          });
          this.$router.back();
        });
      });
    },
    showLogisticsDialog() {
      this.logisticsDialogVisible = true;
    },
  },
};
</script>
<style scoped>
.detail-container {
  width: 80%;
  padding: 20px 20px 20px 20px;
  margin: 20px auto;
}

.operate-container {
  background: #f2f6fc;
  height: 80px;
  margin: -20px -20px 0;
  line-height: 80px;
}

.operate-button-container {
  float: right;
  margin-right: 20px;
}

.table-layout {
  margin-top: 20px;
  border-left: 1px solid #dcdfe6;
  border-top: 1px solid #dcdfe6;
}

.table-cell {
  height: 60px;
  line-height: 40px;
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  padding: 10px;
  font-size: 14px;
  color: #606266;
  text-align: center;
  overflow: hidden;
}

.table-cell-title {
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  padding: 10px;
  background: #f2f6fc;
  text-align: center;
  font-size: 14px;
  color: #303133;
}
</style>
