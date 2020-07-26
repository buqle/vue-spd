/**
* @author QER
* @date 2019/12/18
* @Description: 药房-拣货下架
*/
<template>
  <div class="container container-warp">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Card :bordered="false" class="card-item">
      <p slot="title">单据信息</p>
      <p slot="extra" class="btn-style flex-button" style="width: 220px;justify-content: space-around;">
        <Radius  iconText="针式打印"  @upButton="$skip.print($api.pharmacyApi.DRUG_REVIEW_PRINT,'backNo',info.backNo)" ></Radius>
        <Radius  iconText="A4打印"  @upButton="$skip.print($api.pharmacyApi.DRUG_REVIEW_A4_PRINT,'backNo',info.backNo)" ></Radius>
      </p>
      <Row :gutter="20">
        <Col span="6">
          <span>出库单：</span>
          <span>{{info.backNo||''}}</span>
        </Col>
        <Col span="6">
          <span>状态：</span>
          <span>{{info.statusName||''}}</span>
        </Col>
        <Col span="6">
          <span>申领药房：</span>
          <span>{{info.deptName||''}}</span>
        </Col>
        <Col span="6">
          <span>发起人：</span>
          <span>{{info.createUserName||''}}</span>
        </Col>
        <Col span="6" v-if="info.createDat!=''">
          <span>发起时间：</span>
          <span>{{info.createDate||''}}</span>
        </Col>
        <Col span="6">
          <span>联系电话：</span>
          <span>{{info.phone||''}}</span>
        </Col>
        <Col span="6">
          <span>药房地址：</span>
          <span>{{info.deptAddress||''}}</span>
        </Col>
        <Col span="6" v-if="info.checkUserName!=''">
          <span>复核人：</span>
          <span>{{info.checkUserName||''}}</span>
        </Col>
        <Col span="6" v-if="info.checkDate!=''">
          <span>复核时间：</span>
          <span>{{info.checkDate||''}}</span>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" class="card-item info-item">
      <p slot="title">产品信息</p>
      <Search  @upAdd="choseCode"></Search>
      <Row class="mt15">
        <Tabs :value="von" @on-click="changeTab">
          <div slot="extra" style="display:  flex; justify-content: space-around;
    width: 200px;">
            <Radius  iconText="复核通过"  @upButton="submitData(1)" v-if="searchArr[1].infos.checkStatus==0&&dataWait.length>0"></Radius>

            <Radius  iconText="不通过"  @upButton="notPss" v-if="searchArr[1].infos.checkStatus==0&&dataWait.length>0"  buttonSize="0"></Radius>

            <div v-if="searchArr[1].infos.checkStatus==1&&dataWait.length>0">
              <Radius  iconText="生成验收单"  @upButton="submitData" v-if="info.type!=4 && info.type!=9&&info.type!=11&&info.status == 1||info.type!=4 && info.type!=9&&info.type!=11&&info.status ==2"></Radius>
            </div>

          </div>
          <TabPane  :name="index.toString()" v-for="(item,index) in tabs" :key="index" :label="item.label" :disabled="!info.backNo">
            <Table :columns="columns" :data="dataWait" ref="selection" @on-selection-change="selectData"></Table>
          </TabPane>
        </Tabs>
        <div class="r mt15">
          <Page :total="searchArr[1].totalPage" :page-size="searchArr[1].infos.pageSize" :current.sync="searchArr[1].infos.pageNo" @on-change="record_search(searchArr[1])" show-total show-elevator />
        </div>
      </Row>
    </Card>
  </div>
