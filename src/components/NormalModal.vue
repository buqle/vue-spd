<template>
  <Modal :fullscreen="modal.fullscreen" v-model="modal.show" :title="modal.title" :width="modal.width" :styles="styles"  @on-visible-change="onVisibleChange">
    <Form v-if="modal.htmlType == 'form'" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="modal.labelWidth">
      <FormItem v-for="(val,key,i) in formValidate" :label="modal.datas[i]['text']" :prop="modal.datas[i]['id']" :key="i">
        <InputNumber v-if="modal.datas[i]['type'] == 'InputNumber'"
                     :max="isEmpty(modal.datas[i]['max'])?modal.datas[i]['max']:Infinity"
                     :min="isEmpty(modal.datas[i]['min'])?modal.datas[i]['min']:-Infinity" v-model="formValidate[key]"></InputNumber>
      </FormItem >
    </Form>
    <div class="condition" v-if="modal.htmlType == 'formTable'">
      <div v-if="modal.buttons" class="condition-row">
        <Button v-for="(item,index) in modal.buttons" :key="index" size="large" type="default" :icon="item.icon" :class="item.cls" class="mr10" @click="item.fun">{{item.text}}</Button>
      </div>
      <div class="condition-row">
        <div v-for="(item,index) in modal.form" :key="index" class="condition-group" :style="{width:item.width?item.width:''}">
          <label v-if="item.label">{{item.text}}</label>
          <Select v-if="item.type == 'Select'"
                  :filterable="item.filterable"
                  :remote="item.remote"
                  :remote-method="item.fun?item.fun:() => () => {}"
                  :loading="item.loading"
                  v-model="queryParam[item.id]"
                  :placeholder="item.placeholder"
                  clearable
                  class="condition-group-ipt">
            <Option v-for="(oitem,oindex) in item.list" :value='oitem[item.listValue]' :key="oindex">{{oitem[item.listText]}}</Option>
          </Select>
          <Input v-if="item.type == 'Input'" v-model="queryParam[item.id]" search/>
        </div>
      </div>
      <div class="condition-table">
        <Table height="400" ref="selection"  @on-selection-change="onSelectionChange" :loading="modal.table.loading" :columns="modal.table.columns" :data="modal.table.data"></Table>
      </div>
      <div v-if="modal.page" class="condition-page">
        <Page :total="modal.page.total" :page-size="modal.page.pageSize" :current.sync="modal.page.pageNo" @on-change="getTableData()" show-total show-elevator />
      </div>
    </div>
    <div slot="footer">
      <Button type="text" size="large" @click="handleCancle">取消</Button>
      <Button type="primary" size="large" :loading="modal.loading" @click="handleComfirm">确定</Button>
    </div>
  </Modal>
</template>

<script>
  import {isEmpty} from "../util/util";
  import {Message} from 'iView';
  export default {
    name:'NormalModal',
    props: {
      modal:{
        type:Object,
        default:()=>{}
      }
    },
    data(){
      return{
        formValidate:{},
        ruleValidate:{},
        selectData:[],
        queryParam:{}
      }
    },
    created() {

    },
    methods:{
      isEmpty,
      handleCancle(){
        this.$emit('cancleEditModal',false)
      },
      handleComfirm(){
        if(this.modal.htmlType == 'form'){
          this.$refs.formValidate.validate((valid) => {
            if (valid) {
              this.$emit('comfirmEditModal',this.formValidate);
            } else {
              Message.error('请填写符合要求的数值!');
            }
          })
        }else{
          if(!this.modal.noSelect){
            if(this.selectData.length == 0){
              Message.warning('请至少选中一条数据');
              return;
            }
          }
          this.$emit('comfirmEditModal',this.selectData);
        }
      },
      getFormValidate(){
        let modal = this.modal;
        if(modal.htmlType && modal.htmlType == 'form'){
          if(modal.datas && modal.datas.length >0){
            modal.datas.forEach(item => {
              this.$set(this.formValidate,item.id,item.value)
            })
          }
        }
      },
      getRuleValidate(){
        let modal = this.modal;
        if(modal.htmlType && modal.htmlType == 'form'){
          if(modal.datas && modal.datas.length >0){
            modal.datas.forEach(item => {
              if(item.rules){
                this.$set(this.ruleValidate,item.id,item.rules)
              }
            })
          }
        }
      },
      getQueryParam(){
        let modal = this.modal;
        if(modal.htmlType && modal.htmlType == 'formTable'){
          if(modal.form && modal.form.length >0){
            modal.form.forEach(item => {
              this.$set(this.queryParam,item.id,item.value)
            })
          }
        }
      },
      onSelectionChange(selection){
        this.selectData = selection;
        this.$emit('setSelectData',this.selectData);
      },
      getTableData(flag){
        let pageNo = this.modal.page.pageNo;
        let pageSize = this.modal.page.pageSize;
        if(flag){//查询是返回第一页，分页查询不用
          pageNo = 1;
        }
        let param = {pageNo,pageSize,...this.queryParam}
        this.$emit('modalDataQuery',param);
      },
      onVisibleChange(status){
        let id = "";
        if(this.modal.id){
          id = this.modal.id;
        }
        this.$emit('visibleChange',status,id);
      }
    },
    watch:{
      'modal': {
        deep: true,
        handler(newVal, oldVal) {
          this.getFormValidate();
          this.getRuleValidate();
          this.getQueryParam();
        }
      },
      'formValidate': {
        deep: true,
        handler (newVal, oldVal) {
          this.$emit('modalValueChange', newVal)
        }
      },
      'queryParam': {
        deep: true,
        handler (newVal, oldVal) {
          this.getTableData(true);
        }
      },
    },
    computed: {
      styles () {
        let style = {};
        if (this.modal.top) {
          style['top'] = `${this.modal.top}px`;
        }
        return style;
      }
    }
  }
</script>

<style scoped lang="less">
  .ivu-input-number{
    width: 100%;
  }
</style>
