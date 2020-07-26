<template>
	<div class="condition">   
	<Card dis-hover :bordered="false">
	            <p slot="title">
	                单据信息
	            </p>
	            <p slot="extra" class="btn-style">
	                <Button type="default" v-if="nameSh == 1 && comlist.auditStatus ==1" @click="examDetailCheckListListClick()">确认验收</Button>
	                <Button type="primary" @click="print()">打印</Button>
	            </p> 
	            <div> 
	                    <Row :gutter="30">
	                        <Col span="6">
	                        出库单：{{comlist.distributeCode}}
	                        </Col>
	                        <Col span="6">
	                          申领单：{{comlist.applyCode}}
	                        </Col>
	                        <Col span="6">
	                            状态：{{comlist.statusName}}
	                        </Col>
	                    </Row>
	                    <Row :gutter="30" class="mt10">
	                        <Col span="6">
	                            配货部门：{{comlist.originDeptName}}
	                        </Col>
	  		<Col span="6">
	                            发起时间：{{comlist.createDate}}
	                        </Col>
	                        <Col span="6">
	                            验收时间：{{comlist.receptionTime}}
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
			<Table :columns="columns" :data="druhListDetail"  @on-selection-change="handleGoodsChange"></Table>
			<Spin size="large" fix v-if="spinShow"></Spin>
		             <div class="r mt15">
		             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="druhStorageListClick(false)" show-total show-elevator />
		             </div>
		</TabPane>
		<TabPane label="已验收" name="2" class="mb10">
			<Table :columns="columns1" :data="druhListDetail"></Table> 
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
	            	url:`${route}/a/deliver/print/rescuecarprint`,
	             comlist:'',
	             druhListDetail:[],
	             loading:false,
	             goodsName:'',
	             goodsList:[],
	             goodsSumList:[],
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
					title: '实到数量',
					key: 'realNum',
					align: 'center'
				},
				{ 
					title: '需求数量',
					key: 'realDeliveryQuantiry',
					align: 'center'
				},
				{ 
					title: '单位',
					key: 'replanUnit',
					align: 'center'
				},
				{ 
					title: '通用名',
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
					　　　　　　}, params.row.ctmmSpecification),
					　　　　　　h('div', {
					　　　　　　　　slot: 'content',
					　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
					　　　　　　},params.row.ctmmSpecification)
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
					　　　　　　}, params.row.packageSpecification),
					　　　　　　h('div', {
					　　　　　　　　slot: 'content',
					　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
					　　　　　　},params.row.packageSpecification)
					　　　　])
					　　])
					}
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
					type: 'index',
					title: '序号',
					align: 'center'
				},
				{ 
					title: '实到数量',
					key: 'realNum',
					align: 'center'
				},
				{ 
					title: '需求数量',
					key: 'realDeliveryQuantiry',
					align: 'center'
				},
				{ 
					title: '单位',
					key: 'replanUnit',
					align: 'center'
				},
				{ 
					title: '通用名',
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
					　　　　　　}, params.row.ctmmSpecification),
					　　　　　　h('div', {
					　　　　　　　　slot: 'content',
					　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
					　　　　　　},params.row.ctmmSpecification)
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
					　　　　　　}, params.row.packageSpecification),
					　　　　　　h('div', {
					　　　　　　　　slot: 'content',
					　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
					　　　　　　},params.row.packageSpecification)
					　　　　])
					　　])
					}
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
			this.page.status = name;
			this.druhStorageListClick(true);
		},
		 handleGoodsChange(selection) {
			this.goodsSumList = [];
			for (let i = 0; i < selection.length; i++) {
				let item = {
				id:selection[i].id,
				realReceiveQuantiry:selection[i].realNum
			}
			this.goodsSumList.push(item);
			} 
		}, 
		//  确认审核
		async examDetailCheckListListClick(){
			if(this.goodsSumList.length == 0){
				this.$Message.error('请勾选数据!');
				return
			}
			let item = {
				checkType:4,
				detailList:this.goodsSumList,
				distributeCode:this.comlist.distributeCode,
			}
			let datalist = await this.$api.druhStorage.examDetailCheckListList(item);
			this.goodsSumList = [];
			if(datalist.code == 200){
				this.druhStorageDetailHeadClick();
				this.nameSh = '2';
			}
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
			this.druhListDetail = datalist.data.list;
			this.page.totalPage = datalist.data.count;
			this.page.hisDrugCodeList = '';
		},
		// 打印
		async print(){
			window.open(`${this.url}?distributeCode=${this.$router.history.current.query.id}&status=${this.nameSh}`, '_blank');
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
