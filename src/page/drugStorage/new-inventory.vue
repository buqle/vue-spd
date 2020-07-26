<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>单号</label>
				<Input placeholder="请输入单号" v-model="page.checkBillNo" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>状态</label>
				<Select v-model="page.filterStatus" clearable class="big condition-group-ipt">
				        	<Option v-for="(sta,index) in stateList" :value="sta.value" :key="index">{{ sta.label }}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>盘点时间</label>
				 <DatePicker type="daterange" v-model="launchDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-clear="clearLaunchDate"></DatePicker>
			</div>
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>类型</label>
				<Select v-model="page.checkBillType" clearable class="big condition-group-ipt">
			        <Option v-for="(type,index) in typeList" :value="type.value" :key="index">{{ type.label}}</Option>
			    </Select>
			</div>
		</div>
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" @click="add()">新建盘点</Button>
	             	<Button type="default" size="large" class="l ml10" @click="delSheveListClick()">删除</Button>
	             	<Button type="default" size="large" class="l ml10" @click="exportAsPrint()">导出</Button>
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="checkbillListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList" @on-selection-change="handleSelectionChange"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="checkbillListClick(false)" show-total show-elevator />
	             </div>
	             <Modal v-model="modal" width="600" footer-hide @on-cancel="modalReset">
	             <Spin size="large" fix v-if="spinShow"></Spin>
		      <p slot="header" style="color:#4fa1a4; text-align:center; font-size: 14px;">上传企业资质</p>
		      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
		      <div>
		        <Row>
		          <Col span="20">
		          		<FormItem label="类型：" prop="checkBillType">
			            		<RadioGroup v-model="formValidate.checkBillType">
						<Radio v-for="(type,index) in typeList" v-if="index != 0" :label='type.value' :key='index'>{{ type.label}}</Radio>
					</RadioGroup>
				</FormItem>
		          </Col>
		        </Row>
		      <Row>
		          <Col span="20">
		          		<FormItem label="子类型：" prop="checkBillSubType">
			            		<RadioGroup v-model="formValidate.checkBillSubType">
						<Radio v-for="(type,index) in subTypeList" v-if="index != 0" :label='type.value' :key='index'>{{ type.label}}</Radio>
					</RadioGroup>
				</FormItem>
		          </Col>
		        </Row>
		        <Row>
		          <Col span="20">
		          		<FormItem label="药品特征：" prop="drugFeatureCode">
			            		<RadioGroup v-model="formValidate.drugFeatureCode">
						<Radio v-for="(type,index) in drugCharacteristicsList" :label='type.value' :key='index'>{{ type.label}}</Radio>
					</RadioGroup>
				</FormItem>
		          </Col>
		        </Row>
		        <Row>
		          <Col span="20">
		          		<FormItem label="采购类型：" prop="purchaseType">
			            		<RadioGroup v-model="formValidate.purchaseType">
						<Radio label="1">
							<span>零库存</span>
						</Radio>
						<Radio label="2">
							<span>自采</span>
						</Radio>
					</RadioGroup>
				</FormItem>
		          </Col>
		        </Row>
		        <Row>
		          <Col span="20">
		          		<FormItem label="盘点范围：" prop="isLocCheck">
			            		<RadioGroup v-model="formValidate.isLocCheck">
						<Radio label="0">
							<span>全部</span>
						</Radio>
						<Radio label="1">
							<span>自定义</span>
						</Radio>
					</RadioGroup>
				</FormItem>
		          </Col>
		        </Row>
		        <Row v-if="formValidate.checkBillSubType == 3">
		          <Col span="20">
		          		<FormItem label="起始时间：" prop="checkStartTime">
			            		<DatePicker type="datetime" v-model="formValidate.checkStartTime" format="yyyy-MM-dd HH:mm"></DatePicker>
				</FormItem>
		          </Col>
		        </Row>
		        <Row v-if="formValidate.isLocCheck == 1">
		          <Col span="20">
		          		<FormItem label="起始货位：" prop="startLocSort">
			            		 <Select
				                v-model="formValidate.startLocSort"
				                filterable
				                clearable
				                remote
				                placeholder="请选择起始货位"
				                :remote-method="queryDrugByListClick"
				                :loading="loading" @on-change="deptLocationClick()">
				                <Option v-for="(dep, index) in deptLocationList" :value="dep.deptCode" :key="index">{{dep.positionName}}</Option>
				            </Select>
				</FormItem>
		          </Col>
		        </Row>
		        <Row v-if="formValidate.isLocCheck == 1">
		          <Col span="20">
		          		<FormItem label="截止货位：" prop="endLocSort">
			            		 <Select
				                v-model="formValidate.endLocSort"
				                filterable
				                clearable
				                remote
				                placeholder="请选择截止货位"
				                :remote-method="queryDrugByListClick"
				                :loading="loading" @on-change="deptLocationClick()"><!--  @on-change="deptLocationClick(positionName)" -->
				                <Option v-for="(dep, index) in deptLocationList" :value="dep.deptCode" :key="index">{{dep.positionName}}</Option>
				            </Select>
				</FormItem>
		          </Col>
		        </Row>
		        <Row>
		          <Col span="20">
		          		<FormItem label="备注：">
			            		 <Input placeholder="请输入备注" v-model="formValidate.remarks" class="condition-group-ipt"></Input>
				</FormItem>
		          </Col>
		        </Row>
		        <Row>
		          <FormItem>
		            <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
		            <Button @click="modalReset()" style="margin-left: 8px">取消</Button>
		          </FormItem>
		        </Row>
		        </div>
		      </Form>
		    </Modal>
	</div>
