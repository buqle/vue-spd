<template>
	<div class="condition">   
	<Card dis-hover :bordered="false">
	            <p slot="title">
	                单据信息
	            </p>
	            <p slot="extra" class="btn-style">
	                <Button type="primary" @click="exportAsPrint()">导出execl</Button>
	                <Button type="primary" @click="print()">打印</Button>
	                <Button type="primary" v-if="this.comlist.isDraft == 1" @click="add()">编辑草稿</Button>
	            </p> 
	            <div> 
	                    <Row :gutter="30">
	                        <Col span="6">
	                        退货单：{{comlist.backNo}}
	                        </Col>
	                        <Col span="6">
	                            状态：{{comlist.backStatusName}}
	                        </Col>
	                        <Col span="6">
	                           来源部门：{{comlist.backDpetName}}
	                        </Col>
	                    </Row>
	                    <Row :gutter="30" class="mt10">
	                        <Col span="6">
	                           退货人：{{comlist.createUserName}}
	                        </Col>
	  		<Col span="6">
	                           退货时间：{{comlist.createDate}}
	                        </Col>
	                        <Col span="6">
	                           供应商：{{comlist.supplierName}}
	                        </Col>
	                    </Row> 
	                    <Row :gutter="30" class="mt10">
	                        <Col span="6">
	                            复核人：{{comlist.reviewUserName}}
	                        </Col>
	  		<Col span="6">
	                           复核时间：{{comlist.reviewDate}}
	                        </Col>
	                    </Row> 
	            </div>
	        </Card>
	            <div class="condition-row mb15">  
			<div class="condition-group">
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
		<h3 class="f16 green-h3 mb10">产品信息</h3>
		<Table :columns="columns" :data="druhList"></Table>
		<Spin size="large" fix v-if="spinShow"></Spin>
	             <!-- <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="druhStorageListClick(false)" show-total show-elevator />
	             </div> -->


	             <Modal v-model="modal" fullscreen title="编辑草稿" :loading="loading1">
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
				<Button type="primary" @click="confirmEditDraftList()">提交草稿</Button>
			</div>
		</Modal>

		<Modal v-model="modalGoods" title="添加产品" width="1200" @on-cancel="modalReset"  @on-ok="asyncOK">
			<div class="condition">
				<div class="condition-row">
					<div class="condition-group">
						<label>药品名称</label>
						<Select
					                v-model="goodsName1"
					                filterable
					                clearable
					                remote
					                placeholder="请选择药品"
					                :remote-method="queryDrugByListClick1"
					                :loading="loading"  style="width: 300px" @on-change="goodsClick1(goodsName1)">
					                <Option v-for="(option, index) in goodsList1" :value="option.ctmmParam" :key="index">{{option.ctmmParam}}</Option>
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
	</div>  
