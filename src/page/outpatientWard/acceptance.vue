<template>
  <div class="condition">
    <div class="condition-row">
      <div class="condition-group">
        <label>发起时间</label>
        <DatePicker v-model="launchDate" type="daterange" class="condition-group-ipt" placement="bottom-end" placeholder="发起时间" @on-clear="clearLaunchDate"></DatePicker>
      </div>
      <div class="condition-group">
        <label>单据</label>
        <Input v-model="form.distributeCode" placeholder="出库单/申领单" class="condition-group-ipt"></Input>
      </div>
      <div class="condition-group">
        <label>状态</label>
        <Select v-model="form.auditStatus" class="condition-group-ipt">
          <Option  v-for="(item,index) in types" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
      </div>
    </div>
    <div class="condition-row">
      <div class="condition-group">
        <label>验收时间</label>
        <DatePicker v-model="checkDate" type="daterange" class="condition-group-ipt" placement="bottom-end" placeholder="验收时间" @on-clear="clearCheckDate"></DatePicker>
      </div>
    </div>
    <div class="condition-row">
      <Button size="large" type="default" icon="md-add" class="l" @click="addAcceptance()">新建验收</Button>
      <Button size="large" type="default" icon="ios-search" class="r" @click="getData(true)">查询</Button>
    </div>
    <div class="condition-table">
      <Table :loading="loading" :columns="columns" :data="dataList"></Table>
    </div>
    <div class="condition-page">
      <Page :total="page.total" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getData()" show-total show-elevator />
    </div>
    <Modal v-model="modalShow" fullscreen title="新建验收">
      <div class="condition">
        <div class="condition-row">
          <div class="condition-group">
            <Input prefix="ios-barcode" suffix="ios-search" search @on-search="searchInfo" v-model="distributeCode" placeholder="使用条码枪扫描" class="condition-group-ipt"></Input>
          </div>
          <div class="condition-group">
            <label>备注</label>
            <Input v-model="form.distributeCode" placeholder="请输入" class="condition-group-ipt"></Input>
          </div>
        </div>
        <div class="condition-card">
          <Card :bordered="false" dis-hover>
            <p slot="title">单据信息</p>
            <Row :gutter="20">
              <Col class="card-item"span="8" v-for="(item,index) in billInfo" :key="index">
                <span>{{ item.name }}：</span>
                <span>{{ item.value }}</span>
              </Col>
            </Row>
          </Card>
        </div>
        <div class="condition-table">
          <Tabs :value="status" @on-click="clickTab">
            <TabPane label="待验收" name="1">
              <Table :columns="columns1" :data="dataList1"></Table>
            </TabPane>
            <TabPane label="已验收" name="2">
              <Table :columns="columns1" :data="dataList1"></Table>
            </TabPane>
          </Tabs>
        </div>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="handleCancle">取消</Button>
        <Button type="primary" size="large"  @click="handleComfirm">确定</Button>
      </div>
    </Modal>
  </div>

