<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>退货单号</label>
				<Input placeholder="请输入退货单号" v-model="page.backNo" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>退货时间</label>
				 <DatePicker type="daterange" v-model="launchDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-clear="clearLaunchDate"></DatePicker>
			</div>
			<div class="condition-group">
				<label>状态</label>
				<Select v-model="page.backStatus" clearable class="big condition-group-ipt">
			        <Option v-for="(type,index) in typeList" :value="type.value" :key="index">{{ type.label}}</Option>
			    </Select>
			</div>
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>退货原因</label>
				<Select v-model="page.backCause" clearable class="big condition-group-ipt">
				        	<Option v-for="(sta,index) in stateList" :value="sta.value" :key="index">{{ sta.label }}</Option>
				</Select>
			</div>
			 <div class="condition-group">
				<label>供应商</label>
				<Select v-model="page.supplierCode" clearable class="big condition-group-ipt">
			        <Option v-for="(sup,index) in supplierList" :value="sup.ctmaSupplierCode" :key="index">{{ sup.ctmaSupplierName}}</Option>
			    </Select>
			</div> 
		</div>
	             <div class="condition-row mb15">
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="backListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="backListClick(false)" show-total show-elevator />
	             </div>
	</div>
</template>
<script>
export default {
	data () {
	            return { 
	            	spinShow:false,
	            	loading:false,
	             columns: [
	                    {
	                        type: 'index',
	                        title: '序号',
	                        align: 'center'
	                    },
	                    {
	                        title: '退货单',
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
	                                            this.$router.push({path: "/Purchase/outStorage/backStorage/details", query:{id:params.row.backNo}})
	                                        }
	                                    }
	                                },params.row.backNo), 
	                                h('p', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {float:'left',color:'#ffffff',padding:'0 5px',backgroundColor: 'red',position:'absolute',marginLeft:'7%',borderRadius:'20px'},
	                                },params.row.backStoreDetailItemCount),
	                            ]);
	                        }
	                    },
	                    {
	                        title: '来源部门',
	                        key: 'backDpetName',
	                        align: 'center'

	                    },
	                    {
	                        title: '退货原因',
	                        key: 'backCause',
	                        align: 'center'
	                    },
	                    {
	                        title: '状态',
	                        key: 'backStatusName',
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
	                        title: '退货人',
	                        key: 'createUserName',
	                        align: 'center'
	                    },
	                    {
	                        title: '退货时间',
	                        key: 'createDate',
	                        align: 'center'
	                    }
	                ],
	                supplierList:[],
	                typeList:[],
	                stateList:[],
	                druhList:[],
	                goodsLists:[],
	                backGoodsList:[],
	                backGoodsLists:[],
	                goodsSumList:[],
	                launchDate:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    backStatus:'0',
			    startTime:'',
			    endTime:'',
			    backCause:'',
		                supplierCode:[], 
		                backNo:'',
		    }
	            }
	},
	methods:{
		clearLaunchDate(){
			this.launchDate = [];
			this.page.startTime = "";
			this.page.endTime = "";
		},
		// 列表
		async backListClick(flag){
			let launchDate = this.launchDate;
			if(launchDate && Array.isArray(launchDate) && launchDate.length > 0 && launchDate[0] && launchDate[1]){
				this.page.startTime = this.$moment(launchDate[0]).format('YYYY-MM-DD');
				this.page.endTime = this.$moment(launchDate[1]).format('YYYY-MM-DD');
			}
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.backList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
			}
		},
		// 状态
		async typeListClick(){
			let datalist = await this.$api.publics.typeList({'type':'back_status'});
			this.typeList=datalist.data;
		}, 
		// 供应商
		async supplierAllListClick(){
			let datalist = await this.$api.publics.supplierAllList();
			this.supplierList=datalist.data;
		},
		// 退货原因
		async stateListClick(){
			let datalist = await this.$api.publics.typeList({'type':'back_cause'});
			this.stateList=datalist.data;
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		// 类型
		this.typeListClick();
		// 供应商
		this.supplierAllListClick();
		// 状态
		this.stateListClick();
		// 列表
		this.backListClick(false);
	}
}
</script>

