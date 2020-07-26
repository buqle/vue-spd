/**
 * @author BQL
 * @date 2020/3/26
 * @Description: 批号调整
*/
<template>
  <div class="condition">
    <div class="condition-row clear">
      <div class="condition-group">
        <label>部　　门</label>
        <Select  placeholder="请选择部门" class="condition-group-ipt" v-model="searchArr[0].deptCode">
          <Option  v-for="(item,index) in makeupStatusArr" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>状　　态</label>
        <Select  placeholder="状态" class="condition-group-ipt" v-model="searchArr[0].status">
          <Option  v-for="(item,index) in makeupTypeArr" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>制单时间</label>
        <DatePicker type="daterange" v-model="searchArr[0].orderTime" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getTime" placement="bottom"></DatePicker>
      </div>
    </div>
    <div class="condition-row mt15 clear" style="display: flex">
      <div  flexcont class="condition-group drug-sea">
        <label>药品名称</label>
        <Search :size="'80%'" :ml="10" @upAdd="choseCode"></Search>
      </div>
      <div class="condition-group">
        <label>批　　号</label>
        <Input  placeholder="批号"  class="condition-group-ipt" v-model="searchArr[0].lot"></Input>
      </div>
    </div>
    <div class="condition-row clear">
      <Button size="large" type="default" icon="ios-search" class="r" @click="getList">查询</Button>
    </div>
    <Row class="flex-button" v-if="!$route.meta.checkBill">
      <Col span="2-5">
        <Radius iconHref="icon-tianjiaanniu" iconText="新增批号" iconSize="20"  @upButton="add"></Radius>
      </Col>
      <Col span="2-5" style="margin:0  8px;">
        <Radius  iconText="提交"  @upButton="checkBill(1)"></Radius>
      </Col>
      <Col span="2-5">
        <Radius  iconText="删除"  @upButton="checkBill(2)" buttonSize="0"></Radius>
      </Col>
      <Col span="2-5" style="margin:0  8px;">
        <Radius  iconText="导出"  @upButton="exports"></Radius>
      </Col>
    </Row>
    <Row class="flex-button" v-else>
      <Col span="2-5">
        <Radius  iconText="审核通过"  @upButton="checkBill(3)"></Radius>
      </Col>
      <Col span="2-5" style="margin:0  8px;">
        <Radius  iconText="驳回"  @upButton="checkBill(4)" buttonSize="0"></Radius>
      </Col>
      <Col span="2-5">
        <Radius  iconText="导出"  @upButton="exports"></Radius>
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
</template>

