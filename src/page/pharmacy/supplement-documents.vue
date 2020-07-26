/**
* @author QER
* @date 2019/12/29
* @Description: 药房-补登单据
*/
<template>
  <div class="condition" v-if="!infoTel">
    <div class="condition-row clear">
      <div class="condition-group">
        <label>单据号　</label>
        <Input  placeholder="补登单据/入库/出库单号"  class="condition-group-ipt" v-model="searchArr[0].makeupCode"></Input>
      </div>
      <div class="condition-group">
        <label>状　　态</label>
        <Select  placeholder="请选择状态" class="condition-group-ipt" v-model="searchArr[0].makeupStatus">
          <Option  v-for="(item,index) in makeupStatusArr" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>类　　型</label>
        <Select  placeholder="请选择状态" class="condition-group-ipt" v-model="searchArr[0].makeupType">
          <Option  v-for="(item,index) in makeupTypeArr" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
      </div>
      <div class="condition-group mt15">
        <label>审核时间</label>
        <DatePicker type="daterange" v-model="searchArr[0].closeDate2" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getTime" placement="bottom"></DatePicker>
      </div>
      <div class="condition-group mt15">
        <label>补登时间</label>
        <DatePicker type="daterange" v-model="searchArr[0].closeDate" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getTime" placement="bottom"></DatePicker>
      </div>
    </div>
    <div class="condition-row clear">
      <Button size="large" type="default" icon="ios-search" class="r" @click="getList">查询</Button>
    </div>
    <Row class="flex-button" v-if="!$route.meta.check">
      <Col span="3">
        <Radius iconHref="icon-tianjiaanniu" iconText="补登出库单" iconSize="20"  @upButton="add(1)"></Radius>
      </Col>
      <Col span="3" style="margin: 0 8px;">
        <Radius iconHref="icon-tianjiaanniu" iconText="补登入库单" iconSize="20"  @upButton="add(2)"></Radius>
      </Col>
      <Col span="2-5">
        <Radius  iconText="删除"  @upButton="deleteSelect" buttonSize="0"></Radius>
      </Col>
    </Row>

    <Row class="flex-button" v-else>
      <Col span="2-5" style="margin-right:  8px;">
        <Radius iconHref="icon-tianjiaanniu" iconText="批量通过" iconSize="20"  @upButton="checkBill(1)"></Radius>
      </Col>
      <Col span="2-5">
        <Radius  iconText="批量驳回"  @upButton="checkBill(2)" buttonSize="0"></Radius>
      </Col>
    </Row>
    <div class="demo-spin-container mt15">
      <Table :columns="columns" :data="searchTabs" @on-selection-change="selectproducts"></Table>
      <Spin size="large" fix v-if="spinsShow"></Spin>
    </div>
    <div class="r mt15">
      <Page :total="searchArr[0].totalPage" :page-size="searchArr[0].pageSize" :current.sync="searchArr[0].pageNo" @on-change="record_search(searchArr[0])" show-total show-elevator />
    </div>
  </div>
  <Info v-else :headData="info" :searchs="searchInfo" :infoColumns="infoColumns" :infoArr="infoArr">
    <Row class="flex-button"  slot="header">
      <Col span="2-5" style="margin-right:  8px;" v-if="$route.meta.check&&infoData.makeupStatus==2">
        <Radius iconHref="icon-tianjiaanniu" iconText="通过" iconSize="20"  @upButton="checkBill(1,true)"  ></Radius>
      </Col>
      <Col span="2-5" v-if="$route.meta.check&&infoData.makeupStatus==2">
        <Radius  iconText="驳回"  @upButton="checkBill(2,true)" buttonSize="0"></Radius>
      </Col>
      <Col span="2-5"  v-if="!$route.meta.check&&infoData.makeupStatus ==1">
        <Radius  iconText="再次提交" @upButton="editAdd(2)" iconHref="icon-bianji" iconSize="20"></Radius>
      </Col>
    </Row>
  </Info>
</template>

