/**
* @author QER
* @date 2019/12/23
* @Description: 出库管理-发药复核
*/
<template>
  <div class="condition">
    <div class="condition-row clear">
      <div class="condition-group">
        <label>单　　据</label>
        <Input  placeholder="请输入出库单/申领单/入库单"  class="condition-group-ipt" v-model="searchArr[0].parameter"></Input>
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
            width: '200',
            render: (h, params) => {
              return h('div', [
                h('span',{style:{color:'#2d8cf0',cursor:'pointer'},
                  on: {
                    click: () => {
                      this.edit(params.row)
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
            align: 'center'
          },
          {
            title: '发药时间',
            key: 'dispensingDate',
            fixed:'right',
            align: 'center',
            width: '250',
          }
        ],
      }
    },
    async created(){
      this.getList()
    },
    computed:{
      ...mapState(['spinsShow','searchTab','infoTel','totalPage'])
    },

    methods:{
      ...mapActions(['record_search']),
      async getList(flag){
        if(flag){
          this.searchArr[0].totalPage=0
        }
        await this.record_search(this.searchArr[0]);
        this.searchArr[0].totalPage=this.totalPage
      },
      edit(query){
        this.$skip.goEdit(
          this.$router,'/pharmacy/outStorage/review/detail',
          query
        )
      },
    }
  }
</script>

<style scoped>
  .condition-row{height: auto!important;}
  .flexcont-add{width:20%;justify-content: space-around;}
</style>
