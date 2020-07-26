/**
* @author QER
* @date 2020/3/13
* @Description: 药房-抢救车目录管理
*/
<template>
  <div class="condition">
    <div class="condition-row clear">
      <div class="condition-group">
        <label>部　　门</label>
        <Select  placeholder="请选择部门" class="condition-group-ipt" v-model="searchArr[0].parentDeptCode">
          <Option key="" value=''>全部</Option>
          <Option  v-for="(item,index) in makeupStatusArr" :value="item.id" :key="index">{{item.deptName}}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>抢救车</label>
        <Select  placeholder="请选择抢救车" class="condition-group-ipt" v-model="searchArr[0].deptCode">
          <Option  v-for="(item,index) in makeupTypeArr" :value="item.id" :key="index">{{item.deptName}}</Option>
        </Select>
      </div>
    </div>
    <div class="condition-row clear">
      <Button size="large" type="default" icon="ios-search" class="r" @click="getList">查询</Button>
    </div>

    <div class="demo-spin-container mt15">
      <Table :columns="columns" :data="searchTabs"></Table>
      <Spin size="large" fix v-if="spinsShow"></Spin>
    </div>
    <div class="r mt15">
      <Page :total="searchArr[0].totalPage" :page-size="searchArr[0].pageSize" :current.sync="searchArr[0].pageNo" @on-change="changepage" show-total show-elevator />
    </div>
  </div>
</template>

<script>
  import {filter} from 'lodash'
  import {mapState,mapActions,mapMutations} from 'vuex'
  export default {
    data(){
      return{
        searchTabs:[],
        makeupTypeArr:[],
        makeupStatusArr:[],
        selectproductsObj:[],//选中数据
        searchArr:[{
          pageNo:1,
          pageSize:10,
          totalPage:0,
          url:this.$api.pharmacyApi.SALVAFE_LIST,
          method: 'postJson',
          deptCode:'',
          parentDeptCode:'',
        },
          {
            url:this.$api.pharmacyApi.SALVAFE_ROOM_DEPT_LIST,
            infoName:'makeupTypeArr',
            method: 'get',
            infos:{}
          },
          {
            url:this.$api.pharmacyApi.SALVAFE_DEPT_LIST,
            infoName:'makeupStatusArr',
            method: 'get',
            infos:{}
          },

        ],
        columns: [
          {
            type: 'index',
            title: '序号',
            align: 'center'
          },
          {
            title: '部门',
            key: 'parentDeptName',
            align: 'center'
          },
          {
            title: '抢救车',
            key: 'deptName',
            align: 'center'
          },
          {
            title: '操作',
            key: 'address',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    //size: 'small'
                  },
                  style: {
                    marginRight: '2px',
                  },
                  on: {
                    click: () => {
                      //this.infoTit=params.row.deptName
                      this.editAdd(params.row.deptCode,params.row.deptName)
                    }
                  }
                }, '编辑目录')
              ]);
            }
          }
        ],

      }
    },
    async created(){
      await  this.getTop()
      this.getList();
    },
    computed:{
      ...mapState(['spinsShow','searchTab','infoTel','totalPage'])
    },

    methods:{
      ...mapActions(['record_search_head','record_search',]),
      ...mapMutations(['RECORD_INFOTEL']),

      async getTop(){
        await this.record_search_head(this.searchArr[1]);
        this.makeupTypeArr=this.$store.state[this.searchArr[1].infoName].data;

        await this.record_search_head(this.searchArr[2]);
        this.makeupStatusArr=this.$store.state[this.searchArr[2].infoName].data;

      },
      //分页
      changepage(index){
        let _start = ( index - 1 ) * this.searchArr[0].pageSize;
        let _end = index * this.searchArr[0].pageSize;
        this.searchTabs = this.searchTab.slice(_start,_end);
      },
      createPage(list,historyData,data){
        if(list.length < this.searchArr[0].pageSize){
          historyData=list;
        }else{
          historyData =list.slice(0,this.searchArr[0].pageSize);
        }
        this[data] = historyData;
      },
      async getList(){
        await this.record_search(this.searchArr[0]);
        //this.searchTabs=this.searchTab
        this.createPage(this.searchTab,this.searchTabs,'searchTabs')
        this.searchArr[0].totalPage=this.searchTab.length;
      },
      //新建
      editAdd(backNo,tit) {
        this.$router.push({path: '/pharmacy/configMgt/salvageList/add', query: {backNo, tit}})
      }
    },

  }
</script>

<style scoped>
  .condition-row{height: auto!important;}
  .flexcont-add{width:20%;justify-content: space-around;}
</style>

