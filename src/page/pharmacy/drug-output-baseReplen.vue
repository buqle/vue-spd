/**
* @author QER
* @date 2020/1/6
* @Description: 药房-调拨出库
*/
<template>
  <div class="condition" v-if="!infoTel">
    <div class="condition-row clear">
      <div class="condition-group">
        <label>单　　号</label>
        <Input  placeholder="出库单/拣货单"  class="condition-group-ipt" v-model="searchArr[0].infos.orderNo"></Input>
      </div>
      <div class="condition-group">
        <label>申领部门</label>
        <Select  placeholder="请选择部门" class="condition-group-ipt" v-model="searchArr[0].infos.deptCode">
          <Option key="" value="">全部</Option>
          <Option  v-for="(item,index) in deptCodeArr" :value="item.id" :key="index">{{item.deptName}}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>状　　态</label>
        <Select  placeholder="请选择状态" class="condition-group-ipt" v-model="searchArr[0].infos.backStatus">
          <Option  v-for="(item,index) in acceptanceArr" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
      </div>
      <div class="condition-group mt15">
        <label>出库时间</label>
        <DatePicker type="daterange" v-model="searchArr[0].closeDate" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getTime" placement="bottom"></DatePicker>
      </div>
    </div>
    <div class="condition-row clear">
      <Button size="large" type="default" icon="ios-search" class="r" @click="getList(true)">查询</Button>
    </div>
    <Row class="flex-button">
      <Col span="2-5">
        <Radius iconHref="icon-tianjiaanniu" iconText="新建出库" iconSize="20"  @upButton="add"></Radius>
      </Col>
      <Col span="2-5" style="margin-left: 8px;">
        <Radius  iconText="删除"  @upButton="deleteSelect" buttonSize="0"></Radius>
      </Col>
    </Row>
    <div class="demo-spin-container mt15">
      <Table :columns="columns" :data="searchTab" @on-selection-change="selectproducts" style="width: 100%"></Table>
      <Spin size="large" fix v-if="spinsShow"></Spin>
    </div>
    <div class="r mt15">
      <Page :total="searchArr[0].totalPage" :page-size="searchArr[0].pageSize" :current.sync="searchArr[0].infos.pageNo" @on-change="getList" show-total show-elevator/>
    </div>
  </div>
  <Info v-else :headData="info" :searchs="searchInfo" :infoColumns="infoColumns" :infoArr="infoArr" style="width: 100%"></Info>
</template>

