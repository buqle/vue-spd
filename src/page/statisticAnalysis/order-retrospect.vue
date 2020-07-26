<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>订单单号</label>
				<Input placeholder="请输入订单单号" v-model="page.orderCode" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>补货库房</label>
				<Select v-model="page.deptCode" clearable class="big condition-group-ipt">
				        	<Option v-for="(dep,index) in depList" :value="dep.id" :key="index">{{dep.deptName}}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>供应商</label>
				<Select v-model="page.supplierCode" clearable class="condition-group-ipt">
				<Option v-for="sup in supplierList" :value="sup.ctmaSupplierCode" :key="sup.ctmaSupplierCode">{{ sup.ctmaSupplierName}}</Option>
				</Select>
			</div> 
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>订单状态</label>
				<Select v-model="page.orderStatus" clearable class="condition-group-ipt">
				<Option v-for="ty in typeList" :value="ty.value" :key="ty.value">{{ ty.label}}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>退库时间</label>
				<DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
			</div>
		</div>
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" @click="exportAsPrint()">导出</Button>
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="getOrderTraceExecuteListClick(true)">查询</Button>
	             </div>
	             <div class="sum-style">
			<h3>列表查询</h3>
		</div>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getOrderTraceExecuteListClick(false)" show-total show-elevator />
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
	                        align: 'center'
	                    },
	                    {
	                        title: '订单单号',
	                        key: 'orderCode',
	                        align: 'center',
	                        render: (h, params) => {
	                            return h('div', [
	                                h('div', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {color:'blue',cursor:'pointer'},
	                                    on: {
	                                        click: () => {
	                                            // this.show(params.row.guid)
	                                            // this.$router.replace('/warehousingAcceptanceDetail/'+params.row.ctmaSupplierName) 
	                                            this.$router.push({path: "/purchase/statisticAnalysis/orderRetrospect/details", query:{id:params.row.orderCode}})
	                                        }
	                                    }
	                                },params.row.orderCode)
	                            ]);
	                        }
	                    },
	                     {
	                        title: '供应商',
	                        key: 'supplierName',
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
	                        title: '订单状态',
	                        key: 'orderStatusName',
	                        align: 'center'
	                    },
	                    {
	                        title: '补货库房',
	                        key: 'deptName',
	                        align: 'center'
	                    },
	                    {
	                        title: '下单人',
	                        key: 'createUserName',
	                        align: 'center'
	                    },
	                    {
	                        title: '下单日期',
	                        key: 'createDate',
	                        align: 'center'
	                    }
	                ],
	                depList:[],
	                supplierList:[],
	                druhList:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    shelfTime:'',
			    startTime:'',
			    endTime:'',
			    orderCode:'',
			    supplierCode:'',
			    supplierCodeList:[],
			    deptCode:'',
			    orderStatus:''
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
		// 导出
		async exportAsPrint(){
			this.page.pageSize = null;
			this.page.supplierCodeList = [];
			if(this.page.supplierCode){
				this.page.supplierCodeList.push(this.page.supplierCode);
			}
        			let datalist = await this.$api.druhStorage.getOrderTraceExportTraceList(this.page);
        			this.page.supplierCodeList = [];
        			this.page.pageSize = 10;
			let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
			let fileName = `${this.getCurrentDate()}订单追溯情况.xls`;
			let objectUrl = URL.createObjectURL(blob); 
			const link = document.createElement('a')
			link.download = fileName;
			link.href = objectUrl;
			link.click();

			// let objectUrl = URL.createObjectURL(blob); 
			// // window.location.href = objectUrl;
			// window.open(objectUrl);
		},
		// 列表
		async getOrderTraceExecuteListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.page.supplierCodeList = [];
			if(this.page.supplierCode){
				this.page.supplierCodeList.push(this.page.supplierCode);
			}

			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getOrderTraceExecuteList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
				this.page.supplierCodeList = [];
			}
			
		},
		// 订单状态
		async typeListClick(){
			let datalist = await this.$api.publics.typeList({'type':'order_status'});
			this.typeList=datalist.data;
		},
		// 供应商
		async supplierAllListClick(){
			let datalist = await this.$api.publics.findSuppliersList();
			this.supplierList=datalist.data;
		},
		// 补货库房
		async getDeptByParamDeptListClick(){
			let datalist = await this.$api.publics.getDeptByParamDeptList({'deptType':3});
			this.depList=datalist.data;
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect);
		// 供应商
		this.supplierAllListClick();
		// 订单状态
		this.typeListClick();
		// 补货库房
		this.getDeptByParamDeptListClick();
		// 列表
		this.getOrderTraceExecuteListClick(false);
	}
}
</script>

