<template>
  <el-card class="form-container" shadow="never">
    <el-form
      :model="productCate"
      :rules="rules"
      ref="productCateFrom"
      label-width="150px"
    >
      <el-form-item label="Category name: " prop="name">
        <el-input v-model="productCate.name"></el-input>
      </el-form-item>
      <el-form-item label="Superior Category:">
        <el-select
          v-model="productCate.parentId"
          placeholder="Please select category"
        >
          <el-option
            v-for="item in selectProductCateList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Unit of Quantity:">
        <el-input v-model="productCate.productUnit"></el-input>
      </el-form-item>
      <el-form-item label="Sort:">
        <el-input v-model="productCate.sort"></el-input>
      </el-form-item>
      <el-form-item label="Whether to display:">
        <el-radio-group v-model="productCate.showStatus">
          <el-radio :label="1">Yes</el-radio>
          <el-radio :label="0">No</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Whether it is displayed in the navigation bar:">
        <el-radio-group v-model="productCate.navStatus">
          <el-radio :label="1">Yes</el-radio>
          <el-radio :label="0">No</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Category Icons:">
        <single-upload v-model="productCate.icon"></single-upload>
      </el-form-item>
      <el-form-item
        v-for="(filterProductAttr, index) in filterProductAttrList"
        :label="index | filterLabelFilter"
        :key="filterProductAttr.key"
      >
        <el-cascader
          clearable
          v-model="filterProductAttr.value"
          :options="filterAttrs"
        >
        </el-cascader>
        <el-button
          style="margin-left: 20px"
          @click.prevent="removeFilterAttr(filterProductAttr)"
          >Delete</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="handleAddFilterAttr()"
          >Added</el-button
        >
      </el-form-item>
      <el-form-item label="Keywords:">
        <el-input v-model="productCate.keywords"></el-input>
      </el-form-item>
      <el-form-item label="Category Description:">
        <el-input
          type="textarea"
          :autosize="true"
          v-model="productCate.description"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('productCateFrom')"
          >Submit</el-button
        >
        <el-button v-if="!isEdit" @click="resetForm('productCateFrom')"
          >Reset</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import {
  fetchList,
  createProductCate,
  updateProductCate,
  getProductCate,
} from "@/api/productCate";
import { fetchListWithAttr } from "@/api/productAttrCate";
import { getProductAttrInfo } from "@/api/productAttr";
import SingleUpload from "@/components/Upload/singleUpload";

const defaultProductCate = {
  description: "",
  icon: "",
  keywords: "",
  name: "",
  navStatus: 0,
  parentId: 0,
  productUnit: "",
  showStatus: 0,
  sort: 0,
  productAttributeIdList: [],
};
export default {
  name: "ProductCateDetail",
  components: { SingleUpload },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      productCate: Object.assign({}, defaultProductCate),
      selectProductCateList: [],
      rules: {
        name: [
          {
            required: true,
            memessage: "Please enter the brand name",
            trigger: "blur",
          },
          {
            min: 2,
            max: 140,
            message: "Length between 2 and 140 characters",
            trigger: "blur",
          },
        ],
      },
      filterAttrs: [],
      filterProductAttrList: [
        {
          value: [],
        },
      ],
    };
  },
  created() {
    if (this.isEdit) {
      getProductCate(this.$route.query.id).then((response) => {
        this.productCate = response.data;
      });
      getProductAttrInfo(this.$route.query.id).then((response) => {
        if (response.data != null && response.data.length > 0) {
          this.filterProductAttrList = [];
          for (let i = 0; i < response.data.length; i++) {
            this.filterProductAttrList.push({
              key: Date.now() + i,
              value: [
                response.data[i].attributeCategoryId,
                response.data[i].attributeId,
              ],
            });
          }
        }
      });
    } else {
      this.productCate = Object.assign({}, defaultProductCate);
    }
    this.getSelectProductCateList();
    this.getProductAttrCateList();
  },
  methods: {
    getSelectProductCateList() {
      fetchList(0, { pageSize: 100, pageNum: 1 }).then((response) => {
        this.selectProductCateList = response.data.list;
        this.selectProductCateList.unshift({
          id: 0,
          name: "No superior classification",
        });
      });
    },
    getProductAttrCateList() {
      fetchListWithAttr().then((response) => {
        let list = response.data;
        for (let i = 0; i < list.length; i++) {
          let productAttrCate = list[i];
          let children = [];
          if (
            productAttrCate.productAttributeList != null &&
            productAttrCate.productAttributeList.length > 0
          ) {
            for (
              let j = 0;
              j < productAttrCate.productAttributeList.length;
              j++
            ) {
              children.push({
                label: productAttrCate.productAttributeList[j].name,
                value: productAttrCate.productAttributeList[j].id,
              });
            }
          }
          this.filterAttrs.push({
            label: productAttrCate.name,
            value: productAttrCate.id,
            children: children,
          });
        }
      });
    },
    getProductAttributeIdList() {
      //获取选中的筛选商品属性
      let productAttributeIdList = [];
      for (let i = 0; i < this.filterProductAttrList.length; i++) {
        let item = this.filterProductAttrList[i];
        if (item.value !== null && item.value.length === 2) {
          productAttributeIdList.push(item.value[1]);
        }
      }
      return productAttributeIdList;
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("Whether to submit data", "prompt", {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            type: "warning",
          }).then(() => {
            if (this.isEdit) {
              this.productCate.productAttributeIdList =
                this.getProductAttributeIdList();
              updateProductCate(this.$route.query.id, this.productCate).then(
                (response) => {
                  this.$message({
                    message: "Modification was successful",
                    type: "success",
                    duration: 1000,
                  });
                  this.$router.back();
                }
              );
            } else {
              this.productCate.productAttributeIdList =
                this.getProductAttributeIdList();
              createProductCate(this.productCate).then((response) => {
                this.$refs[formName].resetFields();
                this.resetForm(formName);
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
      this.productCate = Object.assign({}, defaultProductCate);
      this.getSelectProductCateList();
      this.filterProductAttrList = [
        {
          value: [],
        },
      ];
    },
    removeFilterAttr(productAttributeId) {
      if (this.filterProductAttrList.length === 1) {
        this.$message({
          message: "At least one must be left",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      var index = this.filterProductAttrList.indexOf(productAttributeId);
      if (index !== -1) {
        this.filterProductAttrList.splice(index, 1);
      }
    },
    handleAddFilterAttr() {
      if (this.filterProductAttrList.length === 3) {
        this.$message({
          message: "At most three",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      this.filterProductAttrList.push({
        value: null,
        key: Date.now(),
      });
    },
  },
  filters: {
    filterLabelFilter(index) {
      if (index === 0) {
        return "Filter properties: ";
      } else {
        return "";
      }
    },
  },
};
</script>

<style scoped></style>
