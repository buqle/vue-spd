/**
 * @author QER
 * @date 2019/12/25
 * @Description: 药房-新建退库
*/
<template>
  <div class="condition" v-if="!infoTel">
    <div class="condition-row clear">
      <div class="condition-group">
        <label>退库单号</label>
        <Input  placeholder="退货单号"  class="condition-group-ipt" v-model="searchArr[0].backNo"></Input>
      </div>
      <div class="condition-group">
        <label>退库原因</label>
        <Select  placeholder="请选择退库原因" class="condition-group-ipt" v-model="searchArr[0].backCause">
          <Option  v-for="(item,index) in backCauseArr" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>状　　态</label>
        <Select  placeholder="请选择状态" class="condition-group-ipt" v-model="searchArr[0].backStatus">
          <Option  v-for="(item,index) in backStatusArr" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
      </div>
      <div class="condition-group mt15">
        <label>退库时间</label>
        <DatePicker type="daterange" v-model="searchArr[0].closeDate" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getTime" placement="bottom"></DatePicker>
      </div>
    </div>
    <div class="condition-row clear">
      <Button size="large" type="default" icon="ios-search" class="r" @click="getList(true)">查询</Button>
    </div>
    <Row>
      <Col span="2-5">
        <Radius iconHref="icon-tianjiaanniu" iconText="新建出库" iconSize="20"  @upButton="add"></Radius>
      </Col>
    </Row>
    <div class="demo-spin-container mt15">
      <Table :columns="columns" :data="searchTab"></Table>
      <Spin size="large" fix v-if="spinsShow"></Spin>
    </div>
    <div class="r mt15">
      <Page :total="totalPage" :page-size="searchArr[0].pageSize" :current.sync="searchArr[0].pageNo" @on-change="record_search(searchArr[0])" show-total show-elevator />
    </div>
  </div>
  <Info v-else :headData="info" :searchs="searchInfo" :infoColumns="infoColumns" :infoArr="infoArr">
    <Col span="2-5" slot="header">
      <Radius  iconText="编辑单据" @upButton="editAdd(2)" iconHref="icon-bianji" iconSize="20" v-if="infoData.backStatus ==3"></Radius>
      <Radius  iconText="编辑草稿" @upButton="editAdd(1)" iconHref="icon-bianji" iconSize="20" v-if="infoData.isDraft==1"></Radius>
    </Col>
  </Info>
</template>

