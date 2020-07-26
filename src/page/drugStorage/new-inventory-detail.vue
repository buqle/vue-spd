<template>
	<div class="condition">   
	<Card dis-hover :bordered="false">
	            <p slot="title">
	                单据信息
	            </p>
	            <p slot="extra" class="btn-style">
	                <!-- <Button type="primary" icon="printer" @click="exportAsPrint()">导出execl</Button> -->
	                <Button type="primary" v-if="comlist.checkStatus == 1" @click="beginCheckListClick()">盘点</Button>
	                <Button type="primary" v-if="comlist.checkStatus == 2" @click="submitCheckListClicks()">全部提交</Button>
	                <Button type="primary" v-if="comlist.checkStatus > 1" @click="print()">打印</Button>
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
			<div class="condition-group">
				<Button type="primary" class="r" v-if="comlist.checkStatus == 2" @click="submitCheckListClick()">保存</Button>
			</div>
		</div>
		<Table :columns="columns" :data="druhList" style="width: 100%"  @on-selection-change="handleSelectionChange"></Table> 
		<Spin size="large" fix v-if="spinShow"></Spin>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getListByBillNoListClick(false)" show-total show-elevator />
	             </div>
	             
	</div>  
</template>
<script> 
import {route}  from '@/api/apiRoute';
import expandRow from '@/components/ExpandInventory';
export default {
	data () {
	            return { 
	            	url:`${route}/a/checkbill/print/checkBillPrint`,
	             comlist:'',
	             druhList:[],
	             loading:false,
	             goodsName:'',
	             goodsList:[], 
	             backGoodsList:[],
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
					type: 'selection',
					align: 'center',
					width:'50',
					fixed: 'left'
				},
				{
					type: 'index',
					title: '序号',
					align: 'center',
					width:'80',
					fixed: 'left'
				},
				{
					type: 'expand',
					align: 'center',
					width:'10',
					fixed: 'left',
					render: (h, params) => {
						return h(expandRow, {
							props: {
								row:this.druhList[params.index].children
							}
						})
					}
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
					fixed: 'left',
					render: (h, params) => {
				                        	if(params.row.showUint&&this.comlist.checkStatus == 2 && params.row.checkDetailStatus == 1){
							return  params.row.positionName.length&&params.row.positionName[0][0].locationName?params.row.positionName[0][0].locationName:'加载中...'
						}else {
							return h('div',params.row.positionTypeName);
						}
					} 
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
					title: '账面库存',
					key: 'accountStoreNum',
					align: 'center',
					width:'150',
					render: (h, params) => {
						if(this.comlist.checkBillType == "2" && params.row.checkDetailStatus == 1){
							// return h('div',0);
					 	 }else{
				                        	  	return h('div',params.row.accountStoreNum);
				                        	 }
					}
				},
				{
					title: '实际数量',
					key: 'practicalRepertory',
					align: 'center',
					width:'150',
					render: (h, params) => {
						if(this.comlist.checkStatus == 2 && params.row.checkDetailStatus == 1){
					 		return h('InputNumber', {
						                    props: {
						                    	min:1,
						                    	max:this.druhList[params.index].accountStoreNum,
						                          type: 'text',
						                          value: this.druhList[params.index].accountStoreNum,
						                          editable:true
						                    },
						                    on: {  
									'on-change':(event)=>{
							                      		this.druhList[params.index].practicalRepertory = event;
							                    	}
								},
						                });
					 	 }else{
				                        	  	return h('div',params.row.practicalRepertory);
				                        	 }
					}
				},
				{
					title: '盈亏数量',
					key: 'checkNum',
					align: 'center',
					width:'150',
					render: (h, params) => {
						if(this.comlist.checkBillType == "2" && params.row.checkDetailStatus == 1){
							// return h('div',0);
					 	 }else{
				                        	  	return h('div',params.row.checkNum?params.row.checkNum:0);
				                        	 }
					}
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
					width:'150',
					render: (h, params) => {
						if(this.comlist.checkStatus == 2 && params.row.checkDetailStatus == 1){
					 		return h('Input', {
						                    props: {
						                          type: 'text',
						                          value: this.druhList[params.index].accountBatchNo,
						                          editable:false
						                    },
						                    on: {  
									'on-change':(event)=>{
							                      		this.druhList[params.index].practicalBatch = event;
							                    	}
								},
						             });
					 	}else{
					 		return h('div',params.row.practicalBatch);
					 	}
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
					title: '生产日期',
					key: 'accountProductTime',
					align: 'center',
					width:'150'
				},
				{
					title: '实际生产日期',
					key: 'realProductTime',
					align: 'center',
					width:'180',
					render: (h, params) => {
						if(this.comlist.checkStatus == 2 && params.row.checkDetailStatus == 1){
					 		return h('DatePicker', {
						                    props: {
						                          value: this.druhList[params.index].accountProductTime,
						                          editable:false
						                    },
						                    on: {  
									'on-change':(event)=>{
							                      		this.druhList[params.index].realProductTime = event;
							                    	}
								},
						             });
					 	}else{
					 		return h('div',params.row.realProductTime);
					 	}
					}
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
					width:'180',
					render: (h, params) => {
						if(this.comlist.checkStatus == 2 && params.row.checkDetailStatus == 1){
					 		return h('DatePicker', {
						                    props: {
						                          value: this.druhList[params.index].accountEndTime,
						                          editable:false
						                    },
						                    on: {  
									'on-change':(event)=>{
							                      		this.druhList[params.index].validEndTime = event;
							                    	}
								},
						             });
					 	}else{
					 		return h('div',params.row.validEndTime);
					 	}
					}
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
				{
					title: '操作',
					align: 'center',
					width:'100',
					render: (h, params) => {
						if(params.row.id && params.row.checkDetailStatus == 1){ 
							return h('a', { 
					                                    on: {
					                                        click: () => {
					                                        	this.addNewLotListClick(params.row,params.index);
					                                        }
					                                    }
					                                }, '新增批号')
					 	}else if(params.row.checkDetailStatus == 1){
					 		return h('a', { 
					                                    on: {
					                                        click: () => {
					                                        }
					                                    }
					                                }, '删除')
					 	}
					}
				}
	                	],
	            }
	},
	methods: {
		handleSelectionChange(selection) {
			this.backGoodsList = [];
			for (let i = 0; i < selection.length; i++) {
				let item = {
					accountBatchNo: selection[i].accountBatchNo,
					accountEndTime: selection[i].accountEndTime,
					accountProductTime: selection[i].accountProductTime,
					accountStoreNum: selection[i].accountStoreNum,
					bigDrugCode: selection[i].bigDrugCode,
					drugCode: selection[i].drugCode,
					id: selection[i].id,
					locCode: selection[i].locCode,
					pId: selection[i].pId,
					practicalBatch: selection[i].practicalBatch,
					practicalRepertory: selection[i].practicalRepertory,
					realProductTime: selection[i].realProductTime,
					referencePrice: selection[i].referencePrice,
					unitCode: selection[i].unitCode,
					validEndTime: selection[i].validEndTime,
					supplierCode: selection[i].supplierCode,
					unit:selection[i].unit,
					locationName:selection[i].locationName,
					positionTypeName:selection[i].positionTypeName
				}
				this.backGoodsList.push(item);
			}
		},
		//  头部 新增批号
		async addNewLotListClick(params,index){
			this.$set(this.druhList[index], '_expanded', false);
			let datalist = await this.$api.druhStorage.addNewLotList({'bigDrugCode':params.bigDrugCode});
			this.druhList[index].accc = [];
			this.druhList[index].accc.push(datalist.data.dataVo);
			let item = {
				unitSort:datalist.data.dataVo[0].unitSort,
				unitCode:datalist.data.dataVo[0].unitCode
			}
			let dataLocIlist = await this.$api.druhStorage.findLocInfoList(item);

			this.druhList[index].positionName=[];
			for (let i = 0; i < dataLocIlist.data.length; i++) {
				let item1 = {
					id:dataLocIlist.data[i].id,
					locationName:dataLocIlist.data[i].locationName,
					positionName:dataLocIlist.data[i].positionName
				}
				this.druhList[index].positionName.push(item1);
			}  
                          	if(this.druhList[index].accc){
                          		this.druhList[index].children = this.druhList[index].children || [];
				let uuid = new Date().getTime();
				this.druhList[index].children.push({
				uuid,
				positionName:this.druhList[index].positionName,
				children: null,
				pId: params.id,
				accountBatchNo: null,
				id: null,
				accountProductTime: null,
				accountEndTime: null,
				accountStoreNum: 0,
				practicalRepertory: 0,
				showUint:'show',
				practicalBatch:null,
				unit:this.druhList[index].accc[0][0].unit,
				locCode:this.druhList[index].positionName[0].id,
				unitCode:this.druhList[index].accc[0][0].unitCode,
				positionTypeName:this.druhList[index].positionName[0].locationName
				});
                          	}
                          	this.$set(this.druhList[index], '_expanded', true);
                          	// this.druhList[index]._expanded = true;
                          	console.log("222",this.druhList);
		},
		//  头部 全部提交
		async submitCheckListClicks(){
			let datalist = await this.$api.druhStorage.submitCheckList({'checkBillNo':this.$router.history.current.query.id,'detailList':this.backGoodsList,'isTotalSubmit':"0"}); 
			// 明细
			this.checkBillGetListClick();
			this.backGoodsList = [];
			// 列表
			this.getListByBillNoListClick(true);
		},
		//  头部 提交
		async submitCheckListClick(){
			if(this.backGoodsList.length == 0){
				this.$Message.success('请勾选数据!');
				return
			}
			let datalist = await this.$api.druhStorage.submitCheckList({'checkBillNo':this.$router.history.current.query.id,'detailList':this.backGoodsList}); 
			// 明细
			this.checkBillGetListClick();
			this.backGoodsList = [];
			// 列表
			this.getListByBillNoListClick(true);
		},
		//  头部 盘点
		async beginCheckListClick(){
			let datalist = await this.$api.druhStorage.beginCheckList({'checkBillNo':this.$router.history.current.query.id}); 
			// 明细
			this.checkBillGetListClick();
			// 列表
			this.getListByBillNoListClick(true);
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
			for (let i = 0; i < this.druhList.length; i++) {
				this.druhList[i].practicalRepertory = this.druhList[i].accountStoreNum;
				this.druhList[i].practicalBatch = this.druhList[i].accountBatchNo;
				this.druhList[i].realProductTime = this.druhList[i].accountProductTime;
				this.druhList[i].validEndTime = this.druhList[i].accountEndTime;

				if (this.druhList[i].id === null || this.druhList[i].checkDetailStatus === 2) {
					this.druhList[i]['_disabled'] = true;
				}
			}
			this.page.totalPage = datalist.data.count;
			this.page.hisDrugCodeList = [];
			if(this.comlist.checkStatus != 2) {
				this.columns.splice(2, 1);
			}
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
		// // 明细
		this.checkBillGetListClick();
		// 列表
		this.getListByBillNoListClick(false);
	},
	watch: { 
	 
	},


}
</script> 
<style lang="less" scoped>
/deep/ td.ivu-table-expanded-cell {
    padding: 0 !important; 
} 
</style>
