<template>
  <div style="margin-top: 50px">
    <el-form
      :model="localData"
      ref="productRelationForm"
      label-width="120px"
      class="form-inner-container"
      size="small"
    >
      <el-form-item label="关联专题：">
        <el-transfer
          style="display: inline-block"
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入专题名称"
          v-model="selectSubject"
          :titles="subjectTitles"
          :data="subjectList"
        >
        </el-transfer>
      </el-form-item>
      <el-form-item label="关联优选：">
        <el-transfer
          style="display: inline-block"
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入优选名称"
          v-model="selectPrefrenceArea"
          :titles="prefrenceAreaTitles"
          :data="prefrenceAreaList"
        >
        </el-transfer>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev"
          >上一步，填写商品属性</el-button
        >
        <el-button type="primary" size="medium" @click="handleFinishCommit"
          >完成，提交商品</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchListAll as fetchSubjectList } from "@/api/subject";
import { fetchList as fetchPrefrenceAreaList } from "@/api/prefrenceArea";

export default {
  name: "ProductRelationDetail",
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
  emits: ["update:modelValue", "prevStep", "finishCommit"],
  data() {
    return {
      //所有专题列表
      subjectList: [],
      //专题左右标题
      subjectTitles: ["待选择", "已选择"],
      //所有专题列表
      prefrenceAreaList: [],
      //专题左右标题
      prefrenceAreaTitles: ["待选择", "已选择"],
    };
  },
  created() {
    this.getSubjectList();
    this.getPrefrenceAreaList();
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
    //选中的专题
    selectSubject: {
      get: function () {
        let subjects = [];
        if (
          this.localData.subjectProductRelationList == null ||
          this.localData.subjectProductRelationList.length <= 0
        ) {
          return subjects;
        }
        for (
          let i = 0;
          i < this.localData.subjectProductRelationList.length;
          i++
        ) {
          subjects.push(this.localData.subjectProductRelationList[i].subjectId);
        }
        return subjects;
      },
      set: function (newValue) {
        this.localData.subjectProductRelationList = [];
        for (let i = 0; i < newValue.length; i++) {
          this.localData.subjectProductRelationList.push({
            subjectId: newValue[i],
          });
        }
      },
    },
    //选中的优选
    selectPrefrenceArea: {
      get: function () {
        let prefrenceAreas = [];
        if (
          this.localData.prefrenceAreaProductRelationList == null ||
          this.localData.prefrenceAreaProductRelationList.length <= 0
        ) {
          return prefrenceAreas;
        }
        for (
          let i = 0;
          i < this.localData.prefrenceAreaProductRelationList.length;
          i++
        ) {
          prefrenceAreas.push(
            this.localData.prefrenceAreaProductRelationList[i].prefrenceAreaId
          );
        }
        return prefrenceAreas;
      },
      set: function (newValue) {
        this.localData.prefrenceAreaProductRelationList = [];
        for (let i = 0; i < newValue.length; i++) {
          this.localData.prefrenceAreaProductRelationList.push({
            prefrenceAreaId: newValue[i],
          });
        }
      },
    },
  },
  methods: {
    filterMethod(query, item) {
      return item.label.indexOf(query) > -1;
    },
    getSubjectList() {
      fetchSubjectList().then((response) => {
        let list = response.data;
        for (let i = 0; i < list.length; i++) {
          this.subjectList.push({
            label: list[i].title,
            key: list[i].id,
          });
        }
      });
    },
    getPrefrenceAreaList() {
      fetchPrefrenceAreaList().then((response) => {
        let list = response.data;
        for (let i = 0; i < list.length; i++) {
          this.prefrenceAreaList.push({
            label: list[i].name,
            key: list[i].id,
          });
        }
      });
    },
    handlePrev() {
      this.$emit("prevStep");
    },
    handleFinishCommit() {
      this.$emit("finishCommit", this.isEdit);
    },
  },
};
</script>

<style scoped></style>
