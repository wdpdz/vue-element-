<!--
 *@FileDescription: 基本form组件
 *@Auhor: wdp
 *@Date: 2022-5-27
 *@LastEditors: wdp
 *@LastEditTime: 2022-5-27
-->
<template>
  <div class="form-item">
    <!-- 标题 -->
    <div class="form-item_label">
      <label><span style="color: red" v-if="required">*</span>{{ label }}</label>
    </div>

    <!-- input输入框  -->
    <div class="form-item_value input" v-if="type == 'text'">
      <el-input
        v-model="val"
        placeholder="请输入内容"
        @input="inputEvent"
        clearable
      />
    </div>

    <!-- 下拉框 -->
    <div class="form-item_value select" v-if="type == 'select'">
      <el-select v-model="val" clearable placeholder="请选择" @input="inputEvent">
        <el-option
          v-for="item in columns"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>

    <!-- 时间选择框 -->
    <div class="form-item_value picker" v-if="type == 'picker'">
      <el-date-picker 
        v-model="val" 
        type="date" 
        placeholder="选择日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        @input="inputEvent"
      >
      </el-date-picker>
    </div>

    <!-- 用户头像上传 -->
    <div class="form-item_value uploadAvatar" v-if="type == 'uploadAvatar'">
      <i v-if="value" class="el-icon-delete"></i>
      <el-upload
        class="avatar-uploader"
        action="/api/img"
        :show-file-list="false"
        :on-success="handleImgSuccess"
        :before-upload="beforeImgUpload"
      >
        <!-- <el-button v-if="model == 'button'" size="small" type="primary">点击上传</el-button> -->
        <div class="upload-wrap" :style="[imgSize]"> 
          <img v-if="value" :src="value" class="avatar" width="100%" height="100%">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </div>
      </el-upload>
    </div>

    <!-- 照片墙 -->
    <div class="form-item_value abridgeImg" v-if="type == 'abridgeImg'">
      <!-- file-list 照片墙数据来源 -->
      <el-upload
        action="/api/img"
        list-type="picture-card"
        accept=".jpg,.png"
        :file-list= value
        :on-success="handleImgSuccess22"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :class="{hide:showUpload}">
        <i class="el-icon-plus"></i>
      </el-upload> 
      <el-dialog :visible.sync="dialogVisible">
        <!-- 放大图片的图片地址 -->
        <img width="100%" :src="dialogImageUrl" alt=""> 
      </el-dialog>
    </div>

    <!-- 上传附件 -->
    <div class="form-item_value file" v-if="type == 'file'">
      <el-upload
        class="upload-demo"
        action="/api/img"
        :on-success="handleFileSuccess"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list= value>
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>
    
  </div>
</template>

<script>
export default {
  name: "formItem",
  props: {
    label: {
      type: String,
      default: () => "你好",
    },
    type: {
      type: String,
      default: () => "text",
    },
    required: {
      type: Boolean,
      default: () => false,
    },
    value: [String, Number, Array, Date],
    columns: {
      type: Array,
      default: () => [],
    },
    imgWidth: {
      type: String,
      default: () => "",
    },
    imgHeight: {
      type: String,
      default: () => "",
    },
    limit: {
      type: Number,
      default: () => null,
    }
  },
  data() {
    return {
      val: "",
      dialogImageUrl: '', // 存储展示预览图片
      dialogVisible: false, // 控制显示隐藏预览图片弹窗
      showUpload: false, // 控制显示隐藏上传图片按钮
      
    };
  },
  computed: {
    // 用户头像 -- 动态宽高
    imgSize(){
      const width = this.imgWidth?this.imgWidth:'100px'
      const height = this.imgHeight?this.imgHeight:'100px'
      return { width, height }
    },
  },
  watch: {
    value: {
      // handler watch中需要具体执行的方法，固定方法名称
      handler(newValue, oldValue) {
        this.val = newValue;
      },
      immediate: true,
    },
  },
  methods: {
    inputEvent() {
      // 配合父组件的.sync修饰符，更新响应数据
      this.$emit("update:value", this.val);
    },

    /**
     * author: wdp
     * describe: 用户头像
     * date: 2022.05.27
     * explain: 使用mockjs模拟的接口，返回的图片链接写死的
     * takeCare: 一般图片/文件参数格式为FormData，这里没做格式限制。如需要，请使用 自定义上传 属性
     */
    // 用户头像上传上传前格式判断
    beforeImgUpload(file){
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      return isJPG
    },
    // 用户头像上传上传成功后
    handleImgSuccess(file){
      this.$emit("update:value", file.list.root.url);
    },

    /************************** 照片墙逻辑开始**************************/
    // 上传成功
    handleImgSuccess22(response, file, fileList){
       // response表示上传结果
      // file表示当前上传的文件
      // fileList表示当前成功上传的图片数组
      console.log(fileList.length,this.limit)
      if (fileList.length >= this.limit) {
        console.log(22222)
        this.showUpload = true
      }
      this.$emit("update:value", fileList);
    },
    // 删除
    handleRemove(file,fileList) {
      // file代表将要删除的文件
      // fileList为删除此图片之后剩下的图片列表
      if (fileList.length < this.limit) {
        this.showUpload = false
      }
      this.$emit("update:value", fileList);
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.response.list.root.url;
      this.dialogVisible = true;
    },
    /************************** 照片墙逻辑结束**************************/

    /************************** 上传附件逻辑开始**************************/
    // 上传
    handleFileSuccess(response, file, fileList){
      this.$emit("update:value", fileList);
    },
    // 配合limit 限制上传个数
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    // 删除弹窗
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    // 删除弹窗中的 确定 按钮
    handleRemove(file, fileList) {
      this.$emit("update:value", fileList);
    },
    // 文件下载
    handlePreview(file) {
      document.location.href = file.response.list.root.url
    },
    /************************** 上传附件逻辑开始**************************/
  },
};
</script>

<style lang="less" scoped>
.form-item {
  width: 100%;
  display: flex;
  align-items: baseline; // 中心位置对齐
}

// 上传图片样式
.upload-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  &:hover {
    border-color: #409EFF;
  }
}

// 控制显示隐藏上传图片按钮
.hide /deep/ .el-upload--picture-card {
  display: none;
}

</style>