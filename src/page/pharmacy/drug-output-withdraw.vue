/**
* @author QER
* @date 2019/12/29
* @Description: 药房-退库下架
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
      <Button size="large" type="default" icon="ios-search" class="r" @click="record_search({item:searchArr[0]})">查询</Button>
    </div>
    <div class="demo-spin-container mt15">
      <Table :columns="columns" :data="searchTab"></Table>
      <Spin size="large" fix v-if="spinsShow"></Spin>
    </div>
    <div class="r mt15">
      <Page :total="totalPage" :page-size="searchArr[0].pageSize" :current.sync="searchArr[0].pageNo" @on-change="record_search(searchArr[0])" show-total show-elevator />
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
        deptCodeArr:[],
        searchArr:[{
          pageNo:1,
          pageSize:10,
          totalPage:0,
          url:this.$api.pharmacyApi.DRUG_OUTSTORAGE_PICKUNDER_LIST,
          applyOrderNo:'',
          pickingStatus:1,
          startTime:'',
          endTime:'',
          closeDate:'',
          deptCode:'',
          pickingType: '5',
          queryType: 1
        },{
          url:this.$api.systemApi.GETDEPT_TYPELIST,
          infoName:'acceptanceArr',
          type: 'picking_status'
        },
          {
            url:this.$api.pharmacyApi.DRUG_OUTPUT_WITHDRAW_DEPT_LIST,
            infoName:'deptCodeArr',
            method:'get',
          }
        ],
        columns: [
          {
            type: 'index',
            title: '序号',
            width:60,
            align: 'center'
          },
          {
            title: '拣货单',
            key: 'pickingOrderNo',
            align: 'center',
            width: 162,
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
                  }
                })
              ]);
            },
          },
          {
            title: '申领部门',
            key: 'deptName',
            width:120,
            align: 'center',
          },
          {
            title: '状态',
            key: 'statusName',
            width:100,
            align: 'center',
          },
          {
            title: '类型',
            key: 'type',
            width:100,
            align: 'center',
          },
          {
            title: '发起人',
            key: 'createUserName',
            width:100,
            align: 'center',
          },
          {
            title: '发起时间',
            key: 'createDate',
            width:180,
            align: 'center',
            fixed:'right'
          },
          {
            title: '拣货人',
            key: 'pickingUserName',
            width:100,
            align: 'center',
            fixed:'right'
          },
          {
            title: '拣货时间',
            key: 'updateDate',
            width:180,
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
      this.deptCodeArr=this.$store.state[this.searchArr[2].infoName].data;
      this.searchArr[0].deptCode=this.deptCodeArr[1].value

      await this.record_search(this.searchArr[0]);
      //this.searchArr[0].totalPage=this.totalPage
    },
    computed:{
      ...mapState(['spinsShow','searchTab','totalPage'])
    },
    methods:{
      ...mapActions(['record_search_head','record_search']),
      edit(query){
        this.$skip.goEdit(
          this.$router,'/pharmacy/outStorage/withdraw/detail',
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
