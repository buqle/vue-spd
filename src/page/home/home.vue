<template>
  <div class="layout" >
    <div class="layout-main-header">
        <div class="layout-logo">
          <span class="logo-img">
            <img src="../../assets/image/logo.png">
          </span>
        </div>
        <div class="layout-subject">
          <Dropdown placement="bottom-start" trigger="click" @on-click="changeDept">
            <span class="subject-img header-span">
              <span class="layout-subject-text">{{currentDeptName}}</span>
              <Icon type="md-arrow-dropdown"></Icon>
            </span>
            <Dropdown-menu slot="list">
              <Dropdown-item v-for="(item,index) in deptInfo" ref="dept" :index="index" :name="item.deptId" :key="index" :selected="deptSelected===index?true:false">{{item.deptName}}</Dropdown-item>
            </Dropdown-menu>
          </Dropdown>
        </div>
        <div class="layout-user">
          <Dropdown placement="bottom-end" trigger="click">
            <span class="user-img header-span">
              <img src="../../assets/image/user.png">
              <span>{{curUserName}}</span>
            </span>
            <Dropdown-menu slot="list">
              <Dropdown-item  @click.native="modifyPassWord()">修改密码</Dropdown-item>
              <Dropdown-item  @click.native="logout()" divided>退出</Dropdown-item>
            </Dropdown-menu>
          </Dropdown>
        </div>
    </div>
    <div class="layout-main-content" :class="{'layout-hide-text': spanLeft < 4}">
      <Row type="flex">
        <i-col :class="spanLeft < 4?'collapsed-width':'normal-width'" class="layout-menu-left">
          <Menu ref="side_menu" :mode="modeType" class="layout-menu-left-sider"  width="auto" :active-name="activeName" :open-names="openNames" @on-select="menuSelect" accordion>
            <template v-for="(item,index) in menu" v-if="spanLeft >= 4">
              <Submenu :name="item.id" v-if="item.children">
                <template slot="title">
                  <SvgIcon class="svg-icon" iconSize="18" iconColor="#61697b" prefix="icon-" :iconHref="`${item.icon}`"></SvgIcon>
                  <span class="layout-text" >{{item.name}}</span>
                </template>
                <template v-for="(child,childIndex) in item.children">
                  <Menu-item :name="child.href">{{child.name}}</Menu-item>
                </template>
              </Submenu>
              <template  v-if="!item.children">
                <Menu-item :name="item.href">
                  <Icon :type="item.icon" :size="iconSize"></Icon>
                  <span class="layout-text" >{{item.name}}</span>
                </Menu-item>
              </template>
            </template>
            <template v-for="(item,index) in menu" v-if="spanLeft < 4 && item.children">
              <Dropdown placement="right-start" class="_dropdownList" :transfer="true" @on-click="dropDown">
                <sapn class="drop-menu-a">
                  <SvgIcon class="svg-icon" iconSize="26" iconColor="#61697b" prefix="icon-" :iconHref="`${item.icon}`"></SvgIcon>
                </sapn>
                <DropdownMenu slot="list">
                  <DropdownItem  v-if="!item.name" :name="item.href">{{item.name}}</DropdownItem>
                  <Dropdown placement="right-start" :transfer="true" v-if="item.children">
                    <DropdownItem>
                      {{item.name}}
                      <Icon type="ios-arrow-right"></Icon>
                    </DropdownItem>
                    <DropdownMenu slot="list">
                      <DropdownItem v-for="(child,childIndex) in item.children" :key="childIndex" :name="child.href">{{child.name}}</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </DropdownMenu>
              </Dropdown>
            </template>
          </Menu>
          <div class="layout-menu-left-bottom">
            <span type="text" class="drop-menu-span" @click="toggleClick">
              <Icon type="md-menu" class="_iconCls ivu-col-span-1" size="32" color="#4fa1a4"/>
            </span>
          </div>
        </i-col>
        <i-col class="layout-menu-right">
          <div class="layout-breadcrumb">
            <Breadcrumb>
              <Icon v-if="!isEmptyObject($route.query)&&!$store.state.infoTel||$store.state.backIcon" type="md-return-left" color="#4fa1a4" size="24" class="returnBtn" @click.native="returnBtnClick"/>
              <Icon v-if="$store.state.infoTel" type="md-return-left" color="#4fa1a4" size="24" class="returnBtn" @click.native="RECORD_INFOTEL"/>
              <Breadcrumb-item>{{$route.name}}</Breadcrumb-item>
            </Breadcrumb>
          </div>
          <div class="layout-content">
            <div class="layout-content-main">
              <router-view></router-view>
            </div>
          </div>
        </i-col>
      </Row>
    </div>

    <!-- 修改密码 模态框start -->
    <Modal v-model="modal1" title="修改密码">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem  label="原密码" prop="oldPassWord">
          <Input v-model="formValidate.oldPassWord" placeholder="请输入原始密码"></Input>
        </FormItem >
        <FormItem  label="新密码" prop="newPassWord">
          <Input v-model="formValidate.newPassWord" placeholder="请输入新密码"></Input>
        </FormItem >
        <FormItem  label="确认新密码" prop="newPassWordAgain">
          <Input v-model="formValidate.newPassWordAgain" placeholder="请再次输入新密码"></Input>
        </FormItem >
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="comfirmModifyPS">确定</Button>
      </div>
    </Modal>
    <!-- 修改密码 模态框end -->
  </div>

