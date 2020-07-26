/**
 * @author QER
 * @date 2020/1/2
 * @Description: 药房-发药复核
*/
<template>
  <div class="condition">
    <div class="condition-row clear">
      <div class="condition-group">
        <label>单据号　</label>
        <Input  placeholder="请输入拣货单/申领单"  class="condition-group-ipt" v-model="searchArr[0].orderNo"></Input>
      </div>
      <div class="condition-group">
        <label>状　　态</label>
        <Select  placeholder="请选择状态" class="condition-group-ipt" v-model="searchArr[0].backStatus">
          <Option  v-for="(item,index) in acceptanceArr" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>出库分类</label>
        <Select  placeholder="请选择出库分类" class="condition-group-ipt" v-model="searchArr[0].backType">
          <Option  v-for="(item,index) in typeArr" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
      </div>

      <div class="condition-group  mt15">
        <label>批　　号</label>
        <Input  placeholder="请输入拣货单/申领单"  class="condition-group-ipt" v-model="searchArr[0].lot"></Input>
      </div>
      <div class="condition-group  mt15">
        <label>申领部门</label>
        <Select  placeholder="请选择部门" class="condition-group-ipt" v-model="searchArr[0].deptCode">
          <Option  v-for="(item,index) in deptCodeArr" :value="item.id" :key="index">{{item.deptName}}</Option>
        </Select>
      </div>
      <div class="condition-group mt15">
        <label>出库时间</label>
        <DatePicker type="daterange" v-model="searchArr[0].closeDate" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getTime" placement="right"></DatePicker>
      </div>
    </div>
    <div class="condition-row mt15 clear">
      <div  flexcont class="condition-group drug-sea">
        <label>药品名称</label>
        <Search :size="'80%'" :ml="10" @upAdd="choseCode"></Search>
      </div>
    </div>
    <div class="condition-row clear">
      <Button size="large" type="default" icon="ios-search" class="r" @click="record_search(searchArr[0])">查询</Button>
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
        deptCodeArr:[],
        searchArr:[{
          pageNo:1,
          pageSize:10,
          totalPage:0,
          url:this.$api.pharmacyApi.DRUG_REVIEW_LIST,
          orderNo:'',
          backStatus:1,
          lot:'',
          backType:'',
          startTime:'',
          endTime:'',
          closeDate:'',
          deptCode:'',
          hisDrugCode:''
        },{
          url:this.$api.systemApi.GETDEPT_TYPELIST,
          infoName:'acceptanceArr',
          type: 'out_store_status'
        },
          {
            url:this.$api.systemApi.GETDEPT_TYPELIST,
            infoName:'typeArr',
            type: 'room_out_store_type'
          },
          {
            url:this.$api.pharmacyApi.DRUG_REVIEW_DEPT_LIST,
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
            title: '出库单',
            key: 'backNo',
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
                }, params.row.backNo),
                h('Badge', {
                  props: {
                    count: params.row.outstoreDetailItemsCount
                  }
                })
              ]);
            },
          },
          {
            title: '拣货单',
            key: 'pickingNo',
            width:160,
            align: 'center',
          },
          {
            title: '出库分类',
            key: 'backType',
            width:100,
            align: 'center',
          },
          {
            title: '状态',
            key: 'status',
            width:90,
            align: 'center',
          },
          {
            title: '申领部门',
            key: 'deptName',
            width:140,
            align: 'center',
          },
          {
            title: '发起人',
            key: 'createUserName',
            width:100,
            align: 'center',
            fixed:'right'
          },
          {
            title: '发起时间',
            key: 'createDate',
            width:170,
            align: 'center',
            fixed:'right'
          },
          {
            title: '复核人',
            key: 'checkUserName',
            width:100,
            align: 'center',
            fixed:'right'
          },
          {
            title: '复核时间',
            key: 'checkDate',
            width:170,
            align: 'center',
            fixed:'right'
          }
        ],
      }
    },
    async created(){
      await this.record_search_head(this.searchArr[1]);
      this.acceptanceArr=this.$store.state[this.searchArr[1].infoName].data;
      this.searchArr[0].backStatus=this.acceptanceArr[1].value

      await this.record_search_head(this.searchArr[2]);
      this.typeArr=this.$store.state[this.searchArr[2].infoName].data;


      await this.record_search_head(this.searchArr[3]);
      this.deptCodeArr=this.$store.state[this.searchArr[3].infoName].data;

      this.record_search(this.searchArr[0]);

    },
    computed:{
      ...mapState(['spinsShow','searchTab','totalPage'])
    },
    methods:{
      ...mapActions(['record_search_head','record_search']),

      edit(query){
        this.$skip.goEdit(
          this.$router,'/pharmacy/outStorage/pharmacyReview/detail',
          query
        )
      },
      getTime(date){
        this.searchArr[0].startTime=date[0];
        this.searchArr[0].endTime=date[1];
      },
      //选择药品code
      choseCode(drugCode){
        drugCode?this.searchArr[0].hisDrugCode=drugCode:this.searchArr[0].hisDrugCode=''
      }
    }
  }
</script>

<style scoped>
  .condition-row{height: auto!important;}
  .flexcont-add{width:20%;justify-content: space-around;}
</style>
