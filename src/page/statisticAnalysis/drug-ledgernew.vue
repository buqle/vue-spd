<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>供应商</label>
				<Select v-model="page.supplierCode" clearable class="condition-group-ipt">
				<Option v-for="sup in supplierList" :value="sup.ctmaSupplierCode" :key="sup.ctmaSupplierCode">{{ sup.ctmaSupplierName}}</Option>
				</Select>
			</div> 
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
        <label>类　型</label>
        <Select v-model="page.secondType" clearable class="big condition-group-ipt">
          <Option v-for="(ty,index) in typeList" :value="ty.value" :key="index">{{ty.label}}</Option>
        </Select>
      </div>
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>部　门</label>
				<Select v-model="page.deptCode" clearable class="big condition-group-ipt">
				        	<Option v-for="(dep,index) in depList" :value="dep.id" :key="index">{{dep.deptName}}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>生产批号</label>
				<Input placeholder="请输入生产批号" v-model="page.lot" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>统计时间</label>
				<DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
			</div>
		</div>
		<div class="condition-row">
      <div class="condition-group">
        <label>拆零移库信息</label>
        <Select v-model="page.isShowOthersType" clearable class="big condition-group-ipt" style="width: 70%;" >
          <Option v-for="(sh,index) in isShowList" :value="sh.value" :key="index">{{sh.label}}</Option>
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
	                        title: '部门',
	                        key: 'deptName',
	                        align: 'left',
	                        width:'100',
	                    },
	                     {
	                        title: '类型',
	                        key: 'type',
	                        align: 'left',
	                        width:'100'
	                    },
	                    {
	                        title: '单号',
	                        key: 'orderNo',
	                        align: 'left',
	                        width:'180'
	                    },
	                    {
	                        title: '时间',
	                        key: 'createDate',
	                        align: 'left',
	                        width:'100'
	                    },
	                    {
	                        title: '药品名称',
	                        key: 'ctmmTradeName',
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
	                        title: '生产厂家',
	                        key: 'ctmmManufacturerName',
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
	                        width:'150',
	                        align: 'center'
	                    },
	                    {
	                        title: '生产批号',
	                        key: 'lot',
	                        width:'100',
	                        align: 'center'
	                    },
	                    {
	                        title: '生产日期',
	                        key: 'productDate',
	                        width:'100',
	                        align: 'center'
	                    },
	                    {
	                        title: '有效期至',
	                        key: 'validEndDate',
	                        width:'100',
	                        align: 'center'
	                    },
	                    {
	                        title: '包装规格',
	                        key: 'packageSpecification',
	                        width:'100',
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
			　　　　　　}, params.row.packageSpecification),
			　　　　　　h('div', {
			　　　　　　　　slot: 'content',
			　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
			　　　　　　},params.row.packageSpecification)
			　　　　])
			　　])
			}
	                    },
	                    {
	                        title: '剂型',
	                        key: 'ctmmDosageFormDesc',
	                        width:'100',
	                        align: 'center'
	                    },
	                    {
	                        title: '供应商',
	                        key: 'supplierName',
	                        align: 'center',
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
	                        title: '批准文号',
	                        key: 'approvalNo',
	                        align: 'center',
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
			　　　　　　}, params.row.approvalNo),
			　　　　　　h('div', {
			　　　　　　　　slot: 'content',
			　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
			　　　　　　},params.row.approvalNo)
			　　　　])
			　　])
			}
	                    },
	                    {
	                        title: '库存数量',
	                        key: 'stockNum',
	                        align: 'center',
	                        width:'100'
	                    },
	                    {
	                        title: '入库数量',
	                        key: 'inStockNum',
	                        align: 'center',
	                        width:'100',
	                        fixed:'right'
	                    },
	                    {
	                        title: '出库数量',
	                        key: 'outStockNum',
	                        align: 'center',
	                        width:'100',
	                        fixed:'right'
	                    },
	                    {
	                        title: '结存数量',
	                        key: 'balanceNum',
	                        align: 'center',
	                        width:'100',
	                        fixed:'right'
	                    },
	                    {
	                        title: '药品编号',
	                        key: 'hisDrugCode',
	                        align: 'center',
	                        width:'150',
	                        fixed:'right'
	                    }
	                ],
	                isShowList:[
	                	{value:'1',label:'不包含'},
	                	{value:'2',label:'包含'}
	                ],
	                supplierList:[],
	                depList:[],
	                typeList:[],
	                druhList:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    supplierCode:'',
			    hisDrugCodeList:[],
			    shelfTime:'',
			    startTime:'',
			    endTime:'',
			    lot:'',
			    deptCode:'',
			    isShowOthersType:'1',
			    secondType:''
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
        			let datalist = await this.$api.druhStorage.getMedicineStandingExportList(this.page);
        			this.page.pageSize = 10;
			let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
			let fileName = `${this.getCurrentDate()}药品台账详情.xls`;
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
			if(!name){
				this.page.hisDrugCodeList = '';
			}else{
				for (let i = 0; i < this.goodsList.length; i++) {
					 if(name == this.goodsList[i].ctmmParam){
						this.page.hisDrugCodeList = this.goodsList[i].bigDrugCode;
					}
				}
			}
		},
		// 列表
		async findBalanceDetailsListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getnewDrugLedgerList(this.page);
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
			let datalist = await this.$api.publics.findMedicineStandingDeptsList();
			this.depList=datalist.data;
		},
		// 类型
		async getTypeClick(){
			let datalist = await this.$api.publics.typeList({'type':'medicine_standing'});
			this.typeList=datalist.data;
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		// 供应商
		this.supplierAllListClick();
		// 部门
		this.getDeptClick();
		// 类型
		this.getTypeClick();
		// 列表
		this.findBalanceDetailsListClick(false);
	}
}
</script>

