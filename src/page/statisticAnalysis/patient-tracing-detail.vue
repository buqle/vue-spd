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
	                          商品名称：{{comlist.drugname}}
	                        </Col>
	                        <Col span="6">
	                          规格：{{comlist.specification}}
	                        </Col>
	                        <Col span="6">
	                          包装规格：{{comlist.specification}}
	                        </Col>
	                    </Row>
	                    <Row :gutter="30" class="mt10"> 
	                        <Col span="6">
	                          生产厂家：{{comlist.ctmmmanufacturername}}
	                        </Col>
	                        <Col span="6">
	                          批号：{{comlist.batch}}
	                        </Col>
	                    </Row>
	            </div>
	        </Card>
		<h3 class="f16 green-h3 mb10">产品信息</h3>
		<Tabs v-model="nameSh" :animated="false" @on-click="handleTab">
		<TabPane label="当前库存" name="0" class="mb10">
			<Table :columns="columns" :data="druhList"></Table>
			<Spin size="large" fix v-if="spinShow"></Spin>
		</TabPane>
		<TabPane label="采购/验收记录" name="1" class="mb10">
			<Table :columns="columns1" :data="druhList"></Table> 
			<Spin size="large" fix v-if="spinShow"></Spin>
		</TabPane>
		<TabPane label="院内流通记录" name="2" class="mb10">
			<Table :columns="columns2" :data="druhList"></Table> 
			<Spin size="large" fix v-if="spinShow"></Spin>
		</TabPane>
		<TabPane label="发药记录" name="3" class="mb10">
			<Table :columns="columns3" :data="druhList"></Table> 
			<Spin size="large" fix v-if="spinShow"></Spin>
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
	             nameSh:'',
	             spinShow:false,
		columns:[
				{
					type: 'index',
					title: '序号',
					align: 'center'
				},
				{ 
					title: '所在部门',
					key: 'deptname',
					align: 'center'
				},
				{
					title: '货位',
					key: 'positionname',
					align: 'center'
				},
				{
					title: '货位类型',
					key: 'positiontype',
					align: 'center'
				},
				{
					title: '数量',
					key: 'totalquantity',
					align: 'center'
				},
				{
					title: '单位',
					key: 'unit',
					align: 'center'
				}
	                	],
	             columns1:[
				{
					type: 'index',
					title: '序号',
					align: 'center'
				},
				{ 
					title: '供应商',
					key: 'ctmasuppliername',
					align: 'center'
				},
				{
					title: '采购订单',
					key: 'ordercode',
					align: 'center'
				},
				{
					title: '采购时间',
					key: 'orderdate',
					align: 'center',
					// 处理时间
			                          render: (h, params) => {
						return h("div",this.$moment(params.row.orderdate).format('YYYY-MM-DD'))
					}
				},
				{	 
					title: '采购人',
					key: 'orderusername',
					align: 'center'
				},
				{
					title: '验收时间',
					key: 'receptiontime',
					align: 'center',
					// 处理时间
			                          render: (h, params) => {
						return h("div",this.$moment(params.row.receptiontime).format('YYYY-MM-DD'))
					}
				},
				{	 
					title: '验收数量',
					key: 'realreceivequantiry',
					align: 'center'
				},
				{ 
					title: '验收人',
					key: 'receptionusername',
					align: 'center'
				}
	                	],
	             columns2:[
				{
					type: 'index',
					title: '序号',
					align: 'center'
				},
				{ 
					title: '操作部门',
					key: 'deptname',
					align: 'center'
				},
				{
					title: '操作类型',
					key: 'storetype',
					align: 'center'
				},
				{
					title: '操作时间',
					key: 'createdate',
					align: 'center'
				},
				{	 
					title: '操作人',
					key: 'username',
					align: 'center'
				},
				{ 
					title: '单据编号',
					key: 'storecode',
					align: 'center'
				},
				{
					title: '操作数量',
					key: 'storenum',
					align: 'center'
				},
				{	 
					title: '单位',
					key: 'unit',
					align: 'center'
				}
	                	],
	             columns3:[
				{
					type: 'index',
					title: '序号',
					align: 'center',
					width:'80'
				},
				{ 
					title: '发药部门',
					key: 'deptname',
					align: 'center',
					width:'120'
				},
				{
					title: '发药时间',
					key: 'dispensingdate',
					align: 'center'
				},
				{
					title: '发药单号',
					key: 'dispensingno',
					align: 'center'
				},
				{	 
					title: '发药单位',
					key: 'unit',
					align: 'center'
				},
				{ 
					title: '发药数量',
					key: 'quantity',
					align: 'center'
				},
				{
					title: '患者姓名',
					key: 'patpatientname',
					align: 'center'
				},
				{	 
					title: '就诊卡号',
					key: 'patpatientid',
					align: 'center'
				}
	                	]
	            }
	},
	methods: {
		handleTab(name){
			if(name == 0){
				// 当前库存
				this.getMedStoreDetailListClick();
			}else if(name == 1){
				// 采购/验收记录
				this.getmMedCommonCheckacceptDetailListClick();
			}else if(name == 2){
				// 院内流通记录
				this.getMedCommonStoreFlowListClick();
			}else{
				// 发药记录
				this.medHisDispensingDetailListClick();
			}
		},
		// 列表 当前库存
		async getMedStoreDetailListClick(){
			this.druhList = [];
			let item = {
				batch:this.$router.history.current.query.batch,
				drugcode:this.$router.history.current.query.drugcode
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getMedStoreDetailList(item);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList = datalist.data;
				for (let i = 0; i < this.druhList.length; i++) {
					 if(this.druhList[i].positiontype == 1){
					 	this.druhList[i].positiontype = '补货指示货位';
					 }else if(this.druhList[i].positiontype == 2){
					 	this.druhList[i].positiontype = '拆零发药货位';
					 }else if(this.druhList[i].positiontype == 3){
					 	this.druhList[i].positiontype = '预拆零发药';
					 }else if(this.druhList[i].positiontype == 4){
					 	this.druhList[i].positiontype = '发药机货位';
					 }else if(this.druhList[i].positiontype == 5){
					 	this.druhList[i].positiontype = '基数药货位';
					 }else{
					 	this.druhList[i].positiontype = '抢救车货位';
					 }
				}
			}
		},
		// 列表 采购/验收记录
		async getmMedCommonCheckacceptDetailListClick(){
			this.druhList = [];
			let item = {
				batch:this.$router.history.current.query.batch,
				drugcode:this.$router.history.current.query.drugcode
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getmMedCommonCheckacceptDetailList(item);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList = datalist.data;
			}
		},
		// 列表 院内流通记录
		async getMedCommonStoreFlowListClick(){
			this.druhList = [];
			let item = {
				batch:this.$router.history.current.query.batch,
				drugcode:this.$router.history.current.query.drugcode
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getMedCommonStoreFlowList(item);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList = datalist.data;
			}
		},
		// 列表 发药记录
		async medHisDispensingDetailListClick(){
			this.druhList = [];
			let item = {
				batch:this.$router.history.current.query.batch,
				drugcode:this.$router.history.current.query.drugcode
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.medHisDispensingDetailList(item);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList = datalist.data;
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
		this.comlist = this.$router.history.current.query;
		// console.log(this.$router.history.current.query);
		// 头部
		this.handleTab(0);
		
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
