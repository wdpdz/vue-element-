<!--
 *@FileDescription: wang编译功能
 *@Auhor: wdp
 *@Date: 2022-5-27
 *@LastEditors: wdp
 *@LastEditTime: 2022-5-27
-->
<template>
  <div id="div1"></div>
</template>

<script>
import E from "wangeditor";
export default {
  data() {
    return {
      editor: "",
    };
  },
  mounted() {
    this.editor = new E("#div1");

    // 配置 onchange 回调函数
    this.editor.config.onchange = newHtml => {
        this.$emit('eaitorTex',newHtml)
    };
    // 配置触发 onchange 的时间频率，默认为 200ms
    this.editor.config.onchangeTimeout = 500; // 修改为 500ms

    // 默认情况下，显示所有菜单
    this.editor.config.menus = [
      "head",
      "bold",
      "fontSize",
      "fontName",
      "italic",
      "underline",
      //   "strikeThrough",
      "indent",
      "lineHeight",
      //   "foreColor",
      "backColor",
      "link",
      //   "list",
      "todo",
      "justify",
      "quote",
      "emoticon",
      "image",
      "video",
      "table",
      "code",
      "splitLine",
      "undo",
      "redo",
    ];

    this.editor.create();
  },
};
</script>

<style>
</style>