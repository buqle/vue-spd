<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>单据号</label>
				<Input placeholder="请输入供应商" v-model="page.distributeCode" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>状态</label>
				<Select v-model="page.auditStatus" clearable class="big condition-group-ipt">
				        	<Option v-for="(sta,index) in stateList" :value="sta.value" :key="index">{{ sta.label }}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>验收时间</label>
				 <DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
			</div>
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>类　型</label>
				<Select v-model="page.type" clearable class="big condition-group-ipt">
			        <Option v-for="(type,index) in typeList" :value="type.value" :key="index">{{ type.label}}</Option>
			    </Select>
			</div>
		</div>
	             <div class="condition-row">
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="shelfListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="shelfListClick(false)" show-total show-elevator />
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
	                        title: '配送单/验收单',
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
	                                            this.$router.push({path: "/drugStorage/wareHouse/grounding/detail", query:{id:params.row.distributeCode}})
	                                        }
	                                    }
	                                },params.row.distributeCode), 
	                                h('p', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {float:'left',color:'#ffffff',padding:'0 5px',backgroundColor: 'red',position:'absolute',marginLeft:'8%',borderRadius:'20px'},
	                                },params.row.checkAcceptDetailsItemsCount),
	                            ]);
	                        }
	                    },
	                    {
	                        title: '状态',
	                        key: 'statusName',
	                        align: 'center'
	                    },
	                    {
	                        title: '类型',
	                        key: 'typeName',
	                        align: 'center'
	                    },
	                    {
	                        title: '验收时间',
	                        key: 'receptionTime',
	                        align: 'center'
	                    },
	                    {
	                        title: '上架时间',
	                        key: 'upUserDate',
	                        align: 'center'
	                    },
	                ],
	                typeList:[],
	                stateList:[],
	                druhList:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    type:'',
			    shelfTime:'',
			    receptionStartTime:'',
			    receptionEndTime:'',
			    distributeCode:'',
		                auditStatus:'',
		    },
	            }
	},
	methods:{
		getDateStartEnd(){
			let startdate = new Date(this.page.shelfTime[0]);
			let year = startdate.getFullYear();
			let month = startdate.getMonth() + 1;
			let data = startdate.getDate();
			this.page.receptionStartTime = year + '-' + month + '-' + data;

			var enddata = new Date(this.page.shelfTime[1]);
			let year1 = enddata.getFullYear();
			let month1 = enddata.getMonth() + 1;
			let data1 = enddata.getDate();
			this.page.receptionEndTime = year1 + '-' + month1 + '-' + data1;
			if(!this.page.shelfTime[0]){
				this.page.receptionStartTime = '';
				this.page.receptionEndTime = '';
			}
		},
		// 列表
		async shelfListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.shelfListList(this.page);
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
		// 状态
		async stateListClick(){
			let datalist = await this.$api.publics.typeList({'type':'acceptance_status'});
			this.stateList=datalist.data;
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		// 类型
		this.typeListClick();
		// 状态
		this.stateListClick();
		// 列表
		this.shelfListClick(false);
	}
}
</script>

