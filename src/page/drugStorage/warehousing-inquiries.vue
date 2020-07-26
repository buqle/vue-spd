<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>单　号</label>
				<Input placeholder="请输入供应商" v-model="page.inStoreCode" class="condition-group-ipt"></Input>
			</div>
			 <div class="condition-group">
				<label>入库分类</label>
				<Select v-model="page.inStoreType" clearable class="big condition-group-ipt">
			        <Option v-for="(type,index) in typeList" :value="type.value" :key="index">{{ type.label}}</Option>
			    </Select>
			</div>
			<div class="condition-group">
				<label>验收时间</label>
				 <DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
			</div>
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>供应商</label>
				<Select v-model="page.supid" clearable class="big condition-group-ipt">
			        <Option v-for="(sup,index) in supplierList" :value="sup.ctmaSupplierCode" :key="index">{{ sup.ctmaSupplierName}}</Option>
			    </Select>
			</div>
		</div>
	             <div class="condition-row">
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="instoreListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="instoreListClick(false)" show-total show-elevator />
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
	                        title: '入库单',
	                        // key: 'ctmaSupplierName',
	                        align: 'left',
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
	                                            this.$router.push({path: "/drugStorage/wareHouse/wareHouseReceiptMgt/detail", query:{id:params.row.inStoreCode}})
	                                        }
	                                    }
	                                },params.row.inStoreCode), 
	                                h('p', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {float:'left',color:'#ffffff',padding:'0 5px',backgroundColor: 'red',position:'absolute',marginLeft:'8%',borderRadius:'20px'},
	                                },params.row.instorDetailsItemsCount),
	                            ]);
	                        }
	                    },
	                    {
	                        title: '配送单/验收单号',
	                        key: 'distributeCode',
	                        align: 'center'
	                    },
	                    {
	                        title: '订单',
	                        key: 'orderCode',
	                        align: 'center'
	                    },
	                    {
	                        title: '入库分类',
	                        key: 'inStoreTypeName',
	                        align: 'center'
	                    },
	                    {
	                        title: '供应商',
	                        key: 'ctmaSupplierName',
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
			　　　　　　}, params.row.ctmaSupplierName),
			　　　　　　h('div', {
			　　　　　　　　slot: 'content',
			　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
			　　　　　　},params.row.ctmaSupplierName)
			　　　　])
			　　])
			}
	                    },
	                    {
	                        title: '上架时间',
	                        key: 'createDate',
	                        align: 'center'
	                    },
	                ],
	                supplierList:[],
	                typeList:[],
	                druhList:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    inStoreType:'',
			    startTime:'',
			    shelfTime:'',
			    endTime:'',
			    inStoreCode:'',
		                supplierCodeList:'',
		                supid:'',
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
		// 列表
		async instoreListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.page.supplierCodeList = [];
			if(this.page.supid){
				this.page.supplierCodeList.push(this.page.supid);
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.instoreList(this.page);
			if(datalist.data.list.length > 0){
				this.spinShow = false;
			}
			this.druhList=datalist.data.list;
			this.page.totalPage = datalist.data.count;
		},
		// 类型
		async typeListClick(){
			let datalist = await this.$api.publics.typeList({'type':'in_store_type'});
			this.typeList=datalist.data;
		},
		// 供应商
		async supplierAllListClick(){
			let datalist = await this.$api.publics.supplierAllList();
			this.supplierList=datalist.data;
		}, 
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		// 类型
		this.typeListClick(); 
		// 供应商
		this.supplierAllListClick();
		// 列表
		this.instoreListClick(false);
	}
}
</script>

