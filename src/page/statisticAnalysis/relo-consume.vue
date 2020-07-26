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
			                :loading="loading" class="condition-group-ipt" @on-change="goodsClick(goodsName)" @on-clear="clearGoodDate">
			                <Option v-for="(option, index) in goodsList" :value="option.ctmmParam" :key="index">{{option.ctmmParam}}</Option>
			            </Select>
			</div>
			<div class="condition-group">
				<label>供应商</label>
				<Select  placeholder="请选择" class="condition-group-ipt" v-model="page.supplierCode" clearable>
					<Option  v-for="(item,index) in supplierList" :value="item.ctmaSupplierCode" :key="index">{{item.ctmaSupplierName}}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>时间段</label>
				 <DatePicker type="daterange" v-model="launchDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-clear="clearLaunchDate"></DatePicker>
			</div> 
		</div>
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" @click="exportAsPrint()">导出</Button>
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="getFindBalanceDetailsListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList" style="width: 100%"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getFindBalanceDetailsListClick(false)" show-total show-elevator />
	             </div>

	</div>
</template>
<script>
export default {
	data () {
	            return {
	            	loading:false,
	             goodsName:'',
	             goodsList:[],  
	            	spinShow:true,
	             columns: [
	                    {
	                        type: 'index',
	                        title: '序号',
	                        width:'80',
	                        align: 'center'
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
	                        　　　　　　　　width: '120px',
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
	                        key: 'hisFlowId',
	                        width:'150',
	                        align: 'center',
	                        render: (h, params) => {
	                        　　return h('div', [
	                        　　　　h('Tooltip', {
	                        　　　　props: { placement: 'top' }
	                        　　　　}, [
	                        　　　　h('div', {
	                        　　　　　　style: {
	                        　　　　　　　　width: '120px',
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
	                        key: 'hisDrugCode',
	                        width:'150',
	                        align: 'center',
	                        render: (h, params) => {
	                        　　return h('div', [
	                        　　　　h('Tooltip', {
	                        　　　　props: { placement: 'top' }
	                        　　　　}, [
	                        　　　　h('div', {
	                        　　　　　　style: {
	                        　　　　　　　　width: '120px',
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
	                        width:'150',
	                        align: 'center',
	                        render: (h, params) => {
	                        　　return h('div', [
	                        　　　　h('Tooltip', {
	                        　　　　props: { placement: 'top' }
	                        　　　　}, [
	                        　　　　h('div', {
	                        　　　　　　style: {
	                        　　　　　　　　width: '120px',
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
	                        width:'150',
	                        align: 'center',
	                        render: (h, params) => {
	                        　　return h('div', [
	                        　　　　h('Tooltip', {
	                        　　　　props: { placement: 'top' }
	                        　　　　}, [
	                        　　　　h('div', {
	                        　　　　　　style: {
	                        　　　　　　　　width: '120px',
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
	                        title: '生产厂商',
	                        key: 'ctmmManufactureName',
	                        width:'150',
	                        align: 'center',
	                        render: (h, params) => {
	                        　　return h('div', [
	                        　　　　h('Tooltip', {
	                        　　　　props: { placement: 'top' }
	                        　　　　}, [
	                        　　　　h('div', {
	                        　　　　　　style: {
	                        　　　　　　　　width: '120px',
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
	                        title: '单位',
	                        key: 'unit',
	                        width:'100',
	                        align: 'center',
	                    },
	                    {
	                        title: '期初数量',
	                        key: 'periodNum',
	                        width:'100',
	                        fixed: 'right',
	                        align: 'center'
	                    },
	                    {
	                        title: '本期入库',
	                        key: 'thisPeriodInNum',
	                        width:'100',
	                        fixed: 'right',
	                        align: 'center'
	                    },
	                    {
	                        title: '本期消耗',
	                        key: 'thisPeriodDispensingNum',
	                        width:'100',
	                        fixed: 'right',
	                        align: 'center'
	                    },
	                    {
	                        title: '本期出库',
	                        key: 'thisPeriodOutNum',
	                        width:'100',
	                        fixed: 'right',
	                        align: 'center'
	                    },
	                    {
	                        title: '损益数量',
	                        key: 'gainsLossNum',
	                        width:'100',
	                        fixed: 'right',
	                        align: 'center'
	                    },
	                    {
	                        title: '结存数量',
	                        key: 'thisPeriodBalanceNum',
	                        width:'100',
	                        fixed: 'right',
	                        align: 'center'
	                    }
	                ],
	                DeptList:[],
	                druhList:[],
	                supplierList:[],
	                launchDate:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    startTime:'',
			    endTime:'',
			    hisDrugCode:'',
			    supplierCode:''
		    }, 
	            }
	},
	 mounted() {
		const myDate = new Date();
		const year = myDate.getFullYear(); // 获取当前年份
		const month = myDate.getMonth() + 1; // 获取当前月份(0-11,0代表1月所以要加1);
		const day = myDate.getDate(); // 获取当前日（1-31）
		// 日期格式：2019/07/29 - 2019/07/29
		this.launchDate = `${year}-${month - 1}-${day} - ${year}-${month}-${day}`;
	},
	methods:{
		// 导出
		async exportAsPrint(){
			this.page.pageSize = null;
        			let datalist = await this.$api.druhStorage.getStoreBalanceExportList(this.page);
        			this.page.pageSize = 10;
			let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
			let fileName = `${this.getCurrentDate()}库存结存表.xls`;
			let objectUrl = URL.createObjectURL(blob); 
			const link = document.createElement('a')
			link.download = fileName;
			link.href = objectUrl;
			link.click();

			// let objectUrl = URL.createObjectURL(blob); 
			// // window.location.href = objectUrl;
			// window.open(objectUrl);
		},
		clearGoodDate(){
			this.page.hisDrugCode = "";
		},
		clearLaunchDate(){
			this.launchDate = [];
			this.page.startTime = "";
			this.page.endTime = "";
		},
		// 列表
		async getFindBalanceDetailsListClick(flag){
			let launchDate = this.launchDate;
			if(launchDate && Array.isArray(launchDate) && launchDate.length > 0 && launchDate[0] && launchDate[1]){
				this.page.startTime = this.$moment(launchDate[0]).format('YYYY-MM-DD');
				this.page.endTime = this.$moment(launchDate[1]).format('YYYY-MM-DD');
			}
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getFindBalanceDetailsList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
			}
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
			this.page.hisDrugCodeList = [];
			for (let i = 0; i < this.goodsList.length; i++) {
				 if(name == this.goodsList[i].ctmmParam){
					this.page.hisDrugCode = this.goodsList[i].bigDrugCode;
				}
			}
			this.getFindBalanceDetailsListClick(true);
		},
		// 供应商
		async findSuppliersListClick(){
			let datalist = await this.$api.publics.findSuppliersList();
			this.supplierList=datalist.data;
		},
	},
	created(){
		let myDate = new Date();
		let year = myDate.getFullYear(); // 获取当前年份
		let month = myDate.getMonth() + 1; // 获取当前月份(0-11,0代表1月所以要加1);
		let month1 = myDate.getMonth(); // 获取当前月份(0-11,0代表1月所以要加1);
		if(month < 10){
			month = '0' + month
		}
		let day = myDate.getDate(); // 获取当前日（1-31）
		if(day < 10){
			day = '0' + day
		}
		if(month1 < 10){
			month1 = '0' + month1
		}
		// 日期格式：2019/07/29 - 2019/07/29
		this.page.startTime = `${year}-${month1}-${day}`;
		this.page.endTime = `${year}-${month}-${day}`;
		// console.log(this.$store.state.currentSelect);
		// 供应商
		this.findSuppliersListClick();
		// 列表
		this.getFindBalanceDetailsListClick(false);
	}
}
</script>

