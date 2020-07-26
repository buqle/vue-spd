<template>
  <div class="container">
    <Card :bordered="false" dis-hover class="card-item info-item">
      <Row :gutter="20">
        <Col span="8">
          <span>基数药部门：</span>
          <span>{{ deptInfo.deptName ? deptInfo.deptName: ''}}</span>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" dis-hover class="card-item info-item">
      <p slot="title">产品信息</p>
      <p slot="extra">
        <Button type="default" icon="md-add" @click="addProduct()">新增</Button>
      </p>
      <Row>
        <div class="condition">
          <div class="condition-row">
            <div class="condition-group" style="width:62%">
              <RemoteSelect
                :fun="handleQuery"
                :options="options"
                :loading="selectLoading"
                :optionValue="optionValue"
                :optionText="optionText"
                placeholder="药品名称"
                v-model="hisDrugCodeList">
              </RemoteSelect>
            </div>
          </div>
          <div class="condition-table">
            <Table :loading="loading" :columns="columns" :data="dataList">
             <template slot-scope="{ row, index }" slot="stockBase">
                <InputNumber v-if="editIndex === index" :max="999999" :min="1" :precision="0" v-model="dataList[index].stockBase" style="width:100%"></InputNumber>
                <span v-else>{{ dataList[index].stockBase }}</span>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                <div v-if="editIndex === index">
                  <Button @click="handleSave(row,index)">保存</Button>
                  <Button @click="editIndex = -1">取消</Button>
                </div>
                <div v-else>
                  <Button @click="editIndex = index">编辑库存基数</Button>
                  <Button @click="handleDel(row, index)">删除</Button>
                </div>
              </template>
            </Table>
          </div>
          <div class="condition-page">
            <Page :total="page.total" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getData()" show-total show-elevator />
          </div>
        </div>
      </Row>
    </Card>
    <NormalModal :modal="addModal"
                 @cancleEditModal="cancleEditModal"
                 @modalDataQuery="modalDataQuery"
                 @comfirmEditModal="comfirmEditModal">
    </NormalModal>
  </div>