</template>
<script>
import {route}  from '@/api/apiRoute';
export default {
	data () {
	            return {
	            	url:`${route}/a/backsdetail/print/printBackDetail`,
	            	modal:false,
	            	modalGoods:false,
	            	loading1:true,
	            	backcause:'',
	             backcauseOther:'',
	             backGoodsLists:[],
	             goodsSumList:[],
	             backGoodsList:[],
	             supplierList:[],
	             goodsLists:[],
	             stateList:[],
	             goodsName1:'',
	             goodsList1:[],

	             comlist:'',
	             druhList:[],
	             loading:false,
	             goodsName:'',
	             goodsList:[],
	             spinShow:false,
		page:{
			pageNo:1,
			pageSize:10,
			totalPage:0,
			backNo:'',
			hisDrugCodeList:''
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
		columns:[
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
					title: '入库单号',
					key: 'inStoreCode',
					align: 'center'
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
					title: '出库数量',
					key: 'backNum',
					align: 'center'
				},
				{
					title: '生产批号',
					key: 'lot',
					align: 'center'
				},
				{
					title: '药品编码',
					key: 'hisDrugCode',
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
	            }
	},
	methods: {
		add(){
			this.modal=true;
			this.editDraftHead();
			this.editDraftList();
		},
		backModal(){
			this.modal=false;
		},
		modalReset(){
			this.modalGoods=false;
		},
		// 弹框抬头
		async editDraftHead(){
			let datalist = await this.$api.druhStorage.editDraftHeadList({'backNo':this.$router.history.current.query.id});
			this.backcause = datalist.data.backCause;
		},
		// 弹框 列表明细
		async editDraftList(){
			let datalist = await this.$api.druhStorage.editDraftList({'backNo':this.$router.history.current.query.id});
			this.backGoodsLists = datalist.data;
		},
		addGoods(){
			if(!this.backcause){
				this.$Message.error('请选择退货原因!');
				return
			}
			this.modalGoods=true;
			this.backdetailListClick(true);
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
			this.page1.hisDrugCodeList = [];
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
		async confirmEditDraftList(){
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
					backNo:this.$router.history.current.query.id,
					backcause:this.backcause,
					backcauseOther:this.backcauseOther,
					backDrugList:this.goodsSumList,
					deptCode:this.comlist.backDeptCode
				}
				console.log(item);
				let datalist = await this.$api.druhStorage.confirmEditDraftList(item);
				if(datalist.code == 200){
					this.$Message.success('提交草稿成功!');
					this.modal=false;
					this.backcause = '';
					this.backcauseOther = '';
					this.goodsSumList = [];
					this.backGoodsLists = [];
					this.backGoodsList = [];
					this.$router.push({path: "/drugStorage/outStorage/backStorage"})
				}else{
					this.$Message.error(datalist.msg);
				}
				
			}
			
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
					backNo:this.$router.history.current.query.id,
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
					this.backInfoListClick(true);
				}else{
					this.$Message.error(datalist.msg);
				}
				
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
		// 退货原因
		async stateListClick(){
			let datalist = await this.$api.publics.typeList({'type':'back_cause'});
			this.stateList=datalist.data;
		},
		// 列表
		async backInfoListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.druhList = [];
			this.page.backNo = this.$router.history.current.query.id;
			// this.page.distributeCode = this.$router.history.current.query.id;
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.backInfoList(this.page);
			this.spinShow = false;
			this.comlist=datalist.data;
			this.druhList=datalist.data.list;
			this.page.totalPage = datalist.data.count;
			this.page.hisDrugCodeList = '';
		},
		// 打印
		async print(){
			window.open(`${this.url}?backNo=${this.$router.history.current.query.id}`, '_blank');
		},
		// 导出
		async exportAsPrint(){
        			let datalist = await this.$api.druhStorage.backExportList({'backNo':this.$router.history.current.query.id});
			let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
			let fileName = `${this.getCurrentDate()}退货计划.xls`;
			let objectUrl = URL.createObjectURL(blob); 
			const link = document.createElement('a')
			link.download = fileName;
			link.href = objectUrl;
			link.click();

			// let objectUrl = URL.createObjectURL(blob); 
			// // window.location.href = objectUrl;
			// window.open(objectUrl);
		},
		// 药品
		async queryDrugByListClick1(query){
			let item = {
				paramName:query,
				queryType:3,
			}
			this.loading = true;
			let datalist = await this.$api.publics.queryDrugByList(item);
			this.loading = false;
			this.goodsList1=datalist.data;
		},
		// 药品检索
		goodsClick1(name){
			for (let i = 0; i < this.goodsList1.length; i++) {
				 if(name == this.goodsList1[i].ctmmParam){
					this.page1.hisDrugCodeList.push(this.goodsList1[i].bigDrugCode);
				}
			}
			this.backdetailListClick();
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
			for (let i = 0; i < this.goodsList.length; i++) {
				 if(name == this.goodsList[i].ctmmParam){
					this.page.hisDrugCodeList = this.goodsList[i].bigDrugCode;
				}
			}
			this.backInfoListClick();
		},
		// 供应商
		async supplierAllListClick(){
			let datalist = await this.$api.publics.supplierAllList();
			this.supplierList=datalist.data;
		},
	}, 
	created(){
		// console.log(this.$router.history.current.query.id);
		// 供应商
		this.supplierAllListClick();
		// 列表
		this.backInfoListClick(false);
		// 退货原因
		this.stateListClick();
	},
	watch: { 
	 
	},


}
</script> 
<style scoped>
	.c_green_tit {
        color: #2d8cf0;
    }
</style>
