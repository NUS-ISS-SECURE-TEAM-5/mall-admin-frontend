<template>
   
  <el-card class="form-container" shadow="never">
    <el-form :model="brand" :rules="rules" ref="brandFrom" label-width="150px">
      <el-form-item label="Brand name: " prop="name">
        <el-input v-model="brand.name"></el-input>
      </el-form-item>
      <el-form-item label="Brand initial letter:">
        <el-input v-model="brand.firstLetter"></el-input>
      </el-form-item>
      <el-form-item label="Brand LOGO:" prop="logo">
        <single-upload v-model="brand.logo"></single-upload>
      </el-form-item>
      <el-form-item label="Brand Zone Large Picture:">
        <single-upload v-model="brand.bigPic"></single-upload>
      </el-form-item>
      <el-form-item label="Brand Story:">
        <el-input
          placeholder="Please enter content"
          type="textarea"
          v-model="brand.brandStory"
          :autosize="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="Sort:" prop="sort">
        <el-input v-model.number="brand.sort"></el-input>
      </el-form-item>
      <el-form-item label="Whether to display:">
        <el-radio-group v-model="brand.showStatus">
          <el-radio :label="1">Yes</el-radio>
          <el-radio :label="0">No</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Brand Manufacturer:">
        <el-radio-group v-model="brand.factoryStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('brandFrom')"
          >Submit</el-button
        >
        <el-button v-if="!isEdit" @click="resetForm('brandFrom')"
          >Reset</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { createBrand, getBrand, updateBrand } from "@/api/brand";
import SingleUpload from "@/components/Upload/singleUpload";
const defaultBrand = {
  bigPic: "",
  brandStory: "",
  factoryStatus: 0,
  firstLetter: "",
  logo: "",
  name: "",
  showStatus: 0,
  sort: 0,
};
export default {
  name: "BrandDetail",
  components: { SingleUpload },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      brand: Object.assign({}, defaultBrand),
      rules: {
        name: [
          {
            required: true,
            message: "Please enter the brand name",
            trigger: "blur",
          },
          {
            min: 2,
            max: 140,
            message: "Length between 2 and 140 characters",
            trigger: "blur",
          },
        ],
        logo: [
          {
            required: true,
            message: "Please enter the brand logo",
            trigger: "blur",
          },
        ],
        sort: [{ type: "number", message: "Sorting must be number" }],
      },
    };
  },
  created() {
    if (this.isEdit) {
      getBrand(this.$route.query.id).then((response) => {
        this.brand = response.data;
      });
    } else {
      this.brand = Object.assign({}, defaultBrand);
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
              updateBrand(this.$route.query.id, this.brand).then((response) => {
                this.$refs[formName].resetFields();
                this.$message({
                  message: "Modification was successful",
                  type: "success",
                  duration: 1000,
                });
                this.$router.back();
              });
            } else {
              createBrand(this.brand).then((response) => {
                this.$refs[formName].resetFields();
                this.brand = Object.assign({}, defaultBrand);
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
      this.brand = Object.assign({}, defaultBrand);
    },
  },
};
</script>
<style></style>
