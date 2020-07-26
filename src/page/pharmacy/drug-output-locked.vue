/**
* @author QER
* @date 2020/1/6
* @Description: 药房-锁定
*/
<template>
  <div class="condition" v-if="!infoTel">
    <div class="condition-row clear">
      <div class="condition-group">
        <label>单　　号</label>
        <Input  placeholder="单号"  class="condition-group-ipt" v-model="searchArr[0].recallNo"></Input>
      </div>
      <div class="condition-group">
        <label>原　　因</label>
        <Select  placeholder="请选择部门" class="condition-group-ipt" v-model="searchArr[0].recallReasonType">
          <Option  v-for="(item,index) in deptCodeArr" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>状　　态</label>
        <Select  placeholder="请选择状态" class="condition-group-ipt" v-model="searchArr[0].recallStatus">
          <Option  v-for="(item,index) in acceptanceArr" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
      </div>
      <div class="condition-group mt15">
        <label>发起时间</label>
        <DatePicker type="daterange" v-model="searchArr[0].closeDate" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getTime" placement="bottom"></DatePicker>
      </div>
      <div class="condition-group mt15">
        <label>供应商　</label>
        <Input  placeholder="供应商名称"  class="condition-group-ipt" v-model="searchArr[0].supplierName"></Input>
      </div>
    </div>
    <div class="condition-row clear">
      <Button size="large" type="default" icon="ios-search" class="r" @click="getList">查询</Button>
    </div>
    <Row class="flex-button" v-if="!$route.meta.check">
      <Col span="2-5">
        <Radius iconHref="icon-tianjiaanniu" iconText="新建锁定" iconSize="20"  @upButton="add"></Radius>
      </Col>
      <Col span="2-5" style="margin: 0 8px;">
        <Radius  iconText="删除"  @upButton="deleteSelect" buttonSize="0"></Radius>
      </Col>
    </Row>
    <Row class="flex-button" v-else>
      <Col span="2-5">
        <Radius iconHref="icon-tianjiaanniu" iconText="批量通过" iconSize="20"  @upButton="deleteSelect(1)"></Radius>
      </Col>
    </Row>
    <div class="demo-spin-container mt15">
      <Table :columns="columns" :data="searchTabs"  @on-selection-change="selectproducts"></Table>
      <Spin size="large" fix v-if="spinsShow"></Spin>
    </div>
    <div class="r mt15">
      <Page :total="searchArr[0].totalPage" :page-size="searchArr[0].pageSize" :current.sync="searchArr[0].pageNo" @on-change="getList" show-total show-elevator />
    </div>
  </div>
  <Info v-else :headData="info" :searchs="searchInfo" :infoColumns="infoColumns" :infoArr="infoArr">
    <Col span="2-5" slot="header" v-if="infoData.recallStatus==5&&!$route.meta.check">
      <Radius  iconText="取消锁定" @upButton="cancelBill" iconHref="icon-bianji" iconSize="20" ></Radius>
    </Col>
    <div  slot="header" v-else-if="$route.meta.check&&infoData.recallStatus==1" class="flex-button" style="width: 130px;justify-content: space-between;">
      <Radius  iconText="通过" @upButton="checkBill(1)"></Radius>
      <Radius  iconText="驳回" @upButton="checkBill" buttonSize="0" ></Radius>
    </div>
  </Info>
</template>

