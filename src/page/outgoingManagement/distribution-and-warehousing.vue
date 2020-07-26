<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>收货部门</label>
				<Select v-model="page.applyDeptCode" clearable class="condition-group-ipt">
				        	<Option v-for="(dep,index) in deptList" :value="dep.id" :key="index">{{ dep.deptName }}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>状　态</label>
				<Select v-model="page.applyStatus" clearable class="condition-group-ipt">
			        <Option v-for="(type,index) in statusList" :value="type.value" :key="index">{{ type.label}}</Option>
			    </Select>
			</div> 
			<div class="condition-group">
				<label>类型</label>
				<Select v-model="page.applyType" clearable class="condition-group-ipt">
			        <Option v-for="(type,index) in typeList" :value="type.value" :key="index">{{ type.label}}</Option>
			    </Select>
			</div>
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>验收时间</label>
				 <DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
			</div>
			<div class="condition-group">
				<label>单据号</label>
				<Input placeholder="请输入申领单" v-model="page.applyCode" class="condition-group-ipt"></Input>
			</div>
		</div>
	             <div class="condition-row">
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="commonDistributeListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="commonDistributeListClick(false)" show-total show-elevator />
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
	                        title: '申领号',
	                        key: 'applyCode',
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
	                                            this.$router.push({path: "/drugStorage/outStorage/acceptDistribution/detail", query:{id:params.row.applyCode}})
	                                        }
	                                    }
	                                },params.row.applyCode), 
	                                h('p', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {float:'left',color:'#ffffff',padding:'0 5px',backgroundColor: 'red',position:'absolute',marginLeft:'8%',borderRadius:'20px'},
	                                },params.row.applydetailsItemsCount),
	                            ]);
	                        }
	                    },
	                    {
	                        title: '申领部门',
	                        key: 'applyDeptName',
	                        align: 'center'
	                    },
	                    {
	                        title: '状态',
	                        key: 'applyStatusName',
	                        align: 'center'
	                    },
	                    {
	                        title: '类型',
	                        key: 'applyTypeName',
	                        align: 'center'
	                    },
	                    {
	                        title: '发起人',
	                        key: 'createUserName',
	                        align: 'center'
	                    },
	                    {
	                        title: '发起时间',
	                        key: 'createDate',
	                        align: 'center'
	                    },
	                ],
	                statusList:[],
	                typeList:[],
	                deptList:[],
	                druhList:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    queryType:2,
			    applyDeptCode:'',
			    applyStatus:'',
			    applyType:'',
			    startTime:'',
			    endTime:'',
			    applyCode:'',
			    shelfTime:''
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
		async commonDistributeListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.commonDistributeList(this.page);
			if(datalist.code = 200){
				this.spinShow = false;
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
			}
		},
		// 申领部门
		async applyDeptListClick(){
			let datalist = await this.$api.publics.applyDeptList();
			this.deptList=datalist.data;
		},
		// 状态
		async statusListClick(){
			let datalist = await this.$api.publics.typeList({'type':'common_distribute_status'});
			this.statusList=datalist.data;
		},
		// 类型
		async typeListClick(){
			let datalist = await this.$api.publics.typeList({'type':'apply_type'});
			this.typeList=datalist.data;
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		// 类型
		this.typeListClick(); 
		// 状态
		this.statusListClick();
		// 申领部门
		this.applyDeptListClick();
		// 列表
		this.commonDistributeListClick(false);
	}
}
</script>

