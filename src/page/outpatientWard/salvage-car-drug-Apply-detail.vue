<template>
	<div class="condition">   
	<Card dis-hover :bordered="false">
	            <p slot="title">
	                单据信息
	            </p>
	            <p slot="extra" class="btn-style">
	                <!-- <Button type="primary" @click="exportAsPrint()">导出execl</Button> -->
	                <!-- <Button type="primary" @click="print()">打印</Button> -->
	            </p> 
	            <div> 
	                    <Row :gutter="30">
	                        <Col span="6">
	                        申领单：{{comlist.applyCode}}
	                        </Col>
	                        <Col span="6">
	                           状态：{{comlist.applyStatusName}}
	                        </Col>
	                        <Col span="6">
	                           申领部门：{{comlist.applyDeptName}}
	                        </Col>
	                    </Row>
	                    <Row :gutter="30" class="mt10">
	                        <Col span="6">
	                           入库人：{{comlist.createUserName}}
	                        </Col>
	                        <Col span="6">
	                           发起时间：{{comlist.createDate}}
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
	             loading:false,
	             goodsName:'',
	             goodsList:[],
	             druhList:[],
	             spinShow:false,
		page:{
			hisDrugCodeList:'',
			applyCode:''
		},
		columns:[
				{
					type: 'index',
					title: '序号',
					align: 'center'
				},
				{	 
					title: '申领数量',
					key: 'applyNum',
					align: 'center'
				},
				{	 
					title: '单位',
					key: 'replanUnit',
					align: 'center'
				},
				{ 
					title: '通用名称',
					key: 'ctmmGenericName',
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
					　　　　　　}, params.row.ctmmGenericName),
					　　　　　　h('div', {
					　　　　　　　　slot: 'content',
					　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
					　　　　　　},params.row.ctmmGenericName)
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
					title: '商品名称',
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
		async rescuecarapplyQueryDrugListClick(){
			this.druhList = [];
			this.page.applyCode = this.$router.history.current.query.id;
			// this.page.distributeCode = this.$router.history.current.query.id;
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.rescuecarapplyDetailList(this.page);
			this.spinShow = false;
			this.comlist=datalist.data;
			this.druhList=datalist.data.detailList;
			this.page.hisDrugCodeList = '';
		},
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
			this.rescuecarapplyQueryDrugListClick();
		},
		// 打印
		async print(){
			window.open(`${this.url}?backNo=${this.$router.history.current.query.id}`, '_blank');
		},
		// 导出
		async exportAsPrint(){
        			let datalist = await this.$api.druhStorage.backExportList({'backNo':this.$router.history.current.query.id});
			let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
			let fileName = `${this.getCurrentDate()}退货计划.xls`;
			let objectUrl = URL.createObjectURL(blob); 
			const link = document.createElement('a')
			link.download = fileName;
			link.href = objectUrl;
			link.click();

			// let objectUrl = URL.createObjectURL(blob); 
			// // window.location.href = objectUrl;
			// window.open(objectUrl);
		},
	}, 
	created(){
		// console.log(this.$router.history.current.query.id);
		// 列表
		this.rescuecarapplyQueryDrugListClick();
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
