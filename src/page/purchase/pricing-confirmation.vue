<template>
  <div class="condition">
    <div class="condition-row">
      <div class="condition-group">
        <label>单号</label>
        <Input v-model="form.updatePriceNo" placeholder="请输入单号" class="condition-group-ipt"></Input>
      </div>
      <div class="condition-group">
        <label>发起时间</label>
        <DatePicker v-model="updateDate" type="daterange" class="condition-group-ipt" placement="bottom-end" placeholder="更新时间" @on-clear="handleClear"></DatePicker>
      </div>
    </div>
    <div class="condition-row">
      <Button size="large" type="default" icon="md-add" class="l" @click="addUpdatePrice()">新建调价</Button>
      <Button size="large" type="default" icon="ios-search" class="r" @click="getData(true)">查询</Button>
    </div>
    <div class="condition-table">
      <Table :loading="loading" :columns="columns" :data="dataList"></Table>
    </div>
    <div class="condition-page">
      <Page :total="page.total" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getData()" show-total show-elevator />
    </div>
    <NormalModal :modal="addModalOut"
                 @cancleEditModal="cancleEditModalOut"
                 @setSelectData="setSelectData"
                 @comfirmEditModal="comfirmEditModalOut"
                 @visibleChange="visibleChange">
    </NormalModal>
    <NormalModal :modal="addModalIn"
                 @modalDataQuery="modalDataQuery"
                 @comfirmEditModal="comfirmEditModal"
                 @cancleEditModal="cancleEditModalIn"
                 @visibleChange="visibleChange">
    </NormalModal>
  </div>
