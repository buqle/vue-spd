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
                        		 药品名称：{{comlist.tradeName}}
	                        </Col>
	                        <Col span="6">
	                          剂型：{{comlist.dosageDesc}}
	                        </Col>
	                        <Col span="6">
	                          包装规格：{{comlist.packageSpecification}}
	                        </Col>
	                    </Row>
	                    <Row :gutter="30" class="mt10">
	                        <Col span="6">
	                          生产厂家：{{comlist.manufactureName}}
	                        </Col>
	  		<Col span="6">
	                          批准文号：{{comlist.approvalNo}}
	                        </Col>
	                    </Row>
	            </div>
	        </Card>
		<h3 class="f16 green-h3 mb10">库存信息</h3>
		<Table :columns="columns" :data="druhList"></Table>
		<Spin size="large" fix v-if="spinShow"></Spin>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getRoomRepertoryListClick()" show-total show-elevator />
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
					title: '货位',
					key: 'storeLocName',
					align: 'center'
				},
				{
					title: '货位类型',
					key: 'storeType',
					align: 'center'
				},
				{
					title: '单位',
					key: 'unit',
					align: 'center'
				},
				{ 
					title: '数量',
					key: 'totalQuantity',
					align: 'center'
				},
				{
					title: '锁定区库存',
					key: 'vacuumNum',
					align: 'center'
				},
				{
					title: '采购方式',
					key: 'purchaseType',
					align: 'center'
				},
				{
					title: '单价',
					key: 'price',
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
				}
	                	],
	            }
	},
	methods: {
		// 列表
		async getRoomRepertoryDetailListClick(){
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getRoomRepertoryDetailList({'hisDrugCode':this.$router.history.current.query.hisDrugCode});
			this.spinShow = false;
			this.comlist=datalist.data;
			this.getRoomRepertoryListClick();
		},
		// 列表
		async getRoomRepertoryListClick(){
			this.druhList = [];
			this.page.drugCode = this.$router.history.current.query.drugCode;
			this.page.deptCode = this.$router.history.current.query.deptCode;
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getRoomRepertoryList(this.page);
			this.spinShow = false;
			this.druhList=datalist.data.list;
			this.page.totalPage = datalist.data.count;
		},
	}, 
	created(){
		// console.log(this.$router.history.current.query.id);
		// 列表
		this.getRoomRepertoryDetailListClick();
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
