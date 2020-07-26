/**
 * @author QER
 * @date 2019/11/20
 * @Description: 用户管理-新增
*/
<template>
  <div class="container">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Card :bordered="false" class="card-item info-item">
      <p slot="title">用户管理</p>
      <Form ref="formValidate" :model="formValidate"  :label-width="80" :rules="ruleValidate">
        <Row v-if="!$route.query.loginName">
          <Col span="8">
            <FormItem label="用户类型">
              <RadioGroup v-model="formValidate.userType">
                <Radio label="0">已有医院用户</Radio>
                <Radio label="1">无医院用户</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="4" v-if="formValidate.userType==0&&!$route.query.loginName">
            <FormItem label="账号" prop="loginName" >
              <Radius iconHref="icon-tianjiaanniu" iconText="添加账号" iconSize="16" @upButton="addUser" buttonSize="6"></Radius>
            </FormItem>
          </Col>
          <Col span="6" v-else>
            <FormItem label="账号" prop="loginName">
              <Input v-model="formValidate.loginName" placeholder="请输入账号" v-if="!formValidate.loginName&&!$route.query.loginName"></Input>
              <Input v-model="formValidate.loginName" placeholder="请输入账号" v-else disabled></Input>
            </FormItem>
          </Col>
          <Col span="4" style="margin-left: 8px;" v-if="formValidate.loginName&&!$route.query.loginName"><Input v-model="formValidate.loginName" disabled></Input></Col>
          <Col span="6">
            <FormItem label="姓名" prop="name">
              <Input v-model="formValidate.name" placeholder="姓名" disabled v-if="formValidate.userType==0"> </Input>
              <Input v-model="formValidate.name" placeholder="请输入姓名" v-else> </Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="手机号" prop="phone">
              <Input v-model="formValidate.phone" placeholder="请输入手机号"> </Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
            <Button type="primary"  @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
          </FormItem>
        </Row>
      </Form>
    </Card>
    <Card :bordered="false" class="card-item clear" style="padding-bottom: 20px;">
      <p slot="title">所属部门</p>
      <Table :columns="columnsDept" :data="deptList" @on-selection-change="selectionChange"></Table>
      <div class="r mt15">
        <Page :total="searchArr[0].dataCount" :page-size="pageSize" show-total show-elevator @on-change="changepage2"/>
      </div>

    </Card>
    <Card :bordered="false" class="card-item clear" style="padding-bottom: 20px;">
      <p slot="title">分配角色</p>
      <Table :columns="columnsRole" :data="roleList" @on-selection-change="selectionChangeRole" ref="demodata"></Table>
      <div class="r mt15">
        <Page :total="searchArr[1].dataCount" :page-size="pageSize" show-total show-elevator @on-change="changepage3"/>
      </div>
    </Card>
    <Modal v-model="modal" width="600" @on-ok="addIn" height="300">
    <p slot="header" style="color:#f60;text-align:center">
      <Icon type="ios-information-circle"></Icon>
      <span>请选择要添加账号</span>
    </p>
      <Row>
        <Col  span="10">
          <Input v-model="searchUserInfo.ctcpName" placeholder="输入姓名"></Input>
        </Col>
        <Col  span="10">
          <Input v-model="searchUserInfo.hisDeptName" placeholder="输入科室"></Input>
        </Col>
        <Col  span="4">
          <Button size="large" type="default" icon="ios-search" class="r" @click="searhUser" >查询</Button>
        </Col>
      </Row>
      <div class="demo-spin-container mt15">
        <Table :columns="searchUserInfo.data" :data="searchUserInfo.userList" ref="selection" @on-row-click="rowClick"></Table>
        <Spin size="large" fix v-if="spinsShow"></Spin>
        <div class="r mt15" v-if="searchUserInfo.userList.length>0">
          <Page :total="searchUserInfo.search.dataCount" :page-size="searchUserInfo.search.pageSize" show-total  @on-change="changepage"/>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {mapState,mapActions} from 'vuex';
  export default {
    data () {
      return {
        spinShow:true,
        deptList:[],
        deptList2:[],
        roleList:[],
        userInfoList:[],
        searchArr:[
          {
            url:this.$api.systemApi.GET_All_DEPTS,
            method:'get',
            infoName:'deptList',
            dataCount:0
          },
          {
            url:this.$api.systemApi.GET_All_ROLE_LIST,
            method:'get',
            infoName:'roleList',
            dataCount:0
          },
          {
            url:this.$api.systemApi.GET_All_USER_INFO,
            method:'get',
            infoName:'userInfoList',
            loginName:this.$route.query.loginName
          }
        ],
        columnsDept:[
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            type: 'index',
            title: '序号',
            align: 'center'
          },
          {
            key: 'deptType',
            title: '部门类别',
            align: 'center',
            render: (h, params) => {
              return h('div', this.DeptSelect.filter(item => item.value === Number(params.row.deptType))[0].text);
            }
          },
          {
            key: 'deptName',
            title: '部门名称',
            align: 'center'
          }
        ],
        columnsRole:[
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },

          {
            type: 'index',
            title: '序号',
            align: 'center'
          },
          {
            key: 'roleName',
            title: '角色名称',
            align: 'center',
          },
          {
            key: 'remarks',
            title: '备注',
            align: 'center'
          }
        ],
        formValidate: {
          userType:'0',
          loginName:'',
          name:'',
          phone:''
        },
        ruleValidate: {
          loginName: [
            { required: true, message: '请输入账号',}
          ],
          name: [
            { required: true, message: '请输入姓名'}
          ]
        },
        modal:false,
        pageSize:10,
        //查询用户
        searchUserInfo:{
          ctcpName:'',
          hisDeptName:'',
          userList:[],
          data:[
            {
              title: '账号',
              key: 'ctcpCode',
              align: 'center'
            },
            {
              title: '姓名',
              key: 'ctcpName',
              align: 'center'
            },
            {
              title: '所属科室',
              key: 'hisDeptName',
              align: 'center'
            },
          ],
          search:{
            infoName:'userList',
            url:this.$api.systemApi.GET_All_USER_LIST,
            dataCount:0,//总条数
            // 每页显示多少条
            pageSize:5,
          }
        },
        okHanData:{},
        //选中部门
        selectDept:[],
        //选中角色
        selectRole:[]
      }
    },
    computed:{
      ...mapState(['spinsShow','totalPage','DeptSelect'])
    },
    methods:{
      ...mapActions(['record_search_head']),

      //分页

    changepage(index){
      let _start = ( index - 1 ) * this.searchUserInfo.search.pageSize;
      let _end = index * this.searchUserInfo.search.pageSize;
      this.searchUserInfo.userList = this.$store.state.userList.data.slice(_start,_end);
    },

      changepage2(index){
        let _start = ( index - 1 ) * this.pageSize;
        let _end = index * this.pageSize;
        let {listDept}=this.userInfoList;
        this.deptList =!listDept?this.$store.state.deptList.data.slice(_start,_end):listDept.slice(_start,_end);
        this.deptList.forEach((item, index) => {
          if (item.checked ==1) {
            item._checked = true
          }
        });
      },
      changepage3(index){
        let _start = ( index - 1 ) * this.pageSize;
        let _end = index * this.pageSize;
        let {listRole}=this.userInfoList;
        this.roleList =!listRole? this.$store.state.roleList.data.slice(_start,_end):listRole.slice(_start,_end);
        this.roleList.forEach((item, index) => {
          if (item.checked ==1) {
            item._checked = true
          }
        });
      },

    createPage(list,historyData,data){
      if(list.length < this.pageSize){
        historyData=list;
      }else{
        historyData =list.slice(0,this.pageSize);
      }
      this[data] = historyData;
      //data=historyData
      //return data=historyData
      //this.deptList = historyData;
      //console.log(data)
    },

      //添加账号-查询
      addUser(){
        this.modal=true;
        this.searhUser();
      },
      //查询账号
      async searhUser(){
        await this.record_search_head(this.searchUserInfo.search);
       let data=this.$store.state[this.searchUserInfo.search.infoName].data;
        this.searchUserInfo.search.dataCount =data.length;
        if(data.length < this.searchUserInfo.search.pageSize){
          this.searchUserInfo.userList=data;
        }else{
          this.searchUserInfo.userList =data.slice(0,this.searchUserInfo.search.pageSize);
        }
        //this.createPage(data,this.searchUserInfo.userList,this.searchUserInfo.search.dataCount)
        this.$store.state.spinsShow=false;
      },
      rowClick(row,index){
        this.okHanData=row;
      },
      //确认添加
      addIn(){
        const {ctcpCode,ctcpName}=this.okHanData;
        this.formValidate.loginName=ctcpCode;
        this.formValidate.name=ctcpName;
      },
      //select
      selectionChangeRole(selection){
        this.selectRole=selection
      },
      selectionChange(selection){
       this.selectDept=selection;
      },
      //提交
      handleSubmit (name) {
        this.$refs[name].validate((valid,val) => {
          if (valid) {
            if(this.selectRole.length==0){
              this.$Message.error('请选择角色');
              return
            }
            let userInfo = {}, deptList = [],roleList = [];
            this.selectDept.map(item=> deptList.push({ deptType: item.deptType, id: item.id }));
            this.selectRole.map(item=>roleList.push({id:item.id}));
            userInfo.deptList = deptList;
            userInfo.roleList = roleList;
            userInfo.loginName = this.formValidate.loginName;
            userInfo.name = this.formValidate.name;
            userInfo.phone = this.formValidate.phone;
            this.hadleSuccess({userInfo})
          } else {
            this.$Message.error('请输入必填项');
          }
        })
      },
      async hadleSuccess(info){
        let menuListSbumit= await this.$api.system.operUserInfo(info);
        if(menuListSbumit.code==200){
          this.$Message.success(!this.$route.query.loginName?'添加成功':'修改成功');
          this.$router.go(-1);
        }
      },
      //取消
      handleReset (name) {
        this.$refs[name].resetFields();
      },
    },
    async created(){
      this.spinShow=true;
      if(this.$route.query.loginName){
        await  this.record_search_head(this.searchArr[2]);
        this.userInfoList=this.$store.state[this.searchArr[2].infoName].data;
        this.spinShow=false;
        let {loginName,phone,userType,userName,listRole,listDept}=this.userInfoList;
        this.formValidate.loginName=this.userInfoList.loginName;
        this.formValidate.phone=phone;
        this.formValidate.name=userName;
        this.formValidate.userType=userType;

        listRole.forEach((item, index) => {
          if (item.checked ==1) {
            item._checked = true
          }
        });
        //this.roleList=listRole;
        this.searchArr[1].dataCount =listRole.length
        this.createPage(listRole,this.roleList,'roleList')
        this.selectRole=listRole.filter(item => item.checked === 1);
        listDept.forEach((item, index) => {
          if (item.checked ==1) {
            item._checked = true
          }
        });
        //this.deptList=listDept;
        this.searchArr[0].dataCount =listDept.length
        this.createPage(listDept,this.deptList,'deptList')
        this.selectDept=listDept.filter(item => item.checked === 1);
      }else {
        await  this.record_search_head(this.searchArr[0]);
        //this.deptList2=this.$store.state[this.searchArr[0].infoName].data;
        this.searchArr[0].dataCount =this.$store.state[this.searchArr[0].infoName].data.length;
        this.createPage(this.$store.state[this.searchArr[0].infoName].data,this.deptList,'deptList')

        this.spinShow=false;
        await  this.record_search_head(this.searchArr[1]);
        //this.roleList=this.$store.state[this.searchArr[1].infoName].data;
        this.searchArr[1].dataCount =this.$store.state[this.searchArr[1].infoName].data.length;
        this.createPage(this.$store.state[this.searchArr[1].infoName].data,this.roleList,'roleList')
      }
    ;

    }

  }
</script>

<style scoped>
  .ivu-input-wrapper{width: 80%;}
</style>
