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
        >
          <el-form-item label="Input Search:">
            <el-input
              v-model="listQuery.orderSn"
              class="input-width"
              placeholder="Order Number"
            ></el-input>
          </el-form-item>
          <el-form-item label="Consignee:">
            <el-input
              v-model="listQuery.receiverKeyword"
              class="input-width"
              placeholder="Consignee Name/Mobile Number"
            ></el-input>
          </el-form-item>
          <el-form-item label="Submit time:">
            <el-date-picker
              class="input-width"
              v-model="listQuery.createTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="Please select time"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="Order Status">
            <el-select
              v-model="listQuery.status"
              class="input-width"
              placeholder="All"
              clearable
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Order category:">
            <el-select
              v-model="listQuery.orderType"
              class="input-width"
              placeholder="All"
              clearable
            >
              <el-option
                v-for="item in orderTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Order source">
            <el-select
              v-model="listQuery.sourceType"
              class="input-width"
              placeholder="All"
              clearable
            >
              <el-option
                v-for="item in sourceTypeOptions"
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
    </el-card>
    <div class="table-container">
      <el-table
        ref="orderTable"
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
        <el-table-column label="ID" width="80" align="center">
          <template v-slot="{ row }">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="Order number" width="180" align="center">
          <template v-slot="{ row }">{{ row.orderSn }}</template>
        </el-table-column>
        <el-table-column label="Craete time" width="180" align="center">
          <template v-slot="{ row }">{{
            row.createTime | formatCreateTime
          }}</template>
        </el-table-column>
        <el-table-column label="Member username" align="center">
          <template v-slot="{ row }">{{ row.memberUsername }}</template>
        </el-table-column>
        <el-table-column label="Total amount" width="120" align="center">
          <template v-slot="{ row }">￥{{ row.totalAmount }}</template>
        </el-table-column>
        <el-table-column label="Payment type" width="120" align="center">
          <template v-slot="{ row }">{{
            row.payType | formatPayType
          }}</template>
        </el-table-column>
        <el-table-column label="Order source" width="120" align="center">
          <template v-slot="{ row }">{{
            row.sourceType | formatSourceType
          }}</template>
        </el-table-column>
        <el-table-column label="Order status" width="120" align="center">
          <template v-slot="{ row }">{{ row.status | formatStatus }}</template>
        </el-table-column>
        <el-table-column label="Operation" width="200" align="center">
          <template v-slot="{ row, $index }">
            <el-button size="mini" @click="handleViewOrder($index, row)"
              >Check order</el-button
            >
            <el-button
              size="mini"
              @click="handleCloseOrder($index, row)"
              v-show="row.status === 0"
              >Close order</el-button
            >
            <el-button
              size="mini"
              @click="handleDeliveryOrder(row)"
              v-show="row.status === 1"
              >Order delivery</el-button
            >
            <el-button
              size="mini"
              @click="handleViewLogistics(row)"
              v-show="row.status === 2 || row.status === 3"
              >Order tracking</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteOrder($index, row)"
              v-show="row.status === 4"
              >Delete Order</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType"
        placeholder="Batch operation"
      >
        <el-option
          v-for="item in operateOptions"
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
        Confitm
      </el-button>
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
      title="Close the order"
      :visible.sync="closeOrder.dialogVisible"
      width="30%"
    >
      <span style="vertical-align: top">Operation Notes:</span>
      <el-input
        style="width: 80%"
        type="textarea"
        :rows="5"
        placeholder="Please enter content"
        v-model="closeOrder.content"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOrder.dialogVisible = false">Calcel</el-button>
        <el-button type="primary" @click="handleCloseOrderConfirm"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>
