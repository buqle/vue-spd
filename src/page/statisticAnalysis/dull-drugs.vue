/**
 * @author QER
 * @date 2020/1/12
 * @Description: 呆滞库存查询
*/
<template>
  <div class="condition">
    <div class="condition-row clear">
      <div class="condition-group">
        <label>呆滞时间</label>
        <Select  placeholder="请选择状态" class="condition-group-ipt" v-model="searchArr[0].delayDay" clearable>
          <Option  v-for="(item,index) in delayDayArr" :value="item.id" :key="index">{{item.desc}}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>时间段</label>
        <DatePicker type="daterange" v-model="launchDate" class="condition-group-ipt" placeholder="请选择日期范围" @on-clear="clearLaunchDate" placement="bottom" ></DatePicker>
      </div>
      <div class="condition-group">
        <label>供应商</label>
        <Select  placeholder="请选择" class="condition-group-ipt" v-model="searchArr[0].supplierCode" clearable>
          <Option  v-for="(item,index) in supplierList" :value="item.ctmaSupplierCode" :key="index">{{item.ctmaSupplierName}}</Option>
        </Select>
      </div>
      <div  flexcont class="condition-group drug-sea mt15">
        <label>药品名称</label>
        <Search :size="'80%'" :ml="10" @upAdd="choseCode"></Search>
      </div>
      <div class="condition-group mt15">
        <label>部　门</label>
        <Select  placeholder="请选择" class="condition-group-ipt" v-model="searchArr[0].deptCode" clearable>
          <Option  v-for="(item,index) in deptCodeArr" :value="item.id" :key="index">{{item.deptName}}</Option>
        </Select>
      </div>
      <div class="condition-group mt15">
        <label>临效期</label>
        <Select  placeholder="请选择" class="condition-group-ipt" v-model="searchArr[0].periodEffectDate" clearable>
          <Option  v-for="(item,index) in periodEffArr" :value="item.id" :key="index">{{item.desc}}</Option>
        </Select>
      </div>
    </div>
    <div class="condition-row clear">
      <Button size="large" type="default" icon="ios-search" class="r" @click="getList">查询</Button>
    </div>
    <div class="demo-spin-container mt15">
      <Table :columns="columns" :data="searchTab"></Table>
      <Spin size="large" fix v-if="spinsShow"></Spin>
    </div>
    <div class="r mt15">
      <Page :total="searchArr[0].totalPage" :page-size="searchArr[0].pageSize" :current.sync="searchArr[0].pageNo" @on-change="getList" show-total show-elevator />
    </div>
  </div>
</template>

<script>
  import {filter} from 'lodash'
  import {mapState,mapActions,mapMutations} from 'vuex'
  export default {
    data(){
      return{
        delayDayArr:[],
        supplierList:[],
        deptCodeArr:[],
        periodEffArr:[],
        launchDate:[],
        searchArr:[{
          pageNo:1,
          pageSize:10,
          totalPage:0,
          url:this.$api.statisticApi.STATISTIC_DULL_DRG_LIST,
          delayDay:30,
          supplierCode:'',
          hisDrugCode:'',
          deptCode:'',
          periodEffectDate:'',
          endTime:'',
          startTime:'',
        },{
          url:this.$api.statisticApi.STATISTIC_DULL_DRG_GETTIME,
          infoName:'delayDayArr',
          infos:{}
        },{
          url:this.$api.statisticApi.STATISTIC_DULL_DRG_GETSUPLIER,
          infoName:'supplierList',
          infos:{}
        },{
          url:this.$api.statisticApi.STATISTIC_DULL_DRG_GETDEPT,
          infoName:'deptCodeArr',
          method:'get',
          infos:{}
        },{
          url:this.$api.statisticApi.STATISTIC_DULL_DRG_GETJXQTIME,
          infoName:'periodEffArr',
          infos:{}
        },
        ],
        columns: [
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
            title: '药品编号',
            align: 'center',
            width:150,
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
            title: '部门',
            key: 'deptName',
            align: 'center',
            width: 120
          },
          {
            title: '呆滞天数',
            key: 'delayDay',
            align: 'center',
            width: 110
          },
          {
            title: '货位',
            key: 'locName',
            align: 'center',
            width: 150
          },
          {
            title: '库存',
            key: 'totalQuantity',
            align: 'center',
            width: 100
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
            key: 'lot',
            title: '生产批号',
            width:120,
            align: 'center'
          },
          {
            key: 'replanUnit',
            title: '单位',
            width:90,
            align: 'center'
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
            key: 'validEndDate',
            title: '有效期至',
            align: 'center',
            width:100,
            fixed:'right'
          },
          {
            key: 'diffDay',
            title: '近效期',
            align: 'center',
            width:100,
            fixed:'right'
          },
          {
            key: 'purchaseType',
            title: '采购方式',
            align: 'center',
            width:100,
            fixed:'right',
            render: (h, params) => {
              if (params.row.purchaseType ==1) {
                return h('span', '零库存');
              }else {
                return h('span', '自采');
              }
            }
          },
          {
            key: 'price',
            title: '价格',
            align: 'center',
            width:100,
            fixed:'right'
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
            },
            fixed:'right'
          },
        ],
      }
    },
    async created(){
      await this.getTop()
      await this.getList()

    },
    computed:{
      ...mapState(['spinsShow','searchTab','totalPage'])
    },
    methods:{
      ...mapActions(['record_search_head','record_search']),
      async getList(){
        let launchDate = this.launchDate;
        if(launchDate && Array.isArray(launchDate) && launchDate.length > 0 && launchDate[0] && launchDate[1]){
          this.searchArr[0].startTime = this.$moment(launchDate[0]).format('YYYY-MM-DD');
          this.searchArr[0].endTime = this.$moment(launchDate[1]).format('YYYY-MM-DD');
        }
        await this.record_search(this.searchArr[0]);
        this.searchArr[0].totalPage=this.totalPage
      },
      async getTop(){
        await this.record_search_head(this.searchArr[1]);
        this.delayDayArr=this.$store.state[this.searchArr[1].infoName].data;
        this.searchArr[0].delayDay=this.delayDayArr[0].id

        await this.record_search_head(this.searchArr[2]);
        this.supplierList=this.$store.state[this.searchArr[2].infoName].data;

        await this.record_search_head(this.searchArr[3]);
        this.deptCodeArr=this.$store.state[this.searchArr[3].infoName].data;

        await this.record_search_head(this.searchArr[4]);
        this.periodEffArr=this.$store.state[this.searchArr[4].infoName].data||[];
      },
      clearLaunchDate(){
        this.launchDate = [];
        this.searchArr[0].startTime= '';
        this.searchArr[0].endTime= '';
      },
      //选择药品code
      choseCode(drugCode){
        drugCode?this.searchArr[0].hisDrugCode=drugCode:this.searchArr[0].hisDrugCode=''
      }
    },

  }
</script>

<style scoped>
  .condition-row{height: auto!important;}
  .flexcont-add{width:20%;justify-content: space-around;}
</style>
