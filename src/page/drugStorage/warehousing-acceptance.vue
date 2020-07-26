<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>来源部门</label>
				<Select v-model="page.originDeptCode" clearable class="big condition-group-ipt">
				        	<Option v-for="(dep,index) in deptList" :value="dep.id" :key="index">{{ dep.deptName }}</Option>
				</Select>
			</div> 
			<div class="condition-group">
				<label>单号</label>
				<Input placeholder="请输入单号" v-model="page.distributeCode" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>供应商</label>
				<Select v-model="page.supid" clearable class="big condition-group-ipt">
				        <Option v-for="(sup,index) in supplierList" :value="sup.ctmaSupplierCode" :key="index">{{ sup.ctmaSupplierName}}</Option>
				    </Select>
			</div> 
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>日期范围</label>
				 <DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
			</div>
			<div class="condition-group">
				<label>状态</label>
				<Select v-model="page.acceptanceType" clearable class="big condition-group-ipt">
				        	<Option v-for="(sta,index) in stateList" :value="sta.value" :key="index">{{ sta.label }}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>类　型</label>
				<Select v-model="page.type" clearable class="big condition-group-ipt">
			        <Option v-for="(type,index) in typeList" :value="type.value" :key="index">{{ type.label}}</Option>
			    </Select>
			</div>
		</div>
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" @click="add()">新建验收</Button>
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="druhStorageListClick(true)">查询</Button>
	             </div>
		<Modal v-model="modal" fullscreen title="新建验收">
			 <Input search v-model="billNo" placeholder="扫描或输入配送单" style="width: 500px;" @on-search="druhStorageDetailHeadClick"/>
			<Card dis-hover :bordered="false">
		            <p slot="title">
		                单据信息
		            </p>
		            <div> 
		                    <Row :gutter="30">
		                        <Col span="6">
		                        配送单：{{comlist.distributeCode}}
		                        </Col>
		                        <Col span="6">
		                            订单号：{{comlist.orderCode}}
		                        </Col>
		                        <Col span="6">
		                            状态：{{comlist.statusName}}
		                        </Col>
		                    </Row>
		                    <Row :gutter="30" class="mt10">
		                        <Col span="6">
		                            类型：{{comlist.typeName}}
		                        </Col>
		  		<Col span="6">
		                            供应商：{{comlist.supplierName}}
		                        </Col>
		                        <Col span="6">
		                            配送日期：{{comlist.createDate}}
		                        </Col>
		                    </Row> 
		                    <Row :gutter="30" class="mt10">
		                        <Col span="6">
		                            验收人：{{comlist.receptionUserName}}
		                        </Col>
		  		<Col span="6">
		                            收货地址：{{comlist.deptAddress}}
		                        </Col>
		                    </Row> 
		            </div>
		        </Card>
		        	<Tabs v-model="nameSh" :animated="false" @on-click="handleTab">
				<TabPane label="待验收" name="1" class="mb10">
					<Table :columns="columns2" :data="druhList1"></Table>
					<Spin size="large" fix v-if="spinShow"></Spin>
				             <div class="r mt15">
				             	<Page :total="page1.totalPage" :page-size="page1.pageSize" :current.sync="page1.pageNo" @on-change="druhStorageDetailListClick(false)" show-total show-elevator />
				             </div>
				</TabPane>
				<TabPane label="已验收" name="2" class="mb10">
					<Table :columns="columns1" :data="druhList1"></Table> 
					<Spin size="large" fix v-if="spinShow"></Spin>
				             <div class="r mt15">
				             	<Page :total="page1.totalPage" :page-size="page1.pageSize" :current.sync="page1.pageNo" @on-change="druhStorageDetailListClick(false)" show-total show-elevator />
				             </div>
				</TabPane> 
			</Tabs>
		</Modal>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="druhStorageListClick(false)" show-total show-elevator />
	             </div>
	</div>