</template>
<script>
  import {Message,Modal} from 'iView';
  export default {
    data () {
      return {
        page:{
          pageNo:1,
          pageSize:10,
          total:0
        },
        page1:{
          pageNo:1,
          pageSize:10,
          total:0
        },
        page2:{
          pageNo:1,
          pageSize:10,
          total:0
        },
        form: {
          distributeCode: '',
          auditStatus: '',
          launchEndTime: '',
          launchStartTime: '',
          checkEndTime: '',
          checkStartTime: '',
          checkType: 3
        },
        launchDate:[],//发起时间
        checkDate:[],//验收时间
        loading: false,
        dataList:[],
        dataList1:[],
        types:[],
        modalShow:false,
        billInfo:[
          {name:'出库单',value:''},
          {name:'申领单',value:''},
          {name:'状态',value:''},
          {name:'配货部门',value:''},
          {name:'发起人',value:''},
          {name:'发起时间',value:''},
          {name:'验收时间',value:''}
        ],
        distributeCode: '',//当前modal显示的id
        status:'2',//tab页面当前选择
        columns: [
          {
            type: 'index',
            title: '序号',
            align: 'center',
            width: 60
          },
          {
            title: '验收单',
            key: 'distributeCode',
            align: 'center',
            width:220,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {color:'#0681f4',cursor:'pointer','margin-right':`5px`},
                  on: {
                    click: () => {
                      this.$router.push({path: "/baseDrug/wareHouse/acceptance/details", query:{distributeCode:params.row.distributeCode}})
                    }
                  }
                },params.row.distributeCode),
                h('Badge', {
                  props: {
                    count: params.row.checkAcceptDetailsItemsCount
                  }
                }),
              ]);
            }
          },
          {
            title: '申领单',
            key: 'applyCode',
            align: 'center'
          },
          {
            title: '配货部门',
            key: 'distributeDeptName',
            align: 'center'
          },
          {
            title: '状态',
            key: 'statusName',
            align: 'center'
          },
          {
            title: '发起人',
            key: 'createName',
            align: 'center'
          },
          {
            title: '发起时间',
            key: 'createDate',
            align: 'center'
          },
          {
            title: '验收时间',
            key: 'receptionTime',
            align: 'center'
          }],
        columns1: [
          {
            type: 'index',
            title: '序号',
            align: 'center',
            width: 60
          },
          {
            title: '实到数量',
            key: 'realReceiveQuantiry',
            align: 'center',
            width: 112,
          },
          {
            title: '需求数量',
            key: 'realDeliveryQuantiry',
            align: 'center',
            width: 112,
          },
          {
            title: '单位',
            key: 'unit',
            align: 'center',
            width: 60,
          },
          {
            title: '通用名',
            key: 'ctmmGenericName',
            align: 'center',
            width: 224,
          },
          {
            title: '商品名',
            key: 'ctmmTradeName',
            align: 'center',
            width: 224,
          },
          {
            title: '规格',
            key: 'ctmmSpecification',
            align: 'center',
            width: 168,
          },
          {
            title: '剂型',
            key: 'ctmmDosageFormDesc',
            align: 'center',
            width: 168,
          },
          {
            title: '包装规格',
            key: 'packageSpecification',
            align: 'center',
            width: 168,
          },
          {
            title: '批准文号',
            key: 'approvalNo',
            align: 'center',
            width: 224,
          },
          {
            title: '生产厂家',
            key: 'ctmmManufacturerName',
            align: 'center',
            width: 224,
          },
          {
            title: '生产批号',
            key: 'productBatchNo',
            align: 'center',
            width: 168,
          },
          {
            title: '生产日期',
            key: 'realProductTime',
            align: 'center',
            width: 168,
          },
          {
            title: '有效期至',
            key: 'realValidEndDate',
            align: 'center',
            width: 168,
          },
          {
            title: '供应商',
            key: 'supplierName',
            align: 'center',
            width: 224,
          }]
      }
    },
    watch:{
      status(value){
        this.getData(true)
      }
    },
    methods:{
      async getTypes(){
        let data = await this.$api.publics.typeList({
          type: 'basemedic_check'
        });
        this.types = data.data;
      },
      async getData(flag){
        let launchDate = this.launchDate,checkDate = this.checkDate;
        if(launchDate && Array.isArray(launchDate) && launchDate.length > 0 && launchDate[0] && launchDate[1]){
          this.form.launchStartTime = this.$moment(launchDate[0]).format('YYYY-MM-DD');
          this.form.launchEndTime = this.$moment(launchDate[1]).format('YYYY-MM-DD');
        }
        if(checkDate && Array.isArray(checkDate) && checkDate.length > 0 && checkDate[0] && checkDate[1]){
          this.form.checkStartTime = this.$moment(checkDate[0]).format('YYYY-MM-DD');
          this.form.checkEndTime = this.$moment(checkDate[1]).format('YYYY-MM-DD');
        }
        if(flag){
          this.page.pageNo = 1;
        }
        this.loading = true;
        let datalist = await this.$api.druhStorage.druhStorageList({
          ...this.form,pageNo:this.page.pageNo,pageSize:this.page.pageSize
        });
        this.loading = false;
        let data = datalist.data;
        this.dataList = data.list;
        this.page = { total: data.count, pageNo: data.pageNo,pageSize: data.pageSize};
      },
      async getDetailHead(){
        if(!this.distributeCode){
          this.$Message.error('配送单编号不能为空!');
          return;
        }
        let datalist = await this.$api.druhStorage.druhStorageDetailHeadList({
          distributeCode:this.distributeCode
        });
        let info = datalist.data;
        this.billInfo = [
          {name:'出库单',value:info.distributeCode?info.distributeCode:''},
          {name:'申领单',value:info.applyCode?info.applyCode:''},
          {name:'状态',value:info.statusName?info.statusName:''},
          {name:'配货部门',value:info.deptName?info.deptName:''},
          {name:'发起人',value:info.createName?info.createName:''},
          {name:'发起时间',value:info.createDate?info.createDate:''},
          {name:'验收时间',value:info.receptionTime?info.receptionTime:''}
        ]
        this.getDetailList(true);
      },
      async getDetailList(flag){
        if(flag){
          this.page1.pageNo = 1;
        }
        let status = 0;
        if(this.status && this.status == '1'){
          status = 1;
        }else{
          status = 2;
        }
        let datalist = await this.$api.druhStorage.druhStorageDetailList({
          distributeCode:this.distributeCode,status:status,pageNo:this.page1.pageNo,pageSize:this.page1.pageSize
        });
        let data = datalist.data;
        this.dataList1 = data.list;
        this.page1 = { total: data.count, pageNo: data.pageNo,pageSize: data.pageSize};
      },
      clearLaunchDate(){
        this.launchDate = [];
        this.form.launchStartTime = "";
        this.form.launchEndTime = "";
      },
      clearCheckDate(){
        this.checkDate = [];
        this.form.checkStartTime = "";
        this.form.checkEndTime = "";
      },
      addAcceptance(){
        this.modalShow = true;
      },
      searchInfo(){
        this.getDetailHead();
      },
      handleCancle(){
        this.modalShow = false;
      },
      handleComfirm(){

      },
      clickTab(name){
        this.status = name;
      }
    },
    created(){
      this.getTypes();
      this.getData();
    }
  }
</script>
<style scoped lang="less">
  .card-item{
    margin-bottom: 10px;
  }

</style>
