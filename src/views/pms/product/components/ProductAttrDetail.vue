<template>
  <div style="margin-top: 50px">
    <el-form
      :model="localData"
      ref="productAttrForm"
      label-width="120px"
      class="form-inner-container"
      size="small"
    >
      <el-form-item label="Attribute type:">
        <el-select
          v-model="localData.productAttributeCategoryId"
          placeholder="Please select attribute type"
          @change="handleProductAttrChange"
        >
          <el-option
            v-for="item in productAttributeCategoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Product specifications:">
        <el-card shadow="never" class="cardBg">
          <div v-for="(productAttr, idx) in selectProductAttr">
            {{ productAttr.name }}：
            <el-checkbox-group
              v-if="productAttr.handAddStatus === 0"
              v-model="selectProductAttr[idx].values"
            >
              <el-checkbox
                v-for="item in getInputListArr(productAttr.inputList)"
                :label="item"
                :key="item"
                class="littleMarginLeft"
              ></el-checkbox>
            </el-checkbox-group>
            <div v-else>
              <el-checkbox-group v-model="selectProductAttr[idx].values">
                <div
                  v-for="(item, index) in selectProductAttr[idx].options"
                  style="display: inline-block"
                  class="littleMarginLeft"
                >
                  <el-checkbox :label="item" :key="item"></el-checkbox>
                  <el-button
                    type="text"
                    class="littleMarginLeft"
                    @click="handleRemoveProductAttrValue(idx, index)"
                    >Delete
                  </el-button>
                </div>
              </el-checkbox-group>
              <el-input
                v-model="addProductAttrValue"
                style="width: 160px; margin-left: 10px"
                clearable
              ></el-input>
              <el-button
                class="littleMarginLeft"
                @click="handleAddProductAttrValue(idx)"
                >Add</el-button
              >
            </div>
          </div>
        </el-card>
        <el-table
          style="width: 100%; margin-top: 20px"
          :data="localData.skuStockList"
          border
        >
          <el-table-column
            v-for="(item, index) in selectProductAttr"
            :label="item.name"
            :key="item.id"
            align="center"
          >
            <template v-slot="{ row }">
              {{ getProductSkuSp(row, index) }}
            </template>
          </el-table-column>
          <el-table-column label="Sales price" width="100" align="center">
            <template v-slot="{ row }">
              <el-input v-model="row.price"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="Promotional Price" width="100" align="center">
            <template v-slot="{ row }">
              <el-input v-model="row.promotionPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="Product inventory" width="80" align="center">
            <template v-slot="{ row }">
              <el-input v-model="row.stock"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="Inventory warning value"
            width="80"
            align="center"
          >
            <template v-slot="{ row }">
              <el-input v-model="row.lowStock"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="SKU number" width="160" align="center">
            <template v-slot="{ row }">
              <el-input v-model="row.skuCode"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="Operation" width="80" align="center">
            <template v-slot="{ row, $index }">
              <el-button
                type="text"
                @click="handleRemoveProductSku($index, row)"
                >Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          style="margin-top: 20px"
          @click="handleRefreshProductSkuList"
          >Refresh List
        </el-button>
        <el-button
          type="primary"
          style="margin-top: 20px"
          @click="handleSyncProductSkuPrice"
          >Sync Product Price
        </el-button>
        <el-button
          type="primary"
          style="margin-top: 20px"
          @click="handleSyncProductSkuStock"
          >Sync Product Stock
        </el-button>
      </el-form-item>
      <el-form-item label="Product Attrbute Pics" v-if="hasAttrPic">
        <el-card shadow="never" class="cardBg">
          <div v-for="(item, index) in selectProductAttrPics">
            <span>{{ item.name }}:</span>
            <single-upload
              v-model="item.pic"
              style="width: 300px; display: inline-block; margin-left: 10px"
            ></single-upload>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="Product Attributes ">
        <el-card shadow="never" class="cardBg">
          <div
            v-for="(item, index) in selectProductParam"
            :class="{ littleMarginTop: index !== 0 }"
          >
            <div class="paramInputLabel">{{ item.name }}:</div>
            <el-select
              v-if="item.inputType === 1"
              class="paramInput"
              v-model="selectProductParam[index].value"
            >
              <el-option
                v-for="item in getParamInputList(item.inputList)"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <el-input
              v-else
              class="paramInput"
              v-model="selectProductParam[index].value"
            ></el-input>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="Product Album: ">
        <multi-upload v-model="selectProductPics"></multi-upload>
      </el-form-item>
      <el-form-item label="Product details:">
        <el-tabs v-model="activeHtmlName" type="card">
          <el-tab-pane label="Computer Details" name="pc">
            <tinymce
              :width="595"
              :height="300"
              v-model="localData.detailHtml"
            ></tinymce>
          </el-tab-pane>
          <el-tab-pane label="Mobile Details" name="mobile">
            <tinymce
              :width="595"
              :height="300"
              v-model="localData.detailMobileHtml"
            ></tinymce>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev"
          >Previous step, fill in the product promotion</el-button
        >
        <el-button type="primary" size="medium" @click="handleNext"
          >Next, select product association</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchList as fetchProductAttrCateList } from "@/api/productAttrCate";
