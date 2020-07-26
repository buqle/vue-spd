<template>
	<div class="condition">   
	<Card dis-hover :bordered="false">
	            <p slot="title">
	                单据信息
	            </p>
	            <p slot="extra" class="btn-style">
	                <Button type="primary" v-if="comlist.applyStatus =='1' || comlist.applyStatus =='3'" @click="confirm('allocate')">配货</Button>
	                <Button type="primary" v-if="comlist.applyStatus =='2' || comlist.applyStatus =='4'" @click="confirm('cancel')">取消</Button>
	                <Button type="primary" v-if="comlist.applyStatus =='2' || comlist.applyStatus =='4'" @click="confirm('addPick')">生成拣货单</Button>
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
	                          发起人：{{comlist.createUserName}}
	                        </Col>
	                        <Col span="6">
	                          发起时间：{{comlist.createDate}}
	                        </Col>
	                        <Col span="6">
	                          联系电话：{{comlist.applyUserPhone}}
	                        </Col>
	                    </Row>  
	                      <Row :gutter="30" class="mt10"> 
	                        <Col span="6">
	                          药房地址：{{comlist.applyLocation}}
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
		<div>
			<Table :columns="columns" :data="druhList" class="l" style="width: 49%;" highlight-row @on-row-click="showRow"></Table>
			<Table :columns="columns1" :data="showDataList" class="r" style="width: 50%;"></Table> 
			<Spin size="large" fix v-if="spinShow"></Spin>
		</div>
	             
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
	             hisDrugCode:'',
	             showDataList:[],
		columns:[ 
				{
					type: 'index',
					title: '序号',
					width:'80',
					align: 'center'
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
					title: '剂型',
					key: 'ctmmDosageFormDesc',
					align: 'center',
					width:'150',
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
					title: '单位',
					key: 'replanUnit',
					width:'150',
					align: 'center'
				},
				{	 
					title: '申领数量',
					key: 'applyNum',
					width:'150',
					align: 'center'
				},
				{
					title: '可用库存',
					key: 'usableQuantity',
					width:'150',
					align: 'center'
				},
				{
					title: '已分配',
					key: 'finishNum',
					width:'150',
					align: 'center'
				},
				{	 
					title: '欠品数',
					key: 'lackNum',
					width:'150',
					align: 'center'
				},
				{
					title: '预分配数',
					key: 'receiveNum',
					width:'150',
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
					title: '可分配数',
					key: 'allocationNum',
					align: 'center'
				},
				{	 
					title: '分配数',
					key: 'usableQuantity',
					width:'150',
					align: 'center'
				}
	                	],
	            }
	},
	methods: {
		confirm(flg) {
			let text;
			if(flg=='allocate'){
				text = '配货';
			}else if(flg=='cancel'){
				text = '取消';
			}else{
				text = '生成拣货单';
			}
			this.$Modal.confirm({
				title: '提示',
				content:'是否确认'+ text +'？',
				onOk: () => {
				 	this.distributeEventList(flg);
				},
			});
	            },
	            // 配货 取消 生成拣货单
		async distributeEventList(flg){
			let item ={
				applyCode:this.$router.history.current.query.id,
				editType:flg
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.distributeEventList(item);
			this.spinShow = false; 
		},
		// 列表
		async instoreInfoList(){
			let item ={
				applyCode:this.$router.history.current.query.id,
				hisDrugCode:this.hisDrugCode
			}
			this.druhList = [];
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.distributeDetailList(item);
			this.spinShow = false;
			this.comlist=datalist.data;
			this.druhList=datalist.data.detailList;
			this.hisDrugCode = '';
		},
		showRow(data) { 
			//获取表格当前行数据
			this.singleQueryListClick(data.id);
		},
		async singleQueryListClick(id){
			let item ={
				id:id, 
			}
			this.showDataList = []; 
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.singleQueryList(item);
			this.spinShow = false;
			this.showDataList=datalist.data.detailList;
		},
		// // 打印
		// async print(){
		// 	window.open(`${this.url}?inStoreCode=${this.$router.history.current.query.id}`, '_blank');
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
					this.hisDrugCode = this.goodsList[i].bigDrugCode;
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
/deep/ .ivu-table {
    width: auto !important;
    height: 100%;
    max-width: 100%;
    overflow: hidden;
    color: #515a6e;
    font-size: 12px;
    background-color: #fff;
    box-sizing: border-box;
}
</style>
