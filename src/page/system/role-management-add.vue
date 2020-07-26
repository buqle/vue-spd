/**
 * @author QER
 * @date 2019/11/26
 * @Description: 角色管理-新增
*/
<template>
  <div class="container">
    <Form ref="formValidate" :model="formValidate"  :label-width="80" :rules="ruleValidate">
    <Card :bordered="false" class="card-item info-item">
      <p slot="title">角色管理</p>

        <Row>
          <Col span="6">
            <FormItem label="角色名称" prop="name" >
              <Input v-model="formValidate.name" v-if="$route.query.id" disabled></Input>
              <Input v-model="formValidate.name"  placeholder="请输入角色名称" v-else></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="备注" prop="remarks" >
              <Input v-model="formValidate.remarks" placeholder="请输入备注"></Input>
            </FormItem>
          </Col>
        </Row>

    </Card>
    <Card :bordered="false" class="card-item">
      <p slot="title">角色权限</p>
      <Row>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <Tree :data="treeData" show-checkbox  ref="tree" @on-check-change="checkTree" :check-strictly="checkFlag" @on-toggle-expand="checkFlag=false" multiple></Tree>
      </Row>
      <Row v-if="treeData.length>0">
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
          <Button @click="$router.go(-1)" style="margin-left: 8px">取消</Button>
        </FormItem>
      </Row>
    </Card>
    </Form>
  </div>
</template>
<script>
  import {filter,intersectionBy,differenceBy,concat,uniq} from 'lodash'
  import {mapState,mapActions} from 'vuex';
  export default {
    data () {
      return {
        spinShow:false,
        formValidate: {
          name:'',
          remarks:'',
          id:''
        },
        ruleValidate: {
          name: [
            { required: true, message: '请输入角色名称'}
          ]
        },
        menuList:[],
        treeData:[],
        treeInfo:{},
        checkFlag:true,
        search:{
          url:this.$api.systemApi.GET_MANAGEMENT_ROLE_EDIT_LIST,
          method:'get',
          infoName:'roleEditInfo',
          id:this.$route.query.id
        },
        checkedKeys:[],
        newCheck:[]
      }
    },
    methods:{
      ...mapActions(['record_search_head']),
      //添加账号-查询
      addUser(){
        this.modal=true;
        this.searhUser();
      },
      //查询账号
      async searhUser(){
        await this.record_search_head(this.searchUserInfo.search);
        this.searchUserInfo.userList=this.$store.state[this.searchUserInfo.search.infoName].data;
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
            this.hadleSuccess(this.newCheck)
          } else {
            this.$Message.error('请输入必填项');
          }
        })
      },
      async hadleSuccess(info){
        let menuIds='';
        if(this.newCheck.length>0){
          menuIds= uniq(this.newCheck,this.treeInfo)
        }else {
          menuIds=this.treeInfo
        }

        let menuListSbumit= await this.$api.system.roleManagSave({
          //meuIds:JSON.stringify(meuIds),
          menuIds,
          id:this.formValidate.id,
          name:this.formValidate.name,
          remarks:this.formValidate.remarks
        });
        if(menuListSbumit.code==200){
          this.$Message.success(!this.$route.query.id?'添加成功':'修改成功');
          this.$router.go(-1);
        }
      },
      //取消
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      resetTree (oldTree) {
        let newTree = oldTree.map(item => {
          if (item.children) {
            //console.log(item.children.check)
            return {
              ...item,
              //checked:item.checked2&&item.chname?true:false,
              title: `${item.name}`,
              children: this.resetTree(
                item.children
              )
            }
          } else {
            return {
              ...item,
              title: `${item.name}       ${item.href}`
            }
          }
        })
        return newTree;
      },
      //选中树形
      checkTree(arr,item){
        this.newCheck=this.$refs.tree.getCheckedNodes().map(item=>item.id)
      }
    },
    async created(){
      this.spinShow=true;
      let menu= await this.$api.system.roleMenuList();
      this.spinShow=false;
      if(this.$route.query.id){
        await  this.record_search_head(this.search);
        this.formValidate=this.$store.state[this.search.infoName].data;
        let checkedKeys = this.formValidate.menuIds.split(',').filter(item => item !== '1');
        this.treeInfo=checkedKeys;
        this.checkedKeys=checkedKeys.map(item=>{
          return{
            id:item
          }
        });
        let newArr=intersectionBy(menu.data,this.checkedKeys, 'id').map(item=>{
          return{
            ...item,
            checked:true,

          }
        });
        let newArr2=differenceBy(menu.data,this.checkedKeys, 'id').map(item=>{
          return{
            ...item,
            checked:false
          }
        });
        let newArr3=concat(newArr,newArr2)
        //console.log(newArr)
        let newmenuList= await this.$skip.menuFormat( newArr3,true);
        //this.treeData=this.resetTree(newmenuList);
        this.treeData=this.resetTree(newmenuList);
        //console.log(this.treeData)
      }else {
        let newmenuList= await this.$skip.menuFormat( menu.data,true);
        this.treeData=this.resetTree(newmenuList);
      }
    }

  }
</script>
