<template>
	<div class="condition">   
	<Card dis-hover :bordered="false">
	            <p slot="title">
	                单据信息
	            </p>
	            <p slot="extra" class="btn-style">
	                <!-- <Button type="primary" v-if="comlist.recallStatus =='1'" @click="pass()">审核</Button> -->
	                <!-- <Button type="primary" v-if="comlist.recallStatus =='1'" @click="reject()">驳回</Button> -->
	            </p> 
	            <div> 
	                    <Row :gutter="30">
	                        <Col span="6">
                        		部门：{{comlist.deptName}}
	                        </Col>
	                        <Col span="6">
	                          损益单号：{{comlist.causticExcessiveNo}}
	                        </Col>
	                        <Col span="6">
	                          账面总库存：{{comlist.accountTotalAmount}}
	                        </Col>
	                    </Row>
	                    <Row :gutter="30" class="mt10">
	                        <Col span="6">
	                          实际总库存：{{comlist.realTotalAmount}}
	                        </Col>
	  		<Col span="6">
	                          损益总数量：{{comlist.excessiveTotalAmount}}
	                        </Col>
	                        <Col span="6">
	                          实际总损益金额：{{comlist.excessiveTotalMoney}}
	                        </Col>
	                    </Row>
	                    <Row :gutter="30" class="mt10">
	                        <Col span="6">
	                          生成时间：{{comlist.createDate}}
	                        </Col>
	                    </Row>
	            </div>
	        </Card>
		<h3 class="f16 green-h3 mb10">库存信息</h3>
		<Table :columns="columns" :data="druhList" style="width: 100%"></Table>
		<Spin size="large" fix v-if="spinShow"></Spin>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getExcessiveDetailListClick()" show-total show-elevator />
	             </div>
	             
	</div>  
</template>
<script>
import {route}  from '@/api/apiRoute';
export default {
	data () {
	            return {
	            	url:`${route}/a/backsdetail/print/printBackDetail`,
	             comlist:'',
	             druhList:[],
	             spinShow:false,
		page:{
			pageNo:1,
			pageSize:10,
			totalPage:0,
			deptCode:'',
			drugCode:''
		},
		columns:[
				{
					type: 'index',
					title: '序号',
					align: 'center',
					width:'80'
				},
				{ 
					title: '货位',
					key: 'locName',
					align: 'center',
					width:'200'
				},
				{ 
					title: '货位类型',
					key: 'positionTypeName',
					align: 'center',
					width:'150'
				},
				{ 
					title: '药品名称',
					key: 'ctmmTradeName',
					align: 'center',
					width:'100',
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
					width:'100',
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
					　　　　　　},params.row.ctmmManufacturerName),
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
					key: 'unit',
					width:'100',
					align: 'center'
				},
				{ 
					title: '生产批号',
					key: 'practicalBatch',
					width:'150',
					align: 'center'
				},
				{
					title: '生产日期',
					key: 'realProductTime',
					width:'100',
					align: 'center'
				},
				{
					title: '有效期至',
					key: 'validEndTime',
					width:'100',
					align: 'center'
				},
				{
					title: '包装规格',
					key: 'packageSpecification',
					width:'150',
					align: 'center'
				},
				{
					title: '剂型',
					key: 'ctmmDosageFormDesc',
					width:'100',
					align: 'center'
				},
				{
					title: '供应商',
					key: 'supplierName',
					align: 'center',
					width:'100',
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
					width:'100',
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
					title: '账面库存',
					key: 'accountStoreNum',
					align: 'center',
					width:'100'
				},
				{
					title: '实际库存',
					key: 'practicalRepertory',
					width:'100',
					align: 'center'
				},
				{
					title: '损益数量',
					key: 'checkNum',
					width:'100',
					align: 'center'
				},
				{
					title: '价格',
					key: 'referencePrice',
					width:'100',
					align: 'center'
				},
				{
					title: '实际损益金额',
					// key: 'excessiveMoney'
					width:'150',
					align: 'center',
					render: (h, params) => {
					　　return h('div',Number(params.row.referencePrice) * Number(params.row.checkNum))
					}
				},
				{
					title: '药品编码',
					key: 'hisDrugCode',
					width:'150',
					align: 'center'
				}
	                	],
	            }
	},
	methods: {
		// 头部
		async getExcessiveDetailUpListClick(){
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getExcessiveDetailUpList({'causticExcessiveNo':this.$router.history.current.query.id});
			this.spinShow = false;
			this.comlist=datalist.data;
			this.getExcessiveDetailListClick();
		},
		// 列表
		async getExcessiveDetailListClick(){
			this.druhList = [];
			this.page.checkBillNo = this.$router.history.current.query.pd;
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getExcessiveDetailList(this.page);
			this.spinShow = false;
			this.druhList=datalist.data.list;
			this.page.totalPage = datalist.data.count;
		},
	}, 
	created(){
		// console.log(this.$router.history.current.query.id);
		// 列表
		this.getExcessiveDetailUpListClick();
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
