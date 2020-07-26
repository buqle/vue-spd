<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>部门</label>
				<Select v-model="page.deptCode" clearable class="big condition-group-ipt">
				        	<Option v-for="dep in DeptList" :value="dep.id" :key="dep.id">{{dep.deptName}} - {{dep.hisDeptName}}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>统计维度</label>
				<Select v-model="page.staticType" clearable class="big condition-group-ipt">
				        <Option v-for="sta in statisticalList" :value="sta.value" :key="sta.value">{{ sta.lable}}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>统计日期</label>
				 <DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
			</div> 
		</div>
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" @click="exportAsPrint()">导出</Button>
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="getStaticsListClick()">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <!-- <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getStaticsListClick(false)" show-total show-elevator />
	             </div> -->

	</div>
</template>
<script>
export default {
	data () {
	            return {
	            	statisticalList:[{value:1,lable:'日'},{value:2,lable:'月'}],
	            	spinShow:true,
	             columns: [
	                    {
	                        type: 'index',
	                        title: '序号',
	                        align: 'center'
	                    },
	                    {
	                        title: '库房结存数量',
	                        key: 'totalQuantity',
	                        align: 'center'
	                    },
	                    {
	                        title: '结存金额(万元)',
	                        key: 'totalPrice',
	                        align: 'center'
	                    },
	                    {
	                        title: '日期',
	                        key: 'time',
	                        align: 'center'
	                    }
	                ],
	                DeptList:[],
	                druhList:[],
	                page:{
			    // pageNo:1,
			    // pageSize:2,
			    // totalPage:0,
			    staticType:1,
			    shelfTime:'',
			    startDate:'',
			    endDate:'',
			    deptCode:''
		    }, 
	            }
	},
	methods:{
		// 导出
		async exportAsPrint(){
        			let datalist = await this.$api.druhStorage.getStaticsExportList({'query':this.page});
			let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
			let fileName = `${this.getCurrentDate()}库房财务指标分析.xls`;
			let objectUrl = URL.createObjectURL(blob); 
			const link = document.createElement('a')
			link.download = fileName;
			link.href = objectUrl;
			link.click();

			// let objectUrl = URL.createObjectURL(blob); 
			// // window.location.href = objectUrl;
			// window.open(objectUrl);
		},
		getDateStartEnd(){
			let startdate = new Date(this.page.shelfTime[0]);
			let year = startdate.getFullYear();
			let month = startdate.getMonth() + 1;
			let data = startdate.getDate();
			this.page.startDate = year + '-' + month + '-' + data;

			var enddata = new Date(this.page.shelfTime[1]);
			let year1 = enddata.getFullYear();
			let month1 = enddata.getMonth() + 1;
			let data1 = enddata.getDate();
			this.page.endDate = year1 + '-' + month1 + '-' + data1;
			if(!this.page.shelfTime[0]){
				this.page.startDate = '';
				this.page.endDate = '';
			}
		},
		// 列表
		async getStaticsListClick(){
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getStaticsList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data;
			}
		},
		// 来源部门
		async queryHisDeptListClick(){
			let datalist = await this.$api.publics.queryHisDeptList();
			this.DeptList=datalist.data;
			this.page.deptCode = this.DeptList[0].id;
			// 列表
			this.getStaticsListClick();
		}
	},
	created(){
		// console.log(this.$store.state.currentSelect);
		// 来源部门
		this.queryHisDeptListClick();
	}
}
</script>