<script>
  import {filter} from 'lodash'
  import {mapState,mapActions,mapMutations} from 'vuex'
  export default {
    data(){
      return{
        deptCodeArr:[],
        searchTabs:[],
        acceptanceArr:[],
        selectproductsObj:[],//选中数据
        searchArr:[{
          pageNo:1,
          pageSize:10,
          totalPage:0,
          url:!this.$route.meta.check?this.$api.pharmacyApi.DRUG_OUTPUT_LOCKED_LIST:this.$api.pharmacyApi.DRUG_OUTPUT_LOCKED_CHECK_LIST,
          recallReasonType:'',
          recallNo:'',
          recallStatus:'',
          supplierName:'',
          closeDate:'',
          endTime:'',
          startTime:'',

        },
          {
            url:this.$api.systemApi.GETDEPT_TYPELIST,
            infoName:'deptCodeArr',
            type: 'recall_reason'
          },
          {
            url:this.$api.systemApi.GETDEPT_TYPELIST,
            infoName:'acceptanceArr',
            type: 'recall_status',
            values: '1,3,5,6'
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
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '锁定单号',
            key: 'recallNo',
            align: 'center',
            width: 162,
            render: (h, params) => {
              return h('div', [
                h('span',{style:{color:'#2d8cf0',cursor:'pointer'},
                  on: {
                    click: () => {
                      this.aboutInfoTel(params.row.recallNo)
                    }
                  }
                }, params.row.recallNo),
                h('Badge', {
                  props: {
                    count: params.row.roomReCallDetailItemCount
                  }
                })
              ]);
            },
          },
          {
            title: '状态',
            key: 'recallStatusName',
            align: 'center',
          },
          {
            title: '类型',
            key: 'recallTypeName',
            align: 'center'
          },
          {
            title: '召回原因',
            key: 'remarks',

          },
          {
            title: '发起人',
            key: 'createUserName',

          },
          {
            title: '发起时间',
            key: 'createDate',
            width: 170
          }
        ],

        //详情页传参
        info:[],
        searchInfo:[
          {
            url:this.$api.pharmacyApi.DRUG_OUTPUT_LOCKED_DETAILHEAD,
            recallNo:'',
            infoName:'infoData',
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
            key: 'ctmmDosageFormDesc',
            title: '剂型',
            width:90,
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
        this.aboutInfoTel(this.$route.query.recallNo)
      }else {

        await  this.getTop()
        this.getList()

      }

    },
    computed:{
      ...mapState(['spinsShow','searchTab','infoTel','totalPage'])
    },

    methods:{
      ...mapActions(['record_search_head','record_search']),
      ...mapMutations(['RECORD_INFOTEL']),
      async getTop(){
        await this.record_search_head(this.searchArr[1]);
        this.deptCodeArr=this.$store.state[this.searchArr[1].infoName].data;


        await this.record_search_head(this.searchArr[2]);
        this.acceptanceArr=this.$store.state[this.searchArr[2].infoName].data;

      },
      async getList(){
        await this.record_search(this.searchArr[0]);
        this.searchTabs=this.searchTab
        this.searchTabs.forEach((item, index) => {
          if (item.recallStatus !=3&&!this.$route.meta.check) {
            item._disabled = true
          }else if (item.recallStatus !=1&&this.$route.meta.check) {
            item._disabled = true
          }
        });
        this.searchArr[0].totalPage=this.totalPage
      },
      getTime(date){
        this.searchArr[0].startTime=date[0];
        this.searchArr[0].endTime=date[1];
      },
      async aboutInfoTel(backNos){
        if(!this.$route.meta.check){
          this.$router.push({ name: '锁定', query: { recallNo: backNos } })
        }else {
          this.$router.push({ name: '锁定审核', query: { recallNo: backNos } })
        }
        this.RECORD_INFOTEL(1);
        this.searchInfo[0].recallNo=backNos;
        await  this.record_search_head(this.searchInfo[0]);
        this.infoData=this.$store.state[this.searchInfo[0].infoName].data;
        const {recallNo,recallStatusName,createUserName,phone,updateUserName,updateDate,createDate,roomReCallDetailVoList}=this.infoData
        this.info=[{
          title:'单据号',
          span:6,
          cont:recallNo
        },
          {
            title:'状态',
            span:6,
            cont:recallStatusName
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
            title:'审核人',
            span:6,
            cont:updateUserName
          },
          {
            title:'审核时间',
            span:6,
            cont:updateDate
          }
        ];
        this.infoArr=roomReCallDetailVoList;
      },
      //新建
      add(){
        this.$skip.goAdd(this.$router, '/pharmacy/outStorage/locked/add')
      },
      //取消锁定
      async cancelBill(){
        let sbumitInfo= await this.$api.pharmacy.cancelLock({
          recallNo:this.$route.query.recallNo
        });
        if(sbumitInfo.code==200){
          this.$Message.success('单据取消锁定成功');
          this.aboutInfoTel(this.$route.query.recallNo);
        }else {
          this.spinShow=false;
        }
      },
      //删除&批量通过
      selectproducts(selection){
        this.selectproductsObj=selection;
      },
      async deleteSelect(flag){
        if(this.selectproductsObj.length==0){
          this.$Message.error('请选择要删除的数据');
          return false;
        };
        this.$store.state.spinsShow=true;
        let recallNos=[];
        let detailList=[];
        if(!flag){
          this.selectproductsObj.map(item=>recallNos.push(item.recallNo));
        }else {
          this.selectproductsObj.map(item=>detailList.push({ recallNo: item.recallNo }));
        }
        let sbumitInfo=''
        sbumitInfo=flag?await this.$api.pharmacy.passCheckClock({
          detailList
        }):await this.$api.pharmacy.nopassCheckClock({
          recallNos
        });
        if(sbumitInfo.code==200){
          this.$Message.success(flag?'批量处理单据成功':'删除单据成功');
          this.$store.state.spinsShow=false;
          this.getList();
        }else {
          this.$store.state.spinsShow=false;
        }
      },
      //批量通过&驳回
      async checkBill(type){
        this.$store.state.spinsShow=true;
        let detailList=[];
        let sbumitInfo='';
        if(type){
          detailList= [ {recallNo:this.$route.query.recallNo} ]
          sbumitInfo=await this.$api.pharmacy.passCheckClock({detailList})
        }else {
          detailList= this.$route.query.recallNo
          sbumitInfo=await this.$api.pharmacy.nopassCheckClock({recallNo:detailList})
        }
        if(sbumitInfo.code==200){
          this.$Message.success(type?'单据审核通过':'单据已驳回');
          this.$store.state.spinsShow=false;
          this.aboutInfoTel(this.$route.query.recallNo)
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
      },
      $route(v){
        if(!v.query.recallNo){
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
