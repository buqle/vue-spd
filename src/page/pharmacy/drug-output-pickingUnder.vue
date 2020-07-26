/**
 * @author QER
 * @date 2019/12/25 
 * @Description: 药房-出库管理-拣货下架
*/
<template>
  <div class="condition">
    <div class="condition-row clear">
      <div class="condition-group">
        <label>单据号　</label>
        <Input  placeholder="请输入拣货单/申领单"  class="condition-group-ipt" v-model="searchArr[0].applyOrderNo"></Input>
      </div>
      <div class="condition-group">
        <label>状　　态</label>
        <Select  placeholder="请选择状态" class="condition-group-ipt" v-model="searchArr[0].pickingStatus">
          <Option  v-for="(item,index) in acceptanceArr" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>类　　型</label>
        <Select  placeholder="请选择类型" class="condition-group-ipt" v-model="searchArr[0].pickingType">
          <Option  v-for="(item,index) in typeArr" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
      </div>
      <div class="condition-group  mt15">
        <label>申领部门</label>
        <Select  placeholder="请选择部门" class="condition-group-ipt" v-model="searchArr[0].deptCode">
          <Option  v-for="(item,index) in deptCodeArr" :value="item.id" :key="index">{{item.deptName}}</Option>
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
        deptCodeArr:[],
        searchArr:[{
          pageNo:1,
          pageSize:10,
          totalPage:0,
          url:this.$api.pharmacyApi.DRUG_OUTSTORAGE_PICKUNDER_LIST,
          applyOrderNo:'',
          pickingStatus:1,
          pickingType:2,
          startTime:'',
          endTime:'',
          closeDate:'',
          queryType: 2,
          deptCode:''
        },{
          url:this.$api.systemApi.GETDEPT_TYPELIST,
          infoName:'acceptanceArr',
          type: 'picking_status'
        },
          {
            url:this.$api.systemApi.GETDEPT_TYPELIST,
            infoName:'typeArr',
            type: 'new_picking_type'
          },
          {
            url:this.$api.pharmacyApi.PUTAWAY_OUTSTORAGE_REPLEN_DEPT_LIST,
            infoName:'deptCodeArr',
            method:'get',
          }
        ],
        columns: [
          {
            type: 'index',
            title: '序号',
            width:'80',
            align: 'center'
          },
          {
            title: '拣货单',
            key: 'pickingOrderNo',
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
                }, params.row.pickingOrderNo),
                h('Badge', {
                  props: {
                    count: params.row.pickingDetailItemCount
                  },
                  style: {marginLeft:'8%'}
                })
              ]);
            },
          },
          {
            title: '申领部门',
            key: 'deptName',
            width:'250',
            align: 'center',
          },
          {
            title: '状态',
            key: 'statusName',
            width:'250',
            align: 'center',
          },
          {
            title: '类型',
            key: 'type',
            width:'250',
            align: 'center',
          },
          {
            title: '发起人',
            key: 'createUserName',
            width:'200',
            align: 'center',
          },
          {
            title: '发起时间',
            key: 'createDate',
            width:'200',
            align: 'center',
            fixed:'right'
          },
          {
            title: '拣货人',
            key: 'pickingUserName',
            width:'200',
            align: 'center',
            fixed:'right'
          },
          {
            title: '拣货时间',
            key: 'updateDate',
            width:'200',
            align: 'center',
            fixed:'right'
          }
        ],
      }
    },
    async created(){
      await this.record_search_head(this.searchArr[1]);
      this.acceptanceArr=this.$store.state[this.searchArr[1].infoName].data;
      this.searchArr[0].pickingStatus=this.acceptanceArr[1].value

      await this.record_search_head(this.searchArr[2]);
      this.typeArr=this.$store.state[this.searchArr[2].infoName].data;
      this.searchArr[0].pickingType=this.typeArr[2].value

      await this.record_search_head(this.searchArr[3]);
      this.deptCodeArr=this.$store.state[this.searchArr[3].infoName].data;
      this.searchArr[0].deptCode=this.deptCodeArr[1].value

      this.getList();
    },
    computed:{
      ...mapState(['spinsShow','searchTab','totalPage'])
    },
    methods:{
      ...mapActions(['record_search_head','record_search']),
      async getList(flag){
        if(flag){
          this.searchArr[0].totalPage=0;
        }
        await this.record_search(this.searchArr[0]);
        this.searchArr[0].totalPage=this.totalPage
      },
      edit(query){
        this.$skip.goEdit(
          this.$router,'/pharmacy/outStorage/pickingUnder/detail',
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
