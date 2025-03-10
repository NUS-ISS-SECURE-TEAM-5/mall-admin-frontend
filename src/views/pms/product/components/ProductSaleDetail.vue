<template>
  <div style="margin-top: 50px">
    <el-form
      :model="localData"
      ref="productSaleForm"
      label-width="120px"
      class="form-inner-container"
      size="small"
    >
      <el-form-item label="Give points:">
        <el-input v-model="localData.giftPoint"></el-input>
      </el-form-item>
      <el-form-item label="Giveaway Growth Value:">
        <el-input v-model="localData.giftGrowth"></el-input>
      </el-form-item>
      <el-form-item label="Points Purchase Limits:">
        <el-input v-model="localData.usePointLimit"></el-input>
      </el-form-item>
      <el-form-item label="Trailer Products:">
        <el-switch
          v-model="localData.previewStatus"
          :active-value="1"
          :inactive-value="0"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="Products for sale:">
        <el-switch
          v-model="localData.publishStatus"
          :active-value="1"
          :inactive-value="0"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="Product recommendation:">
        <span style="margin-right: 10px">New Products</span>
        <el-switch
          v-model="localData.newStatus"
          :active-value="1"
          :inactive-value="0"
        >
        </el-switch>
        <span style="margin-left: 10px; margin-right: 10px">Recommend</span>
        <el-switch
          v-model="localData.recommandStatus"
          :active-value="1"
          :inactive-value="0"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="Service guarantee: ">
        <el-checkbox-group v-model="selectServiceList">
          <el-checkbox :label="1">Worry-free return</el-checkbox>
          <el-checkbox :label="2">Quick refund</el-checkbox>
          <el-checkbox :label="3">Free free shipping</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Detailed page title:">
        <el-input v-model="localData.detailTitle"></el-input>
      </el-form-item>
      <el-form-item label="Detailed page description:">
        <el-input v-model="localData.detailDesc"></el-input>
      </el-form-item>
      <el-form-item label="Product keywords:">
        <el-input v-model="localData.keywords"></el-input>
      </el-form-item>
      <el-form-item label="Product Notes:">
        <el-input
          v-model="localData.note"
          type="textarea"
          :autoSize="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="Select a discount method:">
        <el-radio-group v-model="localData.promotionType" size="small">
          <el-radio-button :label="0">No discount</el-radio-button>
          <el-radio-button :label="1">Special promotion</el-radio-button>
          <el-radio-button :label="2">Member price</el-radio-button>
          <el-radio-button :label="3">Ladder price</el-radio-button>
          <el-radio-button :label="4">Full discount price</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="localData.promotionType === 1">
        <div>
          开始时间：
          <el-date-picker
            v-model="localData.promotionStartTime"
            type="datetime"
            :picker-options="pickerOptions1"
            placeholder="Select start time"
          >
          </el-date-picker>
        </div>
        <div class="littleMargin">
          结束时间：
          <el-date-picker
            v-model="localData.promotionEndTime"
            type="datetime"
            :picker-options="pickerOptions1"
            placeholder="Select end time"
          >
          </el-date-picker>
        </div>
        <div class="littleMargin">
          促销价格：
          <el-input
            style="width: 220px"
            v-model="localData.promotionPrice"
            placeholder="Enter promotional price"
          ></el-input>
        </div>
      </el-form-item>
      <el-form-item v-show="localData.promotionType === 2">
        <div
          v-for="(item, index) in localData.memberPriceList"
          :class="{ littleMargin: index !== 0 }"
        >
          {{ item.memberLevelName }}：
          <el-input v-model="item.memberPrice" style="width: 200px"></el-input>
        </div>
      </el-form-item>
      <el-form-item v-show="localData.promotionType === 3">
        <el-table :data="localData.productLadderList" style="width: 80%" border>
          <el-table-column label="Count" align="center" width="120">
            <template v-slot="{ row }">
              <el-input v-model="row.count"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="Discount" align="center" width="120">
            <template v-slot="{ row }">
              <el-input v-model="row.discount"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Operation">
            <template v-slot="{ row }">
              <el-button
                type="text"
                @click="handleRemoveProductLadder($index, row)"
                >Delete</el-button
              >
              <el-button
                type="text"
                @click="handleAddProductLadder($index, row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item v-show="localData.promotionType === 4">
        <el-table
          :data="localData.productFullReductionList"
          style="width: 80%"
          border
        >
          <el-table-column label="Up to" align="center" width="120">
            <template v-slot="{ row }">
              <el-input v-model="row.fullPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="Reduced" align="center" width="120">
            <template v-slot="{ row }">
              <el-input v-model="row.reducePrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Operation">
            <template v-slot="{ row }">
              <el-button
                type="text"
                @click="handleRemoveFullReduction($index, row)"
                >Delete</el-button
              >
              <el-button
                type="text"
                @click="handleAddFullReduction($index, row)"
                >Add</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev"
          >Previous step, fill in product information</el-button
        >
        <el-button type="primary" size="medium" @click="handleNext"
          >Next step, fill in product attributes</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchList as fetchMemberLevelList } from "@/api/memberLevel";

