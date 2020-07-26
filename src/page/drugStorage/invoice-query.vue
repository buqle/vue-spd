<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>结算单号</label>
				<Input placeholder="请输入结算单号" v-model="page.settleBillNo" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>发　票</label>
				<Input placeholder="请输入发票代码/号码" v-model="page.invoiceParam" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>结算单日期</label>
				 <DatePicker type="daterange" v-model="page.shelfTime1" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd1"></DatePicker>
			</div>
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>发票日期</label>
				 <DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
			</div>
			<div class="condition-group">
				<label>供应商</label>
				<Select v-model="page.supplierName" clearable class="big condition-group-ipt">
			        <Option v-for="sup in supplierList" :value="sup.ctmaSupplierName" :key="sup.ctmaSupplierCode">{{ sup.ctmaSupplierName}}</Option>
			    </Select>
			</div>
		</div>
	             <div class="condition-row">
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="invoiceListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="invoiceListClick(false)" show-total show-elevator />
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
	                        title: '发票号码',
	                        // key: 'ctmaSupplierName',
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
	                                            this.$router.push({path: "/purchase/invoiceQueryMenu/InvoiceQuery/details", query:{id:params.row.invoiceNo}})
	                                        }
	                                    }
	                                },params.row.invoiceNo)
	                            ]);
	                        }
	                    },
	                    {
	                        title: '发票代码',
	                        key: 'invoiceCode',
	                        align: 'center'
	                    },
	                    {
	                        title: '结算单号',
	                        key: 'settleBillNo',
	                        align: 'center'
	                    },
	                    {
	                        title: '发票日期',
	                        key: 'invoiceTime',
	                        align: 'center'
	                    },
	                    {
	                        title: '发票金额(元)',
	                        key: 'invoiceAmount',
	                        align: 'center'
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
	                        title: '结算金额(元)',
	                        key: 'settleAmount',
	                        align: 'center'
	                    },
	                    {
	                        title: '结算单日期',
	                        key: 'settleDate',
	                        align: 'center'
	                    }
	                ],
	                supplierList:[],
	                druhList:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    supplierName:'',
			    settleBillNo:'',
			    invoiceParam:'',
			    shelfTime:'',
			    settleEndTime:'',
			    settleStartTime:'',
			    shelfTime1:'',
			    invoiceStartTime:'',
			    invoiceEndTime:''
		    }
	            }
	},
	methods:{
		getDateStartEnd(){
			let startdate = new Date(this.page.shelfTime[0]);
			let year = startdate.getFullYear();
			let month = startdate.getMonth() + 1;
			let data = startdate.getDate();
			this.page.settleEndTime = year + '-' + month + '-' + data;

			var enddata = new Date(this.page.shelfTime[1]);
			let year1 = enddata.getFullYear();
			let month1 = enddata.getMonth() + 1;
			let data1 = enddata.getDate();
			this.page.settleStartTime = year1 + '-' + month1 + '-' + data1;
			if(!this.page.shelfTime[0]){
				this.page.settleEndTime = '';
				this.page.settleStartTime = '';
			}
		},
		getDateStartEnd1(){
			let startdate = new Date(this.page.shelfTime1[0]);
			let year = startdate.getFullYear();
			let month = startdate.getMonth() + 1;
			let data = startdate.getDate();
			this.page.invoiceStartTime = year + '-' + month + '-' + data;

			var enddata = new Date(this.page.shelfTime[1]);
			let year1 = enddata.getFullYear();
			let month1 = enddata.getMonth() + 1;
			let data1 = enddata.getDate();
			this.page.invoiceEndTime = year1 + '-' + month1 + '-' + data1;
			if(!this.page.shelfTime[0]){
				this.page.invoiceStartTime = '';
				this.page.invoiceEndTime = '';
			}
		},
		// 列表
		async invoiceListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.invoiceList(this.page);
			this.spinShow = false;
			if(datalist.data.list.length > 0 || datalist.data.list){
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
			}
		},
		// 供应商
		async supplierAllListClick(){
			let datalist = await this.$api.publics.supplierAllList();
			this.supplierList=datalist.data;
		}, 
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		// 供应商
		this.supplierAllListClick();
		// 列表
		this.invoiceListClick(false);
	}
}
</script>