<script>
  import {filter} from 'lodash'
  import {mapState,mapActions,mapMutations} from 'vuex'
  export default {
    data(){
      return{
        backCauseArr:[],
        backStatusArr:[],
        searchArr:[{
          pageNo:1,
          pageSize:10,
          totalPage:0,
          url:this.$api.pharmacyApi.DRUG_OUTPUT_REFUND_LIST,
          backCause:'',
          backNo:'',
          backStatus:'',
          closeDate:'',
          endTime:'',
          startTime:'',

        },
          {
            url:this.$api.systemApi.GETDEPT_TYPELIST,
            infoName:'backCauseArr',
            type:'back_cause_room'
          },
          {
            url:this.$api.systemApi.GETDEPT_TYPELIST,
            infoName:'backStatusArr',
            type: 'back_status'
          }
        ],
        columns: [
          {
            type: 'index',
            title: '序号',
            width: 60,
            align: 'center'
          },
          {
            title: '退库单',
            key: 'backNo',
            align: 'center',
            width: 170,
            render: (h, params) => {
              return h('div', [
                h('span',{style:{color:'#2d8cf0',cursor:'pointer'},
                  on: {
                    click: () => {
                      this.aboutInfoTel(params.row.backNo)
                    }
                  }
                }, params.row.backNo),
                h('Badge', {
                  props: {
                    count: params.row.backStoreDetailItemCount
                  }
                })
              ]);
            },
          },
          {
            title: '受理部门',
            key: 'backDpetName',
            align: 'center',
            width: 142
          },
          {
            title: '退库原因',
            key: 'backCause',
            align: 'center',
            width: 120
          },
          {
            title: '是否草稿',
            key: 'isDraftName',
            width: 100,
            align: 'center'
          },
          {
            title: '状态',
            key: 'backStatusName',
            width: 100,
          },
          {
            title: '退库人',
            key: 'createUserName',
            width: 110
          },
          {
            title: '退库时间',
            key: 'createDate',
            fixed:'right',
            width: 170
          },
          {
            title: '复核人',
            key: 'reviewUserName',
            fixed:'right',
            width: 100
          },
          {
            title: '复核时间',
            key: 'reviewDate',
            fixed:'right',
            width: 170
          }
        ],
        //详情页传参
        info:[],
        searchInfo:[
          {
            url:this.$api.pharmacyApi.DRUG_OUTPUT_REFUND_DETAILHEAD,
            backNo:'',
            infoName:'infoData',
            hisDrugCodeList:'',
          }
        ],
        infoData:{},
        infoColumns:[
          {
            type: 'index',
            title: '序号',
            width: 60,
            align: 'center'
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
            key: 'inStoreCode',
            title: '入库单号',
            width:162,
            align: 'center'
          },
          {
            key: 'packageSpecification',
            title: '包装规格',
            align: 'center',
            width:120,
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
            width:90,
            align: 'center'
          },
          {
            key: 'backNum',
            title: '出库数量',
            width:90,
            align: 'center'
          },
          {
            key: 'lot',
            title: '生产批号',
            width:130,
            align: 'center',
          },
          {
            key: 'approvalNo',
            title: '批准文号',
            align: 'center',
            fixed:'right',
            width:140,
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.approvalNo,
                  trigger: 'hover',
                  title:params.row.approvalNo,
                  placement:'left',
                  length:10
                }
              })
            }
          },
          {
            key: 'ctmmManufacturerName',
            title: '生产厂家',
            align: 'center',
            width:180,
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
            key: 'productDate',
            title: '生产日期',
            width:110,
            align: 'center',
            fixed:'right'
          },
          {
            key: 'validEndDate',
            title: '有效期至',
            width:110,
            align: 'center',
            fixed:'right'
          },
        ],
        infoArr:[]
      }
    },
    async created(){
      if(this.infoTel){
       // this.searchInfo[0].backNo=this.$route.query.backNo;
        this.aboutInfoTel(this.$route.query.backNo)
      }else {

        await  this.getTop();
        this.getList();
      }
    },
    computed:{
      ...mapState(['spinsShow','searchTab','infoTel','totalPage'])
    },

    methods:{
      ...mapActions(['record_search_head','record_search',]),
      ...mapMutations(['RECORD_INFOTEL']),
      async getTop(){
        await this.record_search_head(this.searchArr[1]);
        this.backCauseArr=this.$store.state[this.searchArr[1].infoName].data;

        await this.record_search_head(this.searchArr[2]);
        this.backStatusArr=this.$store.state[this.searchArr[2].infoName].data;
        this.searchArr[0].backStatus=this.backStatusArr[0].value
      },
      async getList(flag){
        if(flag){
          this.$store.state.totalPage=0
        }
        await this.record_search(this.searchArr[0]);
        //this.searchArr[0].totalPage=this.totalPage;
      },
      getTime(date){
        this.searchArr[0].startTime=date[0];
        this.searchArr[0].endTime=date[1];
      },
      async aboutInfoTel(backNos){
        //this.$skip.goDetails(this.$router, '/pharmacy/outStorage/refund',backNos)
        this.$router.push({ name: '新建退库', query: { backNo: backNos } })
        this.RECORD_INFOTEL(1);
        this.searchInfo[0].backNo=backNos;
        await  this.record_search_head(this.searchInfo[0]);
        this.infoData=this.$store.state[this.searchInfo[0].infoName].data;
        const {backNo,backStatusName,backDpetName,createUserName,reviewUserName,reviewDate,list,createDate}=this.infoData
        this.info=[{
          title:'退库单',
          span:6,
          cont:backNo
        },
          {
            title:'状态',
            span:6,
            cont:backStatusName
          },
          {
            title:'受理部门',
            span:6,
            cont:backDpetName
          },
          {
            title:'退库人',
            span:6,
            cont:createUserName
          },
          {
            title:'退库时间',
            span:6,
            cont:createDate
          },
          {
            title:'复核人',
            span:6,
            cont:reviewUserName
          },
          {
            title:'复核时间',
            span:6,
            cont:reviewDate
          }
        ];
        this.infoArr=list;
      },
      //新建
      add(){
        this.$skip.goAdd(this.$router, '/pharmacy/outStorage/refund/add')
      },
      //
      editAdd(isDraft){
        this.$router.push({path:'/pharmacy/outStorage/refund/add', query: {backNo: this.$route.query.backNo,isDraft}})
      }
    },
    watch:{
      async infoTel(v){
        if(!v){
          await  this.getTop()
          this.getList()
        }
      }
    }
  }
</script>

<style scoped>
  .condition-row{height: auto!important;}
  .flexcont-add{width:20%;justify-content: space-around;}
</style>

