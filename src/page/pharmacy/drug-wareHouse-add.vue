/**
 * @author QER
 * @date 2019/12/15
 * @Description: 药房-验收
*/
<template>
  <div class="container container-warp">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Card :bordered="false" class="card-item" v-if="!this.$route.query.distributeCode">
      <Row>
        <Col span="8" style="display: flex;align-items: center;">
          <span>验收单号：</span>
          <Input  search enter-button placeholder="使用条码枪扫描" style="flex: 1" @on-search="searchInfo"/>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" class="card-item">
      <p slot="title">单据信息</p>
      <Row :gutter="20">
        <Col span="6">
          <span>验收单：</span>
          <span>{{info.distributeCode||''}}</span>
        </Col>
        <Col span="6">
          <span>申领单：</span>
          <span>{{info.applyCode||''}}</span>
        </Col>
        <Col span="6">
          <span>状态：</span>
          <span>{{info.statusName||''}}</span>
        </Col>
        <Col span="6">
          <span>配货部门：</span>
          <span>{{info.deptName||''}}</span>
        </Col>
        <Col span="6">
          <span>发起人：</span>
          <span>{{info.createName||''}}</span>
        </Col>
        <Col span="6">
          <span>发起时间：</span>
          <span>{{info.createDate||''}}</span>
        </Col>
        <Col span="6">
          <span>验收时间：</span>
          <span>{{info.receptionTime||''}}</span>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" class="card-item info-item">
      <p slot="title">产品信息</p>
      <Search  @upAdd="choseCode"  v-if="this.$route.query.distributeCode"></Search>
      <Row class="mt15">
        <Tabs :value="von" @on-click="changeTab">
          <div slot="extra">
            <Radius  iconText="确认验收"  @upButton="submitData" v-if="info.auditStatus==1&&searchArr[1].status==1"></Radius>
          </div>
          <TabPane  :name="(index+1).toString()" v-for="(item,index) in tabs" :key="index" :label="item.label" :disabled="!info.distributeCode">
            <Table :columns="columns" :data="dataWait" ref="selection" @on-selection-change="selectData" style="width: 100%;"></Table>
          </TabPane>
        </Tabs>
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
          label:'待验收'
        },{
          label:'已验收'
        }],
        info:{},
        dataWait:[],
        dataHad:[],
        columns:[
          {
            type: 'selection',
            width: '80',
            align: 'center',
            fiexd:'left'
          },
          {
            type: 'index',
            title: '序号',
            align: 'center',
            fiexd:'left',
            width: '80'
          },
          {
            key: 'ctmmTradeName',
            title: '药品名称',
            align: 'center',
            width:'200',
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
            key: this.$route.query.distributeCode?'realNum':'realReceiveQuantiry',
            title: '实到数量',
            width:'120',
            align: 'center',
            render: (h, params) => {
              if(this.$route.query.distributeCode&&this.von!=='2'){
                if(this.info.checkDetailStatus==1||this.info.checkDetailStatus==0){
                  return h('InputNumber', {
                    props:{
                      min:0,
                      value:params.row.realNum,
                      max:params.row.realDeliveryQuantiry
                    },
                    on: {
                      'on-change': (value) => {
                        if(value>params.row.realDeliveryQuantiry){
                          this.$Message.error(`输入数值过大, 不能超过${params.row.realDeliveryQuantiry}`);
                          return false;
                        }
                        this.dataWait[params.index].realNum = value
                      }
                    }
                  });
                }else {
                  return h('span', params.row.realNum);
                }
              }else {
                return h('span', params.row.realReceiveQuantiry);
              }
            }
          },
          {
            key: 'realDeliveryQuantiry',
            title: '需求数量',
            width:'120',
            align: 'center'
          },
          {
            key: 'replanUnit',
            title: '单位',
            width:'100',
            align: 'center'
          },
          {
            key: 'ctmmDosageFormDesc',
            title: '剂型',
            width:'100',
            align: 'center'
          },
          {
            key: 'packageSpecification',
            title: '包装规格',
            align: 'center',
            width:'120',
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
            key: 'approvalNo',
            title: '批准文号',
            align: 'center',
            width:'120',
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
            key: 'ctmmManufacturerName',
            title: '生产厂家',
            align: 'center',
            width:'200',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.ctmmManufacturerName,
                  trigger: 'hover',
                  title:params.row.ctmmManufacturerName,
                  placement:'right',
                  length:8
                }
              })
            }
          },
          {
            key: 'productBatchNo',
            title: '生产批号',
            width:'120',
            align: 'center'
          },
          {
            key: 'realProductTime',
            title: '生产日期',
            align: 'center',
            width:'120',
            fixed:'right'
          },
          {
            key: 'realValidEndDate',
            title: '有效期至',
            align: 'center',
            width:'120',
            fixed:'right'
          },
          {
            key: 'supplierName',
            title: '供应商',
            align: 'center',
            fixed:'right',
            width:'200',
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
          },
        ],
        searchArr:[
          {
            url:this.$api.pharmacyApi.DRUG_WARE_HOUSE_DETAILHEAD,
            distributeCode:'',
            infoName:'info',
          },
          {
            url:this.$api.pharmacyApi.DRUG_WARE_HOUSE_DETAILTAB,
            infoName:'dataWait',
            distributeCode:'',
            hisDrugCodeList:'',
            status:1,
            pageNo: 1,
            pageSize: 50,
            totalPage:0
          }
        ],
        von:'1',
        selectSubmitInfo:'',//选中的数据
      }
    },
    created(){
      if(this.$route.query.distributeCode){
        this.searchArr[0].distributeCode=this.$route.query.distributeCode;
        this.searchArr[1].distributeCode=this.$route.query.distributeCode;
        this.spinShow=true;
        this.submit();

      }
    },
    methods:{
      ...mapActions(['record_search_head','record_search']),
      //搜索
     async searchInfo(v){
        if(!v){
          this.$Message.error('请输入要检索的验收单号');
          return false;
        }
       this.spinShow=true;
       this.searchArr[0].distributeCode=v;
       this.searchArr[1].distributeCode=v;
       this.submit();
      },
      async submit(){
        await  this.record_search_head(this.searchArr[0]);
        this.info=this.$store.state[this.searchArr[0].infoName].data;
        this.von=this.info.auditStatus==1?this.von='1':this.von='2';
        this.searchArr[1].status=this.von;
        await  this.record_search_head(this.searchArr[1]);
        this.dataWait=this.$store.state[this.searchArr[1].infoName].data.list;
        this.dataWait.forEach((item, index) => {
          if (this.von==2) {
            item._disabled = true
          }
        });
        this.spinShow=false;
      },
      async changeTab(v){
        if(this.searchArr[1].status==v){
          return false;
        }
        this.dataWait=[];
        this.searchArr[1].status=v;
        this.spinShow=true;
        await  this.record_search_head(this.searchArr[1]);
        this.dataWait=this.$store.state[this.searchArr[1].infoName].data.list;
        this.dataWait.forEach((item, index) => {
          if (v==2) {
            item._disabled = true
          }
        });
        this.spinShow=false;
      },
      selectData(selection){
        this.selectSubmitInfo=selection
      },
      async submitData(){
        if(this.selectSubmitInfo.length==0){
          this.$Message.error('请选择要验收的数据');
          return false;
        };
        let detailList=[];
        detailList=this.selectSubmitInfo.map(item=>{
          return {
            id: item.id,
            realReceiveQuantiry:this.$route.query.distributeCode?item.realNum:null
          }
        });
        this.spinShow=true;
        let sbumitInfo= await this.$api.pharmacy.submitWareHouseData({
          detailList,
          distributeCode:this.info.distributeCode,
          checkType: 2
        });
        if(sbumitInfo.code==200){
          this.$Message.success('验收成功');
          this.von='2';
          this.submit();
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
