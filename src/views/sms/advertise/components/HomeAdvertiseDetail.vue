<template>
   
  <el-card class="form-container" shadow="never" v-loading="loading">
    <el-form
      :model="homeAdvertise"
      :rules="rules"
      ref="homeAdvertiseFrom"
      label-width="150px"
      size="small"
      v-if="homeAdvertise"
    >
      <el-form-item label="Advertising name: " prop="name">
        <el-input v-model="homeAdvertise.name" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="Advertising location:">
        <el-select v-model="homeAdvertise.type">
          <el-option
            v-for="type in typeOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Start Time:" prop="startTime">
        <el-date-picker
          type="datetime"
          placeholder="Select date"
          v-model="homeAdvertise.startTime"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="Expiration time:" prop="endTime">
        <el-date-picker
          type="datetime"
          placeholder="Select date"
          v-model="homeAdvertise.endTime"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="Online/Offline:">
        <el-radio-group v-model="homeAdvertise.status">
          <el-radio :label="0">Offline</el-radio>
          <el-radio :label="1">Online</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Advertising pictures:">
        <single-upload v-model="homeAdvertise.pic"></single-upload>
      </el-form-item>
      <el-form-item label="Sort:">
        <el-input v-model="homeAdvertise.sort" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="Advertising link:" prop="url">
        <el-input v-model="homeAdvertise.url" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="Advertising notes: ">
        <el-input
          class="input-width"
          type="textarea"
          :rows="5"
          placeholder="Please enter content"
          v-model="homeAdvertise.note"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('homeAdvertiseFrom')"
          >Submit</el-button
        >
        <el-button v-if="!isEdit" @click="resetForm('homeAdvertiseFrom')"
          >Reset</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import SingleUpload from "@/components/Upload/singleUpload";
import {
  createHomeAdvertise,
  getHomeAdvertise,
  updateHomeAdvertise,
} from "@/api/homeAdvertise";
const defaultTypeOptions = [
  {
    label: "PC homepage carousel",
    value: 0,
  },
  {
    label: "APP homepage carousel",
    value: 1,
  },
];
const defaultHomeAdvertise = {
  name: null,
  type: 1,
  pic: null,
  startTime: null,
  endTime: null,
  status: 0,
  url: null,
  note: null,
  sort: 0,
};
export default {
  name: "HomeAdvertiseDetail",
  components: { SingleUpload },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      homeAdvertise: { ...defaultHomeAdvertise },
      loading: false,
      rules: {
        name: [
          {
            required: true,
            message: "Please enter the ad name",
            trigger: "blur",
          },
          {
            min: 2,
            max: 140,
            message: "Length between 2 and 140 characters",
            trigger: "blur",
          },
        ],
        url: [
          {
            required: true,
            message: "Please enter the ad link",
            trigger: "blur",
          },
        ],
        startTime: [
          {
            required: true,
            message: "Please select the start time",
            trigger: "blur",
          },
        ],
        endTime: [
          {
            required: true,
            message: "Please select expiration time",
            trigger: "blur",
          },
        ],
        pic: [
          {
            required: true,
            message: "Please select the ad picture",
            trigger: "blur",
          },
        ],
      },
      typeOptions: Object.assign({}, defaultTypeOptions),
    };
  },
  created() {
    if (this.isEdit) {
      this.loading = true;
      getHomeAdvertise(this.$route.query.id)
        .then((res) => {
          this.homeAdvertise = res.data;
        })
        .catch(() => {
          this.$message.error("Failed to get ad details");
          this.$router.back();
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("Whether to submit data", "Prompt", {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            type: "warning",
          }).then(() => {
            if (this.isEdit) {
              updateHomeAdvertise(
                this.$route.query.id,
                this.homeAdvertise
              ).then((response) => {
                this.$refs[formName].resetFields();
                this.$message({
                  message: "Modification was successful",
                  type: "success",
                  duration: 1000,
                });
                this.$router.back();
              });
            } else {
              createHomeAdvertise(this.homeAdvertise).then((response) => {
                this.$refs[formName].resetFields();
                this.homeAdvertise = Object.assign({}, defaultHomeAdvertise);
                this.$message({
                  message: "Submission successful",
                  type: "success",
                  duration: 1000,
                });
              });
            }
          });
        } else {
          this.$message({
            message: "Verification failed",
            type: "error",
            duration: 1000,
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.homeAdvertise = Object.assign({}, defaultHomeAdvertise);
    },
  },
};
</script>
<style scoped>
.input-width {
  width: 70%;
}
</style>
