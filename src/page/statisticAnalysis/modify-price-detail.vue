<template>
	<div class="condition">   
	<Card dis-hover :bordered="false">
	            <p slot="title">
	                单据信息
	            </p>
	            <p slot="extra" class="btn-style">
	                <!-- <Button type="primary" icon="printer" @click="exportAsPrint()">导出execl</Button> -->
	                <!-- <Button type="primary" @click="print()">打印</Button> -->
	            </p> 
	            <div> 
	                    <Row :gutter="30">
	                        <Col span="6">
	                          通用名：{{comlist.ctmmGenericName}}
	                        </Col>
	                        <Col span="6">
	                          药品名称：{{comlist.ctmmTradeName}}
	                        </Col>
	                        <Col span="6">
	                          规格：{{comlist.ctmmSpecification}}
	                        </Col>
	                    </Row>
	                    <Row :gutter="30" class="mt10"> 
	                        <Col span="6">
	                          剂型：{{comlist.approvalNo}}
	                        </Col>
	                        <Col span="6">
	                          包装规格：{{comlist.ctmmDosageFormDesc}}
	                        </Col>
	                        <Col span="6">
	                          生产厂家：{{comlist.ctmmManufacturerName}}
	                        </Col>
	                    </Row>
	                     <Row :gutter="30" class="mt10"> 
	                        <Col span="6">
	                          批准文号：{{comlist.packageSpecification}}
	                        </Col>
	                    </Row>
	            </div>
	        </Card>
		<h3 class="f16 green-h3 mb10">调价基本信息</h3>
		<Table :columns="columns" :data="druhList" style="width: 100%"></Table>
		<Spin size="large" fix v-if="spinShow"></Spin>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getPriceStaticDetailListClick()" show-total show-elevator />
	             </div>
	             
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
	             spinShow:false,
		columns:[
				{
					type: 'index',
					title: '序号',
					align: 'center'
				},
				{ 
					title: '部门',
					key: 'deptName',
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
					key: 'locName',
					align: 'center'
				},
				{
					title: '货位类型',
					key: 'locTypeName',
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
					title: '供应商',
					key: 'supplierName',
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
	                	page:{
				pageNo:1,
				pageSize:10,
				totalPage:0,
				updatePriceId:'',
			},
	            }
	},
	methods: {
		//  头部 明细
		async getPriceStaticUpListClick(){
			let datalist = await this.$api.druhStorage.getPriceStaticUpList({'id':this.$router.history.current.query.id}); 
			this.comlist=datalist.data;
			// 列表
			this.getPriceStaticDetailListClick();
		},
		// 列表 明细
		async getPriceStaticDetailListClick(){
			this.druhList = [];
			this.page.updatePriceId = this.$router.history.current.query.id;
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getPriceStaticDetailList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList = datalist.data.list;
				this.page.totalPage = datalist.data.count;
			}
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
	}, 
	created(){
		// console.log(this.$router.history.current.query.id);
		// 头部
		this.getPriceStaticUpListClick();
		
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
