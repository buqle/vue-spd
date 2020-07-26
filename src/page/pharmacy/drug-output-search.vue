/**
 * @author QER
 * @date 2019/12/20
 * @Description: 出库管理-发药查询
*/
<template>
  <div class="condition" v-if="!infoTel">
    <div class="condition-row clear">
      <div class="condition-group">
        <label>单　　号</label>
        <Input  placeholder="请输入出库单/申领单/入库单"  class="condition-group-ipt" v-model="searchArr[0].parameter"></Input>
      </div>
      <div class="condition-group">
      <label>出库时间</label>
      <DatePicker type="daterange" v-model="searchArr[0].closeDate" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getTime" placement="bottom"></DatePicker>
    </div>
    </div>
    <div class="condition-row clear">
      <Button size="large" type="default"   @click="balanceExportListClick">导出</Button>
      <Button size="large" type="default" icon="ios-search" class="r" @click="getList(true)">查询</Button>
    </div>
    <div class="demo-spin-container mt15">
      <Table :columns="columns" :data="searchTab" ref="myTable" style="width: 100%"></Table>
      <Spin size="large" fix v-if="spinsShow"></Spin>
    </div>
    <div class="r mt15">
      <Page :total="searchArr[0].totalPage" :page-size="searchArr[0].pageSize" :current.sync="searchArr[0].pageNo" @on-change="getList" show-total show-elevator />
    </div>
  </div>
  <Info v-else :headData="info" :searchs="searchInfo" :infoColumns="infoColumns" style="width: 100%"></Info>
</template>

<script>
  import {filter} from 'lodash'
  import {mapState,mapActions} from 'vuex'
  export default {
    data(){
      return{
        backNo:'',
        typeArr:[],
        searchArr:[{
          pageNo:1,
          pageSize:10,
          totalPage:0,
          url:this.$api.pharmacyApi.PUTAWAY_OUTSTORAGE_OUTPUT_LIST,
          parameter:'',
          closeDate:'',
          endTime:'',
          startTime:'',
        }
        ],
        selectModalInfo: [],
        columns: [
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
              ]);
            },
          },
          {
            title: '发药确认单',
            key: 'dispensingCode',
            align: 'center',
            width: '250',
          },
          {
            title: '内部药房',
            key: 'innerDeptName',
            align: 'center',
            width: '250',
          },
          {
            title: '外部药房',
            key: 'outDeptName',
            align: 'center',
            width: '250',
          },
          {
            title: '患者姓名',
            key: 'sickName',
            width: '250',
            align: 'center'
          },
          {
            title: '就诊卡编号',
            key: 'medCardNo',
            width: '250',
          },
          {
            title: '出库分类',
            key: 'backTypeName',
            fixed:'right',
            width: '250',
          },
          {
            title: '发药时间',
            key: 'dispensingDate',
            fixed:'right',
            width: '250',
          }
        ],
        //详情页传参
        info:[],
        searchInfo:[
          {
            url:this.$api.pharmacyApi.PUTAWAY_OUTSTORAGE_OUTPUT_DETAILHEAD,
            backNo:'',
            infoName:'infoData',
            method:'get'
          },
          {
            url:this.$api.pharmacyApi.PUTAWAY_OUTSTORAGE_OUTPUT_DETAILTAB,
            infoName:'detailList',
            backNo:'',
            hisDrugCodeList:'',
            pageNo: 1,
            pageSize: 10,
            totalPage:0
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
            key: 'ctmmDosageFormDesc',
            title: '剂型',
            width:'100',
            align: 'center'
          },
          {
            key: 'packageSpecification',
            title: '包装规格',
            align: 'center',
            width:'150',
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
            title: '发药单位',
            width:'100',
            align: 'center'
          },
          {
            key: 'oEORIDispDrugQuantity',
            title: '发药数量',
            width:'100',
            align: 'center'
          },
          {
            key: 'backSumNum',
            title: '出库数量',
            width:'100',
            align: 'center'
          },
          {
            key: 'outStoreName',
            title: '货位类别',
            width:'120',
            align: 'center'
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
            key: 'lot',
            title: '生产批号',
            width:'120',
            align: 'center',
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
        ]
      }
    },
    async created(){
      this.getList();
    },
    computed:{
      ...mapState(['spinsShow','searchTab','infoTel','totalPage'])
    },

    methods:{
      ...mapActions(['record_search_head','record_search']),
      selectModalTab(selection){
        this.selectModalInfo=selection
      },
      async balanceExportListClick(){

        let datalist = await this.$api.pharmacy.exportList(this.searchArr[0]);
        let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
        let fileName = `${this.getCurrentDate()}日对账单详情.xls`;
        let objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a')
        link.download = fileName;
        link.href = objectUrl;
        link.click();

        // let objectUrl = URL.createObjectURL(blob);
        // // window.location.href = objectUrl;
        // window.open(objectUrl);
      },
      async getList(flag){
        if(flag){
          this.searchArr[0].totalPage=0
        }
        await this.record_search(this.searchArr[0]);
        this.searchArr[0].totalPage=this.totalPage
      },
      getTime(date){
        this.searchArr[0].startTime=date[0];
        this.searchArr[0].endTime=date[1];
      },
     async aboutInfoTel(backNo){
        this.$store.state.infoTel=true;
        this.searchInfo[0].backNo=backNo;
        this.searchInfo[1].backNo=backNo;
        await  this.record_search_head(this.searchInfo[0]);
        this.infoData=this.$store.state[this.searchInfo[0].infoName].data;
        const {dispensingCode,innerDeptName,outDeptName,backTypeName,dispensingDate}=this.infoData
        this.info=[{
         title:'发药单',
         span:10,
         cont:dispensingCode
       },
         {
           title:'内部药房',
           span:6,
           cont:innerDeptName
         },
         {
           title:'外部药房',
           span:6,
           cont:outDeptName
         },
         {
           title:'出库分类',
           span:10,
           cont:backTypeName
         },
         {
           title:'发药时间',
           span:6,
           cont:dispensingDate
         }
       ]
      }
    }
  }
</script>

<style scoped>
  .condition-row{height: auto!important;}
  .flexcont-add{width:20%;justify-content: space-around;}
</style>
