<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group" style="width: 39%;margin-right: 20px">
				<label>订单发送时间</label>
				<DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
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
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="getSupplieroFmaterialListClick(true)">查询</Button>
	             </div>
	             <div class="sum-style">
			<h3>列表查询</h3>
			<h4>
			供应商订单总数量：<b>{{sumList.orderCount || 0}}</b>　　供应商总配送品种数：<b>{{sumList.totalDrugType || 0}}</b>　　供应商实际到货总数量：<b>{{sumList.actualNum || 0}}</b>
			</h4>
		</div>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getSupplieroFmaterialListClick(false)" show-total show-elevator />
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
	                        title: '订单号',
	                        key: 'orderCode',
	                        align: 'center'
	                    },
	                     {
	                        title: '订单发送时间',
	                        key: 'sendTime',
	                        align: 'center'
	                    },
	                    {
	                        title: '实际到货天数',
	                        key: 'arriveDay',
	                        align: 'center'
	                    },
	                    {
	                        title: '采购品规数',
	                        key: 'purchaseVariety',
	                        align: 'center'
	                    },
	                    {
	                        title: '配送品规数',
	                        key: 'deliverVariety',
	                        align: 'center'
	                    },
	                    {
	                        title: '采购数量',
	                        key: 'purchaseNum',
	                        align: 'center'
	                    },
	                    {
	                        title: '实际到货数量',
	                        key: 'actualNum',
	                        align: 'center'
	                    },
	                    {
	                        title: '到货比',
	                        key: 'arrivalRatio',
	                        align: 'center'
	                    }
	                ],
	                druhList:[],
	                supplierList:[],
	                sumList:{},
	                page:{
			pageNo:1,
			pageSize:10,
			totalPage:0,
			supplierCode:'',
			shelfTime:'',
			startTime:'',
			endTime:'',
			supplierCodeList:''
		    }
	            }
	},
	methods:{
		getDateStartEnd(){
			let startdate = new Date(this.page.shelfTime[0]);
			let year = startdate.getFullYear();
			let month = startdate.getMonth() + 1;
			if(month <10){
				month = '0' + month;
			}
			let data = startdate.getDate();
			this.page.startTime = year + '-' + month + '-' + data;

			var enddata = new Date(this.page.shelfTime[1]);
			let year1 = enddata.getFullYear();
			let month1 = enddata.getMonth() + 1;
			if(month1 <10){
				month1 = '0' + month1;
			}
			let data1 = enddata.getDate();
			this.page.endTime = year1 + '-' + month1 + '-' + data1;
			if(!this.page.shelfTime[0]){
				this.page.startTime = '';
				this.page.endTime = '';
			}
		},
		// 导出
		async exportAsPrint(){
			this.page.supplierCodeList = [];
			if(this.page.supplierCode){
				this.page.supplierCodeList.push(this.page.supplierCode);
			}
			this.page.pageSize = null;
        			let datalist = await this.$api.druhStorage.getExportSupplierAnalyzeList(this.page);
        			this.page.pageSize = 10;
			let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
			let fileName = `${this.getCurrentDate()}供应商供货分析情况.xls`;
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
		async getSupplieroFmaterialListClick(flag){
			if(flag){
				this.page.pageNo = 1;
				this.getOrderExecuteTotalsListClick();
			}
			this.page.supplierCodeList = [];
			if(this.page.supplierCode){
				this.page.supplierCodeList.push(this.page.supplierCode);
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getSupplieroFmaterialList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
			}
		},
		// 列表 统计
		async getOrderExecuteTotalsListClick(){
			this.page.supplierCodeList = [];
			if(this.page.supplierCode){
				this.page.supplierCodeList.push(this.page.supplierCode);
			}
			let datalist = await this.$api.druhStorage.getOrderExecuteTotalsList(this.page);
			if(datalist.code == 200){
				this.sumList=datalist.data;
			}
		},
		// 供应商
		async supplierAllListClick(){
			let datalist = await this.$api.publics.findSuppliersList();
			this.supplierList=datalist.data;
		}
	},
	created(){
		// console.log(this.$store.state.currentSelect);
		// 供应商
		this.supplierAllListClick();
		// 列表
		this.getSupplieroFmaterialListClick(false);
	}
}
</script>

