<template>
  <div class="home">
    <FormItem 
      label="输入框1" 
      :value.sync="input1" 
      :required="true" 
    />
    <FormItem 
      type="select" 
      label="下拉框1"
      :value.sync="value1" 
      :columns="options"
      :required="true"
    /> 
    <FormItem 
      type="picker" 
      label="时间"
      :value.sync="picker" 
      :required="true"
    /> 
    <FormItem 
      type="uploadAvatar" 
      label="上传图片-用户头像"
      :value.sync="imgStr"
      imgWidth="120px"
      imgHeight="120px"
    /> 
    <FormItem 
      type="abridgeImg" 
      label="上传图片-照片墙"
      :value.sync="imgArr"
      imgWidth="120px"
      imgHeight="120px"
      :limit= '2'
    /> 
    <FormItem 
      type="file" 
      label="上传附件"
      :value.sync="fileList"
    />
    <el-button type="danger" @click="add">点击提交数据</el-button>
    <div style="marginTop: 200px">
      <Editor 
        @eaitorTex="eaitorTex" 
        ref="resetEdit"
      />
    </div>
  </div>
</template>

<script>
import FormItem from "@/components/formItem";
import Editor from "@/components/wangEditor"

export default {
  name: "Home",
  components: {
    FormItem,
    Editor
  },
  data() {
    return {
      input1: "99",
      value1: '选项1',
      picker: '',
      editor: "",
      imgStr: 'https://i.loli.net/2017/11/09/5a046546a2a1f.jpg',
      imgArr: [],
      fileList: [],
      // fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],

      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
    };
  },
  methods: {
    add() {
      console.log(this.input1,'文本输入框');
      console.log(this.value1, '下拉框');
      console.log(this.picker, '时间框');
      console.log(this.editor, '富文本编辑器');
      console.log(this.imgStr, '用户头像');
      console.log(this.imgArr, '照片墙');
      console.log(this.fileList, '上传附件');
    },
    // 富文本 --- 接收子组件富文本的数据
    eaitorTex(val) {
      this.editor = val;
    },
    // this.$refs.resetEdit.editor.txt.clear() // 富文本 ---  重置富文本框
  },
  mounted(){
    // 富文本 --- 创建编辑器之后，设置编辑器内容
    this.$refs.resetEdit.editor.txt.html()
  }
};
</script>
