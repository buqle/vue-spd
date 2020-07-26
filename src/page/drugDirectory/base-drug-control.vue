/**
* @author QER
* @date 2020/3/13
* @Description: 药房-抢救车目录管理
*/
<template>
  <div class="condition">
    <div class="condition-row clear" v-if="$route.meta.baseMgt==1">
      <div class="condition-group">
        <label>部　　门</label>
        <Select  placeholder="请选择部门" class="condition-group-ipt" v-model="searchArr[0].pDeptCode" @on-change="getItemValue">
          <Option  v-for="(item,index) in makeupStatusArr" :value="item.deptCode" :key="index">{{item.deptName}}</Option>
        </Select>
      </div>
      <div class="condition-group" style="width: 36%">
        <label>基数药部门</label>
        <Select  placeholder="请选择部门" class="condition-group-ipt" v-model="searchArr[0].deptCode" v-if="!searchArr[0].pDeptCode" style="width: 78%;">
          <Option value="" key="">全部</Option>
        </Select>
        <Select  placeholder="请选择部门" class="condition-group-ipt" v-model="searchArr[0].deptCode"  style="width: 78%;" v-else>
          <Option value="" key="">全部</Option>
          <Option  v-for="(item,index) in makeupTypeArr" :value="item.deptCode" :key="index">{{item.deptName}}</Option>
        </Select>
      </div>
    </div>

    <div class="condition-row clear" v-else>
      <div class="condition-group">
        <label>基数药部门</label>
        <Select  placeholder="请选择部门" class="condition-group-ipt" v-model="searchArr[0].deptCode"  style="width: 78%;">
          <Option value='' key=''>全部</Option>
          <Option  v-for="(item,index) in makeupTypeArr" :value="item.id" :key="index">{{item.deptName}}</Option>
        </Select>
      </div>
    </div>

    <div class="condition-row clear">
      <Button size="large" type="default" icon="ios-search" class="r" @click="getList">查询</Button>
    </div>

    <div class="demo-spin-container mt15">
      <Table :columns="columns" :data="searchTabs" v-if="$route.meta.baseMgt"></Table>
      <Table :columns="columns2" :data="searchTabs" v-else></Table>
      <Spin size="large" fix v-if="spinsShow"></Spin>
    </div>
    <div class="r mt15">
      <Page :total="searchArr[0].totalPage" :page-size="searchArr[0].pageSize" :current.sync="searchArr[0].pageNo" @on-change="getList" show-total show-elevator />
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
          url:this.$route.meta.baseMgt?this.$api.pharmacyApi.CARDINAL_DRUGS_LIST:this.$api.pharmacyApi.ARDINAL_PH_DRUGS_LIST,
          method: 'postJson',
          deptCode:'',
          pDeptCode:'',
          deptCodeList:[]
        },
          {
            url:this.$route.meta.baseMgt?this.$api.pharmacyApi.CARDINAL_DRUGS_DEPT_LIST:this.$api.pharmacyApi.CARDINAL_DRUGS_DEPTS_LIST,
            infoName:'makeupStatusArr',
            method: this.$route.meta.baseMgt?'postJson':'get',
            infos:this.$route.meta.baseMgt?{deptTag:1}:{}
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
            key: 'pDeptName',
            align: 'center'
          },
          {
            title: '基数药部门',
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
                      this.editAdd(params.row.deptCode,params.row.deptName,'jsy')
                    }
                  }
                }, '编辑目录')
              ]);
            }
          }
        ],
        columns2: [
          {
            type: 'index',
            title: '序号',
            align: 'center'
          },
          {
            title: '部门名称',
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
                      this.editAdd(params.row.deptCode,params.row.deptName,'jsy')
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
        if(!this.$route.meta.baseMgt){
          await this.record_search_head(this.searchArr[1]);
          this.makeupTypeArr=this.$store.state[this.searchArr[1].infoName].data;
        }else {
          await this.record_search_head(this.searchArr[1]);
          this.makeupStatusArr=this.$store.state[this.searchArr[1].infoName].data;
        }
        //this.searchArr[0].pDeptCode=this.makeupStatusArr[0].deptCode
      },
      async getList(){
        if(!this.$route.meta.baseMgt){
          if(this.searchArr[0].deptCode){
            this.searchArr[0].deptCodeList[0]=this.searchArr[0].deptCode
          }else {
            this.searchArr[0].deptCodeList=[]
          }

        }
        await this.record_search(this.searchArr[0]);
        this.searchTabs=this.searchTab
        this.searchArr[0].totalPage=this.totalPage;
      },
      //新建
      editAdd(backNo,tit,baseMgt) {
        this.$router.push({path: '/pharmacy/configMgt/salvageList/add', query: {backNo, tit,baseMgt}})
      },
      async getItemValue(val){
        if(this.$route.meta.baseMgt&&val){
          this.searchArr[1].infos.deptTag=2;
          this.searchArr[1].infos.pDeptCode=val
        }
        await this.record_search_head(this.searchArr[1]);
        this.makeupTypeArr=this.$store.state[this.searchArr[1].infoName].data;
      }
    },
    mounted(){

    }

  }
</script>

<style scoped>
  .condition-row{height: auto!important;}
  .flexcont-add{width:20%;justify-content: space-around;}
</style>

