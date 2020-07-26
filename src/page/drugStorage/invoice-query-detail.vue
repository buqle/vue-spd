<template>
	<div class="condition">   
	<Card dis-hover :bordered="false">
	            <p slot="title">
	                单据信息
	            </p>
	            <p slot="extra" class="btn-style">
	                <!-- <Button type="primary" icon="printer" @click="exportAsPrint()">导出execl</Button> -->
	                <!-- <Button type="primary" icon="printer" v-if="comlist.checkStatus == 3" @click="auditPassOrNoClick(1)">审核通过</Button> -->
	                <!-- <Button type="primary" icon="printer" v-if="comlist.checkStatus == 3" @click="auditPassOrNoClick(0)">不通过</Button> -->
	                <!-- <Button type="primary" icon="printer" v-if="comlist.checkStatus == 4" @click="print()">打印</Button> -->
	            </p> 
	            <div> 
	                   <Row :gutter="30">
	                        <Col span="6">
	                        供应商：{{comlist.supplierName}}
	                        </Col>
	                        <Col span="6">
	                          结算单号：{{comlist.settleBillNo}}
	                        </Col>
	                        <Col span="6">
	                          发票号码：{{comlist.invoiceNo}}
	                        </Col>
	                    </Row>
	                    <Row :gutter="30" class="mt10"> 
	                    	<Col span="6">
	                          发票代码：{{comlist.invoiceCode}}
	                        </Col>
	                        <Col span="6">
	                          发票日期：{{comlist.invoiceTime}}
	                        </Col>
	                        <Col span="6">
	                          发票金额(元)：{{comlist.invoiceAmount}}
	                        </Col>
	                    </Row>  
	                    <Row :gutter="30" class="mt10"> 
	                    	<Col span="6">
	                          结算单日期：{{comlist.settleDate}}
	                        </Col>
	                        <Col span="6">
	                          结算金额(元)：{{comlist.settleSumAmount}}
	                        </Col>
	                    </Row>
	            </div>
	        </Card>
		<Table :columns="columns" :data="druhList" style="width: 100%"></Table> 
		<Spin size="large" fix v-if="spinShow"></Spin>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getListByBillNoListClick(false)" show-total show-elevator />
	             </div>
	             
	</div>  
</template>
<script> 
import {route}  from '@/api/apiRoute';
export default {
	data () {
	            return { 
	            	url:`${route}/a/checkbill/print/checkBillShevePrint`,
	             comlist:'',
	             druhList:[],
	             loading:false,
	             goodsName:'',
	             goodsList:[], 
	             spinShow:false,
		page:{
			pageNo:1,
			pageSize:10,
			totalPage:0
		},
		columns:[
				{
					type: 'index',
					title: '序号',
					align: 'center',
					fixed: 'left'
				},
				{ 
					title: '药品名称',
					key: 'goodsName',
					align: 'center',
					fixed: 'left',
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
					　　　　　　}, params.row.goodsName),
					　　　　　　h('div', {
					　　　　　　　　slot: 'content',
					　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
					　　　　　　},params.row.goodsName)
					　　　　])
					　　])
					}
				},
				{ 
					title: '生产厂家',
					key: 'producerName',
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
					　　　　　　}, params.row.producerName),
					　　　　　　h('div', {
					　　　　　　　　slot: 'content',
					　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
					　　　　　　},params.row.producerName)
					　　　　])
					　　])
					}
				},
				{ 
					title: '包装规格',
					key: 'packageSpecification',
					align: 'center'
				},
				{	 
					title: '批准文号',
					key: 'registKey',
					align: 'center'
				},
				{
					title: '结算数量',
					key: 'settleQty',
					align: 'center'
				},
				{
					title: '结算价格',
					key: 'settlePrice',
					align: 'center'
				},
				{
					title: '结算金额',
					key: 'settleAmount',
					align: 'center'
				},
				{
					title: '药品编码',
					key: 'goodsCode',
					align: 'center'
				}
	                	], 
	            }
	},
	methods: {
		// 列表
		async invoiceDetailListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.druhList = [];
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.invoiceDetailList({'invoiceNo':this.$router.history.current.query.id});
			this.spinShow = false;
			this.comlist=datalist.data;
			this.druhList=datalist.data.billdetaillist;
			this.page.totalPage = datalist.data.count;
		},
		// 打印
		async print(){
			window.open(`${this.url}?checkBillNo=${this.$router.history.current.query.id}`, '_blank');
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
		// 列表
		this.invoiceDetailListClick(false);
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