<script>
import { fetchList, closeOrder, deleteOrder } from "@/api/order";
import { formatDate } from "@/utils/date";
import LogisticsDialog from "@/views/oms/order/components/logisticsDialog";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  orderSn: null,
  receiverKeyword: null,
  status: null,
  orderType: null,
  sourceType: null,
  createTime: null,
};
export default {
  name: "orderList",
  components: { LogisticsDialog },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: true,
      list: null,
      total: null,
      operateType: null,
      multipleSelection: [],
      closeOrder: {
        dialogVisible: false,
        content: null,
        orderIds: [],
      },
      statusOptions: [
        {
          label: "To be paid",
          value: 0,
        },
        {
          label: "To be shipped",
          value: 1,
        },
        {
          label: "Shipped",
          value: 2,
        },
        {
          label: "Completed",
          value: 3,
        },
        {
          label: "Close",
          value: 4,
        },
      ],
      orderTypeOptions: [
        {
          label: "Normal order",
          value: 0,
        },
        {
          label: "Flash sale order",
          value: 1,
        },
      ],
      sourceTypeOptions: [
        {
          label: "PC order",
          value: 0,
        },
        {
          label: "APP Order",
          value: 1,
        },
      ],
      operateOptions: [
        {
          label: "Batch shipment",
          value: 1,
        },
        {
          label: "Close order",
          value: 2,
        },
        {
          label: "Delete order",
          value: 3,
        },
      ],
      logisticsDialogVisible: false,
    };
  },
  created() {
    this.getList();
  },
  filters: {
    formatCreateTime(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
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
    handleViewOrder(index, row) {
      this.$router.push({ path: "/oms/orderDetail", query: { id: row.id } });
    },
    handleCloseOrder(index, row) {
      this.closeOrder.dialogVisible = true;
      this.closeOrder.orderIds = [row.id];
    },
    handleDeliveryOrder(row) {
      let listItem = this.covertOrder(row);
      this.$router.push({
        path: "/oms/deliverOrderList",
        query: { list: JSON.stringify([listItem]) },
      });
    },
    handleViewLogistics(row) {
      this.logisticsDialogVisible = true;
    },
    handleDeleteOrder(index, row) {
      let ids = [];
      ids.push(row.id);
      this.deleteOrder(ids);
    },
    handleBatchOperate() {
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: "Please select the order to operate",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      if (this.operateType === 1) {
        //批量发货
        let list = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].status === 1) {
            list.push(this.covertOrder(this.multipleSelection[i]));
          }
        }
        if (list.length === 0) {
          this.$message({
            message: "Select the order that does not have shipment",
            type: "warning",
            duration: 1000,
          });
          return;
        }
        this.$router.push({
          path: "/oms/deliverOrderList",
          query: { list: list },
        });
      } else if (this.operateType === 2) {
        //关闭订单
        this.closeOrder.orderIds = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.closeOrder.orderIds.push(this.multipleSelection[i].id);
        }
        this.closeOrder.dialogVisible = true;
      } else if (this.operateType === 3) {
        //删除订单
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        this.deleteOrder(ids);
      }
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
    handleCloseOrderConfirm() {
      if (this.closeOrder.content == null || this.closeOrder.content === "") {
        this.$message({
          message: "Operation notes cannot be empty",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      let params = new URLSearchParams();
      params.append("ids", this.closeOrder.orderIds);
      params.append("note", this.closeOrder.content);
      closeOrder(params).then((response) => {
        this.closeOrder.orderIds = [];
        this.closeOrder.dialogVisible = false;
        this.getList();
        this.$message({
          message: "Modification was successful",
          type: "success",
          duration: 1000,
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
    deleteOrder(ids) {
      this.$confirm("Do you want to perform the delete operation?", "Prompt", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          let params = new URLSearchParams();
          params.append("ids", ids);
          deleteOrder(params).then((response) => {
            this.$message({
              message: "Delete successfully！",
              type: "success",
              duration: 1000,
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Undelete",
            duration: 1000,
          });
        });
    },
    covertOrder(order) {
      return {
        orderId: order.id,
        orderSn: order.orderSn,
        receiverName: order.receiverName,
        receiverPhone: order.receiverPhone,
        receiverPostCode: order.receiverPostCode,
        address: `${order.receiverProvince} ${order.receiverCity} ${order.receiverRegion} ${order.receiverDetailAddress}`,
        deliveryCompany: null, // 初始化为null
        deliverySn: null, // 初始化为null
      };
    },
  },
};
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>
