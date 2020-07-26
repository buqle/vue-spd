<template>
	<div class="condition">   
	<Card dis-hover :bordered="false">
	            <p slot="title">
	                单据信息
	            </p>
	            <p slot="extra" class="btn-style">
	                <Button type="primary" v-if="comlist.backStatus == 0" @click="passClick(1)">通过</Button>
	                <Button type="primary" v-if="comlist.backStatus == 0" @click="passClick(2)">驳回</Button>
	            </p> 
	            <div> 
	                    <Row :gutter="30">
	                        <Col span="6">
	                        退货单：{{comlist.backNo}}
	                        </Col>
	                        <Col span="6">
	                            状态：{{comlist.backStatusName}}
	                        </Col>
	                        <Col span="6">
	                           来源部门：{{comlist.backDpetName}}
	                        </Col>
	                    </Row>
	                    <Row :gutter="30" class="mt10">
	                        <Col span="6">
	                           退货人：{{comlist.createUserName}}
	                        </Col>
	  		<Col span="6">
	                           退货时间：{{comlist.createDate}}
	                        </Col>
	                        <Col span="6">
	                           供应商：{{comlist.supplierName}}
	                        </Col>
	                    </Row> 
	                    <Row :gutter="30" class="mt10">
	                        <Col span="6">
	                            审核人：{{comlist.reviewUserName}}
	                        </Col>
	  		<Col span="6">
	                           审核时间：{{comlist.reviewDate}}
	                        </Col>
	                    </Row> 
	            </div>
	        </Card>
	            <!-- <div class="condition-row mb15">  
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
		</div> -->
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
	             druhList:[],
	             loading:false,
	             goodsName:'',
	             goodsList:[],
	             spinShow:false,
		page:{
			pageNo:1,
			pageSize:10,
			totalPage:0,
			backNo:'',
			hisDrugCodeList:''
		},
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
					title: '入库单号',
					key: 'inStoreCode',
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
					title: '出库数量',
					key: 'backNum',
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
					title: '批准文号',
					key: 'approvalNo',
					align: 'center'
				}
	                	],
	            }
	},
	methods: {
		// 列表
		async passClick(flag){
			let goods = [];
			let item = {
				backNo:this.$router.history.current.query.id
			}
			goods.push(item); 
			// this.page.distributeCode = this.$router.history.current.query.id;
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.depotBackSubmitList({'backdetailList':goods,'type':flag});
			this.spinShow = false;
			this.backInfoListClick();
		},
		// 列表
		async backInfoListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.druhList = [];
			this.page.backNo = this.$router.history.current.query.id;
			// this.page.distributeCode = this.$router.history.current.query.id;
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.backInfoList(this.page);
			this.spinShow = false;
			this.comlist=datalist.data;
			this.druhList=datalist.data.list;
			this.page.totalPage = datalist.data.count;
			this.page.hisDrugCodeList = '';
		},
		// // 打印
		// async print(){
		// 	window.open(`${this.url}?backNo=${this.$router.history.current.query.id}`, '_blank');
		// },
		// // 导出
		// async exportAsPrint(){
  		//  	let datalist = await this.$api.druhStorage.backExportList({'backNo':this.$router.history.current.query.id});
		// 	let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
		// 	let fileName = `${this.getCurrentDate()}退货计划.xls`;
		// 	let objectUrl = URL.createObjectURL(blob); 
		// 	const link = document.createElement('a')
		// 	link.download = fileName;
		// 	link.href = objectUrl;
		// 	link.click();

		// 	// let objectUrl = URL.createObjectURL(blob); 
		// 	// // window.location.href = objectUrl;
		// 	// window.open(objectUrl);
		// },
		// // 药品
		// async queryDrugByListClick(query){
		// 	let item = {
		// 		paramName:query,
		// 		queryType:3,
		// 	}
		// 	this.loading = true;
		// 	let datalist = await this.$api.publics.queryDrugByList(item);
		// 	this.loading = false;
		// 	this.goodsList=datalist.data;
		// },
		// // 药品检索
		// goodsClick(name){
		// 	for (let i = 0; i < this.goodsList.length; i++) {
		// 		 if(name == this.goodsList[i].ctmmParam){
		// 			this.page.hisDrugCodeList = this.goodsList[i].bigDrugCode;
		// 		}
		// 	}
		// 	this.backInfoListClick();
		// },
	}, 
	created(){
		// console.log(this.$router.history.current.query.id);
		// 列表
		this.backInfoListClick(false);
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
