<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>供应商</label>
				<Input placeholder="请输入供应商" v-model="page.ctmaSupplierName" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>日期范围</label>
				 <DatePicker type="daterange" v-model="page.date" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getTime"></DatePicker>
			</div>
		</div>
	  <div class="condition-row">
      <Button size="large" type="default" icon="ios-search" class="r" @click="record_search(page)" >查询</Button>
	  </div>
    <Row>
      <Col span="3">
        <Radius iconHref="icon-tianjiaanniu" iconText="新建供应商" iconSize="20"   @upButton="add"></Radius>
      </Col>
    </Row>
		<div class="demo-spin-container  mt15">
		     <Table :columns="columns" :data="searchTab"></Table>
		     <Spin size="large" fix v-if="spinsShow"></Spin>
    </div>
	     <div class="r mt15">
	       	<Page :total="totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="record_search(page)" show-total show-elevator />
	     </div>

    <Modal v-model="modal" width="400" footer-hide @on-cancel="modalReset">
      <p slot="header" style="color:#f60;text-align:center">
        {{tit}}
      </p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <Row>
          <Col span="20">
            <FormItem label="供应商名称" prop="ctmaSupplierName">
              <Input v-model="formValidate.ctmaSupplierName" placeholder="请输入供应商名称"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20" v-if="tit=='新增供应商信息'">
            <FormItem label="供应商code" prop="ctmaSupplierCode">
              <Input v-model="formValidate.ctmaSupplierCode" placeholder="请输入供应商code"></Input>
            </FormItem>
          </Col>
          <Col span="20" v-else>
            <FormItem label="内部编码" prop="ctmaSupplierCode">
              <Input v-model="formValidate.ctmaSupplierCode" disabled></Input>
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


	</div>
</template>
<script>
  import {mapState,mapActions} from 'vuex'
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
	                        title: '供应商名称',
	                        key: 'ctmaSupplierName',
	                        align: 'center'
	                    },
	                    {
	                        title: '内部编码',
	                        key: 'ctmaSupplierCode',
	                        align: 'center'

	                    },
	                    {
	                        title: '创建时间',
	                        key: 'createDate',
	                        align: 'center'

	                    },
	                    {
	                        title: '编辑人',
	                        key: 'updateUserName',
	                        align: 'center'
	                    },
	                    {
	                        title: '编辑时间',
	                        key: 'updateDate',
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
                                // size: 'small'
                              },
                              style: {
                                marginRight: '5px'
                              },
                              on: {
                                click: () => {
                                  this.add(params.row)
                                }
                              }
                            }, '编辑')
                          ]);
                        }
	                    },
	                ],
          page:{
            pageNo:1,
            pageSize:20,
            totalPage:0,
            url:this.$api.systemApi.SUPPLIER_LIST,
            startTime:'',
            endTime:'',
            ctmaSupplierName:'',
            date:'',
         },
          formValidate:{
            ctmaSupplierName:'',
            ctmaSupplierCode:''
          },
          ruleValidate:{
            ctmaSupplierName: [
              { required: true, message: '请输入供应商名称',trigger: 'blur' }
            ],
            ctmaSupplierCode: [
              { required: true, message: '请输入供应商code',trigger: 'blur' }
            ],
          },
          modal:false,
          tit:'新增供应商信息'
	      }
	},
  computed:{
    ...mapState(['spinsShow','searchTab','totalPage'])
  },
	methods:{
    ...mapActions(['record_search']),
    getTime(date){
      this.page.startTime=date[0];
      this.page.endTime=date[1];
    },
    add(record){
      this.modal=true;
      if(record){
        this.tit='编辑供应商信息';
        this.formValidate.ctmaSupplierName=record.ctmaSupplierName;
        this.formValidate.ctmaSupplierCode=record.ctmaSupplierCode;
        this.formValidate.id=record.id;
      }
    },
    handleSubmit(name){
      this.$refs[name].validate((valid,val) => {
        if (valid) {
          this.hadleSuccess()
        } else {
          this.$Message.error('请输入必填项');
        }
      })
    },
    async hadleSuccess(){
      let menuListSbumit= await this.$api.system.supplierSave(this.formValidate);
      if(menuListSbumit.code==200){
        this.$Message.success('提交成功');
        this.modal=false;
        this.record_search(this.page);
        this.modalReset()
      }else {
        this.$Message.error(menuListSbumit.msg);
      }
    },
    //取消
    handleReset (name) {
      this.$refs[name].resetFields();
      this.modalReset()
    },
    modalReset(){
      this.modal=false;
      this.tit='新增供应商信息';
      this.formValidate={}
    }
	},
	created(){
    this.record_search(this.page);
	}

}
</script>

