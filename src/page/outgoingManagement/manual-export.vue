<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>收货部门</label>
				<Select v-model="page.deptCode" clearable class="condition-group-ipt">
				        	<Option v-for="(dep,index) in DeptList" :value="dep.id" :key="index">{{ dep.deptName }}</Option>
				</Select>
			</div> 
			<div class="condition-group">
				<label>单号</label>
				<Input placeholder="请输入供应商" v-model="page.orderNo" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>出库分类</label>
				<Select v-model="page.backType" clearable class="condition-group-ipt">
			        <Option v-for="(type,index) in typeList" :value="type.value" :key="index">{{ type.label}}</Option>
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
				<Select v-model="page.backStatus" clearable class="condition-group-ipt">
				        	<Option v-for="(sta,index) in stateList" :value="sta.value" :key="index">{{ sta.label }}</Option>
				</Select>
			</div>
		</div>
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" @click="add()">新建出库</Button>
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="outstoreListClick(true)">查询</Button>
	             </div>
		<Modal v-model="modal" fullscreen title="新建出库单" @on-ok="asyncOK">
			<div class="condition">
				<div class="condition-row mb15">
					<Button type="default" size="large" class="l" @click="addGoods()">添加产品</Button>
			             	<Button type="default" size="large" class="l ml10" @click="batchDeleteListClick()">移除</Button>
					<div class="condition-group ml130">
						<label>收货部门</label>
						 <Select v-model="deptCode" clearable class="condition-group-ipt" @on-change="dep(deptCode)">
						        	<Option v-for="(dep,index) in getAllSysDeptList" :value="dep.id" :key="index">{{ dep.deptName }}</Option>
						</Select>
					</div>
					<div class="condition-group">
						<label>出库类型</label>
						<Select v-model="sysDep" clearable class="condition-group-ipt" disabled>
						        	<Option v-for="(dep,index) in getAllSysDeptList" :value="dep.key" :key="index">{{ dep.value }}</Option>
						</Select>
					</div>
				</div>
				 <Table :columns="columns1" :data="outGoodsList"  @on-selection-change="handleGoodsChange"></Table>
		             </div>
		</Modal>
		<Modal v-model="modalGoods" title="选择页面" width="1200" @on-cancel="modalReset"> 
			 <Input search v-model="goods" placeholder="药品名称" style="width: 300px;margin-bottom: 15px;" @on-search="getFilterDrugInfoListClick"/>
			 <Table :columns="columns2" :data="goodsList" @on-selection-change="handleSelectionChange"></Table> 
			 <Spin size="large" fix v-if="spinShow"></Spin>
		             <div class="mt15" style="text-align: right;">
		             	<Page :total="page2.totalPage" :page-size="page2.pageSize" :current.sync="page2.pageNo" @on-change="getFilterDrugInfoListClick(false)" show-total show-elevator />
		             </div> 
		</Modal>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="outstoreListClick(false)" show-total show-elevator />
	             </div>
	</div>
