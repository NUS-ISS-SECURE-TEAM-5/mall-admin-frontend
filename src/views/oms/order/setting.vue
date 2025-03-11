<template>
   
  <el-card class="form-container" shadow="never">
    <el-form
      :model="orderSetting"
      ref="orderSettingForm"
      :rules="rules"
      label-width="150px"
    >
      <el-form-item label="Flash sale exceeds:" prop="flashOrderOvertime">
        <el-input v-model="orderSetting.flashOrderOvertime" class="input-width">
          <template slot="append">minutes</template>
        </el-input>
        <span class="note-margin"
          >without payment, order will close automatically</span
        >
      </el-form-item>
      <el-form-item label="Normal order exceeds:" prop="normalOrderOvertime">
        <el-input
          v-model="orderSetting.normalOrderOvertime"
          class="input-width"
        >
          <template slot="append">minutes</template>
        </el-input>
        <span class="note-margin"
          >without payment, order will close automatically</span
        >
      </el-form-item>
      <el-form-item label="Shipping after:" prop="confirmOvertime">
        <el-input v-model="orderSetting.confirmOvertime" class="input-width">
          <template slot="append">days</template>
        </el-input>
        <span class="note-margin"
          >without payment, order will close automatically</span
        >
      </el-form-item>
      <el-form-item label="Order completion exceeds:" prop="finishOvertime">
        <el-input v-model="orderSetting.finishOvertime" class="input-width">
          <template slot="append">days</template>
        </el-input>
        <span class="note-margin"
          >Automatically end the transaction, no after-sales application is
          applied</span
        >
      </el-form-item>
      <el-form-item label="Order completion exceeds:" prop="commentOvertime">
        <el-input v-model="orderSetting.commentOvertime" class="input-width">
          <template slot="append">days</template>
        </el-input>
        <span class="note-margin">Automatic five-star review</span>
      </el-form-item>
      <el-form-item>
        <el-button @click="confirm('orderSettingForm')" type="primary"
          >Submit</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { getOrderSetting, updateOrderSetting } from "@/api/orderSetting";
const defaultOrderSetting = {
  id: null,
  flashOrderOvertime: 0,
  normalOrderOvertime: 0,
  confirmOvertime: 0,
  finishOvertime: 0,
  commentOvertime: 0,
};
const checkTime = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("Time cannot be empty"));
  }
  console.log("checkTime", value);
  let intValue = parseInt(value);
  if (!Number.isInteger(intValue)) {
    return callback(new Error("Please enter a numeric value"));
  }
  callback();
};
export default {
  name: "orderSetting",
  data() {
    return {
      orderSetting: Object.assign({}, defaultOrderSetting),
      rules: {
        flashOrderOvertime: { validator: checkTime, trigger: "blur" },
        normalOrderOvertime: { validator: checkTime, trigger: "blur" },
        confirmOvertime: { validator: checkTime, trigger: "blur" },
        finishOvertime: { validator: checkTime, trigger: "blur" },
        commentOvertime: { validator: checkTime, trigger: "blur" },
      },
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("Do you want to submit a modification?", "Tip", {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            type: "warning",
          }).then(() => {
            updateOrderSetting(1, this.orderSetting).then((response) => {
              this.$message({
                type: "success",
                message: "Submitted successfully!",
                duration: 1000,
              });
            });
          });
        } else {
          this.$message({
            message: "The submission parameters are illegal",
            type: "warning",
          });
          return false;
        }
      });
    },
    getDetail() {
      getOrderSetting(1).then((response) => {
        this.orderSetting = response.data;
      });
    },
  },
};
</script>
<style scoped>
.input-width {
  width: 50%;
}

.note-margin {
  margin-left: 15px;
}
</style>
