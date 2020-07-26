/**
 * @author QER
 * @date 2019/9/30
 * @Description:菜单管理-新增页面
*/
<template>
  <div>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
     <Row>
       <Col span="8">
         <FormItem label="上级菜单" prop="parentName">
           <Input v-model="formValidate.parentName" placeholder="请输入上级菜单名称" @click.native="showTree"></Input>
         </FormItem>
       </Col>
     </Row>
      <Row>
        <Col span="8">
          <FormItem label="菜单名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入菜单名称"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="菜单链接" prop="href">
            <Input v-model="formValidate.href" placeholder="请输入菜单链接"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="4">
          <FormItem label="菜单图标">
            <Radius iconHref="icon-tianjiaanniu" iconText="修改图标" iconSize="16" @upButton="addIcon" buttonSize="6" v-if="formValidate.icon"></Radius>
            <Radius iconHref="icon-tianjiaanniu" iconText="添加图标" iconSize="16" @upButton="addIcon" buttonSize="6" v-else></Radius>
          </FormItem>
        </Col>
        <Col span="4" v-if="!modal">
          <svg class="icon icon26" aria-hidden="true">
            <use :xlink:href="`#icon-${formValidate.icon}`" v-if="formValidate.icon"></use>
            <use :xlink:href="`#icon-${iconNow}`" v-else></use>
          </svg>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="排序" prop="sort">
            <Input v-model="formValidate.sort" placeholder="请输入排序"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="部门类型" prop="depType">
            <Select v-model="formValidate.depType" placeholder="请选择部门类型">
              <Option v-for="(item,index) in DeptSelect" :value="item.value" :key="index">{{item.text}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="4">
          <FormItem label="是否可见" prop="isShow">
            <RadioGroup v-model="formValidate.isShow">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
        <Col span="6" style="margin-top: 8px;">
          该菜单是否显示在系统菜单中。
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="权限标识" prop="permission">
            <Input v-model="formValidate.permission" placeholder="请输入权限标识"></Input>
          </FormItem>
        </Col>
        <Col span="6">
          控制器中定义的权限标识，如：@RequiresPermissions("权限标识")
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="备注" prop="remarks">
            <Input v-model="formValidate.remarks" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注信息"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
        </FormItem>
      </Row>
    </Form>


    <Modal v-model="modal" width="400" @on-ok="addIn" @on-cancel="modalReset">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>请选择要添加的菜单图标</span>
      </p>
      <p>
          <span v-for="(item,index) in iconArr" :key="index" class="icon-modal" flexcont @click="addIconName(index,item)" :class="{'add':activeID==index}" pointer>
             <svg class="icon" aria-hidden="true">
                <use :xlink:href="`#icon-${item}`"></use>
            </svg>
          </span>
      </p>
    </Modal>

    <Modal v-model="treeModal" width="400" @on-ok="okSelect" @on-cancel="cancelSelect">
      <p slot="header" style="color:#f60;text-align:center">
       选择上级
      </p>
      <Tree :data="treeData" @on-select-change="selectChange" ref="tree"></Tree>
    </Modal>

  </div>

</template>
<script>
  import Radius from '@/components/Radius';
  import {mapState,mapMutations} from 'vuex';
  export default {
    components: {Radius},
    computed:{
      ...mapState(['iconArr','DeptSelect','currentSelect'])
    },
    data () {
      return {
        formValidate: {
          name:'',
          parentName: '',
          href:'',
          icon:'',
          sort:'',
          depType: '',
          isShow: '',
          permission: '',
          remarks: ''
        },
        modal:false,
        ruleValidate: {
          name: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' }
          ],
          parentName: [
            { required: true, message: '请输入上级菜单名称',}
          ],
          sort: [
            { required: true, message: '请输入排序',}
          ],
          depType: [
            { required: true, message: '请选择部门类型', }
          ]
        },
        activeID:null,
        iconNow:null,
        menuList:[],
        treeModal:false,
        treeData:[],
        treeSelectedKeys:'',
        treeInfo:'',
        spinShow:true
      }
    },
    methods: {
      addIcon(){
        this.modal=true
      },
      addIconName(index,item){
        this.activeID=index;
        this.iconNow=item;
      },
      addIn(){
        this.modal=false;
        this.formValidate.icon=this.iconNow;
      },
      modalReset(){
        this.modal=false;
        console.log(2)
        this.iconNow=null;
        this.formValidate.icon=null;
      },
      //提交
      handleSubmit (name) {
        this.$refs[name].validate((valid,val) => {
          if (valid) {
            if(this.treeInfo.length){
              this.formValidate['parent.id']=this.parentId
            }else {
              this.formValidate['parent.id']=this.$route.query.parentId
            }
            this.hadleSuccess()
          } else {
            this.$Message.error('请输入必填项');
          }
        })
      },
      async hadleSuccess(){
        let menuListSbumit= await this.$api.system.menuListSbumit(this.formValidate);
        if(menuListSbumit.code==200){
          this.$Message.success('提交成功');
          this.$router.go(-1);
        }else {
          this.$Message.error(menuListSbumit.msg);
        }
      },
      //取消
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      //选择上级 part
      showTree(){
        this.treeModal=true
        this.treeData=this.resetTree(this.menuList)
      },
      resetTree (oldTree) {
        let newTree = oldTree.map(item => {
          if (item.children) {
            return {
              ...item,
              title: item.name,
              children: this.resetTree(item.children)
            }
          } else {
            return {
              ...item,
              title: item.name
            }
          }
        })
        return newTree
      },
      selectChange(){
        this.treeInfo=this.$refs.tree.getSelectedNodes();
          console.log(this.treeInfo)

      },
      //ok button
      okSelect(){
        const {id , title} = this.treeInfo[0];
        this.treeModal=false;
        this.parentId=id;
        this.formValidate.parentName=title;
      },
      cancelSelect(){
        this.treeModal=false;
      }
    },
    async created(){
      let menu= await this.$api.system.menuListSearch();
      let newmenuList= await this.$skip.menuFormat( menu.data,true);
      this.menuList=newmenuList;
      if(this.$route.query.id&&this.$route.query.parentId){
        let detail = await this.$api.system.menuListEdit(this.$route.query);
            this.formValidate=detail.data;
            this.spinShow=false
      }else{
        this.formValidate.parentName=this.$route.query.parentName;
        this.spinShow=false
      }

    },
    watch:{
      $route(){

      }
    },
  }

</script>


<style scoped>
  .icon-modal{margin: 8px 14px;display: inline-block;}
  .icon-modal .icon{
    width: 22px;height: 22px;
  }
  svg{fill: #333333;}
  .icon-modal.add .icon{ fill: #f60;}
  .icon.icon26{ width: 20px;height: 20px;margin-top: 4px;margin-left: 10px;}
</style>
