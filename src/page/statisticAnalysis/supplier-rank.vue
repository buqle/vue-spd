<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>出库时间</label>
				<DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
			</div>
		</div>
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" @click="exportAsPrint()">导出</Button>
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="getSupplierListClick(true)">查询</Button>
	             </div>
	             <div class="sum-style">
			<h3>列表查询</h3>
		</div>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getSupplierListClick(false)" show-total show-elevator />
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
	                        align: 'center'
	                    },
	                    {
	                        title: '出库品类数',
	                        key: 'drugCount',
	                        align: 'center'
	                    },
	                    {
	                        title: '出库数量',
	                        key: 'backSumNum',
	                        align: 'center'
	                    },
	                    {
	                        title: '出库总金额(万元)',
	                        key: 'backSumAmount',
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
        			let datalist = await this.$api.druhStorage.getSupplierExportList(this.page);
        			this.page.pageSize = 10;
			let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
			let fileName = `${this.getCurrentDate()}供应商排行表详情.xls`;
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
		async getSupplierListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getSupplierList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
			}
			
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect);
		// 列表
		this.getSupplierListClick(false);
	}
}
</script>

