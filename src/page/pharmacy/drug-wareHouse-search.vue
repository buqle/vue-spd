/**
 * @author QER
 * @date 2019/12/18
 * @Description: 入库查询
*/
<template>
  <div class="condition">
    <div class="condition-row clear">
      <div class="condition-group">
        <label>单　　号</label>
        <Input  placeholder="请输入出库单/申领单/入库单"  class="condition-group-ipt" v-model="searchArr[0].inStoreCode"></Input>
      </div>
      <div class="condition-group">
        <label>入库分类</label>
        <Select  placeholder="请选择类型" class="condition-group-ipt" v-model="searchArr[0].inStoreType">
          <Option  v-for="(item,index) in typeArr" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
      </div>
      <div class="condition-group">
      <label>入库时间</label>
      <DatePicker type="daterange" v-model="searchArr[0].closeDate" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getTime" placement="bottom"></DatePicker>
    </div>
    </div>
    <div class="condition-row clear">
      <Button size="large" type="default" icon="ios-search" class="r" @click="getList(true)">查询</Button>
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
  import {mapState,mapActions} from 'vuex'
  export default {
    data(){
      return{
        typeArr:[],
        searchArr:[{
          pageNo:1,
          pageSize:20,
          totalPage:0,
          url:this.$api.pharmacyApi.DRUG_WARE_HOUSE_SEARCH_LIST,
          inStoreCode:'',
          inStoreType:'',
          closeDate:'',
          endTime:'',
          startTime:'',
          method: 'postJson'
        },{
          url:this.$api.systemApi.GETDEPT_TYPELIST,
          method: 'post',
          infoName:'acceptanceArr',
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
            title: '入库单',
            key: 'inStoreCode',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('span',{style:{color:'#2d8cf0',cursor:'pointer'},

                  on: {
                    click: () => {
                      this.edit(params.row)
                    }
                  }
                }, params.row.inStoreCode),
                h('Badge', {
                  props: {
                    count: params.row.instorDetailsItemsCount
                  },
                  style: {marginLeft:'8%'}
                })
              ]);
            },
          },
          {
            title: '出库单',
            key: 'orderCode',
            align: 'center',
          },
          {
            title: '申领单',
            key: 'applyCode',
            align: 'center',
          },
          {
            title: '入库分类',
            key: 'inStoreTypeName',
            align: 'center'
          },
          {
            title: '配货部门',
            key: 'deptName',
            align: 'center'
          },
          {
            title: '入库时间',
            key: 'createDate',
            align: 'center'
          },
          {
            title: '备注',
            key: 'remarks',
            align: 'center',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.remarks?params.row.remarks:'',
                  trigger: 'hover',
                  title:params.row.remarks,
                  placement:'left',
                  length:8
                }
              })
            }
          }
        ],
      }
    },
    async created(){
      await this.record_search_head(this.searchArr[1]);
      this.typeArr=this.$store.state[this.searchArr[1].infoName].data;
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
          this.$router,'/pharmacy/wareHouse/newLibrary/detail',
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
