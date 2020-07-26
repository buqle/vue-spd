/**
 * @author QER
 * @date 2019/11/27
 * @Description: 药房-药品申领
*/
<template>
  <div class="condition">
    <div class="condition-row">
      <div class="condition-group">
        <label>申领单</label>
        <Input  placeholder="请输入"  class="condition-group-ipt" v-model="searchArr[0].applyCode"></Input>
      </div>
      <div class="condition-group">
        <label>状态</label>
        <Select  placeholder="请选择类型" class="condition-group-ipt" v-model="searchArr[0].applyStatus">
          <Option  v-for="(item,index) in typeArr" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>发起时间</label>
        <DatePicker type="daterange" v-model="searchArr[0].closeDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getTime"></DatePicker>
      </div>
    </div>
    <div class="condition-row">
      <Button size="large" type="default" icon="ios-search" class="r" @click="record_search({item:searchArr[0]})">查询</Button>
    </div>
    <Row>
      <Col span="2-5">
        <Radius iconHref="icon-tianjiaanniu" iconText="新建申领" iconSize="20"  @upButton="add"></Radius>
      </Col>
    </Row>
    <div class="demo-spin-container">
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
        typeArr:[],
        searchArr:[{
          pageNo:1,
          pageSize:20,
          totalPage:0,
          url:this.$api.pharmacyApi.APPLY_SEARCH_LIST,
          applyCode:'',
          applyStatus:'',
          queryType: 1,
          startTime:'',
          endTime:'',
          closeDate:''
        },{
          url:this.$api.systemApi.GETDEPT_TYPELIST,
          method: 'post',
          infoName:'typeArr',
          type: 'apply_status'
        }
        ],
        columns: [
          {
            type: 'index',
            title: '序号',
            align: 'center'
          },
          {
            title: '申领单',
            key: 'applyCode',
            align: 'center',
            width: 162,
            render: (h, params) => {
              return h('div', [
                h('span',
                  {
                    style:{color:'#2d8cf0',cursor:'pointer'},
                    on: {
                      click: () => {
                        this.edit(params.row)
                      }
                    }

                    },

                  params.row.applyCode
                ),
                h('Badge', {
                  props: {
                    count: params.row.applydetailsItemsCount
                  },
                  style: {marginLeft:'8%'}
                })
              ]);
            },
          },
          {
            title: '申领部门',
            key: 'applyDeptName',
            align: 'center'
          },
          {
            title: '配货部门',
            key: 'distributeDeptName',
            align: 'center'
          },
          {
            title: '状态',
            key: 'applyStatusName',
            align: 'center'
          },
          {
            title: '类型',
            key: 'applyTypeName',
            align: 'center'
          },
          {
            title: '发起人',
            key: 'createUserName',
            align: 'center'
          },
          {
            title: '发起时间',
            key: 'createDate',
            align: 'center'
          }
        ],
      }
    },
    async created(){
      await this.record_search(this.searchArr[0]);
      await this.record_search_head(this.searchArr[1]);
      this.typeArr=this.$store.state[this.searchArr[1].infoName].data;

    },
    computed:{
      ...mapState(['spinsShow','searchTab','totalPage'])
    },
    methods:{
      ...mapActions(['record_search_head','record_search']),
      add(){
        this.$skip.goAdd(this.$router, '/pharmacy/wareHouse/drugsFor/add')
      },
      edit(query){
        this.$skip.goEdit(
          this.$router,'/pharmacy/wareHouse/drugsFor/detail',
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
  .flexcont-add{width:20%;justify-content: space-around;}
</style>
