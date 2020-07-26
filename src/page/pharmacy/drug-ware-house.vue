/**
 * @author QER
 * @date 2019/12/15
 * @Description: 入库验收
*/
<template>
  <div class="condition">
    <div class="condition-row clear">
      <div class="condition-group">
        <label>单　　据</label>
        <Input  placeholder="请输入出库单/申领单"  class="condition-group-ipt" v-model="searchArr[0].distributeCode"></Input>
      </div>
      <div class="condition-group">
        <label>状　　态</label>
        <Select  placeholder="请选择状态" class="condition-group-ipt" v-model="searchArr[0].acceptanceType">
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
      <div class="condition-group mt15">
        <label>发起时间</label>
        <DatePicker type="daterange" v-model="searchArr[0].createTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getTime2"></DatePicker>
      </div>
      <div class="condition-group mt15">
        <label>批　　号</label>
        <Input  placeholder="请输入批号"  class="condition-group-ipt" v-model="searchArr[0].lot"></Input>
      </div>

    </div>
    <div class="condition-row mt15 clear">
      <div  flexcont class="condition-group drug-sea">
        <label>药品名称</label>
        <Search :size="'80%'" :ml="10" @upAdd="choseCode"></Search>
      </div>
    </div>
    <div class="condition-row clear">
      <div class="condition-group" style="width: 12%;">
        <Radius iconHref="icon-tianjiaanniu" iconText="新建验收" iconSize="20"  @upButton="add"></Radius>
      </div>

      <Button size="large" type="default" icon="ios-search" class="r" @click="record_search({item:searchArr[0]})">查询</Button>
    </div>
    <div class="demo-spin-container mt15">
      <Table :columns="columns" :data="searchTab" width="100%"></Table>
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
          url:this.$api.pharmacyApi.DRUG_WARE_HOUSE_LIST,
          distributeCode:'',
          acceptanceType:'',
          type:'',
          checkType:2,
          receptionStartTime:'',
          receptionEndTime:'',
          closeDate:'',
          hisDrugCode:'',
          lot:'',
          createTime:'',
          startCreateTime:'',
          endCreateTime:'',
          method: 'postJson',
        },{
          url:this.$api.systemApi.GETDEPT_TYPELIST,
          method: 'post',
          infoName:'acceptanceArr',
          type: 'acceptance_checkVo'
        },
          {
            url:this.$api.systemApi.GETDEPT_TYPELIST,
            method: 'post',
            infoName:'typeArr',
            type: 'acceptance_type'
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
            title: '验收单',
            key: 'distributeCode',
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
            title: '申领单',
            key: 'applyCode',
            align: 'center',
            width: '200',
            render: (h, params) => {
              return h('div', [
                h('span', params.row.applyCode),
              ]);
            },
          },
          {
            title: '配货部门',
            key: 'deptName',
            width: '150',
            align: 'center'
          },
          {
            title: '状态',
            key: 'statusName',
            width: '150',
            align: 'center'
          },
          {
            title: '类型',
            key: 'typeName',
            width: '150',
            align: 'center'
          },
          {
            title: '验收时间',
            key: 'receptionTime',
            width: '200',
            align: 'center'
          },
          {
            title: '发起人',
            key: 'createName',
            width: '150',
            fixed:'right',
            align: 'center'
          },
          {
            title: '发起时间',
            key: 'createDate',
            width: '200',
            fixed:'right',
            align: 'center'
          },
          {
            title: '验收人',
            key: 'receptionUserName',
            width: '100',
            fixed:'right',
            align: 'center'
          },
          {
            title: '验收时间',
            width: '150',
            key: 'receptionTime',
            fixed:'right',
            align: 'center'
          },
        ],
      }
    },
    async created(){
      await this.record_search(this.searchArr[0]);
      await this.record_search_head(this.searchArr[1]);
      this.acceptanceArr=this.$store.state[this.searchArr[1].infoName].data;
      await this.record_search_head(this.searchArr[2]);
      this.typeArr=this.$store.state[this.searchArr[2].infoName].data;
    },
    computed:{
      ...mapState(['spinsShow','searchTab','totalPage'])
    },
    methods:{
      ...mapActions(['record_search_head','record_search']),
      add(){
        this.$skip.goAdd(this.$router, '/pharmacy/wareHouse/acceptance/add')
      },
      edit(query){
        this.$skip.goEdit(
          this.$router,'/pharmacy/wareHouse/acceptance/detail',
          query
        )
      },
      getTime(date){
        this.searchArr[0].receptionStartTime=date[0];
        this.searchArr[0].receptionEndTime=date[1];
      },
      getTime2(date){
        this.searchArr[0].startCreateTime=date[0];
        this.searchArr[0].endCreateTime=date[1];
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
