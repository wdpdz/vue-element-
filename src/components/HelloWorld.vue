/** * 查询条件组件 */
<template>
  <div class="formSearch">
    <div class="table-header" v-if="tableSearch && tableSearch.length > 0">
      <el-form
        size="small"
        :rules="rules"
        :model="formSearch"
        :inline="true"
        ref="formSearch"
        label-position="right"
        v-bind="{ 'label-width': '30%', ...(options && options.formProps) }"
      >
        <el-row :gutter="40">
          <template v-for="(item, index) in tableSearch">
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6" :key="index">
              <el-form-item
                class="table-header-item"
                :label="item.label"
                :prop="item.value"
                :key="index"
                v-bind="item.labelProps"
              >
                <!-- 下拉 -->
                <el-select
                  clearable
                  v-bind="item.props"
                  v-if="item.type === 'select'"
                  v-model="formSearch[item.value]"
                  :placeholder="`请选择${item.placeholder || item.label}`"
                >
                  <el-option v-for="option in item.children" :key="option.value" :value="option.value" :label="option.label" />
                </el-select>
                <!-- 级联 -->
                <el-date-picker
                  clearable
                  style="width: 100%;"
                  placeholder="选择日期"
                  v-bind="item.props || { type: 'date' }"
                  v-else-if="item.type === 'picker'"
                  v-model="formSearch[item.value]"
                />
                <el-cascader
                  v-else-if="item.type === 'cascader'"
                  v-model="formSearch[item.value]"
                  :options="item.options"
                ></el-cascader>
                <!--数字 -->
                <el-input
                  v-if="item.inputType === 'number'"
                  clearable
                  v-bind="item.props"
                  v-model="formSearch[item.value]"
                  :placeholder="`请输入${item.placeholder || item.label}`"
                  :maxlength="item.maxlength"
                  @keyup.enter.native="handleSearch"
                  :oninput="handleChangeInput(item)"
                />
            <!--文本-->
                <el-input
                  v-if="item.type === 'text'"
                  clearable
                  v-bind="item.props"
                  v-model="formSearch[item.value]"
                  :placeholder="`请输入${item.placeholder || item.label}`"
                  :maxlength="item.maxlength"
                  @keyup.enter.native="handleSearch"
                  :oninput="handleChangeInput(item)"
                />
            <!--  申请额度范围 最低 -->
                <el-input
                  class="halfWidth"
                  v-if="item.apply === 'applyLow'"
                  clearable
                  v-bind="item.props"
                  :type="item.inputType || 'text'"
                  v-model="formSearch[item.value]"
                  :maxlength="item.maxlength"
                  @keyup.enter.native="handleSearch"
                  :oninput="handleChangeInput(item)"
                />
                <!--  申请额度范围 最高 -->
                <el-input
                  class="halfWidth lvsige"
                  v-if="item.apply === 'applyHeight'"
                  clearable
                  v-bind="item.props"
                  :type="item.inputType || 'text'"
                  v-model="formSearch[item.value]"
                  :maxlength="item.maxlength"
                  @keyup.enter.native="handleSearch"
                  :oninput="handleChangeInput(item)"
                />
              </el-form-item>
            </el-col>
          </template>
          <el-col :xs="w" :sm="w" :md="w" :lg="w" :xl="w" class="table-item-btns-box">
            <el-form-item>
              <el-button size="small" type="primary" _icon="el-icon-search" @click="handleSearch" class="wide-button lvsige">
                查询
              </el-button>
              <el-button plain size="small" _icon="el-icon-refresh-right" @click="handleReset('formSearch')" class="wide-button">
                重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { convertParams } from '@/utils/tool'
const methods = {
  // 搜索查询按钮
  handleSearch() {
    console.log('查询')
    if (this.rules) {
      return this.$refs['formSearch'].validate(valid => {
        if (!valid) return false
        this.$emit('handleSearch', convertParams(Object.assign({}, this.formSearch)))
      })
    }
    this.$emit('handleSearch', convertParams(Object.assign({}, this.formSearch)))
  },
  // 搜索重置按钮
  handleReset(formName) {
    this.$refs[formName].resetFields()
    // this.$refs.cascader.clearCheckedNodes()
    this.formSearch = this.reset ? { ...this.value } : {}
    this.$emit('handleReset')
    if (this.reset) return false
    this.handleSearch()
  },
  // input为number校验
  handleChangeInput(item) {
    return item.inputType === 'number' ? this.handleOnInput(this.formSearch[item.value], item.value, item.rulesLength) : null
  },
  // input渲染长度校验
  handleOnInput(val, label, rulesLength) {
    if (val && Number(val) <= 0) {
      this.formSearch[label] = 0
    }
    if (rulesLength && val && val.length > 11) {
      this.formSearch[label] = this.formSearch[label].slice(0, 11)
    }
  }
}
export default {
  name: 'FormSearch',
  props: {
    tableSearch: {
      type: Array
    },
    rules: {
      type: Object
    },
    value: {
      type: Object
    },
    reset: {
      type: Boolean
    },
    rulesLength: {
      type: Boolean
    },
    options: Object
  },
  data() {
    return {
      formSearch: {
        ...this.value
      },
      w: 0
    }
  },
  mounted() {
    // :xs="24" :sm="12" :md="12" :lg="8" :xl="6"
    //   768     1200       1200            1920
    // const arr = ['xs', 'sm', 'md', 'lg', 'xl']
    const s = +document.body.clientWidth
    let n = 3
    console.log(s)
    if (s < 768) {
      n = 1
    } else if (s > 768 && s < 1200) {
      n = 2
    } else if (s > 1200 && s < 1912) {
      n = 3
    } else if (s >= 1912) {
      n = 4
    }

    const r = this.tableSearch.length % n
    if (n === 1) {
      this.w = 24
    } else if (n === 2) {
      if (r === 0) this.w = 24
      if (r === 1) this.w = 12
    } else if (n === 3) {
      if (r === 0) this.w = 24
      if (r === 1) this.w = 16
      if (r === 2) this.w = 8
    } else if (n === 4) {
      if (r === 0) this.w = 24
      if (r === 1) this.w = 18
      if (r === 2) this.w = 12
      if (r === 3) this.w = 6
    }
  },
  methods,
  watch: {
    value(val) {
      if (val) return (this.formSearch = { ...this.value })
    }
  }
}
</script>
<style lang="scss" scoped>
  /deep/.lvsige {
    margin-left: -65% !important;
  }
  /deep/.halfWidth {
    width: 47% !important;
  }
.table-header {
  padding-top: 10px;
  /deep/ .el-form-item {
    display: flex;
    margin-bottom: 12px;
    .el-form-item__content {
      width: 70%;
      min-width: 200px;
      .el-cascader {
        width: 100%;
      }
    }
    .el-select {
      width: 100%;
    }
    .el-form-item__label {
      min-width: 120px;
    }
  }
  .table-item-btns-box {
    text-align: right;
    /deep/ .el-form-item__content {
      width: 100%;
      min-width: 200px;
      text-align: right;
    }
  }
  /deep/.el-input--suffix .el-input__inner {
    padding-right: 0;
  }
}
</style>