import { fetchList as fetchProductAttrList } from "@/api/productAttr";
import SingleUpload from "@/components/Upload/singleUpload";
import MultiUpload from "@/components/Upload/multiUpload";
import Tinymce from "@/components/Tinymce";

export default {
  name: "ProductAttrDetail",
  components: { SingleUpload, MultiUpload, Tinymce },
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
      //编辑模式时是否初始化成功
      hasEditCreated: false,
      //商品属性分类下拉选项
      productAttributeCategoryOptions: [],
      //选中的商品属性
      selectProductAttr: [],
      //选中的商品参数
      selectProductParam: [],
      //选中的商品属性图片
      selectProductAttrPics: [],
      //可手动添加的商品属性
      addProductAttrValue: "",
      //商品富文本详情激活类型
      activeHtmlName: "pc",
    };
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
    //是否有商品属性图片
    hasAttrPic() {
      if (this.selectProductAttrPics.length < 1) {
        return false;
      }
      return true;
    },
    //商品的编号
    productId() {
      return this.localData.id;
    },
    //商品的主图和画册图片
    selectProductPics: {
      get: function () {
        let pics = [];
        if (
          this.localData.pic === undefined ||
          this.localData.pic == null ||
          this.localData.pic === ""
        ) {
          return pics;
        }
        pics.push(this.localData.pic);
        if (
          this.localData.albumPics === undefined ||
          this.localData.albumPics == null ||
          this.localData.albumPics === ""
        ) {
          return pics;
        }
        let albumPics = this.localData.albumPics.split(",");
        for (let i = 0; i < albumPics.length; i++) {
          pics.push(albumPics[i]);
        }
        return pics;
      },
      set: function (newValue) {
        if (newValue == null || newValue.length === 0) {
          this.localData.pic = null;
          this.localData.albumPics = null;
        } else {
          this.localData.pic = newValue[0];
          this.localData.albumPics = "";
          if (newValue.length > 1) {
            for (let i = 1; i < newValue.length; i++) {
              this.localData.albumPics += newValue[i];
              if (i !== newValue.length - 1) {
                this.localData.albumPics += ",";
              }
            }
          }
        }
      },
    },
  },
  created() {
    this.getProductAttrCateList();
  },
  watch: {
    productId: function (newValue) {
      if (!this.isEdit) return;
      if (this.hasEditCreated) return;
      if (newValue === undefined || newValue == null || newValue === 0) return;
      this.handleEditCreated();
    },
  },
  methods: {
    handleEditCreated() {
      //根据商品属性分类id获取属性和参数
      if (this.localData.productAttributeCategoryId != null) {
        this.handleProductAttrChange(this.localData.productAttributeCategoryId);
      }
      this.hasEditCreated = true;
    },
    getProductAttrCateList() {
      let param = { pageNum: 1, pageSize: 100 };
      fetchProductAttrCateList(param).then((response) => {
        this.productAttributeCategoryOptions = [];
        let list = response.data.list;
        for (let i = 0; i < list.length; i++) {
          this.productAttributeCategoryOptions.push({
            label: list[i].name,
            value: list[i].id,
          });
        }
      });
    },
    getProductAttrList(type, cid) {
      let param = { pageNum: 1, pageSize: 100, type: type };
      fetchProductAttrList(cid, param).then((response) => {
        let list = response.data.list;
        if (type === 0) {
          this.selectProductAttr = [];
          for (let i = 0; i < list.length; i++) {
            let options = [];
            let values = [];
            if (this.isEdit) {
              if (list[i].handAddStatus === 1) {
                //编辑状态下获取手动添加编辑属性
                options = this.getEditAttrOptions(list[i].id);
              }
              //编辑状态下获取选中属性
              values = this.getEditAttrValues(i);
            }
            this.selectProductAttr.push({
              id: list[i].id,
              name: list[i].name,
              handAddStatus: list[i].handAddStatus,
              inputList: list[i].inputList,
              values: values,
              options: options,
            });
          }
          if (this.isEdit) {
            //编辑模式下刷新商品属性图片
            this.refreshProductAttrPics();
          }
        } else {
          this.selectProductParam = [];
          for (let i = 0; i < list.length; i++) {
            let value = null;
            if (this.isEdit) {
              //编辑模式下获取参数属性
              value = this.getEditParamValue(list[i].id);
            }
            this.selectProductParam.push({
              id: list[i].id,
              name: list[i].name,
              value: value,
              inputType: list[i].inputType,
              inputList: list[i].inputList,
            });
          }
        }
      });
    },
    //获取设置的可手动添加属性值
    getEditAttrOptions(id) {
      let options = [];
      for (
        let i = 0;
        i < this.localData.productAttributeValueList.length;
        i++
      ) {
        let attrValue = this.localData.productAttributeValueList[i];
        if (attrValue.productAttributeId === id) {
          let strArr = attrValue.value.split(",");
          for (let j = 0; j < strArr.length; j++) {
            options.push(strArr[j]);
          }
          break;
        }
      }
      return options;
    },
    //获取选中的属性值
    getEditAttrValues(index) {
      let values = new Set();
      if (index === 0) {
        for (let i = 0; i < this.localData.skuStockList.length; i++) {
          let sku = this.localData.skuStockList[i];
          let spData = JSON.parse(sku.spData);
          if (spData != null && spData.length >= 1) {
            values.add(spData[0].value);
          }
        }
      } else if (index === 1) {
        for (let i = 0; i < this.localData.skuStockList.length; i++) {
          let sku = this.localData.skuStockList[i];
          let spData = JSON.parse(sku.spData);
          if (spData != null && spData.length >= 2) {
            values.add(spData[1].value);
          }
        }
      } else {
        for (let i = 0; i < this.localData.skuStockList.length; i++) {
          let sku = this.localData.skuStockList[i];
          let spData = JSON.parse(sku.spData);
          if (spData != null && spData.length >= 3) {
            values.add(spData[2].value);
          }
        }
      }
      return Array.from(values);
    },
    //获取属性的值
    getEditParamValue(id) {
      for (
        let i = 0;
        i < this.localData.productAttributeValueList.length;
        i++
      ) {
        if (
          id === this.localData.productAttributeValueList[i].productAttributeId
        ) {
          return this.localData.productAttributeValueList[i].value;
        }
      }
    },
    handleProductAttrChange(value) {
      this.getProductAttrList(0, value);
      this.getProductAttrList(1, value);
    },
    getInputListArr(inputList) {
      return inputList.split(",");
    },
    handleAddProductAttrValue(idx) {
      let options = this.selectProductAttr[idx].options;
      if (this.addProductAttrValue == null || this.addProductAttrValue == "") {
        this.$message({
          message: "The attribute value cannot be empty",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      if (options.indexOf(this.addProductAttrValue) !== -1) {
        this.$message({
          message: "The attribute value cannot be repeated",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      this.selectProductAttr[idx].options.push(this.addProductAttrValue);
      this.addProductAttrValue = null;
    },
    handleRemoveProductAttrValue(idx, index) {
      this.selectProductAttr[idx].options.splice(index, 1);
    },
    getProductSkuSp(row, index) {
      let spData = JSON.parse(row.spData);
      if (spData != null && index < spData.length) {
        return spData[index].value;
      } else {
        return null;
      }
    },
    handleRefreshProductSkuList() {
      this.$confirm(
        "Refreshing the list will cause the sku information to be regenerated, whether to refresh",
        "Prompt",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      ).then(() => {
        this.refreshProductAttrPics();
        this.refreshProductSkuList();
      });
    },
    handleSyncProductSkuPrice() {
      this.$confirm(
        "Will synchronize the price of the first sku to all skus, whether to continue",
        "tip",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      ).then(() => {
        if (
          this.localData.skuStockList !== null &&
          this.localData.skuStockList.length > 0
        ) {
          let tempSkuList = [];
          tempSkuList = tempSkuList.concat(
            tempSkuList,
            this.localData.skuStockList
          );
          let price = this.localData.skuStockList[0].price;
          for (let i = 0; i < tempSkuList.length; i++) {
            tempSkuList[i].price = price;
          }
          this.localData.skuStockList = [];
          this.localData.skuStockList = this.localData.skuStockList.concat(
            this.localData.skuStockList,
            tempSkuList
          );
        }
      });
    },
    handleSyncProductSkuStock() {
      this.$confirm(
        "Synchronize the inventory of the first sku to all skus, whether to continue",
        "Tip",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      ).then(() => {
        if (
          this.localData.skuStockList !== null &&
          this.localData.skuStockList.length > 0
        ) {
          let tempSkuList = [];
          tempSkuList = tempSkuList.concat(
            tempSkuList,
            this.localData.skuStockList
          );
          let stock = this.localData.skuStockList[0].stock;
          let lowStock = this.localData.skuStockList[0].lowStock;
          for (let i = 0; i < tempSkuList.length; i++) {
            tempSkuList[i].stock = stock;
            tempSkuList[i].lowStock = lowStock;
          }
          this.localData.skuStockList = [];
          this.localData.skuStockList = this.localData.skuStockList.concat(
            this.localData.skuStockList,
            tempSkuList
          );
        }
      });
    },
    refreshProductSkuList() {
      this.localData.skuStockList = [];
      let skuList = this.localData.skuStockList;
      //只有一个属性时
      if (this.selectProductAttr.length === 1) {
        let attr = this.selectProductAttr[0];
        for (let i = 0; i < attr.values.length; i++) {
          skuList.push({
            spData: JSON.stringify([{ key: attr.name, value: attr.values[i] }]),
          });
        }
      } else if (this.selectProductAttr.length === 2) {
        let attr0 = this.selectProductAttr[0];
        let attr1 = this.selectProductAttr[1];
        for (let i = 0; i < attr0.values.length; i++) {
          if (attr1.values.length === 0) {
            skuList.push({
              spData: JSON.stringify([
                { key: attr0.name, value: attr0.values[i] },
              ]),
            });
            continue;
          }
          for (let j = 0; j < attr1.values.length; j++) {
            let spData = [];
            spData.push({ key: attr0.name, value: attr0.values[i] });
            spData.push({ key: attr1.name, value: attr1.values[j] });
            skuList.push({
              spData: JSON.stringify(spData),
            });
          }
        }
      } else {
        let attr0 = this.selectProductAttr[0];
        let attr1 = this.selectProductAttr[1];
        let attr2 = this.selectProductAttr[2];
        for (let i = 0; i < attr0.values.length; i++) {
          if (attr1.values.length === 0) {
            skuList.push({
              spData: JSON.stringify([
                { key: attr0.name, value: attr0.values[i] },
              ]),
            });
            continue;
          }
          for (let j = 0; j < attr1.values.length; j++) {
            if (attr2.values.length === 0) {
              let spData = [];
              spData.push({ key: attr0.name, value: attr0.values[i] });
              spData.push({ key: attr1.name, value: attr1.values[j] });
              skuList.push({
                spData: JSON.stringify(spData),
              });
              continue;
            }
            for (let k = 0; k < attr2.values.length; k++) {
              let spData = [];
              spData.push({ key: attr0.name, value: attr0.values[i] });
              spData.push({ key: attr1.name, value: attr1.values[j] });
              spData.push({ key: attr2.name, value: attr2.values[k] });
              skuList.push({
                spData: JSON.stringify(spData),
              });
            }
          }
        }
      }
    },
    refreshProductAttrPics() {
      this.selectProductAttrPics = [];
      if (this.selectProductAttr.length >= 1) {
        let values = this.selectProductAttr[0].values;
        for (let i = 0; i < values.length; i++) {
          let pic = null;
          if (this.isEdit) {
            //编辑状态下获取图片
            pic = this.getProductSkuPic(values[i]);
          }
          this.selectProductAttrPics.push({ name: values[i], pic: pic });
        }
      }
    },
    //获取商品相关属性的图片
    getProductSkuPic(name) {
      for (let i = 0; i < this.localData.skuStockList.length; i++) {
        let spData = JSON.parse(this.localData.skuStockList[i].spData);
        if (name === spData[0].value) {
          return this.localData.skuStockList[i].pic;
        }
      }
      return null;
    },
    //合并商品属性
    mergeProductAttrValue() {
      this.localData.productAttributeValueList = [];
      for (let i = 0; i < this.selectProductAttr.length; i++) {
        let attr = this.selectProductAttr[i];
        if (
          attr.handAddStatus === 1 &&
          attr.options != null &&
          attr.options.length > 0
        ) {
          this.localData.productAttributeValueList.push({
            productAttributeId: attr.id,
            value: this.getOptionStr(attr.options),
          });
        }
      }
      for (let i = 0; i < this.selectProductParam.length; i++) {
        let param = this.selectProductParam[i];
        this.localData.productAttributeValueList.push({
          productAttributeId: param.id,
          value: param.value,
        });
      }
    },
    //合并商品属性图片
    mergeProductAttrPics() {
      for (let i = 0; i < this.selectProductAttrPics.length; i++) {
        for (let j = 0; j < this.localData.skuStockList.length; j++) {
          let spData = JSON.parse(this.localData.skuStockList[j].spData);
          if (spData[0].value === this.selectProductAttrPics[i].name) {
            this.localData.skuStockList[j].pic =
              this.selectProductAttrPics[i].pic;
          }
        }
      }
    },
    getOptionStr(arr) {
      let str = "";
      for (let i = 0; i < arr.length; i++) {
        str += arr[i];
        if (i != arr.length - 1) {
          str += ",";
        }
      }
      return str;
    },
    handleRemoveProductSku(index, row) {
      let list = this.localData.skuStockList;
      if (list.length === 1) {
        list.pop();
      } else {
        list.splice(index, 1);
      }
    },
    getParamInputList(inputList) {
      return inputList.split(",");
    },
    handlePrev() {
      this.$emit("prevStep");
    },
    handleNext() {
      this.mergeProductAttrValue();
      this.mergeProductAttrPics();
      this.$emit("nextStep");
    },
  },
};
</script>

<style scoped>
.littleMarginLeft {
  margin-left: 10px;
}

.littleMarginTop {
  margin-top: 10px;
}

.paramInput {
  width: 250px;
}

.paramInputLabel {
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 10px;
}

.cardBg {
  background: #f8f9fc;
}
</style>
