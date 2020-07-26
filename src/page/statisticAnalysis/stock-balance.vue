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
			                :loading="loading" class="condition-group-ipt" @on-change="goodsClick(goodsName)" @on-clear="cleargoodsName">
			                <Option v-for="(option, index) in goodsList" :value="option.ctmmParam" :key="index">{{option.ctmmParam}}</Option>
			            </Select>
			</div>
			 <div class="condition-group">
				<label>日期范围</label>
				<DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
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
				<label>存储地点</label>
				<Select v-model="page.deptCode" clearable class="big condition-group-ipt">
				        	<Option v-for="(dep,index) in depList" :value="dep.id" :key="index">{{dep.deptName}}</Option>
				</Select>
			</div>
		</div>
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" @click="exportAsPrint()">导出</Button>
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="findBalanceDetailsListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList" style="width: 100%;"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="findBalanceDetailsListClick(false)" show-total show-elevator />
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
	                        width:'80',
	                        align: 'center'
	                    },
	                    {
	                        title: '供应商',
	                        // key: 'ctmaSupplierName',
	                        align: 'left',
	                        width:'100',
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
	                        title: '药品流水码',
	                        // key: 'ctmaSupplierName',
	                        align: 'left',
	                        width:'100',
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
			　　　　　　}, params.row.hisFlowId),
			　　　　　　h('div', {
			　　　　　　　　slot: 'content',
			　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
			　　　　　　},params.row.hisFlowId)
			　　　　])
			　　])
			}
	                    },
	                    {
	                        title: '药品编码',
	                        // key: 'ctmaSupplierName',
	                        align: 'left',
	                        width:'100',
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
	                        // key: 'ctmaSupplierName',
	                        align: 'left',
	                        width:'100',
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
	                        // key: 'ctmaSupplierName',
	                        align: 'left',
	                        width:'100',
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
	                        width:'120',
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
	                        title: '批号',
	                        key: 'lot',
	                        width:'150',
	                        align: 'center'
	                    },
	                    {
	                        title: '生产日期',
	                        key: 'productDate',
	                        width:'100',
	                        align: 'center'
	                    },
	                    {
	                        title: '有效日期',
	                        key: 'validEndDate',
	                        width:'100',
	                        align: 'center'
	                    },
	                    {
	                        title: '单位',
	                        key: 'unit',
	                        width:'100',
	                        align: 'center'
	                    },
	                    {
	                        title: '存储地点',
	                        key: 'deptName',
	                        width:'100',
	                        align: 'center'
	                    },
	                    {
	                        title: '发生日期',
	                        key: 'occurDate',
	                        width:'100',
	                        align: 'center'
	                    },
	                    {
	                        title: '期初数量',
	                        key: 'periodNum',
	                        align: 'center',
	                        width:'100',
	                        fixed:'right'
	                    },
	                    {
	                        title: '本期入库',
	                        key: 'thisPeriodInNum',
	                        align: 'center',
	                        width:'100',
	                        fixed:'right'
	                    },
	                    {
	                        title: '本期发药',
	                        key: 'thisPeriodDispensingNum',
	                        align: 'center',
	                        width:'100',
	                        fixed:'right'
	                    },
	                    {
	                        title: '本期出库',
	                        key: 'thisPeriodOutNum',
	                        align: 'center',
	                        width:'100',
	                        fixed:'right'
	                    },
	                    {
	                        title: '本期结存描述',
	                        key: 'thisPeriodStore',
	                        align: 'center',
	                        width:'100',
	                        fixed:'right'
	                    },
	                    {
	                        title: '本期结余(小单位)',
	                        key: 'thisPeriodBalanceNum',
	                        align: 'center',
	                        width:'100',
	                        fixed:'right'
	                    }
	                ],
	                supplierList:[],
	                depList:[],
	                druhList:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    supplierCode:'',
			    shelfTime:'',
			    startTime:'',
			    endTime:'',
			    hisDrugCode:'',
			    deptCode:'',
		    },
	            }
	},
	 mounted() {
		const myDate = new Date();
		const year = myDate.getFullYear(); // 获取当前年份
		const month = myDate.getMonth() + 1; // 获取当前月份(0-11,0代表1月所以要加1);
		const day = myDate.getDate(); // 获取当前日（1-31）
		// 日期格式：2019/07/29 - 2019/07/29
		this.page.shelfTime = `${year}/${month - 1}/${day} - ${year}/${month}/${day}`;
	},
	methods:{
		cleargoodsName(){
			this.page.hisDrugCode = ""; 
		},
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
        			let datalist = await this.$api.druhStorage.storeBalanceExportList();
			let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
			let fileName = `${this.getCurrentDate()}库存结存查询.xls`;
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
		async findBalanceDetailsListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.findBalanceDetailsList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
			}
			
		},
		    // 供应商
		async supplierAllListClick(){
			let datalist = await this.$api.publics.findSuppliersList();
			this.supplierList=datalist.data;
		},
		// 部门
		async getDeptClick(){
			let datalist = await this.$api.publics.findDeptsList();
			this.depList=datalist.data;
		},
	},
	created(){
		const myDate = new Date();
		const year = myDate.getFullYear(); // 获取当前年份
		const month = myDate.getMonth() + 1; // 获取当前月份(0-11,0代表1月所以要加1);
		const day = myDate.getDate(); // 获取当前日（1-31）
		// 日期格式：2019/07/29 - 2019/07/29
		this.page.startTime = `${year}/${month - 1}/${day}`;
		this.page.endTime = `${year}/${month}/${day}`;

		// console.log(this.$store.state.currentSelect); 
		// 供应商
		this.supplierAllListClick();
		// 部门
		this.getDeptClick();
		// 列表
		this.findBalanceDetailsListClick(false);
	}
}
</script>