<script>
  import {filter} from 'lodash'
  import {mapState,mapActions,mapMutations} from 'vuex'
  export default {
    data(){
      return{
        deptCodeArr:[],
        acceptanceArr:[],
        selectproductsObj:[],
        searchArr:[{
          infos:{
            pageNo:1,
            pageSize:10,
            deptCode:'',
            orderNo:'',
            backStatus:'',
            backType:3,
            endTime:'',
            startTime:'',
          },

          totalPage:0,
          url:this.$api.pharmacyApi.PUTAWAY_OUTSTORAGE_REPLEN_LIST,
          closeDate:'',


        },
          {
            url:this.$api.pharmacyApi.PUTAWAY_OUTSTORAGE_REPLEN_DEPT_LIST,
            infoName:'deptCodeArr',
            method:'get',
          },
          {
            url:this.$api.systemApi.GETDEPT_TYPELIST,
            infoName:'acceptanceArr',
            type: 'out_store_status'
          }
        ],
        columns: [
          {
            type: 'selection',
            width: '80',
            align: 'center',
            fiexd:'left'
          },
          {
            type: 'index',
            title: '序号',
            width: '80',
            align: 'center'
          },
          {
            title: '出库单',
            key: 'backNo',
            align: 'center',
            width: '250',
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
                    count: params.row.outstoreDetailItemsCount
                  },
                  style:{marginLeft:'8%'}
                })
              ]);
            },
          },
          {
            title: '拣货单',
            key: 'pickingNo',
            align: 'center',
            width: '150',
          },
          {
            title: '出库分类',
            key: 'backType',
            align: 'center',
            width: '150',
          },
          {
            title: '状态',
            key: 'status',
            align: 'center',
            width: '150',
          },
          {
            title: '申领部门',
            key: 'deptName',
            width: '150',
          },
          {
            title: '发起人',
            key: 'createUserName',
            width: '150',
          },
          {
            title: '发起时间',
            key: 'createDate',
            fixed:'right',
            width: '180',
          },
          {
            title: '复核人',
            key: 'checkUserName',
            fixed:'right',
            width: '180',
          },
          {
            title: '复核时间',
            key: 'checkDate',
            fixed:'right',
            width: '180',
          }
        ],

        //详情页传参
        info:[],
        searchInfo:[
          {
            url:this.$api.pharmacyApi.PUTAWAY_OUTSTORAGE_REPLEN_DETAILINFO,
            backNo:'',
            infoName:'infoData',
            method:'get',
            hisDrugCodeList:'',
          }
        ],
        infoData:{},
        infoColumns:[

          {
            type: 'index',
            title: '序号',
            width: '80',
            align: 'center'
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
            key: 'ctmmDosageFormDesc',
            title: '剂型',
            width:'100',
            align: 'center'
          },
          {
            key: 'ctmmSpecification',
            title: '规格',
            align: 'center',
            width:'120',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.ctmmSpecification,
                  trigger: 'hover',
                  title:params.row.ctmmSpecification,
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
            key: 'replanUnit',
            title: '单位',
            width:'100',
            align: 'center'
          },
          {
            key: 'backNum',
            title: '出库数量',
            width:'100',
            align: 'center'
          },
          {
            key: 'lot',
            title: '生产批号',
            width:'150',
            align: 'center',
          },
          {
            key: 'approvalNo',
            title: '批准文号',
            align: 'center',
            fixed:'right',
            width:'150',
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
            key: 'supplierName',
            title: '供应商',
            align: 'center',
            width:'200',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.supplierName,
                  trigger: 'hover',
                  title:params.row.supplierName,
                  placement:'right',
                  length:8
                }
              })
            },
            fixed:'right'
          },
          {
            key: 'productDate',
            title: '生产日期',
            width:'120',
            align: 'center',
            fixed:'right'
          },
          {
            key: 'validEndDate',
            title: '有效期至',
            width:'120',
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
        await  this.getTop()
        this.getList()
      }
    },
    computed:{
      ...mapState(['spinsShow','searchTab','infoTel','totalPage'])
    },
    mounted(){
    },
    methods:{
      ...mapActions(['record_search_head','record_search']),
      ...mapMutations(['RECORD_INFOTEL']),
      //删除
      selectproducts(selection){
        this.selectproductsObj=selection;
      },
      async deleteSelect(){
        if(this.selectproductsObj.length==0){
          this.$Message.error('请选择要删除的数据');
          return false;
        };
        this.$store.state.spinsShow=true;
        let ids=[];
        this.selectproductsObj.map(item=>ids.push(item.id));
        let sbumitInfo=await this.$api.pharmacy.deleteOutBills({
          ids
        });
        if(sbumitInfo.code==200){
          this.$Message.success('删除单据成功');
          this.$store.state.spinsShow=false;
          this.getList();
        }else {
          this.$store.state.spinsShow=false;
        }
      },
      async getTop(){
        await this.record_search_head(this.searchArr[1]);
        this.deptCodeArr=this.$store.state[this.searchArr[1].infoName].data;
        //this.searchArr[0].deptCode=this.deptCodeArr.length>0?this.deptCodeArr[1].value:''

        await this.record_search_head(this.searchArr[2]);
        this.acceptanceArr=this.$store.state[this.searchArr[2].infoName].data;
        //this.searchArr[0].backStatus=this.acceptanceArr[1].value

      },
      async getList(flag){
        if(!this.$route.meta.check){
          this.searchArr[0].infos.backType=2
        }else {
          this.searchArr[0].infos.backType=3
        }
        if(flag){
          this.searchArr[0].totalPage=0
        }
        await this.record_search(this.searchArr[0]);
        this.searchArr[0].totalPage=this.totalPage
      },
      getTime(date){
        this.searchArr[0].infos.startTime=date[0];
        this.searchArr[0].infos.endTime=date[1];
      },
      async aboutInfoTel(backNos){
        if(!this.$route.meta.check){
          this.$router.push({ name: '基数药补货', query: { backNo: backNos } });

        }else {
          this.$router.push({ name: '调拨出库', query: { backNo: backNos } });

        }
        this.RECORD_INFOTEL(1);
        this.searchInfo[0].backNo=backNos;
        await  this.record_search_head(this.searchInfo[0]);
        this.infoData=this.$store.state[this.searchInfo[0].infoName].data;
        const {backNo,statusName,deptName,createUserName,phone,deptAddress,checkUserName,checkDate,createDate,detailVo}=this.infoData
        this.info=[{
          title:'出库单',
          span:6,
          cont:backNo
        },
          {
            title:'状态',
            span:6,
            cont:statusName
          },
          {
            title:'申领药房',
            span:6,
            cont:deptName
          },
          {
            title:'发起人',
            span:6,
            cont:createUserName
          },
          {
            title:'发起时间',
            span:6,
            cont:createDate
          },
          {
            title:'联系电话',
            span:6,
            cont:phone
          },
          {
            title:'药房地址',
            span:6,
            cont:deptAddress
          },
          {
            title:'复核人',
            span:6,
            cont:checkUserName
          },
          {
            title:'复核时间',
            span:6,
            cont:checkDate
          }
        ];
        this.infoArr=detailVo;
      },
      //新建
      add(){
        if(this.$route.meta.check){
          this.$skip.goAdd(this.$router, '/pharmacy/outStorage/newOut/add')
        }else {
          this.$skip.goAdd(this.$router, '/pharmacy/outStorage/baseReplen/add')
        }

      },
    },
    watch:{
      async infoTel(v){
        if(!v){
          await  this.getTop()
          this.getList()
        }
      },
      $route(to,from){
       this.getTop()
        this.getList()
      }
    }
  }
</script>

<style scoped>
  .condition-row{height: auto!important;}
  .flexcont-add{width:20%;justify-content: space-around;}
</style>
