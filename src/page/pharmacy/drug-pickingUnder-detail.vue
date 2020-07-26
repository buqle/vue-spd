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
      <Row :gutter="20">
        <Col span="6">
          <span>拣货单：</span>
          <span>{{info.pickingOredr||''}}</span>
        </Col>
        <Col span="6">
          <span>申领单：</span>
          <span>{{info.applyOrder||''}}</span>
        </Col>
        <Col span="6">
          <span>申领部门：</span>
          <span>{{info.applyDeptName||''}}</span>
        </Col>
        <Col span="6">
          <span>状态：</span>
          <span>{{info.statusName||''}}</span>
        </Col>
        <Col span="6" v-if="info.status!=1||info.status!=2">
          <span>拣货时间：</span>
          <span>{{info.pickingTime||''}}</span>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" class="card-item info-item">
      <p slot="title">产品信息</p>
      <Search  @upAdd="choseCode"></Search>
      <Row class="mt15">
        <Tabs :value="von" @on-click="changeTab">
          <div slot="extra">
            <Radius  iconText="确认拣货"  @upButton="submitData" v-if="searchArr[1].pickingStatus==0"></Radius>
          </div>
          <TabPane  :name="index.toString()" v-for="(item,index) in tabs" :key="index" :label="item.label" :disabled="!info.pickingOredr">
            <Table :columns="columns" :data="dataWait" ref="selection" @on-selection-change="selectData" style="width: 100%"></Table>
          </TabPane>
        </Tabs>
        <div class="r mt15">
          <Page :total="searchArr[1].totalPage" :page-size="searchArr[1].pageSize" :current.sync="searchArr[1].pageNo" @on-change="record_search(searchArr[1])" show-total show-elevator />
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
          label:'待拣货'
        },{
          label:'已拣货'
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
            width: '80',
          },
          {
            key: 'ctmmTradeName',
            title: '药品名称',
            align: 'center',
            width:'250',
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
            key: 'amount',
            title: '实际拣货数量',
            width:'150',
            align: 'center',
            render: (h, params) => {
              if(this.von==1&&this.info.status==1|this.info.status==2){
                return h('InputNumber', {
                  props:{
                    min:1,
                    value:params.row.amount,
                    max:params.row.allocationNum
                  },
                  on: {
                    'on-change': (value) => {
                      if(value>params.row.allocationNum){
                        this.$Message.error(`输入数值过大, 不能超过${params.row.allocationNum}`);
                        return false;
                      }
                      if(!value){
                        this.$Message.error(`请输入拣货数量`);
                        return false;
                      }
                      this.dataWait[params.index].amount = value
                    }
                  }
                });
              }else {
                return h('span', params.row.amount);
              }
            }
          },
          {
            key: 'allocationNum',
            title: '配货数量',
            width:'150',
            align: 'center'
          },
          {
            key: 'lot',
            title: '生产批号',
            width:'150',
            align: 'center'
          },
          {
            key: 'productDate',
            title: '生产日期',
            width:'150',
            align: 'center'
          },
          {
            key: 'validEndDate',
            title: '有效期至',
            width:'150',
            align: 'center'
          },
          {
            key: 'packageSpecification',
            title: '包装规格',
            align: 'center',
            width:'200',
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
            key: 'replanUnit',
            title: '单位',
            align: 'center',
            width:'150',
            fixed:'right'
          },
          {
            key: 'locName',
            title: '指示货位',
            align: 'center',
            width:'150',
            fixed:'right'
          },
        ],
        searchArr:[
          {
            url:this.$api.pharmacyApi.DRUG_OUTSTORAGE_PICKUNDER_DETAILHEAD,
            pickingOrderNo:this.$route.query.pickingOrderNo,
            infoName:'info',
            method:'get'
          },
          {
            url:this.$api.pharmacyApi.DRUG_OUTSTORAGE_PICKUNDER_DETAILTAB,
            infoName:'dataWait',
            pickingOrderNo:this.$route.query.pickingOrderNo,
            hisDrugCodeList:'',
            pickingStatus:0,
            pageNo: 1,
            pageSize: 10,
            totalPage:0
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

      async submit(){
        this.spinShow=true;
        await  this.record_search_head(this.searchArr[0]);
        this.info=this.$store.state[this.searchArr[0].infoName].data;
        this.von=this.info.status==1?this.von='0':this.von='1';
        this.searchArr[1].pickingStatus=this.von;
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
        if(this.searchArr[1].pickingStatus==v){
          return false;
        }
        this.dataWait=[];
        this.searchArr[1].pickingStatus=v;
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
      async submitData(){
        if(this.selectSubmitInfo.length==0){
          this.$Message.error('请选择要下架的单据');
          return false;
        };
        let pickingDetail=[];
        pickingDetail=this.selectSubmitInfo.map(item=>{
          return {
            drugCode: item.drugCode,
            id: item.id,
            pickingNum: item.amount === undefined ? item.allocationNum : item.amount,
          }
        });

        this.spinShow=true;
        let sbumitInfo= await this.$api.pharmacy.submitPickData({
          pickingDetail,
          pickingOrderNo:this.info.pickingOredr,
          applyNo:this.info.applyOrder
        });
        if(sbumitInfo.code==200){
          this.$Message.success('单据拣货下架成功');
          this.von='1';
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