</template>
<script>
  import { Message,Modal } from 'iView';
  import NormalModal from '@/components/NormalModal';
  import RemoteSelect from '@/components/RemoteSelect';
  export default {
    components:{
      NormalModal,RemoteSelect
    },
    data () {
      const handleQueryModal = value => {
        if(value !== ''){
          this.queryDrugByListModal(value);
        }else{
          this.addModal.form[0].list = [];
        }
      }
      return {
        page:{
          pageNo:1,
          pageSize:10,
          total:0
        },
        deptCode:'',
        hisDrugCodeList:'',
        dataList:[],
        loading: false,
        selectLoading:false,
        optionValue:'bigDrugCode',
        optionText:'ctmmParam',
        options: [],
        deptInfo:{},
        query:{
          paramName: '',
          queryType: 3
        },
        editIndex: -1,
        columns: [
          {
            type: 'index',
            title: '序号',
            align: 'center',
            width: 80
          },
          {
            title: '药品名称',
            key: 'ctmmTradeName',
            align: 'center',
            width: 200
          },
          {
            title: '剂型',
            key: 'ctmmDosageFormDesc',
            align: 'center',
            width: 100

          },
          {
            title: '单位',
            key: 'replanUnit',
            align: 'center',
            width: 120
          },
          {
            title: '包装规格',
            key: 'packageSpecification',
            align: 'center',
            width: 170
          },
          {
            title: '批准文号',
            key: 'approvalNo',
            align: 'center',
            width: 200,
          },
          {
            title: '生产厂家',
            key: 'ctmmManufacturerName',
            width: 200
          },
          {
            title: '库存基数',
            fixed:'right',
            slot: 'stockBase',
            width: 140
          },
          {
            title: '操作',
            fixed:'right',
            slot: 'action',
            width: 200
          }
        ],
        addModal:{
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
            loading:false,
            columns:[
              {
                type: 'selection',
                align: 'center',
                width: 60
              },
              {
                title: '药品名称',
                key: 'ctmmTradeName',
                align: 'center'
              },
              {
                title: '剂型',
                key: 'ctmmDosageFormDesc',
                align: 'center'
              },
              {
                title: '包装规格',
                key: 'packageSpecification',
                align: 'center'
              },{
                title: '生产厂家',
                key: 'ctmmManufacturerName',
                align: 'center'
              }],
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
    watch: {
      hisDrugCodeList() {
        this.getData(true);
      },
    },
    methods: {
      cancleEditModal(){
        this.addModal.show = false;
      },
      comfirmEditModal(selectDatas){
        this.addModal.loading = true;
        if(selectDatas.length > 0){
          let baseMedicineDetails = selectDatas.map(item => {
            return {
              bigDrugCode: item.bigDrugCode,
              drugCode: item.drugCode
            }
          });
          this.saveAddModal({baseMedicineDetails,deptCode:this.deptCode});
        }
      },
      async saveAddModal(info){
        let saveInfo = await this.$api.purchase.pitchOnCardinalMedicine(info);
        if(saveInfo.code == 200){
          this.addModal.loading = false;
          this.addModal.show = false;
          Message.success("保存成功！");
          this.getData(true);
        }
      },
      async modalDataQuery(params){
        this.addModal.form.forEach((item,index)=> {
          this.addModal.form[index].value = params[item.id];
        })
        this.addModal.table.loading = true;
        let datalist = await this.$api.purchase.addCardinalMedicine({
          pageNo:params.pageNo,
          pageSize:params.pageSize,
          hisDrugCodeList: params.hisDrugCodeList? [params.hisDrugCodeList] : [],
          deptCode:this.deptCode,
          mate:'',
        });
        this.addModal.table.loading = false;
        let data = datalist.data;
        this.addModal.table.data = data.list;
        this.addModal.page = { total: data.count, pageNo: data.pageNo,pageSize: data.pageSize};
      },
      handleQuery(value){
        if(value !== ''){
          this.queryDrugByList(value);
        }else{
          this.options  = [];
        }
      },
      async queryDrugByList(value){
        Object.assign(this.query,{paramName:value});
        this.selectLoading = true;
        let data = await this.$api.publics.queryDrugByList({
          ...this.query
        });
        this.selectLoading = false;
        this.options = data.data;
      },
      async queryDrugByListModal(value){
        Object.assign(this.addModal.query,{paramName:value});
        this.addModal.form[0].loading = true;
        let data = await this.$api.publics.queryDrugByList({
          ...this.addModal.query
        });
        this.addModal.form[0].loading = false;
        this.addModal.form[0].list = data.data;
      },
      async getDeptInfo(deptCode = this.deptCode){
        let data = await this.$api.publics.getDeptNameByCode({
          deptCode
        });
        this.deptInfo = data.data;
      },
      async getData(flag){
        if(flag){
          this.page = 1;
        }
        this.loading = true;
        let datalist = await this.$api.purchase.findCardinalMedicineDetail({
          deptCode:this.deptCode,hisDrugCodeList:this.hisDrugCodeList,pageNo:this.page.pageNo,pageSize:this.page.pageSize
        });
        this.loading = false;
        let data = datalist.data;
        this.dataList = data.list;
        this.page = { total: data.count, pageNo: data.pageNo,pageSize: data.pageSize};
      },
      async handleSave(record,index){
        this.editIndex = index;
        let data = await this.$api.purchase.getHisMedicineBound({
          id:record.id,stockBase:record.stockBase,deptCode:this.deptCode
        });
        if(data.code == 200){
          Message.success('保存成功！');
          this.editIndex = -1;
          this.getData(true);
        }
      },
      handleDel(record,index){
        Modal.confirm({
          title: '确认',
          content: '<p>是否确定删除？</p>',
          onOk: () => {
            this.deleteRecord(record)
          },
          onCancel: () => {}
        });
      },
      async deleteRecord(record){
        let data = await this.$api.purchase.moveCardinalMedicineDetail({
          id:record.id,totalQuantity:record.totalQuantity
        });
        if(data.code == 200 && data.data!=-1){
            Message.success('删除成功');
            this.getData(true);
          }else {
            Message.error('删除失败');
        }
      },
      addProduct(){
        this.addModal.show = true;
      }
    },

    created(){
      this.deptCode = this.$route.query.code;
      this.getDeptInfo();
      this.getData(true);
    },
  }
</script>
<style lang="less" scoped>
  .container{
    background-color: #f5f7f9;
    .card-item{
      margin-bottom:10px;
      .customUnit{
        display: inline-block;
        width: 97%;
        .customUnit-button{
          float: right;
          margin-top: 6px;
        }
      }
    }
    /deep/.ivu-collapse{
      border: none;
      background-color: #fff;
      border-radius: 0px;
      .ivu-collapse-item{
        .ivu-collapse-header {
          height: 48px;
          line-height: 48px;
          color: #17233d;
          font-size: 14px;
          font-weight: 700;
          border-bottom: 1px solid #fff;
          width: 100%;
          i{
            margin-right: 0;
          }
        }
        .ivu-collapse-content-box{
          padding-top: 0;
        }
      }
    }
    /deep/.ivu-input-number{
      width: 100%;
    }
    .info-item{
      .ivu-col {
        margin-bottom:10px;
        font-size: 14px;
      }
    }
  }
</style>

