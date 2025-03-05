<template>
   
  <div>
    <el-upload
      :action="useOss ? ossUploadUrl : minioUploadUrl"
      :data="useOss ? dataObj : null"
      list-type="picture-card"
      :multiple="false"
      :show-file-list="showFileList"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">
        只能上传jpg/png文件，且不超过10MB
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import { policy } from "@/api/oss";

export default {
  name: "singleUpload",
  props: {
    value: String,
  },
  computed: {
    imageUrl() {
      return this.value;
    },
    imageName() {
      if (this.value != null && this.value !== "") {
        return this.value.substr(this.value.lastIndexOf("/") + 1);
      } else {
        return null;
      }
    },
    fileList() {
      return [
        {
          name: this.imageName,
          url: this.imageUrl,
        },
      ];
    },
    showFileList: {
      get: function () {
        return (
          this.value !== null && this.value !== "" && this.value !== undefined
        );
      },
      set: function (newValue) {},
    },
  },
  data() {
    return {
      dataObj: {
        policy: "",
        signature: "",
        key: "",
        ossaccessKeyId: "",
        dir: "",
        host: "",
        // callback:'',
      },
      dialogVisible: false,
      useOss: false, //使用oss->true;使用MinIO->false
      ossUploadUrl: "http://macro-oss.oss-cn-shenzhen.aliyuncs.com",
      minioUploadUrl: "http://localhost:8080/minio/upload",
      currentFileList: [],
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        this.updateFileList(newVal);
      },
    },
  },
  methods: {
    updateFileList(url) {
      if (url) {
        this.currentFileList = [
          {
            name: this.getFileName(url),
            url: url,
          },
        ];
      } else {
        this.currentFileList = [];
      }
    },
    getFileName(url) {
      if (!url) return "";
      const arr = url.split("/");
      return arr[arr.length - 1];
    },
    emitInput(val) {
      this.$emit("input", val);
    },
    handleRemove() {
      this.emitInput("");
      this.currentFileList = [];
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeUpload(file) {
      if (!this.useOss) return true;

      return new Promise((resolve, reject) => {
        policy()
          .then((response) => {
            this.dataObj = {
              policy: response.data.policy,
              signature: response.data.signature,
              ossaccessKeyId: response.data.accessKeyId,
              key: response.data.dir + "/${filename}",
              dir: response.data.dir,
              host: response.data.host,
            };
            resolve(true);
          })
          .catch(reject);
      });
    },
    handleUploadSuccess(res, file) {
      let url = "";

      if (this.useOss) {
        url = `${this.dataObj.host}/${this.dataObj.dir}/${encodeURIComponent(
          file.name
        )}`;
      } else {
        url = res.data?.url || URL.createObjectURL(file.raw);
      }
      this.updateFileList(url);
      this.emitInput(url);
    },
  },
};
</script>
<style>
.el-upload-list__item-thumbnail {
  object-fit: contain !important;
}
</style>
