<template>
	<div class="condition">   
	<Card dis-hover :bordered="false">
	            <p slot="title">
	                单据信息
	            </p>
	            <p slot="extra" class="btn-style">
	            <Button type="primary" v-if="comlist.checkDetailStatus == 1 || comlist.checkDetailStatus == 0" @click="reject()">拒收</Button>
	                <Button type="primary" v-if="comlist.checkDetailStatus == 1 || comlist.checkDetailStatus == 0" @click="saveCheck()">确认验收</Button>
	                <Button type="primary" @click="exportAsPrint()">导出execl</Button>
	                <Button type="primary" @click="print()">打印</Button>
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
		<Tabs v-model="nameSh" :animated="false" @on-click="handleTab">
		<TabPane label="待验收" name="1" class="mb10">
			<Table :columns="columns" :data="druhList"  @on-selection-change="handleListChange"></Table>
			<Spin size="large" fix v-if="spinShow"></Spin>
		             <div class="r mt15">
		             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="druhStorageListClick(false)" show-total show-elevator />
		             </div>
		</TabPane>
		<TabPane label="已验收" name="2" class="mb10">
			<Table :columns="columns1" :data="druhList"></Table> 
			<Spin size="large" fix v-if="spinShow"></Spin>
		             <div class="r mt15">
		             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="druhStorageListClick(false)" show-total show-elevator />
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
	            	url:`${route}/a/deliver/print/printDetail`,
	             comlist:'',
	             druhList:[],
	             loading:false,
	             goodsName:'',
	             goodsList:[],
	             recallNo:[],
	             status:'',
	             model2:'',
	             nameSh:'1',
	             spinShow:false,
		page:{
			pageNo:1,
			pageSize:10,
			totalPage:0,
			distributeCode:'',
			hisDrugCodeList:''
		},
		columns:[
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
	            }
	},
	methods: {
		handleTab(name){
			this.page.status = name;
			this.druhStorageListClick(true);
		},
		//  头部 明细
		async druhStorageDetailHeadClick(){
			let datalist = await this.$api.druhStorage.druhStorageDetailHeadList({'distributeCode':this.$router.history.current.query.id}); 
			this.comlist=datalist.data; 
		},
		// 列表
		async druhStorageListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.druhList = [];
			this.page.distributeCode = this.$router.history.current.query.id;
			this.page.status = this.nameSh;
			// this.page.distributeCode = this.$router.history.current.query.id;
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.druhStorageDetailList(this.page);
			this.spinShow = false;
			this.druhList=datalist.data.list;
			this.page.totalPage = datalist.data.count;
			this.page.hisDrugCodeList = '';
		},
		handleListChange(selection) {
			this.recallNo = [];
			 for (let i = 0; i < selection.length; i++) {
			 	let item ={
			 		drugCode:selection[i].drugCode,
			 		id:selection[i].id,
			 		parentId:selection[i].parentId,
			 		productBatchNo:selection[i].productBatchNo,
			 		realProductTime:selection[i].realProductTime,
			 		realReceiveQuantiry:selection[i].realNum,
			 		realValidEndDate:selection[i].realValidEndDate,
			 		isUsual:selection.isUsual
			 	}
				this.recallNo.push(item);
			}
			console.log(this.recallNo);
		},
		//  拒收
		async reject(){
			if(this.recallNo.length == 0){
				this.$Message.error('请勾选单据!');
				return
			}
			let item ={
				distributeCode:this.$router.history.current.query.id,
				detailList:this.recallNo,
				checkType:1,
				type:106
			}
			let datalist = await this.$api.druhStorage.rejectList(item); 
			this.$Message.success('拒收成功!');
			this.recallNo = [];
			this.$router.push({path: "/drugStorage/wareHouse/psListCheck"});
		},
		//  确认验收
		async saveCheck(){
			if(this.recallNo.length == 0){
				this.$Message.error('请勾选单据!');
				return
			}
			let item ={
				distributeCode:this.$router.history.current.query.id,
				detailList:this.recallNo,
				checkType:1
			}
			let datalist = await this.$api.druhStorage.examDetailCheckListList(item); 
			this.$Message.success('确认验收成功!');
			this.druhStorageListClick(false); 
			this.handleTab('2');
			this.recallNo = [];
		},
		// 打印
		async print(){
			window.open(`${this.url}?distributeCode=${this.$router.history.current.query.id}&status=${this.page.status}`, '_blank');
		},
		// 导出
		async exportAsPrint(){ 
			let item ={
				distributeCode:this.$router.history.current.query.id,
				status:this.page.status
			}
        			let datalist = await this.$api.druhStorage.exportAsPrintList(item);
			let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
			let fileName = `${this.getCurrentDate()}配送商详情.xls`;
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
			this.druhStorageListClick();
		},
	}, 
	created(){
		// console.log(this.$router.history.current.query.id);
		// 列表
		this.druhStorageListClick(false);
		// 明细
		this.druhStorageDetailHeadClick();
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
