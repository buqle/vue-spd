<template>
	<div class="condition">   
	<Card dis-hover :bordered="false">
	            <p slot="title">
	                单据信息
	            </p>
	            <p slot="extra" class="btn-style">
	                <!-- <Button type="primary" icon="printer" @click="exportAsPrint()">导出execl</Button> -->
	                <Button type="primary" v-if="this.page.checkStatus == '0' && this.comlist.status == 1 || this.page.checkStatus == '0' && this.comlist.status == 2" @click="confirm()">复核通过</Button>
	                <Button type="primary" v-if="this.comlist.status == 1" @click="noConfirm()">不通过</Button>
	                <Button type="primary" v-if="comlist.type!=4 && comlist.type!=9&&comlist.type!=11&&comlist.status === 1&&this.page.checkStatus == '1'||comlist.type!=4 && comlist.type!=9&&comlist.type!=11&&comlist.status === 2&&this.page.checkStatus == '1'" @click="confirm1()">生成验收单</Button>
	                <Button type="primary" @click="print()">打印</Button>
	            </p> 
	            <div> 
	                    <Row :gutter="30">
	                        <Col span="6">
	                          出库单：{{comlist.backNo}}
	                        </Col>
	                        <Col span="6">
	                          状态：{{comlist.statusName}}
	                        </Col>
	                        <Col span="6">
	                          申领药房：{{comlist.deptName}}
	                        </Col>
	                    </Row>
	                    <Row :gutter="30" class="mt10"> 
	                        <Col span="6">
	                          发起人：{{comlist.createUserName}}
	                        </Col>
	                        <Col span="6">
	                          发起时间：{{comlist.createDate}}
	                        </Col>
	                        <Col span="6">
	                          联系电话：{{comlist.phone}}
	                        </Col>
	                    </Row>
	                     <Row :gutter="30" class="mt10"> 
	                        <Col span="6">
	                          药房地址：{{comlist.deptAddress}}
	                        </Col>
	                        <Col span="6">
	                          复核人：{{comlist.checkUserName}}
	                        </Col>
	                        <Col span="6">
	                          复核时间：{{comlist.checkDate}}
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
		<Tabs v-model="nameSh" :animated="false" @on-click="handleTab">
		<TabPane label="未复核" name="0" class="mb10">
			<Table :columns="columns" :data="druhList1"  @on-selection-change="handleSelectionChange"></Table>
			<Spin size="large" fix v-if="spinShow"></Spin>
		             <div class="r mt15">
		             	<Page :total="page1.totalPage" :page-size="page1.pageSize" :current.sync="page1.pageNo" @on-change="outStoreDetailListClick(false)" show-total show-elevator />
		             </div>
		</TabPane>
		<TabPane label="已复核" name="1" class="mb10">
			<Table :columns="columns" :data="druhList" @on-selection-change="handleSelectionChange"></Table> 
			<Spin size="large" fix v-if="spinShow"></Spin>
		             <div class="r mt15">
		             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="outStoreDetailListClick(false)" show-total show-elevator />
		             </div>
		</TabPane> 
		</Tabs> 
	             
	</div>  