<script>
  import {filter} from 'lodash'
  import {mapState,mapActions,mapMutations} from 'vuex'
  export default {
    data(){
      return{
        searchTabs:[],
        makeupTypeArr:[],
        makeupStatusArr:[],
        selectproductsObj:[],//选中数据
        searchArr:[{
          pageNo:1,
          pageSize:10,
          totalPage:0,
          url:this.$api.pharmacyApi.DRUG_SUPPLEMENTDOC_LIST,
          makeupCode:'',
          makeupStatus:'',
          makeupType:'',
          closeDate:'',
          endTime:'',
          startTime:'',
          closeDate2:'',
          reviewendTime:'',
          reviewstartTime:'',
          type: 2
        },
          {
            url:this.$api.systemApi.GETDEPT_TYPELIST,
            infoName:'makeupTypeArr',
            type:'makeup_type'
          },
          {
            url:this.$api.systemApi.GETDEPT_TYPELIST,
            infoName:'makeupStatusArr',
            type: 'makeup_status'
          }
        ],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            type: 'index',
            title: '序号',
            width: 60,
            align: 'center'
          },
          {
            title: '补登单号',
            key: 'makeupCode',
            align: 'center',
            width: 170,
            render: (h, params) => {
              return h('div', [
                h('span',{style:{color:'#2d8cf0',cursor:'pointer'},
                  on: {
                    click: () => {
                      this.aboutInfoTel(params.row.makeupCode)
                    }
                  }
                }, params.row.makeupCode),
                h('Badge', {
                  props: {
                    count: params.row.makeupDetailItemCount
                  }
                })
              ]);
            },
          },
          {
            title: '入库/出库单',
            key: 'storeCode',
            align: 'center',
            width: 160
          },
          {
            title: '状态',
            key: 'makeupStatusName',
            align: 'center',
            width: 100
          },
          {
            title: '部门',
            key: 'deptName',
            width: 100,
            align: 'center'
          },
          {
            title: '类型',
            key: 'makeupTypeName',
            width: 120,
          },
          {
            title: '补登原因',
            key: 'makeupCause',
            width: 120,
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.makeupCause,
                  trigger: 'hover',
                  title:params.row.makeupCause,
                  placement:'right',
                  length:6
                }
              })
            },
          },
          {
            title: '补登人',
            key: 'createUserName',
            fixed:'right',
            width: 100
          },
          {
            title: '补登时间',
            key: 'createDate',
            fixed:'right',
            width: 170
          },
          {
            title: '审核时间',
            key: 'reviewDate',
            fixed:'right',
            width: 170
          },
          {
            title: '审核人',
            key: 'reviewUserName',
            fixed:'right',
            width: 100
          }
        ],
        //详情页传参
        info:[],
        searchInfo:[
          {
            url:this.$api.pharmacyApi.DRUG_SUPPLEMENTDOC_DETAILHEAD,
            makeupCode:'',
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
            key: 'makeipQuantity',
            title: '数量',
            width:100,
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
            key: 'positionTypeName',
            title: '目的货位类型',
            width:140,
            align: 'center'
          },
          {
            key: 'lot',
            title: '生产批号',
            width:130,
            align: 'center',
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
            key: 'supplierName',
            title: '供应商',
            align: 'center',
            width:180,
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
        this.aboutInfoTel(this.$route.query.makeupCode)
      }else {

        await  this.getTop()
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
        this.makeupTypeArr=this.$store.state[this.searchArr[1].infoName].data;

        await this.record_search_head(this.searchArr[2]);
        this.makeupStatusArr=this.$store.state[this.searchArr[2].infoName].data;
        this.searchArr[0].makeupStatus=this.makeupStatusArr[0].value
      },
      async getList(){
        await this.record_search(this.searchArr[0]);
        this.searchTabs=this.searchTab
        this.searchTabs.forEach((item, index) => {
          if (item.makeupStatus !=1&&!this.$route.meta.check) {
            item._disabled = true
          }
        });
        this.searchArr[0].totalPage=this.totalPage;
      },
      getTime(date){
        this.searchArr[0].startTime=date[0];
        this.searchArr[0].endTime=date[1];
      },
      getTime2(date){
        this.searchArr[0].reviewstartTime=date[0];
        this.searchArr[0].reviewendTime=date[1];
      },
      async aboutInfoTel(backNos){
        //this.$skip.goDetails(this.$router, '/pharmacy/outStorage/refund',backNos)
        //console.log(this.$route)
        if(this.$route.meta.check){
          this.$router.push({ name: '补登单据复核', query: { makeupCode: backNos } })
        }else {
          this.$router.push({ name: '补登单据', query: { makeupCode: backNos } })
        }

        this.RECORD_INFOTEL(1);
        this.searchInfo[0].makeupCode=backNos;
        await  this.record_search_head(this.searchInfo[0]);
        this.infoData=this.$store.state[this.searchInfo[0].infoName].data;
        const {makeupCode,storeCode,makeupTypeName,makeupStatusName,createUserName,createDate,reviewUserName,reviewDate,list}=this.infoData
        this.info=[{
          title:'补登单',
          span:6,
          cont:makeupCode
        },
          {
            title:'入库/出库单',
            span:6,
            cont:storeCode
          },
          {
            title:'类型',
            span:6,
            cont:makeupTypeName
          },
          {
            title:'状态',
            span:6,
            cont:makeupStatusName
          },
          {
            title:'补登人',
            span:6,
            cont:createUserName
          },
          {
            title:'补登时间',
            span:6,
            cont:createDate
          },
          {
            title:'审核人',
            span:6,
            cont:reviewUserName
          },
          {
            title:'审核时间',
            span:6,
            cont:reviewDate
          }
        ];
        this.infoArr=list;
      },
      //新建
      add(isDraft){
        this.$router.push({path:'/pharmacy/supplementDoc/supplementDocuments/add', query: {isDraft}})
      },
      //
     async editAdd(isDraft){
       let sbumitInfo=await this.$api.pharmacy.submitAgain({
         makeupCode:this.$route.query.makeupCode
       });
        if(sbumitInfo.code==200){
          this.$Message.success('单据提交成功');
          this.aboutInfoTel(this.$route.query.makeupCode);
          this.RECORD_INFOTEL();
        }
      },
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
        let idList=[];
            this.selectproductsObj.map(item=>idList.push(item.id));
        let sbumitInfo=await this.$api.pharmacy.deleteBills({
          idList
        });
        if(sbumitInfo.code==200){
          this.$Message.success('删除单据成功');
          this.$store.state.spinsShow=false;
          this.getList();
        }else {
          this.$store.state.spinsShow=false;
        }
      },
      //批量通过&驳回
      async checkBill(type,checkOne){
        if(this.selectproductsObj.length==0&&!checkOne){
          this.$Message.error(type==1?'请选择要通过的数据':'请选择要驳回的数据');
          return false;
        };
        this.$store.state.spinsShow=true;
          let makeuplist='';
          makeuplist=!checkOne?this.selectproductsObj.map(item=>{ return {makeupCode:item.makeupCode}}):[{makeupCode:this.$route.query.makeupCode}];
        let sbumitInfo=await this.$api.pharmacy.checkBills({
          makeuplist,
          type
        });
        if(sbumitInfo.code==200){
          this.$Message.success('单据状态更改成功');
          this.$store.state.spinsShow=false;
          this.aboutInfoTel(this.$route.query.makeupCode)
        }else {
          this.$store.state.spinsShow=false;
        }
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

