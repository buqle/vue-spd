/**
 * @author QER
 * @date 2020/1/5
 * @Description: 药房-配货出库
*/
<template>
  <div class="condition">
    <div class="condition-row clear">
      <div class="condition-group">
        <label>单据号　</label>
        <Input  placeholder="请输入申领单"  class="condition-group-ipt" v-model="searchArr[0].applyCode"></Input>
      </div>
      <div class="condition-group">
        <label>状　　态</label>
        <Select  placeholder="请选择状态" class="condition-group-ipt" v-model="searchArr[0].applyStatus">
          <Option  v-for="(item,index) in acceptanceArr" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>申领部门</label>
        <Select  placeholder="请选择类型" class="condition-group-ipt" v-model="searchArr[0].applyDeptCode">
          <Option  v-for="(item,index) in typeArr" :value="item.id" :key="index">{{item.deptName}}</Option>
        </Select>
      </div>
      <div class="condition-group mt15">
        <label>发起时间</label>
        <DatePicker type="daterange" v-model="searchArr[0].closeDate" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getTime" placement="right"></DatePicker>
      </div>
    </div>
    <div class="condition-row clear">
      <Button size="large" type="default" icon="ios-search" class="r" @click="getList(true)">查询</Button>
    </div>
    <div class="demo-spin-container mt15">
      <Table :columns="columns" :data="searchTab" style="width: 100%"></Table>
      <Spin size="large" fix v-if="spinsShow"></Spin>
    </div>
    <div class="r mt15">
      <Page :total="searchArr[0].totalPage" :page-size="searchArr[0].pageSize" :current.sync="searchArr[0].pageNo" @on-change="getList" show-total show-elevator />
    </div>
  </div>
</template>

<script>
  import {filter} from 'lodash'
  import {mapState,mapActions} from 'vuex'
  export default {
    data(){
      return{
        acceptanceArr:[],
        typeArr:[],
        searchArr:[{
          pageNo:1,
          pageSize:10,
          totalPage:0,
          url:this.$api.pharmacyApi.PUTAWAY_OUTSTORAGE_ACCPTDIS_LIST,
          applyCode:'',
          applyStatus:'',
          applyDeptCode:'',
          queryType: 2,
          startTime:'',
          endTime:'',
          closeDate:'',
        },{
          url:this.$api.systemApi.GETDEPT_TYPELIST,
          infoName:'acceptanceArr',
          type: 'common_distribute_status'
        },
          {
            url:this.$api.pharmacyApi.PUTAWAY_OUTSTORAGE_REPLEN_DEPT_LIST,
            method: 'get',
            infoName:'typeArr'
          }
        ],
        columns: [
          {
            type: 'index',
            title: '序号',
            align: 'center',
            width:'80'
          },
          {
            title: '申领单',
            key: 'applyCode',
            align: 'center',
            width:'250',
            render: (h, params) => {
              return h('div', [
                h('span',{style:{color:'#2d8cf0',cursor:'pointer'},

                  on: {
                    click: () => {
                      this.edit(params.row)
                    }
                  }
                }, params.row.applyCode),
                h('Badge', {
                  props: {
                    count: params.row.applydetailsItemsCount
                  },
                  style: {marginLeft:'8%'},
                })
              ]);
            },
          },
          {
            title: '状态',
            key: 'applyStatusName',
            width:'250',
            align: 'center'
          },
          {
            title: '申领部门',
            key: 'applyDeptName',
            width:'250',
            align: 'center'
          },
          {
            title: '类型',
            key: 'applyTypeName',
            width:'250',
            align: 'center'
          },
          {
            title: '发起人',
            key: 'createUserName',
            width:'250',
            align: 'center'
          },
          {
            title: '发起时间',
            key: 'createDate',
            width:'250',
            align: 'center'
          }
        ],
      }
    },
    async created(){
      await this.record_search_head(this.searchArr[1]);
      this.acceptanceArr=this.$store.state[this.searchArr[1].infoName].data;

      await this.record_search_head(this.searchArr[2]);
      this.typeArr=this.$store.state[this.searchArr[2].infoName].data;
      this.getList();

    },
    computed:{
      ...mapState(['spinsShow','searchTab','totalPage'])
    },
    methods:{
      ...mapActions(['record_search_head','record_search']),
     async getList(flag){
       if(flag){
         this.searchArr[0].totalPage=0
       }
        await this.record_search(this.searchArr[0]);
        this.searchArr[0].totalPage=this.totalPage
      },
      edit(query){
        this.$skip.goEdit(
          this.$router,'/pharmacy/outStorage/acceptDistribution/detail',
          query
        )
      },
      getTime(date){
        this.searchArr[0].startTime=date[0];
        this.searchArr[0].endTime=date[1];
      }
    }
  }
</script>

<style scoped>
  .condition-row{height: auto!important;}
  .flexcont-add{width:20%;justify-content: space-around;}
</style>
