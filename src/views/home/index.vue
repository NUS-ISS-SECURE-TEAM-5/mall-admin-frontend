<template>
  <div class="app-container">
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_home_order" class="total-icon" />
            <div class="total-title">Total orders today</div>
            <div class="total-value">200</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_home_today_amount" class="total-icon" />
            <div class="total-title">Total sales today</div>
            <div class="total-value">￥5000.00</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_home_yesterday_amount" class="total-icon" />
            <div class="total-title">Total sales yesterday</div>
            <div class="total-value">$5000.00</div>
          </div>
        </el-col>
        <!--<el-col :span="6">-->
        <!--<div class="total-frame">-->
        <!--<svg-icon icon-class="total-week" class="total-icon">-->
        <!--</svg-icon>-->
        <!--<div class="total-title">近7天销售总额</div>-->
        <!--<div class="total-value">￥50000.00</div>-->
        <!--</div>-->
        <!--</el-col>-->
      </el-row>
    </div>
    <div class="un-handle-layout">
      <div class="layout-title">Pending transactions</div>
      <div class="un-handle-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">Orders to be paid</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">Completed order</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">Order to be confirmed</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">Orders to be shipped</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">New out of stock registration</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">Pending refund application</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">Shipped Order</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">Pending return orders</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium"
                >Advertising space is about to expire</span
              >
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">Product Overview</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value"
                  >100</el-col
                >
                <el-col :span="6" class="color-danger overview-item-value"
                  >400</el-col
                >
                <el-col :span="6" class="color-danger overview-item-value"
                  >50</el-col
                >
                <el-col :span="6" class="color-danger overview-item-value"
                  >500</el-col
                >
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title"
                  >Unavailable</el-col
                >
                <el-col :span="6" class="overview-item-title">Available</el-col>
                <el-col :span="6" class="overview-item-title"
                  >Inventory shortage</el-col
                >
                <el-col :span="6" class="overview-item-title"
                  >all products</el-col
                >
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">User Overview</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value"
                  >100</el-col
                >
                <el-col :span="6" class="color-danger overview-item-value"
                  >200</el-col
                >
                <el-col :span="6" class="color-danger overview-item-value"
                  >1000</el-col
                >
                <el-col :span="6" class="color-danger overview-item-value"
                  >5000</el-col
                >
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">New today</el-col>
                <el-col :span="6" class="overview-item-title"
                  >New yesterday</el-col
                >
                <el-col :span="6" class="overview-item-title">New month</el-col>
                <el-col :span="6" class="overview-item-title"
                  >Total number of members</el-col
                >
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="statistics-layout">
      <div class="layout-title">Order Statistics</div>
      <el-row>
        <el-col :span="4">
          <div style="padding: 20px">
            <div>
              <div style="color: #909399; font-size: 14px">
                Total orders this month
              </div>
              <div style="color: #606266; font-size: 24px; padding: 10px 0">
                10000
              </div>
              <div>
                <span class="color-success" style="font-size: 14px">+10%</span>
                <span style="color: #c0c4cc; font-size: 14px">
                  to last month</span
                >
              </div>
            </div>
            <div style="margin-top: 20px">
              <div style="color: #909399; font-size: 14px">
                Total orders this week
              </div>
              <div style="color: #606266; font-size: 24px; padding: 10px 0">
                1000
              </div>
              <div>
                <span class="color-danger" style="font-size: 14px">-10%</span>
                <span style="color: #c0c4cc; font-size: 14px">
                  to last week</span
                >
              </div>
            </div>
            <div style="margin-top: 20px">
              <div style="color: #909399; font-size: 14px">
                Total sales this month
              </div>
              <div style="color: #606266; font-size: 24px; padding: 10px 0">
                100000
              </div>
              <div>
                <span class="color-success" style="font-size: 14px">+10%</span>
                <span style="color: #c0c4cc; font-size: 14px">
                  to last month</span
                >
              </div>
            </div>
            <div style="margin-top: 20px">
              <div style="color: #909399; font-size: 14px">
                Total sales this week
              </div>
              <div style="color: #606266; font-size: 24px; padding: 10px 0">
                50000
              </div>
              <div>
                <span class="color-danger" style="font-size: 14px">-10%</span>
                <span style="color: #c0c4cc; font-size: 14px">
                  to last week</span
                >
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="20">
          <div style="padding: 10px; border-left: 1px solid #dcdfe6">
            <el-date-picker
              style="float: right; z-index: 1"
              size="small"
              v-model="orderCountDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="To"
              start-placeholder="Start Date"
              end-placeholder="End Date"
              @change="handleDateChange"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
            <div ref="chartRef" style="width: 100%; height: 400px"></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import "echarts/lib/component/tooltip";
