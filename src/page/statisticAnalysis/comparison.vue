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
			                placeholder="请选择药品"
			                :remote-method="queryDrugByListClick"
			                :loading="loading" class="condition-group-ipt" @on-change="goodsClick(goodsName)">
			                <Option v-for="(option, index) in goodsList" :value="option.ctmmParam" :key="index">{{option.ctmmParam}}</Option>
			            </Select>
			</div>
			<div class="condition-group">
				<label>批号</label>
				<Input placeholder="请输入批号" v-model="page.lot" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>部门</label>
				<Select v-model="page.deptCode" clearable class="big condition-group-ipt">
				        	<Option v-for="(dep,index) in depList" :value="dep.id" :key="index">{{dep.deptName}}</Option>
				</Select>
			</div>
		</div>
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" @click="exportAsPrint()">导出</Button>
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="getCompareStockListClick(true)">查询</Button>
	             </div>
	             <div class="sum-style">
			<h3>列表查询</h3>
		</div>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getCompareStockListClick(false)" show-total show-elevator />
	             </div>
	</div>
</template>
<script>
export default {
	data () {
	            return { 
	            	spinShow:true,
	            	goodsName:'',
	            	goodsList:'',
	            	loading:false,
	             columns: [
	                    {
	                        type: 'index',
	                        title: '序号',
	                        align: 'center'
	                    },
	                    {
	                        title: '药品流水码',
	                        key: 'causticExcessiveNo',
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
			　　　　　　}, params.row.causticExcessiveNo),
			　　　　　　h('div', {
			　　　　　　　　slot: 'content',
			　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
			　　　　　　},params.row.causticExcessiveNo)
			　　　　])
			　　])
			}
	                    },
	                    {
	                        title: '药品编码',
	                        key: 'hisDrugCode',
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
			　　　　　　}, params.row.hisDrugCode),
			　　　　　　h('div', {
			　　　　　　　　slot: 'content',
			　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
			　　　　　　},params.row.hisDrugCode)
			　　　　])
			　　])
			}
	                    },
	                    {
	                        title: '药品名称',
	                        key: 'ctmmDesc',
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
			　　　　　　}, params.row.ctmmDesc),
			　　　　　　h('div', {
			　　　　　　　　slot: 'content',
			　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
			　　　　　　},params.row.ctmmDesc)
			　　　　])
			　　])
			}
	                    },
	                    {
	                        title: '规格',
	                        key: 'ctmmSpecification',
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
			　　　　　　}, params.row.ctmmSpecification),
			　　　　　　h('div', {
			　　　　　　　　slot: 'content',
			　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
			　　　　　　},params.row.ctmmSpecification)
			　　　　])
			　　])
			}
	                    },
	                    {
	                        title: '生产厂家',
	                        key: 'ctmmManufactureName',
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
			　　　　　　}, params.row.ctmmManufactureName),
			　　　　　　h('div', {
			　　　　　　　　slot: 'content',
			　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
			　　　　　　},params.row.ctmmManufactureName)
			　　　　])
			　　])
			}
	                    },
	                     {
	                        title: '生产日期',
	                        key: 'productDate',
	                        align: 'center',
	                    },
	                    {
	                        title: '有效日期',
	                        key: 'validEndDate',
	                        align: 'center'
	                    },
	                    {
	                        title: '单位',
	                        key: 'unit',
	                        align: 'center'
	                    },
	                    {
	                        title: '批号',
	                        key: 'lot',
	                        align: 'center'
	                    },
	                    {
	                        title: 'HIS库存',
	                        key: 'hisStock',
	                        align: 'center'
	                    },
	                    {
	                        title: 'SPD库存',
	                        key: 'spdStock',
	                        align: 'center'
	                    },
	                    {
	                        title: '库存差异',
	                        key: 'differenceStock',
	                        align: 'center'
	                    },
	                ],
	                depList:[],
	                druhList:[],
	                sumList:{},
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    lot:'',
			    key: '/purchase/statisticAnalysis/comparison',
			    hisDrugCode:'',
			    deptCode:'',
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
        			let datalist = await this.$api.druhStorage.getCompareStockExportList({'hisDrugCode':this.page.hisDrugCode,'lot':this.page.lot,'deptCode':this.page.deptCode});
			let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
			let fileName = `${this.getCurrentDate()}库存对比信息表.xls`;
			let objectUrl = URL.createObjectURL(blob); 
			const link = document.createElement('a')
			link.download = fileName;
			link.href = objectUrl;
			link.click();

			// let objectUrl = URL.createObjectURL(blob); 
			// // window.location.href = objectUrl;
			// window.open(objectUrl);
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
					this.page.hisDrugCode = this.goodsList[i].bigDrugCode;
				}
			}
		},
		// 列表
		async getCompareStockListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getCompareStockList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
			}
			
		},
		// 部门
		async getDeptClick(){
			let datalist = await this.$api.publics.getDeptInfoNoAdminList();
			this.depList=datalist.data;
			this.page.deptCode = this.depList[0].id;
			// 列表
			this.getCompareStockListClick(false);
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect);
		// 部门
		this.getDeptClick();
	}
}
</script>

