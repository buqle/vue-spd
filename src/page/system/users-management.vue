/**
* @author QER
* @date 2019/9/30
* @Description: 用户管理
*/
<template>
  <div class="condition">
    <div class="condition-row">
      <div class="condition-group">
        <label>账号</label>
        <Input  placeholder="请输入"  class="condition-group-ipt" v-model="searchArr[0].loginName"></Input>
      </div>
      <div class="condition-group">
        <label>姓名</label>
        <Input  placeholder="请输入"  class="condition-group-ipt" v-model="searchArr[0].name"></Input>
      </div>
      <div class="condition-group">
        <label>所属科室</label>
        <Select  placeholder="请选择所属科室" class="condition-group-ipt" v-model="searchArr[0].hisDeptIds">
          <Option  v-for="(item,index) in departList" :value="item.ctdCode" :key="index">{{item.ctdName}}</Option>
        </Select>
      </div>
      <div class="condition-group mt15">
        <label>部门</label>
        <Select  placeholder="请选择所属部门" class="condition-group-ipt" v-model="searchArr[0].deptIds">
          <Option  v-for="(item,index) in allDepartList" :value="item.id" :key="index">{{item.deptName}}</Option>
        </Select>
      </div>
    </div>
    <div class="condition-row mb15">
      <Button size="large" type="default" icon="ios-search" class="r" @click="record_search({item:searchArr[0]})">查询</Button>
    </div>
    <Row>
      <Col span="2-5">
        <Radius iconHref="icon-tianjiaanniu" iconText="新增用户" iconSize="20" @upButton="add"></Radius>
      </Col>
    </Row>
    <div class="demo-spin-container">
      <Table :columns="columns" :data="searchTab"></Table>
      <Spin size="large" fix v-if="spinsShow"></Spin>
    </div>
    <div class="r mt15">
      <Page :total="totalPage" :page-size="searchArr[0].pageSize" :current.sync="searchArr[0].pageNo" show-total show-elevator @on-change="record_search(searchArr[0])"/>
    </div>
    <Modal v-model="modal" width="400" @on-ok="yesReset">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>重置密码</span>
      </p>
      <p>
        是否重置密码
      </p>
    </Modal>
  </div>
</template>
<script>
  import {mapState,mapActions} from 'vuex';

  export default {
    data () {
      return {
        columns: [
          {
            type: 'index',
            title: '序号',
            align: 'center'
          },
          {
            title: '账号',
            key: 'loginName',
            align: 'center'
          },
          {
            title: '姓名',
            key: 'userName',
            align: 'center'

          },
          {
            title: '部门性质',
            key: 'deptType',
            align: 'center',
            width:120,
            render: (h, params) => {
              return h('p',{class:'btn__cells'}, params.row.deptType);
            }
          },
          {
            title: '科室名称',
            key: 'hisCtDeptNme',
            align: 'center',
            width:120,
            render: (h, params) => {
              return h('p',{class:'btn__cells'}, params.row.hisCtDeptNme);
            }
          },
          {
            title: '部门名称',
            key: 'deptName',
            align: 'center',
            width:120,
            render: (h, params) => {
              return h('p',{class:'btn__cells'}, params.row.deptName);
            }
          },
          {
            title: '状态',
            key: 'isStart',
            align: 'center',
            render: (h, params) => {
              if (params.row.isStart==0) {
                return h('span', '启用');
              }else {
                return h('span', '停用');
              }
            }
          },
          {
            title: '编辑人',
            key: 'updateUserName',
            align: 'center'
          },
          {
            title: '编辑时间',
            key: 'updateDate',
            align: 'center',

          },
          {
            title: '操作',
            key: 'address',
            align: 'center',
            width:'170',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '2px',
                  },
                  on: {
                    click: () => {
                      this.resetPass(params.row.id)
                    }
                  }
                }, '重置密码'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.edit({
                        loginName:params.row.loginName
                      })
                    }
                  }
                }, '编辑')
              ]);
            }
          },
        ],
        searchArr:[{
          pageNo:1,
          pageSize:10,
          totalPage:0,
          url:this.$api.systemApi.USER_FINDUSERLIST,
          loginName:'',
          name:'',
          hisDeptIds:'',
          deptIds:''
        },{
          url:this.$api.systemApi.USER_GET_ALL_DEPTBYCONDITION,
          infoName:'departList',
        },{
          url:this.$api.systemApi.USER_GET_ALL_DEPTS,
          infoName:'allDepartList',
          method:'get'
        }
        ],
        departList:[],
        allDepartList:[],
        modal:false,
        pswId:''
      }
    },
    computed:{
      ...mapState(['searchInfo','spinsShow','searchTab','totalPage','DeptSelect'])
    },
    methods:{
      ...mapActions(['record_search','record_search_head']),
      add(){
        this.$skip.goAdd(this.$router, '/sys/organization/userMgt/add')
      },
      resetPass(id){
        this.modal=true;
        this.pswId=id;
      },
      async yesReset(){
        let menuListSbumit= await this.$api.system.updatePassWord(this.pswId);
        if(menuListSbumit.code==200){
          this.$Message.success('密码修改成功');
          this.modal=false;
          this.record_search(this.searchArr[0]);
        }
      },
      edit(query){
        this.$skip.goEdit(
          this.$router,'/sys/organization/userMgt/add',
          query
        )
      }
    },
    async created(){
      this.record_search(this.searchArr[0]);
      await  this.record_search_head(this.searchArr[1]);
      this.departList=this.$store.state[this.searchArr[1].infoName].data;
      await  this.record_search_head(this.searchArr[2]);
      this.allDepartList=this.$store.state[this.searchArr[2].infoName].data;
    }

  }
</script>

<style scoped>

</style>
