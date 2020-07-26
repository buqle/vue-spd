<template>
  <div class="condition">
    <div class="condition-row">
      <div class="condition-group">
        <label>申领单</label>
        <Input v-model="form.applyCode" placeholder="请输入申领单" class="condition-group-ipt"></Input>
      </div>
      <div class="condition-group">
        <label>状态</label>
        <Select v-model="form.applyStatus" class="condition-group-ipt">
          <Option  v-for="(item,index) in types" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>发起时间</label>
        <DatePicker v-model="updateDate" type="daterange" class="condition-group-ipt" placement="bottom-end" placeholder="更新时间" @on-clear="handleClear"></DatePicker>
      </div>
    </div>
    <div class="condition-row">
      <Button size="large" type="default" icon="md-add" class="l" @click="addUpdateApply()">新建申领</Button>
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
            return item.drugCode == it.drugCode;
          })
          if(!flag){
            datas.push(item);
            ids.push(item.drugCode);
          }
        })
        this.addModalOut.table.data = datas;
        this.addModalIn.table.existIds = ids;
        this.addModalIn.table.existDatas = datas;
      }
      const columns1 = [
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
          title: '通用名称',
          key: 'ctmmGenericName',
          width: 224,
        },
        {
          title: '商品名',
          key: 'ctmmTradeName',
          width: 224
        },
        {
          title: '规格',
          key: 'ctmmSpecification',
          width: 168
        },
        {
          title: '剂型',
          key: 'ctmmDosageFormDesc',
          width: 168,
        },
        {
          title: '生产厂家',
          key: 'ctmmManufacturerName',
          width: 224,
        },
        {
          title: '包装规格',
          key: 'packageSpecification',
          width: 168
        },
        {
          title: '单位',
          key: 'replanUnit',
          width: 112,
        },
        {
          title: '申领数量',
          key: 'baseApplyNum',
          width: 120,
        },
        {
          title: '可用库存',
          key: 'localUsableQuantity',
          width: 112,
        },
        {
          title: '库存基数',
          key: 'stockBase',
          width: 112,
        },
        {
          title: '批准文号',
          key: 'approvalNo',
          width: 224,
        }
      ];
      const columns2 = [
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
          title: '通用名',
          key: 'ctmmGenericName',
          width: 224
        },
        {
          title: '商品名',
          key: 'ctmmTradeName',
          width: 224,
        },
        {
          title: '规格',
          key: 'ctmmSpecification',
          width: 168,
        },
        {
          title: '剂型',
          key: 'ctmmDosageFormDesc',
          width: 168
        },
        {
          title: '包装规格',
          key: 'packageSpecification',
          width: 168
        },
        {
          title: '批准文号',
          key: 'approvalNo',
          width: 224,
        },
        {
          title: '生产厂家',
          key: 'ctmmManufacturerName',
          width: 224,
        }]
      return {
        outSelectData:[],
        page:{
          pageNo:1,
          pageSize:10,
          total:0
        },
        form: {
          applyCode:'',
          applyStatus:'',
          startTime:'',
          endTime:'',
          queryType: 1
        },
        updateDate:[],//更新时间
        loading: false,
        dataList:[],
        types:[],
        columns: [
          {
            type: 'index',
            title: '序号',
            align: 'center',
            width: 60
          },
          {
            title: '申领单',
            key: 'applyCode',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {color:'#0681f4',cursor:'pointer','margin-right':`5px`},
                  on: {
                    click: () => {
                      this.$router.push({path: "/baseDrug/wareHouse/drugApply/details", query:{applyCode:params.row.applyCode}})
                    }
                  }
                },params.row.applyCode),
                h('Badge', {
                  props: {
                    count: params.row.applydetailsItemsCount
                  }
                }),
              ]);
            }
          },
          {
            title: '申领部门',
            key: 'applyDeptName',
            align: 'center'
          },
          {
            title: '配货部门',
            key: 'distributeDeptName',
            align: 'center'
          },
          {
            title: '状态',
            key: 'applyStatusName',
            align: 'center'
          },
          {
            title: '发起人',
            key: 'createUserName',
            align: 'center'
          },
          {
            title: '发起时间',
            key: 'createDate',
            align: 'center'
          }],
        addModalOut:{
          id:'addModalOut',
          show:false,
          title:'新建申领',
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
            columns:columns1,
            data:[]
          }
        },
        addModalIn:{
          id:'addModalIn',
          show:false,
          title:'添加产品',
          htmlType:'formTable',
          width:984,
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
            placeholder:'通用名/商品名',
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
            columns:columns2,
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
        if(data && data.length  == 0){
          Message.warning("请选择需要申领的数据！");
          return;
        }
        let isNull = data.every(item => {
          if(item.baseApplyNum <= 0) {
            Message.warning('当前提交数据中存在库存不足的数据!');
            return false;
          };
          return true
        });
        if(!isNull) {
          return;
        }
        let detailList = data.map(item => {
          return {
            applyNum: item.baseApplyNum,
            drugCode: item.drugCode,
          }
        });
        let saveInfo = await this.$api.baseDrug.saveDrug({
          detaiList:detailList,applyStatus: "1",applyType: "1"
        });
        this.addModalOut.loading = false;
        if(saveInfo.code == 200){
          this.addModalOut.show = false;
          Message.success("提交成功！");
          this.getData(true);
        }else{
          Message.error(saveInfo.msg?saveInfo.msg:'提交失败！');
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
          this.outSelectData = [];
        }
      },
      async comfirmEditModal(selectDatas){
        this.addModalIn.loading = true;
        let drugCodeList = [];
        selectDatas.forEach(item => {
          drugCodeList.push(item.drugCode);
        });
        let info = await this.$api.baseDrug.addDrug({
          drugCodeList:drugCodeList
        });
        this.addModalIn.loading = false;
        if(info.code == 200){
          this.addModalIn.show = false;
          this.setExistDatas(info.data);
        }else{
          Message.error('添加报错！')
        }
      },
      setExistDatas(data){
        let existIds = this.addModalIn.table.existIds;
        let existDatas = this.addModalIn.table.existDatas;
        data.forEach(item => {
          var flag = existIds.find((value) => {
            return value == item.drugCode;
          })
          if(!flag){//不存在
            existIds.push(item.drugCode);
            existDatas.push(item);
          }
        });
        this.addModalOut.table.data = existDatas;
      },
      async modalDataQuery(params){
        this.addModalIn.form.forEach((item,index)=> {
          this.addModalIn.form[index].value = params[item.id];
        })
        this.addModalIn.table.loading = true;
        let datalist = await this.$api.baseDrug.queryDrugByDept({
          pageNo:params.pageNo,
          pageSize:params.pageSize,
          hisDrugCodeList: params.hisDrugCodeList? [params.hisDrugCodeList] : [],
          existDrugCodeList:this.addModalIn.table.existIds,
          applyFlag: true
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
      async getTypes(flag){
        let data = await this.$api.publics.typeList({
          type: 'apply_status'
        });
        this.types = data.data;
      },
      async getData(flag){
        let updateDate = this.updateDate;
        if(updateDate && Array.isArray(updateDate) && updateDate.length > 0 && updateDate[0] && updateDate[1]){
          this.form.startTime = this.$moment(updateDate[0]).format('YYYY-MM-DD');
          this.form.endTime = this.$moment(updateDate[1]).format('YYYY-MM-DD');
        }
        if(flag){
          this.page.pageNo = 1;
        }
        this.loading = true;
        let datalist = await this.$api.baseDrug.applyList({
          ...this.form,pageNo:this.page.pageNo,pageSize:this.page.pageSize
        });
        this.loading = false;
        let data = datalist.data;
        this.dataList = data.list;
        this.page = { total: data.count, pageNo: data.pageNo,pageSize: data.pageSize};
      },
      handleClear(){
        this.updateDate = [];
        this.form.startTime = "";
        this.form.endTime = "";
      },
      addUpdateApply(){
        this.addModalOut.show = true;
      }
    },
    created(){
      this.getTypes();
      this.getData();
    }
  }
</script>
