<template>
	<div class="condition">   
	<Card dis-hover :bordered="false">
	            <p slot="title">
	                单据信息
	            </p>
	            <p slot="extra" class="btn-style">
	                <!-- <Button type="primary" icon="printer" @click="exportAsPrint()">导出execl</Button> -->
	                <Button type="primary" @click="to()" v-if="comlist.status == '2' || comlist.status == '3' || comlist.status == '4'">下一步复核</Button>
	                <Button type="primary" @click="confirm()" v-if="comlist.status == '1' || comlist.status == '2' || comlist.status == '9'">确认拣货</Button>
	                <Button type="primary" @click="print()">打印</Button>
	            </p> 
	            <div> 
	                    <Row :gutter="30">
	                        <Col span="6">
	                          拣货单：{{comlist.pickingOredr}}
	                        </Col>
	                        <Col span="6">
	                          类型：{{comlist.typeName}}
	                        </Col>
	                        <Col span="6">
	                          单号：{{comlist.applyOrder}}
	                        </Col>
	                    </Row>
	                    <Row :gutter="30" class="mt10"> 
	                        <Col span="6">
	                          申领部门：{{comlist.applyDeptName}}
	                        </Col>
	                        <Col span="6">
	                          状态：{{comlist.statusName}}
	                        </Col>
	                        <Col span="6">
	                          拣货时间：{{comlist.pickingTime}}
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
		<h3 class="f16 green-h3 mb10">产品信息</h3>
		<Tabs v-model="nameSh" :animated="false" @on-click="handleTab">
		<TabPane label="待拣货" name="0" class="mb10">
			<Table :columns="columns1" :data="druhList1"  @on-selection-change="handleSelectionChange"></Table>
			<Spin size="large" fix v-if="spinShow"></Spin>
		             <div class="r mt15">
		             	<Page :total="page1.totalPage" :page-size="page1.pageSize" :current.sync="page1.pageNo" @on-change="pickingDrderdetailListClick(false)" show-total show-elevator />
		             </div>
		</TabPane>
		<TabPane label="已拣货" name="1" class="mb10">
			<Table :columns="columns" :data="druhList"></Table> 
			<Spin size="large" fix v-if="spinShow"></Spin>
		             <div class="r mt15">
		             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="pickingDrderdetailListClick(false)" show-total show-elevator />
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
	            	url:`${route}/a/pickingDetail/print/printDetail`,
	             comlist:'',
	             druhList:[],
	             druhList1:[],
	             loading:false,
	             goodsName:'',
	             goodsList:[],
	             goodsSumList:[],
	             nameSh:'',
	             spinShow:false,
		page:{
			pageNo:1,
			pageSize:10,
			totalPage:0,
			pickingOrderNo:'',
			pickingStatus:'',
			hisDrugCodeList:''
		},
		page1:{
			pageNo:1,
			pageSize:10,
			totalPage:0,
			pickingOrderNo:'',
			pickingStatus:'',
			hisDrugCodeList:''
		},
		columns1:[
				{
			                        type: 'selection',
			                        align: 'center',
			                        width:'60'
			             },
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
					title: '单位',
					key: 'replanUnit',
					align: 'center'
				},
				{	 
					title: '指示货位',
					key: 'locName',
					align: 'center',
				},
				{
					title: '配货数量',
					key: 'allocationNum',
					align: 'center',
				},
				{
					title: '实际拣货数量',
					// key: 'pickingNum',
					align: 'center',
					 render: (h, params) => {
					 		return h('InputNumber', {
						                    props: {
						                    	min:1,
						                    	max:this.druhList1[params.index].allocationNum,
						                          type: 'text',
						                          value: this.druhList1[params.index].allocationNum,
						                          editable:true
						                    },
						                    on: {  
									'on-change':(event)=>{
										if(event > this.druhList1[params.index].allocationNum){
							                      			this.$Message.error('实际拣货数量不能大于配货数量!');
							                      		}else{
							                      			this.druhList1[params.index].pickingNum = event;
							                      		}
							                    	}
								},
						                });
					}
				},
	                	],
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
					title: '单位',
					key: 'replanUnit',
					align: 'center'
				},
				{	 
					title: '指示货位',
					key: 'locName',
					align: 'center',
				},
				{
					title: '配货数量',
					key: 'allocationNum',
					align: 'center',
				},
				{
					title: '实际拣货数量',
					key: 'pickingNum',
					align: 'center'
				},
	                	],
	            }
	},
	methods: {
		to(){
			this.$router.push({path: "/drugStorage/outStorage/outReceiptMgt/details", query:{id:this.comlist.backNo,state:1}})
		},
		handleTab(name){
			this.page.pickingStatus = name;
		},
		handleSelectionChange(selection) {
			this.goodsSumList = [];
			for (let i = 0; i < selection.length; i++) {
				let item = {
					id:selection[i].id,
					drugCode:selection[i].drugCode,
					pickingNum:selection[i].pickingNum
				}
				this.goodsSumList.push(item);
			}
			console.log(this.goodsSumList);
		},
		confirm(){
			this.$Modal.confirm({
				title: '提示',
				content:'是否确认确认拣货？',
				onOk: () => {
				 	this.finishPickingClick(); 
				},
			});
		},
		async finishPickingClick(){
			let item = {
				applyNo:null,
				pickingDetail:this.goodsSumList,
				pickingOrderNo:this.$router.history.current.query.id,
			}
			console.log(item);
		 	this.modal=true;
			let datalist = await this.$api.druhStorage.finishPickingList(item);
			this.modal=false;
			this.getPickingDetailPadListClick();
		},
		//  头部 明细
		async getPickingDetailPadListClick(){
			let datalist = await this.$api.druhStorage.getPickingDetailPadList({'pickingOrderNo':this.$router.history.current.query.id}); 
			this.comlist=datalist.data; 
			if(this.comlist.status == '1' || this.comlist.status == '9'){
				this.nameSh = '0';
			}else{
				this.nameSh = '1';
			}
			// 列表
			this.pickingDrderdetailListClick(false);
		},
		// 列表
		async pickingDrderdetailListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.druhList = [];
			this.page.pickingOrderNo = this.$router.history.current.query.id;
			this.page.pickingStatus = this.nameSh;
			// this.page.distributeCode = this.$router.history.current.query.id;
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.pickingDrderdetailList(this.page);
			this.spinShow = false;
			for (var i = 0; i < datalist.data.list.length; i++) {
				datalist.data.list[i].pickingNum = datalist.data.list[i].allocationNum;
			}
			if(this.comlist.status == '1' || this.comlist.status == '9'){
				this.druhList1 = datalist.data.list;
				this.page1.totalPage = datalist.data.count;
			}else{
				this.druhList = datalist.data.list;
				this.page.totalPage = datalist.data.count;
			}
			
			this.page.hisDrugCodeList = '';
		},
		// 打印
		async print(){
			window.open(`${this.url}?pickingOrderNo=${this.$router.history.current.query.id}`, '_blank');
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
			this.pickingDrderdetailListClick(false);
		},
	}, 
	created(){
		// console.log(this.$router.history.current.query.id);
		// 明细
		this.getPickingDetailPadListClick();
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
