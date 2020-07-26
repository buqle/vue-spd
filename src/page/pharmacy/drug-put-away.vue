/**
 * @author QER
 * @date 2019/12/9
 * @Description: 药房-入库上架
*/
<template>
  <div class="condition">
    <div class="condition-row clear">
      <div class="condition-group">
        <label>单据号　</label>
        <Input  placeholder="请输入验收单"  class="condition-group-ipt" v-model="searchArr[0].distributeCode"></Input>
      </div>
      <div class="condition-group">
        <label>状　　态</label>
        <Select  placeholder="请选择状态" class="condition-group-ipt" v-model="searchArr[0].auditStatus">
          <Option  v-for="(item,index) in acceptanceArr" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>类　　型</label>
        <Select  placeholder="请选择类型" class="condition-group-ipt" v-model="searchArr[0].type">
          <Option  v-for="(item,index) in typeArr" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
      </div>
      <div class="condition-group mt15">
        <label>验收时间</label>
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
        typeArr:[],
        searchArr:[{
          pageNo:1,
          pageSize:10,
          totalPage:0,
          url:this.$api.pharmacyApi.PUTAWAY_SEARCH_LIST,
          distributeCode:'',
          auditStatus:2,
          type:202,
          receptionStartTime:'',
          receptionEndTime:'',
          closeDate:'',
        },{
          url:this.$api.systemApi.GETDEPT_TYPELIST,
          method: 'post',
          infoName:'acceptanceArr',
          type: 'acceptance_status'
        },
          {
            url:this.$api.systemApi.GETDEPT_TYPELIST,
            method: 'post',
            infoName:'typeArr',
            type: 'room_in_store_type'
          }
        ],
        columns: [
          {
            type: 'index',
            title: '序号',
            align: 'center'
          },
          {
            title: '验收单',
            key: 'distributeCode',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('span',{style:{color:'#2d8cf0',cursor:'pointer'},

                  on: {
                    click: () => {
                      this.edit(params.row)
                    }
                  }
                }, params.row.distributeCode),
                h('Badge', {
                  props: {
                    count: params.row.checkAcceptDetailsItemsCount
                  },
                  style: {marginLeft:'8%'}
                })
              ]);
            },
          },
          {
            title: '状态',
            key: 'statusName',
            align: 'center'
          },
          {
            title: '类型',
            key: 'typeName',
            align: 'center'
          },
          {
            title: '验收时间',
            key: 'receptionTime',
            align: 'center'
          },
          {
            title: '上架时间',
            key: 'upUserDate',
            align: 'center'
          }
        ],
      }
    },
    async created(){
      await this.record_search_head(this.searchArr[1]);
      this.acceptanceArr=this.$store.state[this.searchArr[1].infoName].data;
      this.searchArr[0].auditStatus=this.acceptanceArr[1].value
      await this.record_search_head(this.searchArr[2]);
      this.typeArr=this.$store.state[this.searchArr[2].infoName].data;
      this.searchArr[0].type=this.typeArr[2].value
      await this.record_search(this.searchArr[0]);
    },
    computed:{
      ...mapState(['spinsShow','searchTab','totalPage'])
    },
    methods:{
      ...mapActions(['record_search_head','record_search']),
      edit(query){
        this.$skip.goEdit(
          this.$router,'/pharmacy/wareHouse/putaway/detail',
          query
        )
      },
      getTime(date){
        this.searchArr[0].receptionStartTime=date[0];
        this.searchArr[0].receptionEndTime=date[1];
      }
    }
  }
</script>

<style scoped>
  .condition-row{height: auto!important;}
  .flexcont-add{width:20%;justify-content: space-around;}
</style>
