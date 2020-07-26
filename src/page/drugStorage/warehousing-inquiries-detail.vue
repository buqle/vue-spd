<template>
	<div class="condition">   
	<Card dis-hover :bordered="false">
	            <p slot="title">
	                单据信息
	            </p>
	            <p slot="extra" class="btn-style">
	                <Button type="primary" icon="printer" @click="print()">打印</Button>
	            </p> 
	            <div> 
	                    <Row :gutter="30">
	                        <Col span="6">
	                          部门：{{comlist.deptName}}
	                        </Col>
	                        <Col span="6">
	                          入库分类：{{comlist.inStoreTypeName}}
	                        </Col>
	                        <Col span="6">
	                          供应商：{{comlist.ctmaSupplierName}}
	                        </Col>
	                    </Row>
	                    <Row :gutter="30" class="mt10"> 
	                        <Col span="6">
	                          入库单：{{comlist.inStoreCode}}
	                        </Col>
	                        <Col span="6">
	                          配送单/验收单号：{{comlist.distributeCode}}
	                        </Col>
	                        <Col span="6">
	                          订单：{{comlist.orderCode}}
	                        </Col>
	                    </Row>  
	                      <Row :gutter="30" class="mt10"> 
	                        <Col span="6">
	                          入库时间：{{comlist.createDate}}
	                        </Col>
	                        <Col span="6">
	                          上架时间：{{comlist.createDate}}
	                        </Col>
	                        <Col span="6">
	                          备注：{{comlist.remarks}}
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
	             loading:false,
	             goodsName:'',
	             goodsList:[],  
	             spinShow:false,
	             hisDrugCodeList:'',
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
					title: '剂型',
					key: 'ctmmDosageFormDesc',
					align: 'center'
				},
				{ 
					title: '包装规格',
					key: 'packageSpecification',
					align: 'center'
				},
				{ 
					title: '单位',
					key: 'replanUnit',
					align: 'center'
				},
				{	 
					title: '入库数量',
					key: 'inQuantity',
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
					title: '批准文号',
					key: 'approvalNo',
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
				}
	                	],
	            }
	},
	methods: {
		// 列表
		async instoreInfoList(){
			let item ={
				inStoreCode:this.$router.history.current.query.id,
				hisDrugCodeList:this.hisDrugCodeList
			}
			this.druhList = [];
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.instoreInfoList(item);
			this.spinShow = false;
			this.comlist=datalist.data;
			this.druhList=datalist.data.list;
			this.hisDrugCodeList = '';
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
					this.hisDrugCodeList = this.goodsList[i].bigDrugCode;
				}
			}
			this.instoreInfoList();
		},
	}, 
	created(){
		// console.log(this.$router.history.current.query.id);
		// 列表
		this.instoreInfoList();
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
