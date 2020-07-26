/**
* @author QER
* @date 2019/9/30
* @Description: 部门管理
*/
<template>
  <div class="condition">
    <div class="condition-row">
      <div class="condition-group">
        <label>部门名称</label>
        <Input  placeholder="请输入"  class="condition-group-ipt" v-model="searchArr[0].deptName"></Input>
      </div>
      <div class="condition-group">
        <label>科室名称</label>
        <Input  placeholder="请输入"  class="condition-group-ipt" v-model="searchArr[0].hisCtDeptName"></Input>
      </div>
      <div class="condition-group">
        <label>部门类型</label>
        <Select  placeholder="请选择类型" class="condition-group-ipt" v-model="searchArr[0].deptType">
          <Option  v-for="(item,index) in DeptSelect" :value="item.value" :key="index">{{item.text}}</Option>
        </Select>
      </div>
    </div>
    <div class="condition-row">
      <Button size="large" type="default" icon="ios-search" class="r" @click="record_search(searchArr[0])">查询</Button>
    </div>
    <Row>
      <Col span="2-5">
        <Radius iconHref="icon-tianjiaanniu" iconText="新建部门" iconSize="20"  @upButton="add"></Radius>
      </Col>
    </Row>
    <div class="demo-spin-container">
      <Table :columns="columns" :data="searchTab" ref="selection"></Table>
      <Spin size="large" fix v-if="spinsShow"></Spin>
    </div>
    <div class="r mt15">
      <Page :total="totalPage" :page-size="searchArr[0].pageSize" :current.sync="searchArr[0].pageNo" show-total show-elevator @on-change="record_search(searchArr[0])"/>
    </div>
    <!--新建部门-->
    <Modal v-model="modal" width="400" footer-hide @on-cancel="modalReset">
      <p slot="header" style="color:#f60;text-align:center">
        新建部门信息
      </p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Row>
          <Col span="20">
            <FormItem label="部门性质" prop="deptType">
              <Select  placeholder="请选择类型" class="condition-group-ipt" v-model="formValidate.deptType" clearable @on-change="changeDept">
                <Option  v-for="(item,index) in DeptSelect" :value="item.value" :key="index">{{item.text}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="formValidate.deptType!=1&&formValidate.deptType!=2&&formValidate.deptType!=6">
          <Col span="14">
            <FormItem label="科室名称" prop="openDeptName">
              <Radius iconHref="icon-tianjiaanniu" iconText="选择科室" iconSize="16" @upButton="addDeptName('dept')" buttonSize="6"></Radius>
              <Input v-model="formValidate.openDeptName" placeholder="请选择科室名称" disabled v-if="formValidate.openDeptName"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="formValidate.deptType==6">
          <Col span="20">
            <FormItem label="编码" prop="rescuecarCode">
              <Input v-model="formValidate.rescuecarCode" placeholder="请输入编码"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="formValidate.deptType!=1&&formValidate.deptType!=2">
          <Col span="20">
            <FormItem label="部门名称" prop="deptName">
              <Input v-model="formValidate.deptName" placeholder="请输入部门名称"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="formValidate.deptType==3||formValidate.deptType==4||formValidate.deptType==5">
          <Col span="20">
            <FormItem label="货位设置" prop="storeType">
              <CheckboxGroup v-model="formValidate.storeType">
                <Checkbox :label="item.value" v-for="(item,index) in storeList" :key="index">{{item.label}}</Checkbox>
              </CheckboxGroup>
              <Spin v-if="spinShow">加载中...</Spin>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="formValidate.deptType==5||formValidate.deptType==6">
          <Col span="20">
            <FormItem label="货位" prop="description">
              <Radius iconHref="icon-tianjiaanniu" iconText="选择货位" iconSize="16" @upButton="addDeptName('store')" buttonSize="6"></Radius>
              <Input v-model="formValidate.positionName" disabled v-if="formValidate.positionName"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="formValidate.deptLocation!=6">
          <Col span="20">
            <FormItem label="地址" prop="description">
              <Input v-model="formValidate.description" placeholder="请输入地址"></Input>
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
    </Modal>
    <!--新建部门-->

    <!--选择科室-->
    <Modal v-model="deptNameInfo.modal" width="500"  @on-cancel="modalReset2('deptNameInfo.modal')" height="340" @on-ok="okSetData">
      <p slot="header" style="color:#f60;text-align:center" v-if="showType=='dept'">
        选择科室
      </p>
      <p slot="header" style="color:#f60;text-align:center" v-else>
        选择货位
      </p>
      <Row>
        <Col  span="12">
          <Input v-model="deptNameInfo.search.ctdDesc" placeholder="输入科室名称"  v-if="showType=='dept'"></Input>
          <Input v-model="deptNameInfo.search.ctdDesc" placeholder="输入货位名称"  v-else></Input>
        </Col>
        <Col  span="6">
          <Button size="large" type="default" icon="ios-search" class="r" @click="changeDeptList" >查询</Button>
        </Col>
      </Row>
      <div class="demo-spin-container">
        <Table :columns="deptNameInfo.data" :data="deptNameInfo.deptList" ref="selection" @on-row-click="rowClick" v-if="showType=='dept'"></Table>
        <Table :columns="storeInfo.data" :data="storeInfo.storeTypeList" ref="selection" @on-row-click="rowClick" v-else></Table>
        <Spin size="large" fix v-if="spinsShow"></Spin>
        <div class="r mt15">
          <Page :total="totalPage" :page-size="deptNameInfo.search.pageSize" :current.sync="deptNameInfo.search.pageNo" show-total show-elevator @on-change="changeDeptList"/>
        </div>
      </div>
    </Modal>
    <!--选择科室-->
  </div>
</template>
<script>
  import {mapState,mapActions} from 'vuex';
  import {DeptFormat} from '@/util/find'
  export default {
    data () {
      return {
        columns: [
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
            title: '部门性质',
            key: 'deptType',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('span', DeptFormat[params.row.deptType]),
              ]);
            }
          },
          {
            title: '科室名称',
            key: 'hisDeptName',
            align: 'center'

          },
          {
            title: '部门名称',
            key: 'deptName',
            align: 'center'

          },
          {
            title: '地址',
            key: 'deptLocation',
            align: 'center'
          },
          {
            title: '编辑时间',
            key: 'updateDate',
            align: 'center',
            width:150,
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
                      this.edit({
                        id:params.row.id,
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
          url:this.$api.systemApi.GETDEPT_LIST,
          deptName:'',
          hisCtDeptName:'',
          deptType:''
        },{
          url:this.$api.systemApi.GETDEPT_TYPELIST,
          type:'location_type',
          infoName:'storeList',
          spin:'keep'
        }
        ],
        storeList:[],
        formValidate: {
          deptType:'',
          openDeptName: '',
          rescuecarCode:'',
          deptName:'',
          storeType:[],
          positionName: '',
          deptLocation:'',
          openDeptCode:'',
          parentId:'',
          baseDeptCode:''
        },
        ruleValidate: {
          deptType: [
            { required: true, message: '请选择部门性质',}
          ],
          openDeptName: [
            { required: true, message: '请选择科室名称'}
          ],
          rescuecarCode: [
            { required: true, message: '请输入编码'}
          ],
          deptName: [
            { required: true, message: '请输入部门名称'}
          ],
          storeType: [
            { required: true, message: '请选择货位设置'}
          ],
          positionName: [
            { required: true, message: '请设置货位'}
          ]
        },
        modal:false,
        spinShow:false,
        //科室info
        deptNameInfo:{
          modal:false,
          deptList:[],
          search:{
            pageNo:1,
            pageSize:10,
            totalPage:0,
            url:this.$api.systemApi.FINDHISDEPT_LIST,
            ctdCategory:'',
            ctdDesc:'',
            spin:'keep',
            infoName:'deptList',
          },
          data:[
            {
            type: 'index',
            title: '序号',
            align: 'center'
          },
            {
              title: '科室名称',
              key: 'ctdDesc',
              align: 'center'
            },
            {
              title: '编码',
              key: 'ctdCode',
              align: 'center'
            },
          ],
        },
        okHanData:{},
        //货位
        storeInfo:{
          search:{
            url:this.$api.systemApi.GETSTORE_LIST,
            type:'location_type',
            infoName:'storeTypeList',
          },
          storeTypeList:[],
          data:[
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
              title: '货位名称',
              key: 'positionName',
              align: 'center'
            },
          ]
        },
        showType:''
      }
    },
    computed:{
      ...mapState(['searchInfo','spinsShow','searchTab','totalPage','DeptSelect'])
    },
    methods:{
      ...mapActions(['record_search','record_search_head']),
      add(){
        this.modal=true
      },
      //提交
      handleSubmit (name) {
        this.$refs[name].validate((valid,val) => {
          if (valid) {
            let {openDeptCode,deptType,parentId,baseDeptCode}=this.formValidate;
            openDeptCode=this.okHanData.openDeptCode;
            if(deptType==5||deptType==6){
              parentId=this.okHanData.deptCode;
              baseDeptCode=this.okHanData.id;
            }
            this.hadleSuccess()
          } else {
            console.log(this.formValidate.storeType)
            this.$Message.error('请输入必填项');
          }
        })
      },
      async hadleSuccess(){
        let menuListSbumit= await this.$api.system.saveOrUpdateDept(this.formValidate);
        if(menuListSbumit.code==200){
          this.$Message.success('添加部门成功');
          this.modal=false;
          this.record_search(this.searchArr[0]);
          this.modalReset()
        }else {
          this.$Message.error(menuListSbumit.msg);
        }
      },
      //切换部门
      async changeDept(v){
        if(v==4){
         await this.changeDeptApi()
          this.storeList=this.storeList.filter((item, i) => i !== 5);
        }
        if(v==5){
          await  this.changeDeptApi()
          this.storeList=this.storeList.filter((item, i) => i === 5);
        }
        if(v==3){
          await  this.changeDeptApi()
          this.storeList=this.storeList.filter((item, i) => i === 0);
        }

        this.formValidate.openDeptName='';
        this.formValidate.rescuecarCode='';
        this.formValidate.deptName='';
        this.formValidate.storeType=[];
        this.formValidate.positionName='';
      },
      async changeDeptApi(){
        this.storeList=[];
        this.spinShow=true;
        await  this.record_search_head(this.searchArr[1]);
        let data=this.$store.state[this.searchArr[1].infoName].data;
        data= data.filter(item => item.value !== "");
        this.storeList=data;
        this.spinShow=false;
      },
      //取消
      handleReset (name) {
        this.$refs[name].resetFields();
        this.modalReset()
      },
      modalReset(){
        this.modal=false;
        this.formValidate={}
      },
      //选择科室
     async addDeptName(type){
        this.showType=type;
        if(!this.formValidate.deptType&&type=='dept'){
          this.$Message.info('请选择部门性质');
          return false;
        }
        this.deptNameInfo.modal=true;
        if(type=='dept'){
          this.deptNameInfo.search.ctdCategory=this.formValidate.deptType;
          this.changeDeptList();
        }
        if(type=='store'){
          this.storeInfo.search.deptType=this.formValidate.deptType;
          await this.record_search(this.storeInfo.search);

          this.storeInfo.storeTypeList=this.$store.state[this.storeInfo.search.infoName].data.list;
        }

      },
      async changeDeptList(){
        await this.record_search_head(this.deptNameInfo.search);
        this.deptNameInfo.deptList=this.$store.state[this.deptNameInfo.search.infoName].data;
      },
      //设置点击科室
      rowClick(row,index){
        this.okHanData=row;
        //console.log(row)
      },
      okSetData(){
        if(this.showType=='dept'){
          this.formValidate.openDeptName=this.okHanData.ctdDesc;
        }else if(this.showType=='store'){
          this.formValidate.positionName=this.okHanData.positionName;
        }

        this.modalReset2('deptNameInfo.modal')
      },
      //关闭弹窗
      modalReset2(modals){
        this.modals=false;
      },
      //跳往编辑页
      edit(query){
        this.$skip.goEdit(
          this.$router,'/sys/organization/departmentMgt/edit',
          query
        )
      }
    },
    async created(){
      this.record_search(this.searchArr[0]);
    }

  }
</script>

<style scoped>

</style>
