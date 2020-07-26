<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>退库单号</label>
				<Input placeholder="请输入退货单号" v-model="page.backNo" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>退库原因</label>
				<Select v-model="page.backCause" clearable class="big condition-group-ipt">
				        	<Option v-for="(sta,index) in stateList" :value="sta.label" :key="index">{{ sta.label }}</Option>
				</Select>
			</div> 
			<div class="condition-group">
				<label>退库时间</label>
				 <DatePicker type="daterange" v-model="launchDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-clear="clearLaunchDate"></DatePicker>
			</div> 
		</div> 
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" @click="add()">新建退库</Button>
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="backListClick(true)">查询</Button>
	             </div>
		<Modal v-model="modal" fullscreen title="新建退货" :loading="loading1"  @on-ok="submit()" @on-cancel="backModal">
			<div class="condition">
				<div class="condition-row mb15">
					<Button type="default" size="large" class="l" @click="addGoods()">添加产品</Button>
			             	<Button type="default" size="large" class="l ml10" @click="batchDeleteListClick()">移除</Button>
					<div class="condition-group ml130">
						<label>退货原因 *</label>
						 <Select v-model="backcause" clearable class="big condition-group-ipt">
						        	<Option v-for="(sta,index) in stateList" :value="sta.label" :key="index">{{ sta.label }}</Option>
						</Select>
					</div>
				</div>
				 <h3 class="f16 green-h3 mb10">产品信息</h3>
				 <Table :columns="columns2" :data="backGoodsLists"  @on-selection-change="handleGoodsChange"></Table>
		             </div>
		</Modal>
		<Modal v-model="modalGoods" title="添加产品" width="1200" @on-cancel="modalReset"  @on-ok="asyncOK">
			<div class="condition">
				<div class="condition-row">
					<div class="condition-group">
						<label>药品名称</label>
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
					<div class="condition-group">
						<label>生产批号</label> 
						<Input placeholder="请输入生产批号" v-model="page1.lot" class="condition-group-ipt"></Input>
					</div>
					<div class="condition-group">
						<label>入库单号</label>
						<Input placeholder="请输入入库单号" v-model="page1.inStoreCode" class="condition-group-ipt"></Input>
					</div>
				</div>
				<div class="condition-row"> 
					 <div class="condition-group">
						<label>供应商</label>
						<Select v-model="page1.supplierCode" clearable class="big condition-group-ipt">
					        <Option v-for="(sup,index) in supplierList" :value="sup.ctmaSupplierCode" :key="index">{{ sup.ctmaSupplierName}}</Option>
					    </Select>
					</div> 
				</div>
			             <div class="condition-row mb15">
			             	<Button size="large" type="default" icon="ios-search" class="r" @click="backdetailListClick(true)">查询</Button>
			             </div>
		             </div>
			 <Table :columns="columns1" :data="goodsLists" @on-selection-change="handleSelectionChange"></Table> 
			 <Spin size="large" fix v-if="spinShow"></Spin>
		             <div class="mt15" style="text-align: right;">
		             	<Page :total="page1.totalPage" :page-size="page1.pageSize" :current.sync="page1.pageNo" @on-change="backdetailListClick(true)" show-total show-elevator />
		             </div> 
		</Modal>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="backListClick(false)" show-total show-elevator />
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
	             backcause:'',
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
				title: '退货数量',
				key: 'backNum',
				align: 'center',
				 render: (h, params) => {
			                return h('InputNumber', {
			                    props: {
			                    	min:1,
			                    	max:this.backGoodsLists[params.index].usableQuantity,
			                         type: 'text',
			                         value: this.backGoodsLists[params.index].usableQuantity,
			                    },
			                    on: { 
						'on-change':(event)=>{
				                      		this.backGoodsLists[params.index].backNum = event;
				                    	}
					},
			                });
			            }, 
			},
			{ 
				title: '库存数量',
				key: 'usableQuantity',
				align: 'center'
			},
			{ 
				title: '单位',
				key: 'unit',
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
                	],
	             columns1:[
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
				title: '入库单号',
				key: 'inStoreCode',
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
				title: '剂型',
				key: 'ctmmDosageFormDesc',
				align: 'center'
			},
			{
				title: '包装单位',
				key: 'unit',
				align: 'center'
			},
			{
				title: '批准文号',
				key: 'approvalNo',
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
				　　　　　　}, params.row.approvalNo),
				　　　　　　h('div', {
				　　　　　　　　slot: 'content',
				　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
				　　　　　　},params.row.approvalNo)
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
			
                	],
	             columns: [
	                    {
	                        type: 'index',
	                        title: '序号',
	                        align: 'center'
	                    },
	                    {
	                        title: '退货单',
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
	                                            this.$router.push({path: "/baseDrug/outStorage/refund/details", query:{id:params.row.backNo}})
	                                        }
	                                    }
	                                },params.row.backNo), 
	                                h('p', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {float:'left',color:'#ffffff',padding:'0 5px',backgroundColor: 'red',position:'absolute',marginLeft:'7%',borderRadius:'20px'},
	                                },params.row.backStoreDetailItemCount),
	                            ]);
	                        }
	                    },
	                    {
	                        title: '受理部门',
	                        key: 'backDpetName',
	                        align: 'center'

	                    },
	                    {
	                        title: '退库原因',
	                        key: 'backCause',
	                        align: 'center'
	                    },
	                    {
	                        title: '退库人',
	                        key: 'createUserName',
	                        align: 'center'
	                    },
	                    {
	                        title: '退库时间',
	                        key: 'createDate',
	                        align: 'center'
	                    },
	                    {
	                        title: '退货人',
	                        key: 'createUserName',
	                        align: 'center'
	                    },
	                    {
	                        title: '退货时间',
	                        key: 'createDate',
	                        align: 'center'
	                    }
	                ], 
	                stateList:[],
	                supplierList:[],
	                druhList:[],
	                goodsLists:[],
	                backGoodsList:[],
	                backGoodsLists:[],
	                goodsSumList:[],
	                launchDate:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    backStatus:'',
			    startTime:'',
			    endTime:'',
			    backCause:'',
		                supplierCode:[], 
		                backNo:'',
		    }, 
		 page1:{
			pageNo:1,
			pageSize:10,
			totalPage:0,
			hisDrugCodeList:[],
			lot:'',
			supplierCode:'',
			inStoreCode:'',
		},
	            }
	},
	methods:{
		add(){
			this.modal=true;
		},
		addGoods(){
			this.modalGoods=true;
			this.backdetailListClick();
		},
		clearLaunchDate(){
			this.launchDate = [];
			this.page.startTime = "";
			this.page.endTime = "";
		},
		// 列表
		async backdetailListClick(flag){
			if(flag){
				this.page1.pageNo = 1;
			}
			this.goodsLists = [];
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.backdetailList(this.page1);
			this.spinShow = false;
			this.goodsLists=datalist.data.list;
			this.page1.totalPage = datalist.data.count;
		},
		handleSelectionChange(selection) {
			this.backGoodsList = [];
			this.backGoodsList = selection;
			for (let i = 0; i < selection.length; i++) {
				 this.backGoodsList[i].backNum = selection[i].usableQuantity;
			}
		},
		asyncOK(){
			this.backGoodsLists = [];
			this.backGoodsLists = this.backGoodsList;
			this.backGoodsList = [];
		},
		handleGoodsChange(selection) {
			this.goodsSumList = [];
			for (let i = 0; i < selection.length; i++) {
				let item = {
					backNum:selection[i].backNum,
					usableQuantity:selection[i].usableQuantity,
					drugCode:selection[i].drugCode,
					inStoreCode:selection[i].inStoreCode,
					supplierCode:selection[i].supplierCode,
					lot:selection[i].lot,
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
			if(!this.backcause){
				this.$Message.error('请选择退货原因!');
				this.loadingSh();
				return
			}

			this.$Modal.confirm({
				title: '提示',
				content:'是否确定退库？',
				onOk: () => {
					this.backSubmit(); 
				},
			});
		},
		async backSubmit(){
				if(this.goodsSumList.length == 0){
					this.$Message.error('请勾选产品!');
					this.loadingSh();
					return
				}
				for (let i = 0; i < this.goodsSumList.length; i++) {
					if(this.goodsSumList[i].backNum > this.goodsSumList[i].usableQuantity){
						let a =  i + 1;
						this.$Message.error('第'+ a +'数据退货数量不能大于库存数量!');
						this.loadingSh();
						return
					}
				}
				let item = {
					backcause:this.backcause,
					backDrugList:this.goodsSumList,
				}
				console.log(item);
				this.spinShow = true;
				let datalist = await this.$api.druhStorage.dicineBackSubmitList(item);
				this.spinShow = false;
				this.modal=false;
				this.backcause = '';
				this.goodsSumList = [];
				this.backGoodsLists = [];
				this.backGoodsList = [];
				this.backListClick(true); 
		},
		backModal(){
			this.modal=false;
			this.backGoodsLists = [];
		},
		modalReset(){
			this.modalGoods=false;
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
			this.backdetailListClick(true);
		},
		// 列表
		async backListClick(flag){
			let launchDate = this.launchDate;
			if(launchDate && Array.isArray(launchDate) && launchDate.length > 0 && launchDate[0] && launchDate[1]){
				this.page.startTime = this.$moment(launchDate[0]).format('YYYY-MM-DD');
				this.page.endTime = this.$moment(launchDate[1]).format('YYYY-MM-DD');
			}
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.backList(this.page);
			if(datalist.code == 200){
				this.spinShow = false;
			}
			this.druhList=datalist.data.list;
			this.page.totalPage = datalist.data.count;
		},
		// 供应商
		async supplierAllListClick(){
			let datalist = await this.$api.publics.supplierAllList();
			this.supplierList=datalist.data;
		},
		// 退货原因
		async stateListClick(){
			let datalist = await this.$api.publics.typeList({'type':'back_cause_room'});
			this.stateList=datalist.data;
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		// 类型
		this.stateListClick();
		// 供应商
		this.supplierAllListClick();
		// 列表
		this.backListClick(false);
	}
}
</script>