</template>

<script>
  import { Message } from 'iView';
  import { mapState,mapMutations } from 'vuex';
  import { menuFormat,isEmptyObject } from '@/util/util';
  import SvgIcon from '@/components/Icon';
  export default {
    components:{
      SvgIcon
    },
    data () {
      const validateOldPass = (rule, value, callback) =>{
        if (value === '') {
          callback(new Error('原密码不能为空！'));
        } else {
          callback();
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('新密码不能为空！'));
        } else {
          callback();
        }
      };
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('输入密码不能为空！'));
        } else if (value !== this.formValidate.newPassWord) {
          callback(new Error('输入密码与新密码不匹配!'));
        } else {
          callback();
        }
      };
      return {
        showReturn:false,//显示返回按钮
        modeType: "vertical",
        spanLeft: 4,
        spanRight: 20,
        logoIsDisplay: false,
        modal1: false,
        formValidate:{
          oldPassWord:'',
          newPassWord:'',
          newPassWordAgain:''
        },
        ruleValidate: {
          oldPassWord: [
            { required: true, validator: validateOldPass, trigger: 'blur' }
          ],
          newPassWord: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
          newPassWordAgain: [
            { required: true, validator: validatePassCheck, trigger: 'blur' }
          ]
        },
        logoutInfo:{},
        deptSelected: -1,
        currentDeptName: '',
        currentType:'',
        menuList:[],//菜单集合
        menu:[],//当前菜单集合
        activeName:'',
        openNames:[]
      }
    },
    mounted(){
      this.getSelectedMenuInfo();
    },
    computed: {
      ...mapState({
        selectedMenuId (state) {
          return state.currentSelect
        },
        deptInfo (state) {
          return state.loginInfo.deptInfo
        },
        curUserName (state) {
          return state.loginInfo.name
        }
      }),
      iconSize () {
        return this.spanLeft === 4 ? 18 : 24;
      },
      logoSize(){
        if(this.spanLeft !== 4){
          this.logoIsDisplay = true;
          return 50;
        }else{
          this.logoIsDisplay = false;
          return 0;
        }
      }
    },
    methods: {
      isEmptyObject,
      ...mapMutations(['CLEAR_USERINFO','SET_SELECTED_MENU','SET_SELECTED_NAME','SET_SELECTED_TYPE','SET_OPENNAMES','SET_ACTIVENAME','RECORD_INFOTEL']),
      getSelectedMenuInfo (deptId) {
        if(this.deptInfo.length){
          this.deptInfo.forEach((vv, index) => {
            if (vv.deptId === this.selectedMenuId) {
              this.currentDeptName = vv.deptName;
              this.currentType = vv.deptType;
              this.deptSelected = index;
            }
          });
        }

        if (this.deptSelected === -1) {
          this.deptSelected = 0;
          this.currentDeptName = this.deptInfo[0].deptName;
          this.currentType = this.deptInfo[0].deptType;;
        }
        if(this.currentDeptName){
          this.SET_SELECTED_NAME(this.currentDeptName);
        }
        if(this.currentType){
          this.SET_SELECTED_TYPE(this.currentType);
        }
        //当前菜单部门集合
        let dept = this.deptInfo.filter(item => {
          return item.deptId == this.selectedMenuId
        })
        if(dept && dept[0].menuList && dept[0].menuList.length > 0){
          this.menuList = dept[0].menuList;
        }
        //获取左侧菜单树
        let tree = menuFormat(this.menuList, true, 1) ;
        this.menu = tree[0].children[0].children;
        let a = this.menu[0].children[0].href;
        let b = [this.menu[0].id];
        if(deptId){//点击上方菜单切换部门
          this.activeName = a || '';
          this.openNames = b || [];
          this.SET_OPENNAMES(this.menu[0].id);
          this.SET_ACTIVENAME(a);
        }else{//刷新
          this.activeName = this.$store.state.activeName || a;
          this.openNames = [this.$store.state.openNames] || b;
        }
        this.$nextTick(()=>{
          this.$refs.side_menu.updateOpened();
          this.$refs.side_menu.updateActiveName();
          if(deptId){
            this.$router.push({ path: this.activeName });
          }else{
            if(isEmptyObject(this.$route.query)){//非明细页
              this.$router.push({ path: this.activeName });
            }
          }
        });
      },
      returnBtnClick(){
        this.$router.go(-1);
      },
      toggleClick () {
        if (this.spanLeft === 4) {
          this.spanLeft = 1;
          this.spanRight = 23;
        } else {
          this.spanLeft = 4;
          this.spanRight = 20;
        }
      },
      modifyPassWord() {
        this.modal1 = true;
      },
      async logout(){
        this.logoutInfo = await this.$api.user.userOut()
        this.CLEAR_USERINFO();
        this.$router.push('/login');
      },
      comfirmModifyPS() {
        this.$refs.formValidate.validate((valid) => {
          if (valid) {
            this.updatePassword();
            this.modal1 = false;
            Message.success('提交成功!');
          } else {
            Message.error('表单验证失败!');
          }
        })
      },
      async updatePassword(oldPassWord = this.oldPassWord,newPassWord = this.oldPassWord,newPassWordAgain = this.newPassWordAgain){
        let pwdInfo = await this.$api.user.updatePassword({
          oldPassWord,newPassWord,newPassWordAgain
        });
      },
      cancel(){
        this.modal1 = false;
      },
      menuSelect(name) {
        let parentMenu = this.menuList.filter(item =>{
          return item.href == name;
        });
        if(parentMenu && parentMenu[0] && name){
          this.SET_OPENNAMES(parentMenu[0].parentId);
          this.SET_ACTIVENAME(name);
        }
        this.RECORD_INFOTEL();
        this.$router.push({ path: name });
      },
      dropDown(name) {
        this.$router.push({ path: name });
      },
      changeDept(deptId){
        if(deptId){
          // 缓存当前选中的menu
          this.SET_SELECTED_MENU(deptId);
          this.getSelectedMenuInfo(deptId)
          this.cacheCurrentDept(deptId);
        }
      },
      async cacheCurrentDept(id = deptId){
        let curDeptInfo = await this.$api.user.cacheCurrentDept({
          id
        });
      },



    }
  }
</script>
<style scoped lang="less">
  @import url("./home.less");
</style>