</template>
<script> 
import {route}  from '@/api/apiRoute';
export default {
	data () {
	            return { 
	            	url:`${route}/a/outStoreDetail/print/printDetail`,
	             comlist:'',
	             druhList:[],
	             druhList1:[],
	             loading:false,
	             goodsName:'',
	             goodsList:[],
	             goodsSumList:[],
	             nameSh:'',
	             spinShow:false,
		page:{
			pageNo:1,
			pageSize:10,
			totalPage:0,
			backNo:'',
			checkStatus:'',
			hisDrugCode:''
		},
		page1:{
			pageNo:1,
			pageSize:10,
			totalPage:0,
			backNo:'',
			checkStatus:'',
			hisDrugCode:''
		},
		
		columns:[
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
					title: '生产日期',
					key: 'productDate',
					align: 'center'
				},
				{	 
					title: '有效期至',
					key: 'validEndDate',
					align: 'center',
				},
				{
					title: '批准文号',
					key: 'approvalNo',
					align: 'center',
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
					title: '采购方式',
					key: 'purchaseType',
					align: 'center',
					render: (h, params) => { 
						return h('div',params.row.purchaseType == 1?'零库存' : '自采')
					}
				},
				{
					title: '价格',
					key: 'price',
					align: 'center',
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
	            }
	},
	methods: {
		handleTab(name){
			this.page.checkStatus = name;
			// 列表
			this.outStoreDetailListClick(false);
		},
		handleSelectionChange(selection) {
			this.goodsSumList = [];
			for (let i = 0; i < selection.length; i++) {
				let item = {
					backSumNum:selection[i].backNum,
					drugCode:selection[i].drugCode,
					batchNo:selection[i].batchNo
				}
				this.goodsSumList.push(item);
			}
			console.log(this.goodsSumList);
		},
		confirm(){
			if(this.goodsSumList.length == 0){
				this.$Message.error('请选择商品!');
				return
			}
			this.$Modal.confirm({
				title: '提示',
				content:'是否确认复核？',
				onOk: () => {
				 	this.finishPickingClick(); 
				},
			});
		},
		confirm1(){
			this.$Modal.confirm({
				title: '提示',
				content:'是否生成验收单？',
				onOk: () => {
				 	this.buildCheckAcceptListClick(); 
				},
			});
		},
		async buildCheckAcceptListClick(){
			let item = {
				deptCode:this.comlist.deptCode,
				outStoreDetail:this.goodsSumList,
				backNo:this.$router.history.current.query.id,
			}
			console.log(item);
		 	this.modal=true;
			let datalist = await this.$api.druhStorage.buildCheckAcceptList(item);
			this.modal=false;
			this.goodsSumList =[];
			this.outStoreDetailInfoListClick();
		},
		noConfirm(){
			this.$Modal.confirm({
				title: '提示',
				content:'是否确认不通过复核？',
				onOk: () => {
				 	this.rejectOutStoreListClick(); 
				},
			});
		},
		async rejectOutStoreListClick(){
		 	this.modal=true;
			let datalist = await this.$api.druhStorage.rejectOutStoreList({'backNo':this.$router.history.current.query.id});
			this.modal=false;
			this.outStoreDetailInfoListClick();
		},
		async finishPickingClick(){
			let item = {
				deptCode:this.comlist.deptCode,
				outStoreDetail:this.goodsSumList,
				backNo:this.$router.history.current.query.id,
			}
			console.log(item);
		 	this.modal=true;
			let datalist = await this.$api.druhStorage.checkOutStoreList(item);
			this.modal=false;
			this.goodsSumList =[];
			this.outStoreDetailInfoListClick();
		},
		//  头部 明细
		async outStoreDetailInfoListClick(){
			let datalist = await this.$api.druhStorage.outStoreDetailInfoList({'backNo':this.$router.history.current.query.id}); 
			this.comlist=datalist.data; 
			if(this.$router.history.current.query.state == '0'){
				this.nameSh = '0';
			}else{
				this.nameSh = '1';
			}
			// 列表
			this.outStoreDetailListClick(false);
		},
		// 列表
		async outStoreDetailListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.druhList = [];
			this.page.backNo = this.$router.history.current.query.id;
			this.page.checkStatus = this.nameSh;
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.outStoreDetailList(this.page);
			this.spinShow = false;
			if(this.comlist.status == '0'){
				this.druhList1 = datalist.data.list;
				this.page1.totalPage = datalist.data.count;
			}else{
				this.druhList = datalist.data.list;
				this.page.totalPage = datalist.data.count;
				for (var i = 0; i < this.druhList.length; i++) {
					if (this.druhList[i].isCheckAccept == 1) {
					this.druhList[i]['_disabled'] = true
					}
				}
			}
			
			this.page.hisDrugCode = '';
		},
		// 打印
		async print(){
			window.open(`${this.url}?backNo=${this.$router.history.current.query.id}`, '_blank');
		},
		// // 导出
		// async exportAsPrint(){ 
		// 	let item ={
		// 		distributeCode:this.$router.history.current.query.id,
		// 		status:this.page.status
		// 	}
  //       			let datalist = await this.$api.druhStorage.exportAsPrintList(item);
		// 	let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
		// 	let fileName = `${this.getCurrentDate()}配送商详情.xls`;
		// 	let objectUrl = URL.createObjectURL(blob); 
		// 	const link = document.createElement('a')
		// 	link.download = fileName;
		// 	link.href = objectUrl;
		// 	link.click();

		// 	// let objectUrl = URL.createObjectURL(blob); 
		// 	// // window.location.href = objectUrl;
		// 	// window.open(objectUrl);
		// },
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
					this.page.hisDrugCode = this.goodsList[i].bigDrugCode;
				}
			}
			this.outStoreDetailListClick(false);
		},
	}, 
	created(){
		// console.log(this.$router.history.current.query.id);
		// 头部
		this.outStoreDetailInfoListClick();
		
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