<script>
  import {filter} from 'lodash'
  import {mapState,mapActions,mapMutations} from 'vuex';
  import moment from 'moment';
  export default {
    data(){
      return{
        searchTabs:[],
        makeupTypeArr:[
          {value: "", label: "全部"},
          {value: 1, label: "已保存"},
          {value: 2, label: "待审核"},
          {value: 3, label: "已审核"},
          {value: 4, label: "已驳回"}
        ],
        makeupStatusArr:[],
        selectproductsObj:[],//选中数据
        searchArr:[{
          pageNo:1,
          pageSize:10,
          totalPage:0,
          url:this.$api.pharmacyApi.BATCH_LIST,
          deptCode:'',
          status:'',
          orderTime:'',
          closeDate:'',
          endTime:'',
          startTime:'',
          hisDrugCode:'',
          lot:'',
        },
          {
            url:this.$api.systemApi.GETDEPT_TYPELIST,
            infoName:'makeupStatusArr',
            infos:{type:' lot_adjust_dept'}
          },
        ],
        columns: [
          {
            type: 'selection',
            width: '60',
            align: 'center'

          },
          {
            type: 'index',
            title: '序号',
            width: '60',
            align: 'center'
          },
          {
            title: '部门',
            key: 'deptName',
            width: '120',
            align: 'center'
          },
          {
            title: '药品编码',
            key: 'hisDrugCode',
            width: '130',
            align: 'center'
          },
          {
            key: 'drugName',
            title: '药品名称',
            align: 'center',
            width:'180',
            fiexd:'left',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.drugName,
                  trigger: 'hover',
                  title:params.row.drugName,
                  placement:'right',
                }
              })
            },
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
            key: 'ctmmManufacturerName',
            title: '生产厂家',
            align: 'center',
            width:'180',
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
            key: 'approvalNo',
            title: '批准文号',
            align: 'center',
            width:'140',
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
            key: 'unitCode',
            title: '单位',
            width:'90',
            align: 'center'
          },
          {
            key: 'adjustQty',
            title: '数量',
            width:'90',
            align: 'center'
          },
          {
            key: 'lot',
            title: '批号',
            width:'110',
            align: 'center'
          },
          {
            key: 'newLot',
            title: '新批号',
            width:'110',
            align: 'center'
          },
          {
            key: 'productDate',
            title: '生产日期',
            width:'110',
            align: 'center',
            render: (h, params) => {
              let time = moment(params.row.productDate).format('YYYY-MM-DD')
              return h('span', time);
            }
          },
          {
            key: 'validEndDate',
            title: '有效日期',
            width:'110',
            align: 'center',
            render: (h, params) => {
              let time = moment(params.row.validEndDate).format('YYYY-MM-DD')
              return h('span', time);
            }
          },
          {
            key: 'newProductDate',
            title: '新生产日期',
            width:'110',
            align: 'center',
            render: (h, params) => {
              let time = moment(params.row.newProductDate).format('YYYY-MM-DD')
              return h('span', time);
            }
          },
          {
            key: 'newValidEndDate',
            title: '新有效日期',
            width:'110',
            align: 'center',
            render: (h, params) => {
              let time = moment(params.row.newValidEndDate).format('YYYY-MM-DD')
              return h('span', time);
            }
          },
          {
            key: 'remarks',
            title: '备注',
            align: 'center',
            width:'120',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.remarks,
                  trigger: 'hover',
                  title:params.row.remarks,
                  placement:'left',
                  length:10
                }
              })
            }
          },
          {
            key: 'status',
            title: '状态',
            align: 'center',
            width:'100',
            fixed:'right',
            render: (h, params) => {
              if(params.row.status==1){
                return h('span', '已保存');
              }else if(params.row.status==2){
                return h('span', '待审核');
              }else if(params.row.status==3){
                return h('span', '已审核');
              }else if(params.row.status==4){
                return h('span', '已驳回');
              }
            }
          },
          {
            key: 'createUserName',
            title: '制单人',
            align: 'center',
            width:'100',
            fixed:'right'
          },
          {
            key: 'createDate',
            title: '制单日期',
            align: 'center',
            width:'180',
            fixed:'right'
          },
          {
            key: 'checkUserId',
            title: '审核人',
            align: 'center',
            width:'100',
            fixed:'right'
          },
          {
            key: 'checkDate',
            title: '审核日期',
            align: 'center',
            width:'180',
            fixed:'right'
          }
        ],
      }
    },
    async created(){
      await  this.getTop()
      this.getList();
    },
    computed:{
      ...mapState(['spinsShow','searchTab','infoTel','totalPage'])
    },

    methods:{
      ...mapActions(['record_search_head','record_search',]),
      ...mapMutations(['RECORD_INFOTEL']),
      //新建
      add(){
        this.$skip.goAdd(this.$router, '/purchase/batchAdjust/editBatch/add')
      },
      async getTop(){
        await this.record_search_head(this.searchArr[1]);
        this.makeupStatusArr=this.$store.state[this.searchArr[1].infoName].data;
      },
      async getList(){
        if(this.$route.meta.checkBill){
          this.searchArr[0].url=this.$api.pharmacyApi.BATCH_CHECK_LIST;
          this.searchArr[0].status=1
        }else {
          this.searchArr[0].url=this.$api.pharmacyApi.BATCH_LIST;
          this.searchArr[0].status=''
        }
        await this.record_search(this.searchArr[0]);
        this.searchTabs=this.searchTab
        this.searchArr[0].totalPage=this.totalPage;
      },
      //新建
      editAdd(backNo,tit,baseMgt) {
        this.$router.push({path: '/pharmacy/configMgt/salvageList/add', query: {backNo, tit,baseMgt}})
      },
      getTime(date){
        this.searchArr[0].startTime=date[0];
        this.searchArr[0].endTime=date[1];
      },
      //选择药品code
      choseCode(drugCode){
        drugCode?this.searchArr[0].hisDrugCode=drugCode:this.searchArr[0].hisDrugCode=''
      },
      //选中及提交等操作
      selectproducts(selection){
        this.selectproductsObj=selection;
      },
      async checkBill(type,checkOne){
        if(this.selectproductsObj.length==0){
          this.$Message.error('请勾选数据');
          return false;
        };
        this.$store.state.spinsShow=true;
        let lotAdjustList='';
        lotAdjustList=this.selectproductsObj.map(item=>{ return {id:item.id}});
        let sbumitInfo=
          type==1?await this.$api.pharmacy.submitDraft({
            lotAdjustList
        }):type==2?await this.$api.pharmacy.batchDelete({
            lotAdjustList
          }):type==3||type==4?await this.$api.pharmacy.batchCheck({
            lotAdjustList,
            checkStatus:type==3?1:2
          }):'';
        if(sbumitInfo.code==200){
          this.$Message.success('操作成功');
          this.$store.state.spinsShow=false;
          this.getList();
        }else {
          this.$store.state.spinsShow=false;
        }
      },
      async exports(){
        if(this.selectproductsObj.length==0){
          this.$Message.error('请勾选数据');
          return false;
        };
        this.$store.state.spinsShow=true;
        let lotAdjustList='';
        lotAdjustList=this.selectproductsObj.map(item=>{ return {id:item.id}});
        let datalist = await this.$api.pharmacy.exportBatch({lotAdjustList});
        let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
        let fileName = `${this.getCurrentDate()}批号调整.xls`;
        this.$store.state.spinsShow=false;
        let objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a')
        link.download = fileName;
        link.href = objectUrl;
        link.click();
      }
    },
    watch:{
      $route(v){
        this.getList();
      }
    }

  }
</script>

<style scoped>
  .condition-row{height: auto!important;}
  .flexcont-add{width:20%;justify-content: space-around;}
</style>

