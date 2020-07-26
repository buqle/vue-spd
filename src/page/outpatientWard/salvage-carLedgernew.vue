<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>药品名称</label>
				<Select
			                v-model="goodsName"
			                filterable
			                clearable
			                remote
			                placeholder="药品名称"
			                :remote-method="queryDrugByListClick"
			                :loading="loading" @on-change="goodsClick(goodsName)" @on-clear="clear()" class="big condition-group-ipt">
			                <Option v-for="(option, index) in goodsList" :value="option.ctmmParam" :key="index">{{option.ctmmParam}}</Option>
			            </Select>
			</div> 
			<div class="condition-group">
				<label>供应商</label>
				<Select v-model="page.supplierCode" clearable class="big condition-group-ipt">
			        <Option v-for="sup in supplierList" :value="sup.ctmaSupplierCode" :key="sup.ctmaSupplierCode">{{ sup.ctmaSupplierName}}</Option>
			    </Select>
			</div> 
			<div class="condition-group">
				<label>抢救车货位</label>
				<Select v-model="page.deptCode" clearable class="big condition-group-ipt">
				        	<Option v-for="dep in DeptList" :value="dep.id" :key="dep.id">{{ dep.deptName }}</Option>
				</Select>
			</div> 
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>日期范围</label>
				 <DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
			</div>
			<div class="condition-group">
				<label>类　型</label>
				<Select v-model="page.secondType" clearable class="big condition-group-ipt">
			        <Option v-for="type in typeList" :value="type.value" :key="type.value">{{ type.label}}</Option>
			    </Select>
			</div> 
		</div>
	             <div class="condition-row">
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="newDrugLedgerListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList" style="width:100%;"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="newDrugLedgerListClick(false)" show-total show-elevator />
	             </div>

	</div>
</template>
<script>
export default {
	data () {
	            return { 
	            	spinShow:true,
	             	columns: [
	                    {
	                        type: 'index',
	                        title: '序号',
	                        align: 'center',
	                        width:'60'
	                    }, 
	                    {
	                        title: '类型',
	                        key: 'type',
	                        align: 'center',
	                        width:'100'
	                    },
	                    {
	                        title: '时间',
	                        key: 'createDate',
	                        align: 'center',
	                        width:'150'
	                    },
	                    {
	                        title: '通用名',
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
	                        title: '商品名',
	                        // key: 'ctmaSupplierName',
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
	                        title: '规格',
	                        key: 'ctmmSpecification',
	                        align: 'center',
	                        width:'150'
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
	                        key: 'unit',
	                        align: 'center',
	                        width:'150'
	                    },
	                    {
	                        title: '生产批号',
	                        key: 'lot',
	                        align: 'center',
	                        width:'150'
	                    },
	                    {
	                        title: '生产日期',
	                        key: 'productDate',
	                        align: 'center',
	                        width:'150'
	                    },
	                    {
	                        title: '有效期至',
	                        key: 'validEndDate',
	                        align: 'center',
	                        width:'150'
	                    },
	                    {
	                        title: '包装规格',
	                        key: 'packageSpecification',
	                        align: 'center',
	                        width:'150'
	                    },
	                    {
	                        title: '剂型',
	                        key: 'ctmmDosageFormDesc',
	                        align: 'center',
	                        width:'150'
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
	                    },
	                    {
	                        title: '批准文号',
	                        key: 'hisDrugCode',
	                        align: 'center',
	                        width:'150'
	                    },
	                     {
	                        title: '库存数量',
	                        key: 'stockNum',
	                        align: 'center',
	                        width:'100',
	                        fixed: 'right'
	                    },
	                    {
	                        title: '入库数量',
	                        key: 'inStockNum',
	                        align: 'center',
	                        width:'100',
	                        fixed: 'right'
	                    },
	                    {
	                        title: '出库数量',
	                        key: 'outStockNum',
	                        align: 'center',
	                        width:'100',
	                        fixed: 'right'
	                    },
	                    {
	                        title: '结存数量',
	                        key: 'balanceNum',
	                        align: 'center',
	                        width:'100',
	                        fixed: 'right'
	                    },
	                ],
	                goodsName:'',
	                supplierList:[],
	                typeList:[],
	                DeptList:[], 
	                loading:false,
	                goodsList:[],
	                druhList:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    deptCode:'',
			    secondType:'',
			    shelfTime:'',
			    startTime:'',
			    endTime:'', 
			    hisDrugCodeList:'',
		                supplierCode:'',
		    }, 
	            }
	},
	methods:{
		getDateStartEnd(){
			let startdate = new Date(this.page.shelfTime[0]);
			let year = startdate.getFullYear();
			let month = startdate.getMonth() + 1;
			let data = startdate.getDate();
			this.page.startTime = year + '-' + month + '-' + data;

			var enddata = new Date(this.page.shelfTime[1]);
			let year1 = enddata.getFullYear();
			let month1 = enddata.getMonth() + 1;
			let data1 = enddata.getDate();
			this.page.endTime = year1 + '-' + month1 + '-' + data1;
			if(!this.page.shelfTime[0]){
				this.page.startTime = '';
				this.page.endTime = '';
			}
		},
		// 列表
		async newDrugLedgerListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.newDrugLedgerList(this.page);
			if(datalist.code == 200){
				this.spinShow = false;
			}
			this.druhList=datalist.data.list;
			this.page.totalPage = datalist.data.count;
		},
		// 类型
		async typeListClick(){
			let datalist = await this.$api.publics.typeList({'type':'rescuecar_type'});
			this.typeList=datalist.data;
		}, 
		// 供应商
		async supplierAllListClick(){
			let datalist = await this.$api.publics.supplierAllList();
			this.supplierList=datalist.data;
		}, 
		// 抢救车货位
		async findOriginDeptListClick(){
			let datalist = await this.$api.publics.rescuecarDetailList();
			this.DeptList=datalist.data;
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
		},
		clear(){
			this.page.hisDrugCodeList = '';
		}
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		// 类型
		this.typeListClick();
		// 供应商
		this.supplierAllListClick();
		// 抢救车货位
		this.findOriginDeptListClick();
		// 列表
		this.newDrugLedgerListClick(false);
	}
}
</script>

