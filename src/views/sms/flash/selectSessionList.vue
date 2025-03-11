<template>
   
  <div class="app-container">
    <el-card shadow="never" class="operate-container">
      <i class="el-icon-tickets"></i>
      <span>Data list</span>
    </el-card>
    <div class="table-container">
      <el-table
        ref="selectSessionTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="serial number" width="100" align="center">
          <template v-slot="{ row }">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="Flash kill time period name" align="center">
          <template v-slot="{ row }">{{ row.name }}</template>
        </el-table-column>
        <el-table-column label="Daily start time" align="center">
          <template v-slot="{ row }">{{ row.startTime | formatTime }}</template>
        </el-table-column>
        <el-table-column label="Daily end time" align="center">
          <template v-slot="{ row }">{{ row.endTime | formatTime }}</template>
        </el-table-column>
        <el-table-column label="Quantity of products" align="center">
          <template v-slot="{ row }">{{ row.productCount }}</template>
        </el-table-column>
        <el-table-column label="operate" align="center">
          <template v-slot="{ row, $index }">
            <el-button
              size="mini"
              type="text"
              @click="handleShowRelation($index, row)"
              >Product List
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { fetchSelectList } from "@/api/flashSession";
import { formatDate } from "@/utils/date";
export default {
  name: "selectSessionList",
  data() {
    return {
      list: null,
      listLoading: false,
    };
  },
  created() {
    this.getList();
  },
  filters: {
    formatTime(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      return formatDate(date, "hh:mm:ss");
    },
  },
  methods: {
    handleShowRelation(index, row) {
      this.$router.push({
        path: "/sms/flashProductRelation",
        query: {
          flashPromotionId: this.$route.query.flashPromotionId,
          flashPromotionSessionId: row.id,
        },
      });
    },
    getList() {
      this.listLoading = true;
      fetchSelectList({
        flashPromotionId: this.$route.query.flashPromotionId,
      }).then((response) => {
        this.listLoading = false;
        this.list = response.data;
      });
    },
  },
};
</script>
<style scoped>
.operate-container {
  margin-top: 0;
}
</style>
