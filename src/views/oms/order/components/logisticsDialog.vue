<template>
  <el-dialog
    title="Order trackingr tracking"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :before-close="handleClose"
    width="40%"
  >
    <el-steps
      direction="vertical"
      :active="logisticsList.length"
      finish-status="success"
      space="50px"
    >
      <el-step
        v-for="(item, index) in logisticsList"
        :key="index"
        :title="item.name"
        :description="item.time"
      ></el-step>
    </el-steps>
  </el-dialog>
</template>
<script>
const defaultLogisticsList = [
  {
    name: "Order has been submitted, waiting for payment",
    time: "2017-04-01 12:00:00 ",
  },
  { name: "The order payment is successful", time: "2017-04-01 12:00:00 " },
  {
    name: "Scan the lower-level location in Beijing, waiting for payment",
    time: "2017-04-01 12:00:00 ",
  },
  {
    name: "The company in Guangdong Shenzhen, a company in the distribution center, performs unloading scans, waiting for payment",
    time: "2017-04-01 12:00:00 ",
  },
  { name: "Scan in Shenzhen, Guangdong", time: "2017-04-01 12:00:00 " },
  {
    name: "Arriving at the destination outlet Guangdong Shenzhen Company, express delivery will be delivered soon",
    time: "2017-04-01 12:00:00 ",
  },
  {
    name: "The order has been signed and we look forward to serving you again",
    time: "2017-04-01 12:00:00 ",
  },
];
export default {
  name: "logisticsDialog",
  props: {
    modelValue: Boolean,
  },
  data() {
    return {
      logisticsList: [...defaultLogisticsList],
    };
  },
  emits: ["update:modelValue"],
  methods: {
    handleClose() {
      this.$emit("update:modelValue", false);
    },
  },
};
</script>
<style></style>