</template>
<script>
  import {mapState,mapActions} from 'vuex';
  import {filter} from 'lodash'
  export default {

    data () {
      return {
        spinShow:false,
        spinShow2:false,
        loading:false,
        tabs:[{
          label:'待复核'
        },{
          label:'已复核'
        }],
        info:{},
        dataWait:[],
        dataHad:[],
        columns:[
          {
            type: 'selection',
            width: 60,
            align: 'center',
            fiexd:'left'
          },
          {
            type: 'index',
            title: '序号',
            align: 'center',
            fiexd:'left',
            width: 80
          },
          {
            key: 'ctmmTradeName',
            title: '药品名称',
            align: 'center',
            width:180,
            fiexd:'left',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.ctmmTradeName,
                  trigger: 'hover',
                  title:params.row.ctmmTradeName,
                  placement:'right',
                }
              })
            },
          },
          {
            key: 'hisDrugCode',
            title: '药品编码',
            align: 'center',
            width:180,
            fiexd:'left',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.hisDrugCode,
                  trigger: 'hover',
                  title:params.row.hisDrugCode,
                  placement:'right',
                }
              })
            },
          },
          {
            key: 'backNum',
            title: '出库数量',
            width:100,
            align: 'center'
          },
          {
            key: 'ctmmDosageFormDesc',
            title: '剂型',
            width:90,
            align: 'center'
          },
          {
            key: 'lot',
            title: '生产批号',
            width:130,
            align: 'center'
          },
          {
            key: 'productDate',
            title: '生产日期',
            width:110,
            align: 'center'
          },
          {
            key: 'validEndDate',
            title: '有效期至',
            width:110,
            align: 'center'
          },
          {
            key: 'approvalNo',
            title: '批准文号',
            align: 'center',
            width:120,
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.approvalNo,
                  trigger: 'hover',
                  title:params.row.approvalNo,
                  placement:'right',
                  length:8
                }
              })
            }
          },
          {
            key: 'packageSpecification',
            title: '包装规格',
            align: 'center',
            width:120,
            fixed:'right',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.packageSpecification,
                  trigger: 'hover',
                  title:params.row.packageSpecification,
                  placement:'right',
                  length:8
                }
              })
            }
          },
          {
            key: 'supplierName',
            title: '供应商',
            align: 'center',
            fixed:'right',
            width:160,
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.supplierName,
                  trigger: 'hover',
                  title:params.row.supplierName,
                  placement:'left',
                  length:10
                }
              })
            }
          }
        ],
        searchArr:[
          {
            url:this.$api.pharmacyApi.DRUG_REVIEW_DETAILHEAD,
            backNo:this.$route.query.backNo,
            infoName:'info',
            method:'get'
          },
          {
            url:this.$api.pharmacyApi.DRUG_REVIEW_DETAILTAB,
            infoName:'dataWait',
            infos:{
              backNo:this.$route.query.backNo,
              checkStatus:0,
              pageNo: 1,
              pageSize: 10,
            },
            hisDrugCodeList:'',
            totalPage:0,
            method:'postJson'
          }
        ],
        von:'0',
        selectSubmitInfo:'',//选中的数据
      }
    },
    created(){
      this.submit();
    },
    computed:{
      ...mapState(['totalPage'])
    },
    methods:{
      ...mapActions(['record_search_head','record_search']),
      //打印

      async submit(){
        this.spinShow=true;
        await  this.record_search_head(this.searchArr[0]);
        this.info=this.$store.state[this.searchArr[0].infoName].data;
        this.von=this.info.status==3?this.von='1':this.von='0';
        this.searchArr[1].infos.checkStatus=this.von;
        await  this.record_search_head(this.searchArr[1]);
        this.dataWait=this.$store.state[this.searchArr[1].infoName].data.list;
        this.searchArr[1].totalPage=this.$store.state[this.searchArr[1].infoName].data.count;
        this.dataWait.forEach((item, index) => {
          if (this.von==1) {
            item._disabled = true
          }
        });
        this.spinShow=false;
      },
      async changeTab(v){
        if(this.searchArr[1].infos.checkStatus==v){
          return false;
        }
        this.dataWait=[];
        this.searchArr[1].infos.checkStatus=v;
        this.spinShow=true;
        await  this.record_search_head(this.searchArr[1]);
        this.dataWait=this.$store.state[this.searchArr[1].infoName].data.list;
        this.dataWait.forEach((item, index) => {
          if (v==1) {
            item._disabled = true
          }
        });
        this.spinShow=false;
      },
      selectData(selection){
        this.selectSubmitInfo=selection
      },
      //通过&生成验收单
      async submitData(type){
        if(this.selectSubmitInfo.length==0){
          this.$Message.error(type?'请选择要复核的单据':'请选择要验收的单据');
          return false;
        };
        let outStoreDetail=[];
        outStoreDetail=this.selectSubmitInfo.map(item=>{
          return {
            backSumNum: item.backNum,
            batchNo: item.batchNo,
            drugCode: item.drugCode
          }
        });
        this.spinShow=true;
        let sbumitInfo='';
            sbumitInfo= type?await this.$api.pharmacy.submitPassOutStore({
                outStoreDetail,
                backNo:this.info.backNo,
                deptCode:this.info.deptCode
              }):
              await this.$api.pharmacy.submitBuildOutStore({
          outStoreDetail,
          backNo:this.info.backNo,
          deptCode:this.info.deptCode
        });
        if(sbumitInfo.code==200){
          this.$Message.success(type?'单据复核成功':'生成验收单成功');
          this.von='1';
          this.submit();
        }else {
          this.spinShow=false;
        }
      },
      //不通过
      async notPss(){
        if(this.selectSubmitInfo.length==0){
          this.$Message.error('请选择单据');
          return false;
        };
        let backNo=[];
        backNo=this.selectSubmitInfo.map(item=>item.batchNo);
        this.spinShow=true;
        let sbumitInfo= await this.$api.pharmacy.submitOutStore({
          backNo
        });
        if(sbumitInfo.code==200){
          this.$Message.success('操作成功');
          this.von='0';
          this.submit();
        }else {
          this.spinShow=false;
        }
      },
      choseCode(drugCode){
        this.searchArr[1].hisDrugCodeList=drugCode;
        if(!drugCode){
          this.dataWait=this.$store.state.dataWait.data.list;
          return
        }
        let filterArr= filter(this.dataWait,(o)=>{
          return o.hisDrugCode==drugCode
        });
        if(filterArr.length>0){
          this.dataWait=filterArr
        }else {
          this.$Message.error('请选择此单据中药品进行检索');
          return false;
        }
      }
    },


  }
</script>

<style scoped>
  .search-top{align-items: center;color: #666;font-size: 16px;}
</style>