export default {
  name: "ProductSaleDetail",
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["nextStep", "prevStep", "update:modelValue"],
  data() {
    return {
      //日期选择器配置
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
    };
  },
  created() {
    if (!this.isEdit) {
      fetchMemberLevelList({ defaultStatus: 0 }).then((response) => {
        let memberPriceList = [];
        for (let i = 0; i < response.data.length; i++) {
          let item = response.data[i];
          memberPriceList.push({
            memberLevelId: item.id,
            memberLevelName: item.name,
          });
        }
        this.localData.memberPriceList = memberPriceList;
      });
    }
  },
  computed: {
    localData: {
      get() {
        return this.modelValue || {};
      },
      set(newVal) {
        this.$emit("update:modelValue", newVal);
      },
    },
    //选中的服务保证
    selectServiceList: {
      get() {
        let list = [];
        if (!this.localData.serviceIds) return list;
        let ids = this.localData.serviceIds.split(",");
        for (let i = 0; i < ids.length; i++) {
          list.push(Number(ids[i]));
        }
        return list;
      },
      set(newValue) {
        let serviceIds = "";
        if (newValue && newValue.length > 0) {
          for (let i = 0; i < newValue.length; i++) {
            serviceIds += newValue[i] + ",";
          }
          if (serviceIds.endsWith(",")) {
            serviceIds = serviceIds.slice(0, -1);
          }
          this.localData.serviceIds = serviceIds;
        } else {
          this.localData.serviceIds = null;
        }
      },
    },
  },
  methods: {
    handleEditCreated() {
      let ids = this.localData.serviceIds.split(",");
      console.log("handleEditCreated", ids);
      for (let i = 0; i < ids.length; i++) {
        this.selectServiceList.push(Number(ids[i]));
      }
    },
    handleRemoveProductLadder(index, row) {
      let productLadderList = this.localData.productLadderList;
      if (productLadderList.length === 1) {
        productLadderList.pop();
        productLadderList.push({
          count: 0,
          discount: 0,
          price: 0,
        });
      } else {
        productLadderList.splice(index, 1);
      }
    },
    handleAddProductLadder(index, row) {
      let productLadderList = this.localData.productLadderList;
      if (productLadderList.length < 3) {
        productLadderList.push({
          count: 0,
          discount: 0,
          price: 0,
        });
      } else {
        this.$message({
          message: "Only three can be added at most",
          type: "warning",
        });
      }
    },
    handleRemoveFullReduction(index, row) {
      let fullReductionList = this.localData.productFullReductionList;
      if (fullReductionList.length === 1) {
        fullReductionList.pop();
        fullReductionList.push({
          fullPrice: 0,
          reducePrice: 0,
        });
      } else {
        fullReductionList.splice(index, 1);
      }
    },
    handleAddFullReduction(index, row) {
      let fullReductionList = this.localData.productFullReductionList;
      if (fullReductionList.length < 3) {
        fullReductionList.push({
          fullPrice: 0,
          reducePrice: 0,
        });
      } else {
        this.$message({
          message: "Only three can be added at most",
          type: "warning",
        });
      }
    },
    handlePrev() {
      this.$emit("prevStep");
    },
    handleNext() {
      this.$emit("nextStep");
    },
  },
};
</script>

<style scoped>
.littleMargin {
  margin-top: 10px;
}
</style>
