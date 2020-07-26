<template>
	<div class="condition">   
	<Card dis-hover :bordered="false">
	            <p slot="title">
	                单据信息
	            </p>
	            <p slot="extra" class="btn-style">
	                <Button type="primary" v-if="comlist.recallStatus =='1'" @click="pass()">审核</Button>
	                <Button type="primary" v-if="comlist.recallStatus =='1'" @click="reject()">驳回</Button>
	            </p> 
	            <div> 
	                    <Row :gutter="30">
	                        <Col span="6">
                        		  召回单：{{comlist.recallNo}}
	                        </Col>
	                        <Col span="6">
	                            状态：{{comlist.recallStatusName}}
	                        </Col>
	                        <Col span="6">
	                           发起人：{{comlist.createUserName}}
	                        </Col>
	                    </Row>
	                    <Row :gutter="30" class="mt10">
	                        <Col span="6">
	                           发起时间：{{comlist.createDate}}
	                        </Col>
	  		<Col span="6">
	                           审核人：{{comlist.updateUserName}}
	                        </Col>
	                        <Col span="6">
	                           审核时间：{{comlist.updateDate}}
	                        </Col>
	                    </Row>
	            </div>
	        </Card>
		<h3 class="f16 green-h3 mb10">产品信息</h3>
		<Table :columns="columns" :data="druhList"></Table>
		<Spin size="large" fix v-if="spinShow"></Spin>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="druhStorageListClick(false)" show-total show-elevator />
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
			recallNo:'',
		},
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
				}
	                	],
	            }
	},
	methods: {
		pass(){
			this.$Modal.confirm({
				title: '提示',
				content:'是否通过审核？',
				onOk: () => {
				 	this.batchThroughAuditListClick(); 
				},
			});
		},
		async batchThroughAuditListClick(){
			let detailList = [];
			let item = {  
				recallNo:this.$router.history.current.query.id,
			}
			detailList.push(item);
		 	this.spinShow=true;
			let datalist = await this.$api.druhStorage.batchThroughAuditList({'detailList':detailList});
			this.spinShow=false;
			this.$Message.success('审核通过成功!');
			this.$router.push({path: "/purchase/outStorage/recallAndLockedCheck"})
		},
		reject(){
			this.$Modal.confirm({
				title: '提示',
				content:'是否不通过审核？',
				onOk: () => {
				 	this.roomrecallRejectListClick(); 
				},
			});
		},
		async roomrecallRejectListClick(){
		 	this.spinShow=true;
			let datalist = await this.$api.druhStorage.roomrecallRejectList({'recallNo':this.$router.history.current.query.id});
			this.spinShow=false;
			this.$Message.success('驳回通过成功!');
			this.$router.push({path: "/purchase/outStorage/recallAndLockedCheck"})
		},
		// 列表
		async roomrecallGetDetailListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.druhList = [];
			this.page.recallNo = this.$router.history.current.query.id;
			// this.page.distributeCode = this.$router.history.current.query.id;
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.roomrecallGetDetailList(this.page);
			this.spinShow = false;
			this.comlist=datalist.data;
			this.druhList=datalist.data.roomReCallDetailVoList;
			this.page.totalPage = datalist.data.count;
		},
	}, 
	created(){
		// console.log(this.$router.history.current.query.id);
		// 列表
		this.roomrecallGetDetailListClick(false);
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