import { str2Date } from "@/utils/date";
import img_home_order from "@/assets/images/home_order.png";
import img_home_today_amount from "@/assets/images/home_today_amount.png";
import img_home_yesterday_amount from "@/assets/images/home_yesterday_amount.png";
const DATA_FROM_BACKEND = {
  columns: ["date", "orderCount", "orderAmount"],
  rows: [
    { date: "2018-11-01", orderCount: 10, orderAmount: 1093 },
    { date: "2018-11-02", orderCount: 20, orderAmount: 2230 },
    { date: "2018-11-03", orderCount: 33, orderAmount: 3623 },
    { date: "2018-11-04", orderCount: 50, orderAmount: 6423 },
    { date: "2018-11-05", orderCount: 80, orderAmount: 8492 },
    { date: "2018-11-06", orderCount: 60, orderAmount: 6293 },
    { date: "2018-11-07", orderCount: 20, orderAmount: 2293 },
    { date: "2018-11-08", orderCount: 60, orderAmount: 6293 },
    { date: "2018-11-09", orderCount: 50, orderAmount: 5293 },
    { date: "2018-11-10", orderCount: 30, orderAmount: 3293 },
    { date: "2018-11-11", orderCount: 20, orderAmount: 2293 },
    { date: "2018-11-12", orderCount: 80, orderAmount: 8293 },
    { date: "2018-11-13", orderCount: 100, orderAmount: 10293 },
    { date: "2018-11-14", orderCount: 10, orderAmount: 1293 },
    { date: "2018-11-15", orderCount: 40, orderAmount: 4293 },
  ],
};
export default {
  name: "home",
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "Last week",
            onClick(picker) {
              let start = new Date(2018, 10, 1);
              const end = new Date(start.getTime() + 1000 * 60 * 60 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "Last month",
            onClick(picker) {
              let start = new Date(2018, 10, 1);
              const end = new Date(start.getTime() + 1000 * 60 * 60 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      orderCountDate: "",
      chartData: {
        columns: [],
        rows: [],
      },
      loading: false,
      dataEmpty: false,
      img_home_order,
      img_home_today_amount,
      img_home_yesterday_amount,
      chartInstance: null, // 存储 ECharts 实例
    };
  },
  created() {
    this.initOrderCountDate();
    this.getData();
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  methods: {
    handleDateChange() {
      this.getData();
    },
    initOrderCountDate() {
      let start = new Date(2018, 10, 1);
      const end = new Date(start.getTime() + 1000 * 60 * 60 * 24 * 7);
      this.orderCountDate = [start, end];
    },
    getData() {
      setTimeout(() => {
        this.chartData = {
          columns: ["date", "orderCount", "orderAmount"],
          rows: [],
        };
        for (let i = 0; i < DATA_FROM_BACKEND.rows.length; i++) {
          let item = DATA_FROM_BACKEND.rows[i];
          let currDate = str2Date(item.date);
          let start = this.orderCountDate[0];
          let end = this.orderCountDate[1];
          if (
            currDate.getTime() >= start.getTime() &&
            currDate.getTime() <= end.getTime()
          ) {
            this.chartData.rows.push(item);
          }
        }
        this.dataEmpty = false;
        this.loading = false;
        if (this.chartInstance) {
          this.updateChart();
        }
      }, 1000);
    },
    initChart() {
      const chartDom = this.$refs.chartRef;
      if (!chartDom) return;

      this.chartInstance = echarts.init(chartDom);

      const option = this.getChartOption();
      this.chartInstance.setOption(option);
    },
    updateChart() {
      const option = this.getChartOption();
      this.chartInstance.setOption(option);
    },
    getChartOption() {
      // 取出日期、订单数量、订单金额
      const dates = this.chartData.rows.map((item) => item.date);
      const orderCountData = this.chartData.rows.map((item) => item.orderCount);
      const orderAmountData = this.chartData.rows.map(
        (item) => item.orderAmount
      );

      return {
        tooltip: {
          trigger: "item",
          show: true,
          formatter: (params) => {
            return `日期：${params.name}<br/>
            值：${params.value}`;
          },
        },
        legend: { data: ["Order quantity", "Order amount"] },
        xAxis: {
          type: "category",
          data: dates,
        },
        yAxis: [
          { type: "value", name: "Order quantity" },
          { type: "value", name: "Order amount" },
        ],
        series: [
          {
            name: "Order quantity",
            type: "line",
            smooth: true,
            data: orderCountData,
            yAxisIndex: 0,
            showSymbol: true,
            symbolSize: 10,
            emphasis: {
              focus: "series",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#409eff" },
                { offset: 0.8, color: "#82b0ff" },
              ]),
            },
          },
          {
            name: "Order amount",
            type: "line",
            smooth: true,
            data: orderAmountData,
            yAxisIndex: 1,
            showSymbol: true,
            symbolSize: 10,
            emphasis: {
              focus: "series",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#7EC25C" },
                { offset: 0.8, color: "#AED943" },
              ]),
            },
          },
        ],
      };
    },
  },
};
</script>

<style scoped>
.app-container {
  margin-top: 40px;
  margin-left: 120px;
  margin-right: 120px;
}

.total-layout {
  margin-top: 20px;
}

.total-frame {
  border: 1px solid #dcdfe6;
  padding: 20px;
  height: 100px;
}

.total-icon {
  color: #409eff;
  width: 60px;
  height: 60px;
}

.total-title {
  position: relative;
  font-size: 16px;
  color: #909399;
  left: 70px;
  top: -50px;
}

.total-value {
  position: relative;
  font-size: 18px;
  color: #606266;
  left: 70px;
  top: -40px;
}

.un-handle-layout {
  margin-top: 20px;
  border: 1px solid #dcdfe6;
}

.layout-title {
  color: #606266;
  padding: 15px 20px;
  background: #f2f6fc;
  font-weight: bold;
}

.un-handle-content {
  padding: 20px 40px;
}

.un-handle-item {
  border-bottom: 1px solid #ebeef5;
  padding: 10px;
}

.overview-layout {
  margin-top: 20px;
}

.overview-item-value {
  font-size: 24px;
  text-align: center;
}

.overview-item-title {
  margin-top: 10px;
  text-align: center;
}

.out-border {
  border: 1px solid #dcdfe6;
}

.statistics-layout {
  margin-top: 20px;
  border: 1px solid #dcdfe6;
}
.mine-layout {
  position: absolute;
  right: 140px;
  top: 107px;
  width: 250px;
  height: 235px;
}
.address-content {
  padding: 20px;
  font-size: 18px;
}
</style>
