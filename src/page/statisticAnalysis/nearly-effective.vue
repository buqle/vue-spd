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
			                :loading="loading" class="condition-group-ipt" @on-change="goodsClick(goodsName)" @on-clear="clearGoodDate">
			                <Option v-for="(option, index) in goodsList" :value="option.ctmmParam" :key="index">{{option.ctmmParam}}</Option>
			            </Select>
			</div>
			 <div class="condition-group">
				<label>临效期选择</label>
				<Select v-model="page.diffDay" clearable class="big condition-group-ipt">
				        	<Option v-for="(da,index) in dateList" :value="da.id" :key="index">{{da.desc}}</Option>
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
		</div>
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" @click="exportAsPrint()">导出</Button>
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="staticsListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList" style="width: 100%;"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="staticsListClick(false)" show-total show-elevator />
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
	                        align: 'center',
	                        width:'150'
	                    },
	                     {
	                        title: '临效期天数',
	                        key: 'diffDay',
	                        align: 'center',
	                        width:'100',
	                        render: (h, params) => {
			　　　let color = '#4fa1a4';
			          let fontSize = '24px'
			          if(params.row.diffDay <= 30) {
			            color = '#a8071a';
			            fontSize = '24px'
			          }else if(params.row.diffDay > 30 && params.row.diffDay <= 60) {
			            color = '#f5222d';
			            fontSize = '24px'
			          }else if(params.row.diffDay > 60 && params.row.diffDay <= 90) {
			            color = '#ff0000';
			            fontSize = '24px'
			          }
			          // return <span style={{color,fontSize}}>{params.row.diffDay}</span>
			          return h('div',{
			          	style: {
					color: color,
					fontSize: fontSize
			　　　　　　},
			          },params.row.diffDay)
			}
	                    },
	                    {
	                        title: '货位',
	                        key: 'goodsName',
	                        align: 'center',
	                        width:'100',
	                    },
	                    {
	                        title: '货位类型',
	                        key: 'locName',
	                        align: 'center',
	                        width:'150'
	                    },
	                    {
	                        title: '库存',
	                        key: 'totalQuantity',
	                        align: 'center',
	                        width:'100'
	                    },
	                    {
	                        title: '药品名称',
	                        key: 'ctmmTradeName',
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
	                        width:'150',
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
	                        key: 'replanUnit',
	                        width:'100',
	                        align: 'center'
	                    },
	                    {
	                        title: '生产批号',
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
	                        title: '有效期至',
	                        key: 'validEndDate',
	                        width:'100',
	                        align: 'center'
	                    },
	                    {
	                        title: '包装规格',
	                        key: 'packageSpecification',
	                        width:'150',
	                        align: 'center'
	                    },
	                    {
	                        title: '剂型',
	                        key: 'ctmmDosageFormDesc',
	                        align: 'center',
	                        width:'100'
	                    },
	                    {
	                        title: '采购方式',
	                        key: 'purchaseType',
	                        align: 'center',
	                        width:'100',
	                        render: (h, params) => {
			          return h('div',params.row.diffDay == 1 ? '零库存' : '自采')
			}
	                    },
	                    {
	                        title: '价格',
	                        key: 'price',
	                        align: 'center',
	                        width:'100'
	                    },
                     {
                       title: '总金额',
                       key: 'amount',
                       align: 'center',
                       width:'100'
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
	                    },
	                    {
	                        title: '药品编号',
	                        key: 'hisDrugCode',
	                        align: 'center',
	                        width:'150'
	                    }
	                ],
	                supplierList:[],
	                depList:[],
	                druhList:[],
	                dateList:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    supplierCode:'',
			    supplierCodeList:[],
			    diffDay:180,
			    hisDrugCodeList:[],
			    deptCode:'',
			    deptCodeList:[],
			    queryType:2
		    },
	            }
	},
	methods:{
		// 导出
		async exportAsPrint(){
			this.page.supplierCodeList = [];
			this.page.deptCodeList = [];
			if(this.page.supplierCode){
				this.page.supplierCodeList.push(this.page.supplierCode);
			}
			if(this.page.deptCode){
				this.page.deptCodeList.push(this.page.deptCode);
			}
			this.page.pageSize = null;
        			let datalist = await this.$api.druhStorage.staticsExportList(this.page);
        			this.page.pageSize = 10;
        			this.page.supplierCodeList = [];
			this.page.deptCodeList = [];
			let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
			let fileName = `${this.getCurrentDate()}药品近效期表详情.xls`;
			let objectUrl = URL.createObjectURL(blob); 
			const link = document.createElement('a')
			link.download = fileName;
			link.href = objectUrl;
			link.click();

			// let objectUrl = URL.createObjectURL(blob); 
			// // window.location.href = objectUrl;
			// window.open(objectUrl);
		},
		clearGoodDate	(){
			this.goodsName = '';
			this.page.hisDrugCodeList = [];
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
					this.page.hisDrugCodeList.push(this.goodsList[i].bigDrugCode);
				}
			}
			this.staticsListClick(true);
		},
		// 列表
		async staticsListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.page.supplierCodeList = [];
			this.page.deptCodeList = [];
			if(this.page.supplierCode){
				this.page.supplierCodeList.push(this.page.supplierCode);
			}
			if(this.page.deptCode){
				this.page.deptCodeList.push(this.page.deptCode);
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.staticsList(this.page);
			this.spinShow = false;
			this.page.supplierCodeList = [];
			this.page.deptCodeList = [];
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
			let datalist = await this.$api.publics.getDeptByParamDeptList();
			this.depList=datalist.data;
		},
		// 临效期选择
		async getTimeListClick(){
			let datalist = await this.$api.publics.getTimeList();
			this.dateList=datalist.data;
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		// 供应商
		this.supplierAllListClick();
		// 部门
		this.getDeptClick();
		// 临效期选择
		this.getTimeListClick();
		// 列表
		this.staticsListClick(false);
	}
}
</script>

