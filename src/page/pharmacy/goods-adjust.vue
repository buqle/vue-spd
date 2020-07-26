/**
* @author QER
* @date 2020/1/8
* @Description: 药房-货位移动
*/
<template>
  <div class="condition" v-if="!infoTel">
    <div class="condition-row clear">
      <div class="condition-group">
        <label>单　　号</label>
        <Input  placeholder="单号"  class="condition-group-ipt" v-model="searchArr[0].locAdjustNo"></Input>
      </div>
      <div class="condition-group">
        <label>发起时间</label>
        <DatePicker type="daterange" v-model="searchArr[0].closeDate" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getTime" placement="bottom"></DatePicker>
      </div>
    </div>
    <div class="condition-row clear">
      <Button size="large" type="default" icon="ios-search" class="r" @click="record_search({item:searchArr[0]})">查询</Button>
    </div>
    <Col span="2-5">
      <Radius iconHref="icon-tianjiaanniu" iconText="新建移库" iconSize="20"  @upButton="add"></Radius>
    </Col>
    <div class="demo-spin-container mt15">
      <Table :columns="columns" :data="searchTab"></Table>
      <Spin size="large" fix v-if="spinsShow"></Spin>
    </div>
    <div class="r mt15">
      <Page :total="totalPage" :page-size="searchArr[0].pageSize" :current.sync="searchArr[0].pageNo" @on-change="getList" show-total show-elevator />
    </div>
  </div>
  <Info v-else :headData="info" :searchs="searchInfo" :infoColumns="infoColumns" :infoArr="infoArr">
  </Info>
</template>

<script>
  import {filter} from 'lodash'
  import {mapState,mapActions,mapMutations} from 'vuex'
  export default {
    data(){
      return{
        deptCodeArr:[],
        acceptanceArr:[],
        searchArr:[{
          pageNo:1,
          pageSize:10,
          totalPage:0,
          url:this.$api.pharmacyApi.GOODS_ADJUST_LIST,
          recallReasonType:'',
          locAdjustNo:'',
          closeDate:'',
          endTime:'',
          startTime:'',

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
            title: '移库单号',
            key: 'locAdjustNo',
            align: 'center',
            width: 162,
            render: (h, params) => {
              return h('div', [
                h('span',{style:{color:'#2d8cf0',cursor:'pointer'},
                  on: {
                    click: () => {
                      this.aboutInfoTel(params.row.locAdjustNo)
                    }
                  }
                }, params.row.locAdjustNo),
                h('Badge', {
                  props: {
                    count: params.row.roomLocAdjustDetailVoListCount
                  }
                })
              ]);
            },
          },
          {
            title: '状态',
            key: 'statusName',
            align: 'center',
          },
          {
            title: '部门',
            key: 'deptName',
            align: 'center'
          },
          {
            title: '移库人',
            key: 'createName',
            align: 'center'
          },
          {
            title: '移库时间',
            key: 'createDate',

          }
        ],

        //详情页传参
        info:[],
        searchInfo:[
          {
            url:this.$api.pharmacyApi.GOODS_ADJUST_DETAILHEAD,
            locAdjustNo:'',
            infoName:'infoData',
            method:'get'
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
            key: 'adjustNum',
            title: '移动数量',
            width:100,
            align: 'center'
          },
          {
            key: 'originalUnitName',
            title: '移动单位',
            width:100,
            align: 'center'
          },
          {
            key: 'originalStore',
            title: '原库存',
            width:90,
            align: 'center'
          },
          {
            key: 'originalGoodsName',
            title: '原货位',
            width:100,
            align: 'center'
          },
          {
            key: 'originalLocTypeName',
            title: '原货位类型',
            width:110,
            align: 'center'
          },
          {
            key: 'goalGoodsName',
            title: '目的货位',
            width:110,
            align: 'center'
          },
          {
            key: 'goalUnitName',
            title: '目的货位单位',
            width:120,
            fixed:'right',
            align: 'center'
          },
          {
            key: 'goalLocTypeName',
            title: '目的货位类型',
            width:120,
            fixed:'right',
            align: 'center'
          },
          {
            key: 'conversionRate',
            title: '转换系数',
            width:100,
            fixed:'right',
            align: 'center'
          },
          {
            key: 'packageSpecification',
            title: '包装规格',
            align: 'center',
            fixed:'right',
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
            key: 'lot',
            title: '生产批号',
            width:130,
            fixed:'right',
            align: 'center',
          },
          {
            key: 'ctmmManufacturerName',
            title: '生产厂家',
            fixed:'right',
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
          }
        ],
        infoArr:[]
      }
    },
    async created(){
      if(this.infoTel){
        // this.searchInfo[0].backNo=this.$route.query.backNo;
        this.aboutInfoTel(this.$route.query.locAdjustNo)
      }else {
        this.getList()

      }

    },
    computed:{
      ...mapState(['spinsShow','searchTab','infoTel','totalPage'])
    },

    methods:{
      ...mapActions(['record_search_head','record_search']),
      ...mapMutations(['RECORD_INFOTEL']),
      async getList(){
        await this.record_search(this.searchArr[0]);
      },
      getTime(date){
        this.searchArr[0].startTime=date[0];
        this.searchArr[0].endTime=date[1];
      },
      async aboutInfoTel(backNos){
        this.$router.push({ name: '货位移动', query: { locAdjustNo: backNos } })
        this.RECORD_INFOTEL(1);
        this.searchInfo[0].locAdjustNo=backNos;
        await  this.record_search_head(this.searchInfo[0]);
        this.infoData=this.$store.state[this.searchInfo[0].infoName].data;
        const {locAdjustNo,statusName,createName,createDate,roomLocAdjustDetailVoList}=this.infoData
        this.info=[{
          title:'移库单号',
          span:6,
          cont:locAdjustNo
        },
          {
            title:'状态',
            span:6,
            cont:statusName
          },
          {
            title:'移库人',
            span:6,
            cont:createName
          },
          {
            title:'移库时间',
            span:6,
            cont:createDate
          }
        ];
        this.infoArr=roomLocAdjustDetailVoList;
      },
      //新建
      add(){
        this.$skip.goAdd(this.$router, '/pharmacy/goodsAdjust/adjust/add')
      },
    },
    watch:{
      async infoTel(v){
        if(!v){
          this.getList()
        }
      },
      $route(v){
        if(!v.query.locAdjustNo){
          this.RECORD_INFOTEL();
        }
      }
    }
  }
</script>

<style scoped>
  .condition-row{height: auto!important;}
  .flexcont-add{width:20%;justify-content: space-around;}
</style>