</template>
<script>
  import NormalModal from '@/components/NormalModal';
  import _ from 'lodash';
  import {Message,Modal} from 'iView';
  export default {
    components:{
      NormalModal
    },
    data () {
      const handleQueryModal = value => {
        if(value !== ''){
          this.queryDrugByListModal(value);
        }else{
          this.addModalIn.form[0].list = [];
        }
      }
      const addProduct = (value) => {
        this.addModalIn.show = true;
      }
      const delProduct = (value) => {
        if(this.outSelectData && this.outSelectData.length == 0){
          Message.warning('请选择一条数据！');
          return;
        }
        let existData = this.addModalOut.table.data;
        let datas = [],ids = [];
        existData.forEach((item,index) =>{
          var flag = this.outSelectData.find((it) => {
            return item.id == it.id;
          })
          if(!flag){
            datas.push(item);
            ids.push(item.id);
          }
        })
        this.addModalOut.table.data = datas;
        this.addModalIn.table.existIds = ids;
        this.addModalIn.table.existDatas = datas;
      }
      const columns = [
        {
          type: 'selection',
          align: 'center',
          width: 60
        },
        {
          type: 'index',
          title: '序号',
          align: 'center',
          width: 60
        },
        {
          title: '药品名称',
          key: 'ctmmTradeName',
          align: 'center'
        },
        {
          title: '生产厂家',
          key: 'ctmmManufacturerName',
          align: 'center'
        },
        {
          title: '供应商',
          key: 'supplierName',
          align: 'center'
        },
        {
          title: '单位',
          key: 'ctmmValuationUnit',
          align: 'center'
        },
        {
          title: '调整后价格',
          key: 'newPrice',
          align: 'center'
        },
        {
          title: '批准文号',
          key: 'approvalNo',
          align: 'center'
        }]
      return {
        outSelectData:[],
        page:{
          pageNo:1,
          pageSize:10,
          total:0
        },
        form: {
          updatePriceNo:'',
          startDate:'',
          endDate:''
        },
        updateDate:[],//更新时间
        loading: false,
        dataList:[],
        columns: [
          {
            type: 'index',
            title: '序号',
            align: 'center',
            width: 60
          },
          {
            title: '调价单号',
            key: 'updatePriceNo',
            align: 'center',
            render: (h, params) => {
              return h('span', {
                style: {color:'#0681f4',cursor:'pointer'},
                on: {
                  click: () => {
                    this.$router.push({path: "/purchase/drugPricing/pricingConfirmation/detail", query:{updatePriceNo:params.row.updatePriceNo}})
                  }
                }
              },params.row.updatePriceNo);
            }
          },
          {
            title: '状态',
            key: 'statusName',
            align: 'center'

          },
          {
            title: '发起时间',
            key: 'createDate',
            align: 'center'

          },
          {
            title: '发起人',
            key: 'createUserName',
            align: 'center'
          }],
        addModalOut:{
          id:'addModalOut',
          show:false,
          title:'新建调价',
          htmlType:'formTable',
          loading:false,
          fullscreen:true,//全屏
          noSelect:true,//不必勾选就可以提交
          buttons:[
            {
              text:"添加产品",
              icon:'md-add',
              cls:"l",
              fun:addProduct
            },
            {
              text:"删除",
              icon:'md-remove',
              cls:"l",
              fun:delProduct
            }],
          table:{
            loading:false,
            columns:columns,
            data:[]
          }
        },
        addModalIn:{
          id:'addModalIn',
          show:false,
          title:'添加产品',
          htmlType:'formTable',
          width:884,
          top:20,
          labelWidth:50,
          loading:false,
          query:{
            paramName: '',
            queryType: 3
          },
          form:[{
            id:"hisDrugCodeList",
            text:"药品名称",
            type:'Select',
            placeholder:'药品名称',
            width:'62%',
            label:false,
            fun:handleQueryModal,
            hisDrugCodeList:'',
            list:[],
            listValue:'bigDrugCode',
            listText:'ctmmParam',
            filterable:true,
            remote:true,
            loading:false,
            value:''
          }],
          table:{
            existIds:[],//选中的
            existDatas:[],//选中的数据
            loading:false,
            columns:columns,
            data:[]
          },
          page:{
            pageNo:1,
            pageSize:10,
            total:0
          }
        },
      }
    },
    methods:{
      async comfirmEditModalOut(){
        this.addModalOut.loading = true;
        let data = this.addModalOut.table.data;
        let detailList = data.map(item => ({
          ctmmGenericName: item.ctmmGenericName,
          ctmmValuationUnit: item.ctmmValuationUnit,
          fromDate: item.fromDate,
          hisDrugCode: item.hisDrugCode,
          price: item.newPrice,
          supplierCode: item.supplierCode,
          supplierGoodFlowId: item.id,
          toDate: item.toDate,
          unitCode: item.unitCode
        }));
        if(data && data.length  == 0){
          Message.warning("请选择需要调价的数据！");
          return;
        }
        let saveInfo = await this.$api.purchase.checkPriceDetailConfrim({detailList:detailList});
        if(saveInfo.code == 200){
          this.addModalOut.loading = false;
          this.addModalOut.show = false;
          Message.success("保存成功！");
          this.getData(true);
        }
      },
      setSelectData(selectData){
        this.outSelectData = selectData;
      },
      cancleEditModalOut(){
        this.addModalOut.show = false;
      },
      cancleEditModalIn(){
        this.addModalIn.show = false;
      },
      visibleChange(status,id){
        if(id && id == 'addModalIn'){
          if(status){//打开
            this.addModalIn.form[0].value = '' ;
          }else{//关闭
            this.addModalIn.form[0].value = undefined;
          }
        }else if(id && id == 'addModalOut' && !status){
          this.addModalIn.table.existIds = [];
          this.addModalIn.table.existDatas = [];
          this.addModalOut.table.data = [];
        }
      },
      comfirmEditModal(selectDatas){
        this.addModalIn.loading = true;
        let existIds = this.addModalIn.table.existIds;
        let existDatas = this.addModalIn.table.existDatas;
        selectDatas.forEach(item => {
          var flag = existIds.find((value) => {
            return value == item.id;
          })
          if(!flag){//不存在
            existIds.push(item.id);
            existDatas.push(item);
          }
        });
        this.addModalOut.table.data = existDatas;
        this.addModalIn.loading = false;
        this.addModalIn.show = false;
      },
      async modalDataQuery(params){
        this.addModalIn.form.forEach((item,index)=> {
          this.addModalIn.form[index].value = params[item.id];
        })
        this.addModalIn.table.loading = true;
        let datalist = await this.$api.purchase.selectDrugCode({
          pageNo:params.pageNo,
          pageSize:params.pageSize,
          hisDrugCodeList: params.hisDrugCodeList? [params.hisDrugCodeList] : [],
          existIds:this.addModalIn.table.existIds
        });
        this.addModalIn.table.loading = false;
        let data = datalist.data;
        this.addModalIn.table.data = data.list;
        this.addModalIn.page = { total: data.count, pageNo: data.pageNo,pageSize: data.pageSize};
      },
      async queryDrugByListModal(value){
        Object.assign(this.addModalIn.query,{paramName:value});
        this.addModalIn.form[0].loading = true;
        let data = await this.$api.publics.queryDrugByList({
          ...this.addModalIn.query
        });
        this.addModalIn.form[0].loading = false;
        this.addModalIn.form[0].list = data.data;
      },
      async getData(flag){
        let updateDate = this.updateDate;
        if(updateDate && Array.isArray(updateDate) && updateDate.length > 0 && updateDate[0] && updateDate[1]){
          this.form.startDate = this.$moment(updateDate[0]).format('YYYY-MM-DD');
          this.form.endDate = this.$moment(updateDate[1]).format('YYYY-MM-DD');
        }
        if(flag){
          this.page.pageNo = 1;
        }
        this.loading = true;
        let datalist = await this.$api.purchase.checkPriceList({
          ...this.form,pageNo:this.page.pageNo,pageSize:this.page.pageSize
        });
        this.loading = false;
        let data = datalist.data;
        this.dataList = data.list;
        this.page = { total: data.count, pageNo: data.pageNo,pageSize: data.pageSize};
      },
      handleClear(){
        this.updateDate = [];
        this.form.startDate = "";
        this.form.endDate = "";
      },
      addUpdatePrice(){
        this.addModalOut.show = true;
      }
    },
    created(){
      this.getData();
    }
  }
</script>
