<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>退货单号</label>
				<Input placeholder="请输入退货单号" v-model="page.backNo" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>日期范围</label>
				 <DatePicker type="daterange" v-model="launchDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-clear="clearLaunchDate"></DatePicker>
			</div>
			<div class="condition-group">
				<label>状态</label>
				<Select v-model="page.backStatus" clearable class="big condition-group-ipt">
			        <Option v-for="(type,index) in typeList" :value="type.value" :key="index">{{ type.label}}</Option>
			    </Select>
			</div>
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>退货原因</label>
				<Select v-model="page.backCause" clearable class="big condition-group-ipt">
				        	<Option v-for="(sta,index) in stateList" :value="sta.value" :key="index">{{ sta.label }}</Option>
				</Select>
			</div>
			 <div class="condition-group">
				<label>供应商</label>
				<Select v-model="page.supplierCode" clearable class="big condition-group-ipt">
			        <Option v-for="(sup,index) in supplierList" :value="sup.ctmaSupplierCode" :key="index">{{ sup.ctmaSupplierName}}</Option>
			    </Select>
			</div> 
		</div>
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" @click="add()">新建退货</Button>
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="backListClick(true)">查询</Button>
	             </div>
		<Modal v-model="modal" fullscreen title="新建退货" :loading="loading1">
			<div class="condition">
				<div class="condition-row mb15">
					<Button type="default" size="large" class="l" @click="addGoods()">添加产品</Button>
			             	<Button type="default" size="large" class="l ml10" @click="batchDeleteListClick()">移除</Button>
					<div class="condition-group ml130">
						<label>退货原因*</label>
						 <Select v-model="backcause" clearable class="big condition-group-ipt">
						        	<Option v-for="(sta,index) in stateList" :value="sta.label" :key="index">{{ sta.label }}</Option>
						</Select>
					</div>
					<div class="condition-group" v-if="this.backcause == '其他'">
					<label>原因*</label>
						<Input placeholder="请输入原因" v-model="backcauseOther" class="condition-group-ipt"></Input>
					</div>
				</div>
				 <h3 class="f16 green-h3 mb10">产品信息</h3>
				 <Table :columns="columns2" :data="backGoodsLists"  @on-selection-change="handleGoodsChange"></Table>
		             </div>
		             <div slot="footer">
				<Button @click="backModal()" style="margin-left: 8px">取消</Button>
				<Button @click="backSave()" style="margin-left: 8px">保存草稿</Button>
				<Button type="primary" @click="backSubmit()">确认</Button>
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
	             launchDate:[],
	             backcause:'',
	             backcauseOther:'',
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
	                                            this.$router.push({path: "/drugStorage/outStorage/backStorage/details", query:{id:params.row.backNo}})
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
	                        title: '来源部门',
	                        key: 'backDpetName',
	                        align: 'center'

	                    },
	                    {
	                        title: '退货原因',
	                        key: 'backCause',
	                        align: 'center'
	                    },
	                    {
	                        title: '是否草稿',
	                        key: 'isDraftName',
	                        align: 'center'
	                    },
	                    {
	                        title: '状态',
	                        key: 'backStatusName',
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
	                supplierList:[],
	                typeList:[],
	                stateList:[],
	                druhList:[],
	                goodsLists:[],
	                backGoodsList:[],
	                backGoodsLists:[],
	                goodsSumList:[],
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
			existInstoreCodeList:[]
		},
	            }
	},
	methods:{
		add(){
			this.modal=true;
		},
		addGoods(){
			if(!this.backcause){
				this.$Message.error('请选择退货原因!');
				return
			}
			this.modalGoods=true;
			this.backdetailListClick();
		},
		// 列表
		async backdetailListClick(flag){
			for (let i = 0; i < this.backGoodsLists.length; i++) {
				this.page1.existInstoreCodeList.push(this.backGoodsLists[i].batchNo);
			}
			if(flag){
				this.page1.pageNo = 1;
			}
			this.goodsLists = [];
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.backdetailList(this.page1);
			this.spinShow = false;
			this.goodsLists=datalist.data.list;
			this.page1.totalPage = datalist.data.count;
			this.page1.existInstoreCodeList = [];
		},
		handleSelectionChange(selection) {
			this.backGoodsList = [];
			for (let i = 0; i < selection.length; i++) {
				 selection[i].backNum = selection[i].usableQuantity;
				 this.backGoodsList.push(selection[i]);
			}
			console.log('11',this.backGoodsList);
		},
		asyncOK(){
			for (var i = 0; i < this.backGoodsList.length; i++) {
				this.backGoodsLists.push(this.backGoodsList[i])
			}
			console.log('22',this.backGoodsLists);
		},
		handleGoodsChange(selection) {
			this.goodsSumList = [];
			for (let i = 0; i < selection.length; i++) {
				let item = {
					backNum:selection[i].backNum,
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
			for (let i = 0; i < this.goodsSumList.length; i++) {
				for (let j = 0; j < this.backGoodsLists.length; j++) {
					if(this.goodsSumList[i].id == this.backGoodsLists[j].id){
						this.backGoodsLists.splice(j, 1);
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
		async backSave(){
			if(!this.backcause){
				this.$Message.error('请选择退货原因!');
				this.loadingSh();
				return
			}else{
				if(this.backcause == '其他' && !this.backcauseOther){
					this.$Message.error('请填写退货原因!');
					this.loadingSh();
					return
				}
				if(this.goodsSumList.length == 0){
					this.$Message.error('请勾选药品数据!');
					this.loadingSh();
					return
				}
				let item = {
					backcause:this.backcause,
					backcauseOther:this.backcauseOther,
					backDrugList:this.goodsSumList,
				}
				console.log(item);
				let datalist = await this.$api.druhStorage.saveDraftList(item);
				if(datalist.code == 200){
					this.$Message.success('保存草稿成功!');
					this.modal=false;
					this.backcause = '';
					this.backcauseOther = '';
					this.goodsSumList = [];
					this.backGoodsLists = [];
					this.backGoodsList = [];
					this.backListClick(true); 
				}else{
					this.$Message.error(datalist.msg);
				}
				
			}
			
		},
		async backSubmit(){
			if(!this.backcause){
				this.$Message.error('请选择退货原因!');
				this.loadingSh();
				return
			}else{
				if(this.backcause == '其他' && !this.backcauseOther){
					this.$Message.error('请填写退货原因!');
					this.loadingSh();
					return
				}
				if(this.goodsSumList.length == 0){
					this.$Message.error('请勾选药品数据!');
					this.loadingSh();
					return
				}
				let item = {
					backcause:this.backcause,
					backcauseOther:this.backcauseOther,
					backDrugList:this.goodsSumList,
				}
				console.log(item);
				let datalist = await this.$api.druhStorage.backSubmitList(item);
				if(datalist.code == 200){
					this.$Message.success('退货成功!');
					this.modal=false;
					this.backcause = '';
					this.backcauseOther = '';
					this.goodsSumList = [];
					this.backGoodsLists = [];
					this.backGoodsList = [];
					this.backListClick(true); 
				}else{
					this.$Message.error(datalist.msg);
				}
				
			}
			
		},
		backModal(){
			this.modal=false;
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
		clearLaunchDate(){
			this.launchDate = [];
			this.page.startTime = "";
			this.page.endTime = "";
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
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
			}
		},
		// 状态
		async typeListClick(){
			let datalist = await this.$api.publics.typeList({'type':'back_status'});
			this.typeList=datalist.data;
		}, 
		// 供应商
		async supplierAllListClick(){
			let datalist = await this.$api.publics.supplierAllList();
			this.supplierList=datalist.data;
		},
		// 退货原因
		async stateListClick(){
			let datalist = await this.$api.publics.typeList({'type':'back_cause'});
			this.stateList=datalist.data;
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		// 类型
		this.typeListClick();
		// 供应商
		this.supplierAllListClick();
		// 状态
		this.stateListClick();
		// 列表
		this.backListClick(false);
	}
}
</script>

