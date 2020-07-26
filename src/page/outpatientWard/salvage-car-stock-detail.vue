<template>
	<div class="condition">   
	<Card dis-hover :bordered="false">
	            <p slot="title">
	                单据信息
	            </p>
	            <p slot="extra" class="btn-style">
	                <!-- <Button type="primary" icon="printer" @click="exportAsPrint()">导出execl</Button> -->
	                <!-- <Button type="primary" icon="printer" v-if="comlist.checkStatus == 4" @click="handlerProfitAndLossListClick()">一键处理损益</Button> -->
	                <!-- <Button type="primary" icon="printer" v-if="comlist.checkStatus > 4" @click="print()">打印</Button> -->
	            </p> 
	            <div> 
	                    <Row :gutter="30">
	                        <Col span="6">
	                          通用名：{{comlist.genericName}}
	                        </Col>
	                        <Col span="6">
	                          商品名：{{comlist.tradeName}}
	                        </Col>
	                        <Col span="6">
	                           规格：{{comlist.specification}}
	                        </Col>
	                    </Row>
	                    <Row :gutter="30" class="mt10"> 
	                    	<Col span="6">
	                            剂型：{{comlist.dosageDesc}}
	                        </Col>
	                        <Col span="6">
	                            包装规格：{{comlist.packageSpecification}}
	                        </Col>
	                        <Col span="6">
	                            生产厂家：{{comlist.manufactureName}}
	                        </Col>
	                    </Row>  
	                    <Row :gutter="30" class="mt10"> 
	                    	<Col span="6">
	                            批准文号：{{comlist.approvalNo}}
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
// import {route}  from '@/api/apiRoute';
export default {
	data () {
	            return {  
	             comlist:'',
	             druhList:[],
	             loading:false,
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
					title: '供应商',
					key: 'supplierName',
					align: 'center',
					width:'150',
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
		//  头部 明细
		async getRescuecarMedicineDetailClick(){
			let datalist = await this.$api.druhStorage.getRescuecarMedicineDetail({'bigDrugCode':this.$router.history.current.query.bigDrugCode}); 
			this.comlist = datalist.data; 
		},
		// 列表
		async getRescuecarMedicineDetailListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.druhList = [];
			this.page.drugCode = this.$router.history.current.query.drugCode;
			this.page.deptCode = this.$router.history.current.query.deptCode;
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getRescuecarMedicineDetailList(this.page);
			this.spinShow = false;
			this.druhList=datalist.data.list;
			this.page.totalPage = datalist.data.count;
			this.page.hisDrugCodeList = [];
		},
		// // 打印
		// async print(){
		// 	window.open(`${this.url}?checkBillNo=${this.$router.history.current.query.id}`, '_blank');
		// },
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
		this.getRescuecarMedicineDetailListClick(false);
		// 明细
		this.getRescuecarMedicineDetailClick();
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