</template>
<script>
export default {
	data () {
	            return { 
	            	spinShow:false,
	            	modal:false,
	            	modalGoods:false,
	            	comlist:'', 
	            	billNo:'',
	            	deptCode:'',
	            	sysDep:'',
	            	goods:'',
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
				title: '剂型',
				key: 'ctmmDosageFormDesc',
				align: 'center'
			},
			{ 
				title: '包装规格',
				key: 'ctmmSpecification',
				align: 'center'
			},
			{ 
				title: '生产批号',
				key: 'lot',
				align: 'center'
			},
			{	 
				title: '生产日期',
				key: 'productDate',
				align: 'center'
			},
			{
				title: '有效期至',
				key: 'validEndDate',
				align: 'center'
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
				title: '批准文号',
				key: 'approvalNo',
				align: 'center'
			},
                	],
	            	columns1:[
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
				title: '数量',
				key: 'outStoreNum',
				align: 'center',
				 render: (h, params) => {
			                return h('InputNumber', {
			                    props: {
			                    	min:1,
			                    	max:params.row.usableQuantity,
			                         type: 'text',
			                         value: this.outGoodsList[params.index].usableQuantity,
			                    },
			                    on: { 
						'on-change':(event)=>{
							this.outGoodsList[params.index].outStoreNum = event;
				                    	}
					},
			                });
			            }, 
			},
			{ 
				title: '当前库存',
				key: 'usableQuantity',
				align: 'center'
			},
			{ 
				title: '单位',
				key: 'replanUnit',
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
				title: '剂型',
				key: 'ctmmDosageFormDesc',
				align: 'center'
			},
			{
				title: '包装规格',
				key: 'packageSpecification',
				align: 'center'
			},
			{
				title: '生产批号',
				key: 'lot',
				align: 'center'
			},
			{
				title: '生产日期',
				key: 'productDate',
				align: 'center'
			},
			{
				title: '有效期至',
				key: 'validEndDate',
				align: 'center'
			},
			{
				title: '包装规格',
				key: 'packageSpecification',
				align: 'center'
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
	                        title: '出库单',
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
	                                            this.$router.push({path: "/drugStorage/outStorage/withdraw/details", query:{id:params.row.backNo,state:1}})
	                                        }
	                                    }
	                                },params.row.backNo), 
	                                h('p', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {float:'left',color:'#ffffff',padding:'0 5px',backgroundColor: 'red',position:'absolute',marginLeft:'7%',borderRadius:'20px'},
	                                },params.row.outstoreDetailItemsCount),
	                            ]);
	                        }
	                    },
	                    {
	                        title: '拣货单',
	                        key: 'pickingNo',
	                        align: 'center'

	                    },
	                    {
	                        title: '出库分类',
	                        key: 'backType',
	                        align: 'center'

	                    },
	                    {
	                        title: '状态',
	                        key: 'status',
	                        align: 'center'
	                    },
	                    {
	                        title: '收货部门',
	                        key: 'deptName',
	                        align: 'center'
	                    },
	                    {
	                        title: '发起人',
	                        key: 'createUserName',
	                        align: 'center'
	                    },
	                    {
	                        title: '发起时间',
	                        key: 'createDate',
	                        align: 'center'
	                    },
	                    {
	                        title: '复核人',
	                        key: 'checkUserName',
	                        align: 'center'
	                    },
	                    {
	                        title: '复核时间',
	                        key: 'checkDate',
	                        align: 'center'
	                    }
	                ],
	                supplierList:[],
	                typeList:[],
	                DeptList:[],
	                getAllSysDeptList:[],
	                stateList:[],
	                druhList:[],
	                goodsList:[],
	                outGoodsList:[],
	                goodsSumList:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    backType:'',
			    queryType:1,
			    shelfTime:'',
			    startTime:'',
			    endTime:'',
			    deptCode:'',
			    orderNo:'',
		                 backStatus:'',
		    },
		page2:{
			pageNo:1,
			pageSize:10,
			totalPage:0,
			detail:{
				deptCode:'',
				paramName:'',
				listDetail:[]
			},
		},
	            }
	},
	methods:{
		add(){
			this.modal=true;
			this.getAllSysDeptClick();
		},
		dep(code){
			for (let i = 0; i < this.getAllSysDeptList.length; i++) {
				if(code == this.getAllSysDeptList[i].id){
					this.sysDep = this.getAllSysDeptList[i].key;
				}
			}
		},
		addGoods(){
			if(!this.deptCode){
				this.$Message.error('请选择收货部门!');
				return;
			}
			this.modalGoods=true;
			this.getFilterDrugInfoListClick();
		},
		handleSelectionChange(selection) {
			for (let i = 0; i < selection.length; i++) {
				 selection[i].outStoreNum = selection[i].usableQuantity;
				 this.outGoodsList.push(selection[i]);
			}
		},
		handleGoodsChange(selection) {
			this.goodsSumList = [];
			for (let i = 0; i < selection.length; i++) {
				let item = {
					batchNo:selection[i].batchNo,
					drugCode:selection[i].drugCode,
					outStoreNum:selection[i].outStoreNum
				}
				this.goodsSumList.push(item);
			} 
		},
		batchDeleteListClick(){
			if(this.goodsSumList.length == 0){
				this.$Message.error('请勾选数据!');
				return;
			}
			for (let i = 0; i < this.goodsSumList.length; i++) {
				for (let j = 0; j < this.goodsSumList.length; j++) {
					if(this.goodsSumList[i].batchNo == this.outGoodsList[j].batchNo){
					this.outGoodsList.splice(i, 1);
					}
				}
			}
		},
		async asyncOK(){
			let item = {
				deptCode:this.deptCode,
				listDetail:this.goodsSumList,
				outStoreType:2,
			}
			console.log(item);
			let datalist = await this.$api.druhStorage.confirmOutStoreList({'detail':item});
			this.modal=false;
		},
		modalReset(){
			this.modalGoods=false;
		},
		// 列表
		async getFilterDrugInfoListClick(flag){
			if(flag){
				this.page2.pageNo = 1;
			}
			// this.goodsList = [];
			this.page2.detail.deptCode = this.deptCode;
			this.page2.detail.listDetail = [];
			if(this.outGoodsList.length > 0){
				for (let i = 0; i < this.outGoodsList.length; i++) {
					let item = {
						drugCode:this.outGoodsList[i].drugCode,
						lot:this.outGoodsList[i].lot
					} 
					this.page2.detail.listDetail.push(item);
				}
			}
			this.page2.detail.paramName = this.goods;
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getFilterDrugInfoList(this.page2);
			this.spinShow = false;
			this.goodsList = datalist.data.list;
			this.page2.totalPage = datalist.data.count;
			this.page2.detail.paramName = '';
		},
		getDateStartEnd(){
			let startdate = new Date(this.page.shelfTime[0]);
			let year = startdate.getFullYear();
			let month = startdate.getMonth() + 1;
			let data = startdate.getDate();
			this.page.startTime = year + '-' + month + '-' + data;

			var enddata = new Date(this.page.shelfTime[1]);
			let year1 = enddata.getFullYear();
			let month1 = enddata.getMonth() + 1;
			let data1 = enddata.getDate();
			this.page.endTime = year1 + '-' + month1 + '-' + data1;
			if(!this.page.shelfTime[0]){
				this.page.startTime = '';
				this.page.endTime = '';
			}
		},
		// 列表
		async outstoreListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.page.supplierCodeList = [];
			if(this.page.supid){
				this.page.supplierCodeList.push(this.page.supid);
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.outstoreList(this.page);
			if(datalist.code = 200){
				this.spinShow = false;
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
			}
		},
		// 出库分类
		async typeListClick(){
			let datalist = await this.$api.publics.typeList({'type':'sg_out_store_type'});
			this.typeList=datalist.data;
		},  
		// 收货部门
		async getAllSysDeptClick(){
			let datalist = await this.$api.publics.findAllDeptsAndTypeList();
			this.getAllSysDeptList=datalist.data;
		}, 
		// 来源部门
		async findAllDeptsListClick(){
			let datalist = await this.$api.publics.findAllDeptsList();
			this.DeptList=datalist.data;
		}, 
		// 状态
		async stateListClick(){
			let datalist = await this.$api.publics.typeList({'type':'out_store_status'});
			this.stateList=datalist.data;
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		// 出库分类
		this.typeListClick();
		// 来源部门
		this.findAllDeptsListClick();
		// 状态
		this.stateListClick();
		// 列表
		this.outstoreListClick(false);
	}
}
</script>

