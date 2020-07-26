<template>
	<div class="condition">
		<div class="condition-row"> 
			<div class="condition-group">
				<label>申领单</label>
				<Input placeholder="请输入退货单号" v-model="page.applyCode" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>状态</label>
				<Select v-model="page.applyStatus" clearable class="big condition-group-ipt">
				        	<Option v-for="(sta,index) in stateList" :value="sta.value" :key="index">{{ sta.label }}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>发起时间</label>
				 <DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
			</div>
		</div> 
		<div class="condition-row">
			<div class="condition-group">
				<label>抢救车</label>
				<Select v-model="page.applyDeptCode" clearable class="big condition-group-ipt">
					<Option v-for="dep in DeptList" :value="dep.id" :key="dep.id">{{ dep.deptName }}</Option>
				</Select>
			</div>
		</div>
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" @click="add()">新建申领</Button>
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="rescuecarApplyListClick(true)">查询</Button>
	             </div>
		<Modal v-model="modal" fullscreen title="新建退货" :loading="loading1"  @on-ok="submit()">
			<div class="condition">
				<div class="condition-row mb15">
					<Button type="default" size="large" class="l" @click="addGoods()">添加产品</Button>
			             	<Button type="default" size="large" class="l ml10" @click="batchDeleteListClick()">移除</Button> 
					<div class="condition-group ml10">
						<label>抢救车</label>
						<Select v-model="page1.deptCode" clearable class="big condition-group-ipt">
							<Option v-for="dep in DeptList" :value="dep.id" :key="dep.id">{{ dep.deptName }}</Option>
						</Select>
					</div>
				</div>
				 <h3 class="f16 green-h3 mb10">产品信息</h3>
				 <Table :columns="columns2" :data="backGoodsLists"  @on-selection-change="handleGoodsChange"></Table>
		             </div>
		</Modal>
		<Modal v-model="modalGoods" title="添加产品" width="1200" @on-cancel="modalReset"  @on-ok="asyncOK">
			<div class="condition">
				<div class="condition-row mb15">
					<div class="condition-group">
						<label>通用名/商品名</label>
						<Select
					                v-model="goodsName"
					                filterable
					                clearable
					                remote
					                placeholder="请选择药品"
					                :remote-method="queryDrugByListClick"
					                :loading="loading"  style="width: 300px" @on-change="goodsClick(goodsName)">
					                <Option v-for="(option, index) in goodsList" :value="option.ctmmParam" :key="index">{{option.ctmmParam}}</Option>
					            </Select>
					</div>
				</div> 
		             </div>
			 <Table :columns="columns1" :data="goodsLists" @on-selection-change="handleSelectionChange"></Table> 
			 <Spin size="large" fix v-if="spinShow"></Spin>
		             <div class="mt15" style="text-align: right;">
		             	<Page :total="page1.totalPage" :page-size="page1.pageSize" :current.sync="page1.pageNo" @on-change="queryDrugByDeptListClick(true)" show-total show-elevator />
		             </div> 
		</Modal>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="rescuecarApplyListClick(false)" show-total show-elevator />
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
	            	loading:false,
	            	loading1:true,
	             goodsName:'',
	             goodsList:[],
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
				title: '通用名称',
				key: 'ctmmGenericName',
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
				　　　　　　}, params.row.ctmmGenericName),
				　　　　　　h('div', {
				　　　　　　　　slot: 'content',
				　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
				　　　　　　},params.row.ctmmGenericName)
				　　　　])
				　　])
				}
			},
			{ 
				title: '商品名',
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
				title: '药品编码',
				key: 'hisDrugCode',
				align: 'center'
			},
			{ 
				title: '规格',
				key: 'ctmmSpecification',
				align: 'center'
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
				title: '批准文号',
				key: 'approvalNo',
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
                	],
	             columns2:[
	             	{
				type: 'selection',
				align: 'center',
				width:'50'
			},
			{
				type: 'index',
				title: '序号',
				align: 'center'
			},
			{ 
				title: '通用名称',
				key: 'ctmmGenericName',
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
				　　　　　　}, params.row.ctmmGenericName),
				　　　　　　h('div', {
				　　　　　　　　slot: 'content',
				　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
				　　　　　　},params.row.ctmmGenericName)
				　　　　])
				　　])
				}
			},
			{ 
				title: '商品名',
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
				title: '规格',
				key: 'ctmmSpecification',
				align: 'center'
			},
			{ 
				title: '剂型',
				key: 'ctmmDosageFormDesc',
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
				title: '包装规格',
				key: 'packageSpecification',
				align: 'center'
			},
			{	 
				title: '单位',
				key: 'replanUnit',
				align: 'center'
			},
			{
				title: '申领数量',
				key: 'baseApplyNum',
				align: 'center',
				render: (h, params) => {
				　　return h('div',params.row.baseApplyNum < 0?0:params.row.baseApplyNum)
				}
			},
			{
				title: '抢救车库存',
				key: 'localUsableQuantity',
				align: 'center'
			},
			{
				title: '库存基数',
				key: 'stockBase',
				align: 'center'
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
	                        title: '申领单',
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
	                                            this.$router.push({path: "/baseDrug/salvageCar/drugApply/details", query:{id:params.row.applyCode}})
	                                        }
	                                    }
	                                },params.row.applyCode)
	                            ]);
	                        }
	                    },
	                    {
	                        title: '申领抢救车',
	                        key: 'applyDeptName',
	                        align: 'center'

	                    },
	                    {
	                        title: '状态',
	                        key: 'applyStatusName',
	                        align: 'center'
	                    },
	                    {
	                        title: '入库人',
	                        key: 'createUserName',
	                        align: 'center'
	                    },
	                    {
	                        title: '发起时间',
	                        key: 'createDate',
	                        align: 'center'
	                    }
	                ], 
	                stateList:[],
	                supplierList:[],
	                druhList:[],
	                DeptList:[],
	                goodsLists:[],
	                backGoodsList:[],
	                backGoodsLists:[],
	                goodsSumList:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    applyDeptCode:'',
			    applyCode:'',
			    applyStatus:'', 
			    shelfTime:'',
			    startTime:'',
			    endTime:'',
			    queryType:1
		    }, 
		 page1:{
			pageNo:1,
			pageSize:10,
			totalPage:0,
			deptCode:'',
			hisDrugCodeList:[]
		},
	            }
	},
	methods:{
		add(){
			this.modal=true;
		},
		addGoods(){
			if(!this.page1.deptCode){
				this.$Message.error('请选择退库抢救车!');
				return
			}
			this.modalGoods=true;
			this.queryDrugByDeptListClick();
		},
		// 列表
		async queryDrugByDeptListClick(flag){
			if(flag){
				this.page1.pageNo = 1;
			}
			this.goodsLists = [];
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.queryDrugByDeptList(this.page1);
			this.spinShow = false;
			this.goodsLists=datalist.data.list;
			this.page1.totalPage = datalist.data.count;
		},
		handleSelectionChange(selection) {
			this.backGoodsList = [];
			for (let i = 0; i < selection.length; i++) {
				this.backGoodsList.push(selection[i].drugCode);
			}
		},
		async asyncOK(){
			let item = {
				deptCode:this.page1.deptCode,
				drugCodeList:this.backGoodsList
			}
			let datalist = await this.$api.druhStorage.rescuecarapplyAddDrugList(item);
			this.backGoodsLists = datalist.data;
			this.backGoodsList = [];
		},
		handleGoodsChange(selection) {
			this.goodsSumList = [];
			for (let i = 0; i < selection.length; i++) {
				let item = {
					applyNum:selection[i].baseApplyNum,
					drugCode:selection[i].drugCode,
					id:selection[i].id
				}
				this.goodsSumList.push(item);
			} 
		},
		batchDeleteListClick(){
			for (let i = 0; i < this.backGoodsLists.length; i++) {
				 for (let j = 0; j < this.goodsSumList.length; j++) {
				 	if(this.backGoodsLists[i].id == this.goodsSumList[j].id){
				 		this.backGoodsLists.splice(i, 1);
				 	}
				}
			}
		},
		loadingSh(){
			setTimeout(() => {
				this.loading1 = false;
				this.$nextTick(() => {
					this.loading1 = true;
				})
			}, 500)
		},
		submit(){
			this.$Modal.confirm({
				title: '提示',
				content:'是否确认申领？',
				onOk: () => {
					this.backSubmit(); 
				},
			});
		},
		async backSubmit(){ 
				let item = {
					applyType:1,
					applyStatus:1,
					applyDeptCode:this.page1.deptCode,
					detaiList:this.goodsSumList,
					rescuercarApplyFlag:true
				}
				console.log(item);
				let datalist = await this.$api.druhStorage.rescuecarapplySaveList(item);
				this.modal=false;
				this.page1.backcause = '';
				this.page1.deptCode = '';
				this.goodsSumList = [];
				this.backGoodsLists = [];
				this.backGoodsList = [];
				this.rescuecarApplyListClick(true); 
		},
		backModal(){
			this.modal=false;
		},
		modalReset(){
			this.modalGoods=false;
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
		// 药品
		async queryDrugByListClick(query){
			let item = {
				paramName:query,
				queryType:3,
			}
			this.loading = true;
			let datalist = await this.$api.publics.queryDrugByList(item);
			this.loading = false;
			this.goodsList=datalist.data;
		},
		// 药品检索
		goodsClick(name){
			this.page1.hisDrugCodeList = [];
			for (let i = 0; i < this.goodsList.length; i++) {
				 if(name == this.goodsList[i].ctmmParam){
					this.page1.hisDrugCodeList.push(this.goodsList[i].bigDrugCode);
				}
			}
			this.queryDrugByDeptListClick(true);
		},
		// 列表
		async rescuecarApplyListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.rescuecarApplyList(this.page);
			if(datalist.code == 200){
				this.spinShow = false;
			}
			this.druhList=datalist.data.list;
			this.page.totalPage = datalist.data.count;
		},
		// 抢救车货位
		async findOriginDeptListClick(){
			let datalist = await this.$api.publics.rescuecarDetailList();
			this.DeptList=datalist.data;
		},
		// 供应商
		async supplierAllListClick(){
			let datalist = await this.$api.publics.supplierAllList();
			this.supplierList=datalist.data;
		},
		// 状态
		async stateListClick(){
			let datalist = await this.$api.publics.typeList({'type':'apply_status'});
			this.stateList=datalist.data;
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		 // 抢救车货位
		this.findOriginDeptListClick();	
		// 状态
		this.stateListClick();
		// 供应商
		this.supplierAllListClick();
		// 列表
		this.rescuecarApplyListClick(false);
	}
}
</script>

