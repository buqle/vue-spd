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
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" @click="exportAsPrint()">导出</Button>
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="excessiveListClick(true)">查询</Button>
	             </div>
	             <div class="sum-style">
			<h3>列表查询</h3>
		</div>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="excessiveListClick(false)" show-total show-elevator />
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
	                                            this.$router.push({path: "/purchase/statisticAnalysis/orderFulfillment/details", query:{id:params.row.orderCode}})
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
	                        title: '补货库房',
	                        key: 'deptName',
	                        align: 'center'
	                    },
	                    {
	                        title: '订单状态',
	                        key: 'orderStatusName',
	                        align: 'center'
	                    },
	                    {
	                        title: '采购品种数',
	                        key: 'purchaseTypeNum',
	                        align: 'center'
	                    },
	                    {
	                        title: '实到品种数',
	                        key: 'actualTypeNum',
	                        align: 'center'
	                    },
	                    {
	                        title: '采购数量',
	                        key: 'purchaseCount',
	                        align: 'center'
	                    },
	                    {
	                        title: '实际到货数量',
	                        key: 'actualCount',
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
			    orderCode:'',
			    supplierCode:'',
			    supplierCodeList:[],
			    deptCode:'',
		    },
	            }
	},
	methods:{
		// 导出
		async exportAsPrint(){
			this.page.pageSize = null;
			this.page.supplierCodeList = [];
			if(this.page.supplierCode){
				this.page.supplierCodeList.push(this.page.supplierCode);
			}
        			let datalist = await this.$api.druhStorage.getOrderExecuteExportList(this.page);
        			this.page.supplierCodeList = [];
        			this.page.pageSize = 10;
			let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
			let fileName = `${this.getCurrentDate()}订单执行情况.xls`;
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
		async excessiveListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.page.supplierCodeList = [];
			if(this.page.supplierCode){
				this.page.supplierCodeList.push(this.page.supplierCode);
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getOrderExecuteList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
				this.page.supplierCodeList = [];
			}
			
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
		// 补货库房
		this.getDeptByParamDeptListClick();
		// 列表
		this.excessiveListClick(false);
	}
}
</script>

