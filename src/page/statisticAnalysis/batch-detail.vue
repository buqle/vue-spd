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
	                          剂型：{{comlist.ctmmDosageFormDesc}}
	                        </Col>
	                        <Col span="6">
	                          包装规格：{{comlist.packageSpecification}}
	                        </Col>
	                        <Col span="6">
	                          生产厂家：{{comlist.ctmmManufacturerName}}
	                        </Col>
	                    </Row>
	                     <Row :gutter="30" class="mt10"> 
	                        <Col span="6">
	                          批号：{{comlist.lot}}
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
		<TabPane label="非发药消耗" name="4" class="mb10">
			<Table :columns="columns4" :data="druhList"></Table> 
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
					key: 'deptName',
					align: 'center'
				},
				{
					title: '货位',
					key: 'positionName',
					align: 'center'
				},
				{
					title: '货位类型',
					key: 'positionTypeName',
					align: 'center'
				},
				{	 
					title: '数量',
					key: 'storeNum',
					align: 'center'
				},
				{ 
					title: '单位',
					key: 'unit',
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
					title: '供应商',
					key: 'supplierName',
					align: 'center'
				},
				{
					title: '采购订单',
					key: 'planBillNo',
					align: 'center'
				},
				{
					title: '采购时间',
					key: 'planDate',
					align: 'center'
				},
				{	 
					title: '采购人',
					key: 'planUserName',
					align: 'center'
				},
				{ 
					title: '验收单号',
					key: 'checkBillNo',
					align: 'center'
				},
				{
					title: '验收时间',
					key: 'checkDate',
					align: 'center'
				},
				{	 
					title: '验收数量',
					key: 'checkNum',
					align: 'center'
				},
				{ 
					title: '验收人',
					key: 'checkUserName',
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
					key: 'deptName',
					align: 'center'
				},
				{
					title: '操作类型',
					key: 'typeName',
					align: 'center'
				},
				{
					title: '操作时间',
					key: 'time',
					align: 'center'
				},
				{	 
					title: '操作人',
					key: 'userName',
					align: 'center'
				},
				{ 
					title: '单据编号',
					key: 'billNo',
					align: 'center'
				},
				{
					title: '操作数量',
					key: 'num',
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
					key: 'deptName',
					align: 'center',
					width:'120'
				},
				{
					title: '发药时间',
					key: 'dispensingDate',
					align: 'center'
				},
				{
					title: '发药单号',
					key: 'dispensingBillNo',
					align: 'center'
				},
				{	 
					title: '发药单位',
					key: 'dispensingUnit',
					align: 'center'
				},
				{ 
					title: '发药数量',
					key: 'dispensingNum',
					align: 'center'
				},
				{
					title: '患者姓名',
					key: 'sickUserName',
					align: 'center'
				},
				{	 
					title: '就诊卡号',
					key: 'cardNo',
					align: 'center'
				}
	                	],	
	             columns4:[
				{
					type: 'index',
					title: '序号',
					align: 'center'
				},
				{ 
					title: '消耗部门',
					key: 'deptName',
					align: 'center'
				},
				{
					title: '消耗时间',
					key: 'makeUpDate',
					align: 'center'
				},
				{
					title: '发药单位',
					key: 'makeUpUnit',
					align: 'center'
				},
				{ 
					title: '发药数量',
					key: 'makeUpNum',
					align: 'center'
				},
				{
					title: '消耗方式',
					key: 'makeUpTypeName',
					align: 'center'
				}
	                	],
	            }
	},
	methods: {
		handleTab(name){
			if(name == 0){
				// 当前库存
				this.outStoreDetailListClick();
			}else if(name == 1){
				// 采购/验收记录
				this.getPlanAndCheckListClick();
			}else if(name == 2){
				// 院内流通记录
				this.medCirculateListClick();
			}else if(name == 3){
				// 发药记录
				this.getDispensingListClick();
			}else{
				// 非发药消耗
				this.getMakeUpListClick();
			}
		},
		//  头部 明细
		async getDrugInfoListClick(){
			let item = {
				bigDrugCode:this.$router.history.current.query.bigDrugCode,
				drugCode:this.$router.history.current.query.drugCode,
				hisDrugCode:this.$router.history.current.query.hisDrugCode,
				lot:this.$router.history.current.query.lot
			}
			let datalist = await this.$api.druhStorage.getDrugInfoList(item); 
			this.comlist=datalist.data;
			// 列表
			this.getStoreTraceListClick(false);
		},
		// 列表 当前库存
		async getStoreTraceListClick(){
			this.druhList = [];
			let item = {
				bigDrugCode:this.$router.history.current.query.bigDrugCode,
				drugCode:this.$router.history.current.query.drugCode,
				hisDrugCode:this.$router.history.current.query.hisDrugCode,
				lot:this.$router.history.current.query.lot
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getStoreTraceList(item);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList = datalist.data;
			}
		},
		// 列表 采购/验收记录
		async getPlanAndCheckListClick(){
			this.druhList = [];
			let item = {
				bigDrugCode:this.$router.history.current.query.bigDrugCode,
				drugCode:this.$router.history.current.query.drugCode,
				hisDrugCode:this.$router.history.current.query.hisDrugCode,
				lot:this.$router.history.current.query.lot
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getPlanAndCheckList(item);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList = datalist.data;
			}
		},
		// 列表 院内流通记录
		async medCirculateListClick(){
			this.druhList = [];
			let item = {
				bigDrugCode:this.$router.history.current.query.bigDrugCode,
				drugCode:this.$router.history.current.query.drugCode,
				hisDrugCode:this.$router.history.current.query.hisDrugCode,
				lot:this.$router.history.current.query.lot
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.medCirculateList(item);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList = datalist.data;
			}
		},
		// 列表 发药记录
		async getDispensingListClick(){
			this.druhList = [];
			let item = {
				bigDrugCode:this.$router.history.current.query.bigDrugCode,
				drugCode:this.$router.history.current.query.drugCode,
				hisDrugCode:this.$router.history.current.query.hisDrugCode,
				lot:this.$router.history.current.query.lot
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getDispensingList(item);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList = datalist.data;
			}
		},
		// 列表 非发药消耗
		async getMakeUpListClick(){
			this.druhList = [];
			let item = {
				bigDrugCode:this.$router.history.current.query.bigDrugCode,
				drugCode:this.$router.history.current.query.drugCode,
				hisDrugCode:this.$router.history.current.query.hisDrugCode,
				lot:this.$router.history.current.query.lot
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getMakeUpList(item);
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
		// console.log(this.$router.history.current.query.id);
		// 头部
		this.getDrugInfoListClick();
		
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