</template>
<script>
export default {
	data () {
	            return { 
	            	spinShow:false,
	            	modal:false,
	            	comlist:'',
	            	nameSh:'2',
	            	billNo:'',
	            	columns2:[
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
				title: '药品名称',
				key: 'ctmmTradeName',
				align: 'center',
				render: (h, params) => {
				　　return h('div', [
				　　　　h('Tooltip', {
				　　　　props: { placement: 'top' }
				　　　　}, [
				　　　　h('div', {
				　　　　　　style: {
				　　　　　　　　width: '80px',
				　　　　　　　　overflow: 'hidden',
				　　　　　　　　textOverflow: 'ellipsis',
				　　　　　　　　whiteSpace: 'nowrap',
				　　　　　　},
				　　　　　　}, params.row.ctmmTradeName),
				　　　　　　h('div', {
				　　　　　　　　slot: 'content',
				　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
				　　　　　　},params.row.ctmmTradeName)
				　　　　])
				　　])
				}
			},
			{ 
				title: '生产厂家',
				key: 'ctmmManufacturerName',
				align: 'center',
				render: (h, params) => {
				　　return h('div', [
				　　　　h('Tooltip', {
				　　　　props: { placement: 'top' }
				　　　　}, [
				　　　　h('div', {
				　　　　　　style: {
				　　　　　　　　width: '80px',
				　　　　　　　　overflow: 'hidden',
				　　　　　　　　textOverflow: 'ellipsis',
				　　　　　　　　whiteSpace: 'nowrap',
				　　　　　　},
				　　　　　　}, params.row.ctmmManufacturerName),
				　　　　　　h('div', {
				　　　　　　　　slot: 'content',
				　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
				　　　　　　},params.row.ctmmManufacturerName)
				　　　　])
				　　])
				}
			},
			{ 
				title: '单位',
				key: 'replanUnit',
				align: 'center'
			},
			{ 
				title: '配送数量',
				key: 'realDeliveryQuantiry',
				align: 'center'
			},
			{	 
				title: '实到数量',
				key: 'realNum',
				align: 'center'
			},
			{
				title: '生产批号',
				key: 'productBatchNo',
				align: 'center'
			},
			{
				title: '生产日期',
				key: 'realProductTime',
				align: 'center'
			},
			{
				title: '有效期至',
				key: 'realValidEndDate',
				align: 'center'
			},
			{
				title: '包装规格',
				key: 'packageSpecification',
				align: 'center'
			},
			{
				title: '是否异常',
				key: 'isUsual',
				align: 'center',
				render: (h, params) => {
					if(params.row.isUsual === 0){
						return h('div','否');
					}else{
			                        	  	return h('div','是');
			                        	 }
				} 
			},
			{
				title: '剂型',
				key: 'ctmmDosageFormDesc',
				align: 'center'
			},
			{
				title: '供应商',
				key: 'supplierName',
				align: 'center',
				render: (h, params) => {
				　　return h('div', [
				　　　　h('Tooltip', {
				　　　　props: { placement: 'top' }
				　　　　}, [
				　　　　h('div', {
				　　　　　　style: {
				　　　　　　　　width: '80px',
				　　　　　　　　overflow: 'hidden',
				　　　　　　　　textOverflow: 'ellipsis',
				　　　　　　　　whiteSpace: 'nowrap',
				　　　　　　},
				　　　　　　}, params.row.supplierName),
				　　　　　　h('div', {
				　　　　　　　　slot: 'content',
				　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
				　　　　　　},params.row.supplierName)
				　　　　])
				　　])
				}
			},
			{
				title: '批准文号',
				key: 'approvalNo',
				align: 'center'
			},
	                	],
	             columns1:[
			{
				type: 'index',
				title: '序号',
				align: 'center'
			},
			{ 
				title: '药品名称',
				key: 'ctmmTradeName',
				align: 'center',
				render: (h, params) => {
				　　return h('div', [
				　　　　h('Tooltip', {
				　　　　props: { placement: 'top' }
				　　　　}, [
				　　　　h('div', {
				　　　　　　style: {
				　　　　　　　　width: '80px',
				　　　　　　　　overflow: 'hidden',
				　　　　　　　　textOverflow: 'ellipsis',
				　　　　　　　　whiteSpace: 'nowrap',
				　　　　　　},
				　　　　　　}, params.row.ctmmTradeName),
				　　　　　　h('div', {
				　　　　　　　　slot: 'content',
				　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
				　　　　　　},params.row.ctmmTradeName)
				　　　　])
				　　])
				}
			},
			{ 
				title: '生产厂家',
				key: 'ctmmManufacturerName',
				align: 'center',
				render: (h, params) => {
				　　return h('div', [
				　　　　h('Tooltip', {
				　　　　props: { placement: 'top' }
				　　　　}, [
				　　　　h('div', {
				　　　　　　style: {
				　　　　　　　　width: '80px',
				　　　　　　　　overflow: 'hidden',
				　　　　　　　　textOverflow: 'ellipsis',
				　　　　　　　　whiteSpace: 'nowrap',
				　　　　　　},
				　　　　　　}, params.row.ctmmManufacturerName),
				　　　　　　h('div', {
				　　　　　　　　slot: 'content',
				　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
				　　　　　　},params.row.ctmmManufacturerName)
				　　　　])
				　　])
				}
			},
			{ 
				title: '单位',
				key: 'replanUnit',
				align: 'center'
			},
			{ 
				title: '配送数量',
				key: 'realDeliveryQuantiry',
				align: 'center'
			},
			{	 
				title: '实到数量',
				key: 'realNum',
				align: 'center'
			},
			{
				title: '生产批号',
				key: 'productBatchNo',
				align: 'center'
			},
			{
				title: '生产日期',
				key: 'realProductTime',
				align: 'center'
			},
			{
				title: '有效期至',
				key: 'realValidEndDate',
				align: 'center'
			},
			{
				title: '包装规格',
				key: 'packageSpecification',
				align: 'center'
			},
			{
				title: '是否异常',
				key: 'isUsual',
				align: 'center',
				render: (h, params) => {
					if(params.row.isUsual === 0){
						return h('div','否');
					}else{
			                        	  	return h('div','是');
			                        	 }
				} 
			},
			{
				title: '剂型',
				key: 'ctmmDosageFormDesc',
				align: 'center'
			},
			{
				title: '供应商',
				key: 'supplierName',
				align: 'center',
				render: (h, params) => {
				　　return h('div', [
				　　　　h('Tooltip', {
				　　　　props: { placement: 'top' }
				　　　　}, [
				　　　　h('div', {
				　　　　　　style: {
				　　　　　　　　width: '80px',
				　　　　　　　　overflow: 'hidden',
				　　　　　　　　textOverflow: 'ellipsis',
				　　　　　　　　whiteSpace: 'nowrap',
				　　　　　　},
				　　　　　　}, params.row.supplierName),
				　　　　　　h('div', {
				　　　　　　　　slot: 'content',
				　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
				　　　　　　},params.row.supplierName)
				　　　　])
				　　])
				}
			},
			{
				title: '批准文号',
				key: 'approvalNo',
				align: 'center'
			},
                	],
	             columns: [
	                    {
	                        type: 'index',
	                        title: '序号',
	                        align: 'center'
	                    },
	                    {
	                        title: '配送单/验收单',
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
	                                            this.$router.push({path: "/drugStorage/wareHouse/psListCheck/detail", query:{id:params.row.distributeCode}})
	                                        }
	                                    }
	                                },params.row.distributeCode), 
	                                h('p', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {float:'left',color:'#ffffff',padding:'0 5px',backgroundColor: 'red',position:'absolute',marginLeft:'8%',borderRadius:'20px'},
	                                },params.row.checkAcceptDetailsItemsCount),
	                            ]);
	                        }
	                    },
	                    {
	                        title: '订单号',
	                        key: 'orderCode',
	                        align: 'center'

	                    },
	                    {
	                        title: '供应商/来源部门',
	                        key: 'supplierName',
	                        align: 'center'

	                    },
	                    {
	                        title: '状态',
	                        key: 'statusName',
	                        align: 'center'
	                    },
	                    {
	                        title: '类型',
	                        key: 'typeName',
	                        align: 'center'
	                    },
	                    {
	                        title: '验收人',
	                        key: 'receptionUserName',
	                        align: 'center'
	                    },
	                    {
	                        title: '验收时间',
	                        key: 'receptionTime',
	                        align: 'center'
	                    },
	                    {
	                        title: '收货地址',
	                        key: 'deptAddress',
	                        align: 'center'
	                    }
	                ],
	                supplierList:[],
	                typeList:[],
	                deptList:[],
	                stateList:[],
	                druhList:[],
	                druhList1:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    type:'',
			    checkType:1,
			    shelfTime:'',
			    receptionStartTime:'',
			    receptionEndTime:'',
			    originDeptCode:'',
			    distributeCode:'',
		                supplierCodeList:[], 
		                acceptanceType:'',
		                supid:'',
		    }, 
		 page1:{
			pageNo:1,
			pageSize:10,
			totalPage:0,
			distributeCode:'',
		},
	            }
	},
	methods:{
		add(){
			this.modal=true;
			// this.handleTab(1);
		},
		handleTab(name){
			this.page1.status = name;
			this.druhStorageDetailListClick(true);
		},
		//  头部 明细
		async druhStorageDetailHeadClick(){
			if(!this.billNo){
				this.$Message.error('请输入配送单号!');
				return;
			}
			let datalist = await this.$api.druhStorage.druhStorageDetailHeadList({'distributeCode':this.billNo}); 
			if(datalist.code == 200){
				this.comlist=datalist.data;
				this.druhStorageDetailListClick(true);
			}else{
				this.$Message.error('请输入有效的配送单号!');
			}
			
		},
		// 列表
		async druhStorageDetailListClick(flag){
			if(flag){
				this.page1.pageNo = 1;
			}
			this.druhList1 = [];
			this.page1.distributeCode = this.billNo;
			this.page1.status = this.nameSh;
			this.page1.distributeCode = this.billNo;
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.druhStorageDetailList(this.page1);
			this.spinShow = false;
			this.druhList1=datalist.data.list;
			this.page1.totalPage = datalist.data.count;
		},
		getDateStartEnd(){
			let startdate = new Date(this.page.shelfTime[0]);
			let year = startdate.getFullYear();
			let month = startdate.getMonth() + 1;
			let data = startdate.getDate();
			this.page.receptionStartTime = year + '-' + month + '-' + data;

			var enddata = new Date(this.page.shelfTime[1]);
			let year1 = enddata.getFullYear();
			let month1 = enddata.getMonth() + 1;
			let data1 = enddata.getDate();
			this.page.receptionEndTime = year1 + '-' + month1 + '-' + data1;
			if(!this.page.shelfTime[0]){
				this.page.receptionStartTime = '';
				this.page.receptionEndTime = '';
			}
		},
		// 列表
		async druhStorageListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.page.supplierCodeList = [];
			if(this.page.supid){
				this.page.supplierCodeList.push(this.page.supid);
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.druhStorageList(this.page); 
			this.spinShow = false;
			this.druhList=datalist.data.list;
			this.page.totalPage = datalist.data.count;
		},
		// 类型
		async typeListClick(){
			let datalist = await this.$api.publics.typeList({'type':'depot_type'});
			this.typeList = datalist.data;
		}, 
		// 供应商
		async supplierAllListClick(){
			let datalist = await this.$api.publics.supplierAllList();
			this.supplierList = datalist.data;
		}, 
		// 来源部门
		async findOriginDeptListClick(){
			let datalist = await this.$api.publics.findOriginDeptList({'deptCode':this.$store.state.currentSelect});
			this.deptList = datalist.data;
		}, 
		// 状态
		async stateListClick(){
			let datalist = await this.$api.publics.typeList({'type':'acceptance_checkVo'});
			this.stateList = datalist.data;
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		// 类型
		this.typeListClick();
		// 供应商
		this.supplierAllListClick();
		// 来源部门
		this.findOriginDeptListClick();
		// 状态
		this.stateListClick();
		// 列表
		this.druhStorageListClick(false);
	}
}
</script>

