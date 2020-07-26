<template>
	<div class="condition">   
	<Card dis-hover :bordered="false">
	            <p slot="title">
	                单据信息
	            </p>
	            <p slot="extra" class="btn-style">
	                <!-- <Button type="primary" icon="printer" @click="exportAsPrint()">导出execl</Button> -->
	                <Button type="primary" icon="printer" v-if="comlist.checkStatus == 3" @click="auditPassOrNoClick(1)">审核通过</Button>
	                <Button type="primary" icon="printer" v-if="comlist.checkStatus == 3" @click="auditPassOrNoClick(0)">不通过</Button>
	                <!-- <Button type="primary" icon="printer" v-if="comlist.checkStatus == 4" @click="print()">打印</Button> -->
	            </p> 
	            <div> 
	                   <Row :gutter="30">
	                        <Col span="6">
	                        盘点单：{{comlist.checkBillNo}}
	                        </Col>
	                        <Col span="6">
	                            状态：{{comlist.checkStatusName}}
	                        </Col>
	                        <Col span="6">
	                           类型：{{comlist.checkBillTypeName}}
	                        </Col>
	                    </Row>
	                    <Row :gutter="30" class="mt10"> 
	                    	<Col span="6">
	                            部门：{{comlist.checkBillDeptName}}
	                        </Col>
	                        <Col span="6">
	                            制单人：{{comlist.createUserName}}
	                        </Col>
	                        <Col span="6">
	                            制单时间：{{comlist.createDate}}
	                        </Col>
	                    </Row>  
	                    <Row :gutter="30" class="mt10"> 
	                    	<Col span="6">
	                            起始时间：{{comlist.checkStartTime}}
	                        </Col>
	                        <Col span="6">
	                            盘点时间：{{comlist.checkTime}}
	                        </Col>
	                        <Col span="6">
	                            提交时间：{{comlist.checkEndTime}}
	                        </Col> 
	                    </Row>  
	                    <Row :gutter="30" class="mt10">
	                    	<Col span="6">
	                           采购方式：{{comlist.purchaseTypeName}}
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
			<div class="condition-group">
				<RadioGroup v-model="page.causticType" @on-change="getListByBillNoListClick(true)">
					<Radio label=""> 
						<span>全部</span>
					</Radio>
					<Radio label="2">
						<span>盘点正常</span>
					</Radio>
					<Radio label="1">
						<span>盘点异常</span>
					</Radio>
				</RadioGroup>
			</div>
		</div>
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
			totalPage:0,
			checkBillNo:'',
			hisDrugCodeList:[],
			causticType:''
		},
		columns:[
				{
					type: 'index',
					title: '序号',
					align: 'center',
					width:'80',
					fixed: 'left'
				},
				{ 
					title: '货位',
					key: 'locName',
					align: 'center',
					width:'150',
					fixed: 'left'
				},
				{ 
					title: '货位类型',
					key: 'positionTypeName',
					align: 'center',
					width:'150',
					fixed: 'left'
				},
				{ 
					title: '药品名称',
					key: 'ctmmTradeName',
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
					title: '包装规格',
					key: 'packageSpecification',
					align: 'center',
					width:'150'
				},
				{	 
					title: '单位',
					key: 'unit',
					align: 'center',
					width:'150'
				},
				{
					title: '账面库存',
					key: 'accountStoreNum',
					align: 'center',
					width:'150'
				},
				{
					title: '实际数量',
					key: 'practicalRepertory',
					align: 'center',
					width:'150'
				},
				{
					title: '盈亏数量',
					key: 'checkNum',
					align: 'center',
					width:'150'
				},
				{
					title: '账面批号',
					key: 'accountBatchNo',
					align: 'center',
					width:'150'
				},
				{
					title: '实际批号',
					key: 'practicalBatch',
					align: 'center',
					width:'150'
				},
				{
					title: '生产日期',
					key: 'accountProductTime',
					align: 'center',
					width:'150'
				},
				{
					title: '实际生产日期',
					key: 'realProductTime',
					align: 'center',
					width:'180'
				},
				{
					title: '有效期至',
					key: 'accountEndTime',
					align: 'center',
					width:'150'
				},
				{
					title: '实际有效期至',
					key: 'validEndTime',
					align: 'center',
					width:'180'
				},
				{
					title: '单价',
					key: 'referencePrice',
					align: 'center',
					width:'100'
				},
				{
					title: '盈亏金额',
					key: 'mount',
					align: 'center',
					width:'100',
					render: (h, params) => {
					　　return h('div',(Number(params.row.referencePrice) * Number(params.row.checkNum)).toFixed(4))
					}
				},
	                	], 
	            }
	},
	methods: {
		//  头部 通过不通过
		async auditPassOrNoClick(flg){
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.auditPassOrNoList({'checkBillNo':this.$router.history.current.query.id,'sheveType':2,'type':flg}); 
			if(datalist.data){
				this.spinShow = false;
			}else{
				this.$Message.error(datalist.msg);
			} 
		},
		//  头部 明细
		async checkBillGetListClick(){
			let datalist = await this.$api.druhStorage.checkBillGetList({'checkBillNo':this.$router.history.current.query.id}); 
			this.comlist=datalist.data; 
		},
		// 列表
		async getListByBillNoListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.druhList = [];
			this.page.checkBillNo = this.$router.history.current.query.id;
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getListByBillNoList(this.page);
			this.spinShow = false;
			this.druhList=datalist.data.list;
			this.page.totalPage = datalist.data.count;
			this.page.hisDrugCodeList = [];
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
			this.page.hisDrugCodeList = [];
			for (let i = 0; i < this.goodsList.length; i++) {
				 if(name == this.goodsList[i].ctmmParam){
					this.page.hisDrugCodeList.push(this.goodsList[i].bigDrugCode);
				}
			}
			this.getListByBillNoListClick();
		},
	}, 
	created(){
		// console.log(this.$router.history.current.query.id);
		// 列表
		this.getListByBillNoListClick(false);
		// 明细
		this.checkBillGetListClick();
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