</template>
<script>
export default {
	data () {
	            return { 
	            	spinShow:true,
	             columns: [
	             	{
	                        type: 'selection',
	                        align: 'center',
	                        width:'100'
	                    },
	                    {
	                        type: 'index',
	                        title: '序号',
	                        align: 'center'
	                    },
	                    {
	                        title: '盘点单',
	                        // key: 'ctmaSupplierName',
	                        align: 'left',
	                        render: (h, params) => {
	                            return h('div', [
	                                h('div', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {color:'blue',cursor:'pointer',float:'left',},
	                                    on: {
	                                        click: () => {
	                                            // this.show(params.row.guid)
	                                            // this.$router.replace('/warehousingAcceptanceDetail/'+params.row.ctmaSupplierName) 
	                                            this.$router.push({path: "/drugStorage/checkDecrease/newInventory/details", query:{id:params.row.checkBillNo}})
	                                        }
	                                    }
	                                },params.row.checkBillNo), 
	                                h('p', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {float:'left',color:'#ffffff',padding:'0 5px',backgroundColor: 'red',position:'absolute',marginLeft:'7%',borderRadius:'20px'},
	                                },params.row.commonCheckBillDetailListCount),
	                            ]);
	                        }
	                    },
	                    {
	                        title: '状态',
	                        key: 'checkStatusName',
	                        align: 'center'
	                    },
	                    {
	                        title: '盘点类型',
	                        key: 'checkBillTypeName',
	                        align: 'center'
	                    },
	                    {
	                        title: '盘点子类型',
	                        key: 'checkBillSubTypeName',
	                        align: 'center'
	                    },
	                    {
	                        title: '药品特征',
	                        key: 'drugFeatureCodeName',
	                        align: 'center'
	                    },
	                    {
	                        title: '部门',
	                        key: 'checkBillDeptName',
	                        align: 'center'
	                    },
	                    {
	                        title: '盘点责任人',
	                        key: 'createUserName',
	                        align: 'center'
	                    },
	                    {
	                        title: '制单时间',
	                        key: 'createDate',
	                        align: 'center'
	                    },
	                    {
	                        title: '盘点时间',
	                        key: 'checkTime',
	                        align: 'center'
	                    },
	                    {
	                        title: '备注',
	                        key: 'remarks',
	                        align: 'center'
	                    }
	                ],
	                ids:[],
	                launchDate:[],
	                typeList:[],
	                stateList:[],
	                druhList:[],
	                drugCharacteristicsList:[],
	                subTypeList:[],
	                deptLocationList:[],
	                positionName:'',
	                loading:false,
	                modal:false,
	                sh:false,
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    checkBillNo:'',
			    filterStatus:'',
			    checkBillType:'',
			    checkStartTime:'',
			    checkEndTime:'',
			    sheveType:1
		    },
		    formValidate:{
		    	checkBillType:'',
		    	checkBillSubType:'',
		    	drugFeatureCode:'',
		    	purchaseType:'1',
		    	isLocCheck:'',
		    	remarks:'',
		    	startLocSort:'',
		    	endLocSort:'',
		    	checkStartTime:''
		    },
		    ruleValidate:{
		            checkBillType: [
		              { required: true, message: '类型'}
		            ],
		            checkBillSubType: [
		              { required: true, message: '子类型'}
		            ],
		            // drugFeatureCode: [
		            //   { required: true, message: '请选择药品特征',}
		            // ],
		            // purchaseType: [
		            //   { required: true, message: '请选择采购类型',}
		            // ],
		            isLocCheck: [
		              { required: true, message: '请选择盘点范围'}
		            ],
		            checkStartTime:[
		              { required: true, message: '请选择起始时间'}
		            ],
		            startLocSort: [
		              { required: true, message: '请选择起始货位',trigger: "blur"}
		            ],
		            endLocSort: [
		              { required: true, message: '请选择截止货位',trigger: "blur"}
		            ],
		  },
	            }
	},
	watch:{
		'formValidate.checkBillSubType': {
			deep: true,
			handler: function (newVal,oldVal){
				if(newVal == 3){
					const myDate = new Date();
					const year = myDate.getFullYear(); // 获取当前年份
					const month = myDate.getMonth() + 1; // 获取当前月份(0-11,0代表1月所以要加1);
					const day = myDate.getDate(); // 获取当前日（1-31）
					const hour = myDate.getHours();
					const minute = myDate.getMinutes();
					this.formValidate.checkStartTime = `${year}-${month}-${day}  ${hour}:${minute}`;
				}
			}
		},
	},
	methods:{
		handleSelectionChange(selection) {
			for (var i = 0; i < selection.length; i++) {
				this.ids.push(selection[i].id);
			}
			// this.multipleSelection = val;
			console.log(selection);
		},
		async delSheveListClick(){
			if(this.ids.length == 0){
				this.$Message.success('请勾选数据!');
				return
			}
			let datalist = await this.$api.druhStorage.delSheveList(this.ids); 
			if(datalist.code == 200){
				this.$Message.success('删除成功!');
				this.ids = [];
				this.checkbillListClick(true);
			}else{
				this.$Message.error(datalist.msg);
			}
		},
		add(){
			this.modal=true;
			this.formValidate = {};
		},
		modalReset(){
			this.modal=false;
		},
		handleSubmit(name){
			this.$refs[name].validate((valid) => {
				if (valid) {
					console.log(this.formValidate);
					this.createSheveListClick();
				}else{
					this.$Message.error('请输入必填信息!');
				}
			})
		},
		async createSheveListClick(){
			this.formValidate.checkStartTime = this.$moment(this.formValidate.checkStartTime).format('YYYY-MM-DD HH:mm');
			let datalist = await this.$api.druhStorage.createSheveList(this.formValidate);
			this.modal=false;
			if(datalist.code == 200){
				this.$Message.success('新建盘点成功!');
				this.formValidate = {};
				this.checkbillListClick(true);
			}else{
				this.$Message.error(datalist.msg);
			}
		},
		// 导出
		async exportAsPrint(){
        			let datalist = await this.$api.druhStorage.checkBillSheveExportList();
			let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
			let fileName = `${this.getCurrentDate()}盘点审核.xls`;
			let objectUrl = URL.createObjectURL(blob); 
			const link = document.createElement('a')
			link.download = fileName;
			link.href = objectUrl;
			link.click();

			// let objectUrl = URL.createObjectURL(blob); 
			// // window.location.href = objectUrl;
			// window.open(objectUrl);
		},
		clearLaunchDate(){
			this.launchDate = [];
			this.page.checkStartTime = "";
			this.page.checkEndTime = "";
		},
		// 列表
		async checkbillListClick(flag){
			let launchDate = this.launchDate;
			if(launchDate && Array.isArray(launchDate) && launchDate.length > 0 && launchDate[0] && launchDate[1]){
				this.page.checkStartTime = this.$moment(launchDate[0]).format('YYYY-MM-DD');
				this.page.checkEndTime = this.$moment(launchDate[1]).format('YYYY-MM-DD');
			}
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.checkbillList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				for (var i = 0; i < this.druhList.length; i++) {
					if (this.druhList[i].recallStatus != '1') {
						this.druhList[i]['_disabled'] = true
					}
				}
				this.page.totalPage = datalist.data.count;
			}
		},
		// 类型
		async typeListClick(){
			let datalist = await this.$api.publics.typeList({'type':'check_bill_type'});
			this.typeList=datalist.data;
		},
		// 子类型
		async subTypeListClick(){
			let datalist = await this.$api.publics.typeList({'type':'check_bill_sub_type'});
			this.subTypeList=datalist.data;
		},
		// 药品特征
		async drugCharacteristicsListClick(){
			let datalist = await this.$api.publics.typeList({'type':'med_his_drug_feature'});
			this.drugCharacteristicsList=datalist.data;
		},
		// 状态
		async stateListClick(){
			let datalist = await this.$api.publics.typeList({'type':'check_status'});
			this.stateList=datalist.data;
		},
		// 货位
		async queryDrugByListClick(query){
			let item = {
				positionName:query,
			}
			this.loading = true;
			let datalist = await this.$api.publics.queryDeptLocationInfoList(item);
			this.loading = false;
			this.deptLocationList=datalist.data;
		},
		// 货位检索
		deptLocationClick(){
			this.deptLocationList = [];
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		// 类型
		this.typeListClick();
		// 子类型
		this.subTypeListClick();
		// 药品特征
		this.drugCharacteristicsListClick();
		// 状态
		this.stateListClick();
		// 列表
		this.checkbillListClick(false);
	}
}
</script>

