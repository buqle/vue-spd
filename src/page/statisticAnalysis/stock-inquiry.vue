<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>货位名称</label>
				<Input placeholder="请输入货位名称" v-model="page.positionName" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>部门</label>
				<Select v-model="page.deptCode" clearable class="big condition-group-ipt">
				        	<Option v-for="(dep,index) in depList" :value="dep.id" :key="index">{{dep.deptName}}</Option>
				</Select>
			</div>
      <div class="condition-group">
        <label>采购方式</label>
        <Select v-model="page.purchaseType" clearable class="big condition-group-ipt">
          <Option v-for="(type,index) in typeList" :value="type.value" :key="index">{{ type.label}}</Option>
        </Select>
      </div>
		</div>

    <div class="condition-row mt15 clear">
      <div class="condition-group">
        <label>生产厂家</label>
        <Input placeholder="请输入生产厂家" v-model="page.manuFacturer" class="condition-group-ipt"></Input>
      </div>
      <div  flexcont class="condition-group drug-sea">
        <label>药品名称</label>
        <Search :size="'80%'" :ml="10" @upAdd="choseCode"></Search>
      </div>
    </div>

	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" @click="exportAsPrint()">导出</Button>
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="queryDrugByDeptAllListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList" style="width: 100%;"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="queryDrugByDeptAllListClick(false)" show-total show-elevator />
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
	                        title: '药品名称',
	                        // key: 'ctmaSupplierName',
	                        align: 'left',
	                        width:'250',
	                        render: (h, params) => {
	                            return h('div', [
	                                h('div', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {color:'blue',cursor:'pointer',float:'left',},
	                                    on: {
	                                        click: () => {
	                                            // this.show(params.row.guid)
	                                            // this.$router.replace('/warehousingAcceptanceDetail/'+params.row.ctmaSupplierName) 
	                                            this.$router.push({path: "/purchase/statisticAnalysis/stockInquiry/details", query:{hisDrugCode:params.row.hisDrugCode,drugCode:params.row.drugCode,deptCode:params.row.deptCode}})
	                                        }
	                                    }
	                                },params.row.ctmmTradeName)
	                            ]);
	                        }
	                    },
	                    {
	                        title: '药品编码',
	                        key: 'hisDrugCode',
	                        width:'120',
	                        align: 'center'
	                    },
	                    {
	                        title: '部门',
	                        key: 'deptName',
	                        width:'120',
	                        align: 'center'
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
	                        title: '包装规格',
	                        key: 'packageSpecification',
	                        width:'150',
	                        align: 'center'
	                    },
	                    {
	                        title: '单位',
	                        key: 'replanUnit',
	                        width:'100',
	                        align: 'center'
	                    },
	                    {
	                        title: '库存数量',
	                        key: 'totalStoreNum',
	                        width:'100',
	                        align: 'center'
	                    },
	                    {
	                        title: '可用库存',
	                        key: 'usableQuantity',
	                        width:'100',
	                        align: 'center'
	                    },
	                    {
	                        title: '待处理库存',
	                        key: 'waitStoreNum',
	                        width:'100',
	                        align: 'center'
	                    },
	                    {
	                        title: '锁定区库存',
	                        key: 'lockStoreNum',
	                        width:'100',
	                        align: 'center'
	                    },
	                    {
	                        title: '剂型',
	                        key: 'ctmmDosageFormDesc',
	                        width:'100',
	                        align: 'center'
	                    },
	                    {
	                        title: '采购方式',
	                        key: 'purchaseType',
	                        align: 'center',
	                        width:'100',
	                        render: (h, params) => {
			　　return h('div',params.row.purchaseType == 1?'零库存':'自采')
			}
	                    },
	                    {
	                        title: '批准文号',
	                        key: 'approvalNo',
	                        width:'180',
	                        align: 'center'
	                    },
	                    {
	                        title: '待处理说明',
	                        key: 'tempDesc',
	                        align: 'center',
	                        width:'180',
	                        fixed:'right',
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
			　　　　　　}, params.row.tempDesc),
			　　　　　　h('div', {
			　　　　　　　　slot: 'content',
			　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
			　　　　　　},params.row.tempDesc)
			　　　　])
			　　])
			}
	                    }
	                ],
	                typeList:[],
	                depList:[],
	                druhList:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    checkBillNo:'',
			    positionName:'',
			    hisDrugCodeList:[],
			    deptCode:'',
			    purchaseType:'',
          manuFacturer:''
		    },
	            }
	},
	methods:{
    choseCode(drugCode){
      drugCode?this.page.hisDrugCodeList[0]=drugCode:this.page.hisDrugCodeList=[]
    },
		// 导出
		async exportAsPrint(){
        			let datalist = await this.$api.druhStorage.storeSelectExportList(this.page);
			let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
			let fileName = `${this.getCurrentDate()}库存查询.xls`;
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
					this.page.hisDrugCodeList.push(this.goodsList[i].bigDrugCode);
				}
			}
			this.queryDrugByDeptAllListClick();
		},
		// 列表
		async queryDrugByDeptAllListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.queryDrugByDeptAllList(this.page);
			if(datalist.code == 200){
				this.spinShow = false;
			}
			this.druhList=datalist.data.list;
			this.page.totalPage = datalist.data.count;
		},
		// 采购方式
		async typeListClick(){
			let datalist = await this.$api.publics.typeList({'type':'his_purchase_type'});
			this.typeList=datalist.data;
		},
		// 部门
		async getDeptClick(){
			let datalist = await this.$api.publics.getDeptInfoNoAdminList();
			this.depList=datalist.data;
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		// 类型
		this.typeListClick();
		// 部门
		this.getDeptClick();
		// 列表
		this.queryDrugByDeptAllListClick(false);
	}
}
</script>

