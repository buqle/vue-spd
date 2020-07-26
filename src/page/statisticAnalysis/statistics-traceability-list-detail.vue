<template>
	<div class="condition">   
	<Card dis-hover :bordered="false">
	            <p slot="title">
	                单据信息
	            </p>
	            <p slot="extra" class="btn-style">
	                <!-- <Button type="primary" icon="printer" @click="print()">打印</Button> -->
	            </p> 
	            <div> 
	                    <Row :gutter="30">
	                        <Col span="6">
	                          单号：{{comlist.backno}}
	                        </Col>
	                        <Col span="6">
	                          单据类型：{{comlist.ordertype}}
	                        </Col>
	                        <Col span="6">
	                          操作人：{{comlist.operationUserName}}
	                        </Col>
	                    </Row>
	                    <Row :gutter="30" class="mt10">
	                        <Col span="6">
	                          操作时间：{{comlist.backdate}}
	                        </Col>
	                        <Col span="6">
	                          部门：{{comlist.deptName}}
	                        </Col>
	                    </Row> 
	            </div>
	        </Card>
		<Table :columns="columns" :data="druhList"></Table> 
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>  
</template>
<script> 
import {route}  from '@/api/apiRoute';
export default {
	data () {
	            return { 
	            	url:`${route}/a/instoredetail/print/printInstoreDetail`,
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
					title: '药品名称',
					key: 'ctmmDesc',
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
					　　　　　　}, params.row.ctmmDesc),
					　　　　　　h('div', {
					　　　　　　　　slot: 'content',
					　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
					　　　　　　},params.row.ctmmDesc)
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
					title: '单位',
					key: 'unit',
					align: 'center'
				},
				{	 
					title: '操作前库存',
					key: 'beforOperationStock',
					align: 'center'
				},
				{	 
					title: '操作数量',
					key: 'operationNum',
					align: 'center'
				},
				{
					title: '操作后库存',
					key: 'afterOperationStock',
					align: 'center'
				},
				{
					title: '患者名称',
					key: 'patPatientName',
					align: 'center'
				},
				{	 
					title: '就诊卡号',
					key: 'patPatientId',
					align: 'center'
				}
	                	],
	            }
	},
	methods: {
		// 列表
		async getMedHisBackDetailListClick(){
			this.druhList = [];
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getMedHisBackDetailList({'backNo':this.$router.history.current.query.id});
			this.spinShow = false;
			this.comlist=datalist.data;
			this.druhList=datalist.data.getDetail;
		},
		// 打印
		async print(){
			window.open(`${this.url}?inStoreCode=${this.$router.history.current.query.id}`, '_blank');
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
		this.getMedHisBackDetailListClick();
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
