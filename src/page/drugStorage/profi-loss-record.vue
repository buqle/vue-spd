<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>单号</label>
				<Input placeholder="请输入盘点单号" v-model="page.checkBillNo" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>类型</label>
				<Select v-model="page.checkBillType" clearable class="big condition-group-ipt">
			        <Option v-for="(type,index) in typeList" :value="type.value" :key="index">{{ type.label}}</Option>
			    </Select>
			</div> 
			<div class="condition-group">
				<label>盘点时间</label>
				 <DatePicker type="daterange" v-model="launchDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-clear="clearLaunchDate"></DatePicker>
			</div>
		</div>
		
	             <div class="condition-row">
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="causticExcessiveListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="causticExcessiveListClick(false)" show-total show-elevator />
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
	                        title: '损益单',
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
	                                            this.$router.push({path: "/drugStorage/checkDecrease/profiLossRecord/details", query:{checkBillNo:params.row.checkBillNo,causticExcessiveNo:params.row.causticExcessiveNo}})
	                                        }
	                                    }
	                                },params.row.causticExcessiveNo), 
	                                // h('p', {
	                                //     props: {
	                                //         // type: 'primary',
	                                //         // size: 'small'
	                                //     },
	                                //     style: {float:'left',color:'#ffffff',padding:'0 5px',backgroundColor: 'red',position:'absolute',marginLeft:'7%',borderRadius:'20px'},
	                                // },params.row.commonCheckBillDetailListCount),
	                            ]);
	                        }
	                    },
	                    {
	                        title: '盘点单',
	                        key: 'checkBillNo',
	                        align: 'center'
	                    },
	                    {
	                        title: '盘点类型',
	                        key: 'checkBillTypeName',
	                        align: 'center'
	                    },
	                    {
	                        title: '盘点子类型',
	                        key: 'checkBillSubTypeName',
	                        align: 'center'
	                    },
	                    {
	                        title: '药品特征',
	                        key: 'drugFeatureCodeName',
	                        align: 'center'
	                    },
	                    {
	                        title: '部门',
	                        key: 'deptName',
	                        align: 'center'
	                    },
	                    {
	                        title: '生成人',
	                        key: 'createUserName',
	                        align: 'center'
	                    },
	                    {
	                        title: '生成时间',
	                        key: 'createDate',
	                        align: 'center'
	                    }
	                ],
	                typeList:[],
	                stateList:[],
	                druhList:[],
	                launchDate:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    checkBillNo:'',
			    checkBillType:'',
			    checkStartTime:'',
			    checkEndTime:''
		    },
	            }
	},
	methods:{
		// 列表
		async causticExcessiveListClick(flag){
			let launchDate = this.launchDate;
			if(launchDate && Array.isArray(launchDate) && launchDate.length > 0 && launchDate[0] && launchDate[1]){
				this.page.checkStartTime = this.$moment(launchDate[0]).format('YYYY-MM-DD');
				this.page.checkEndTime = this.$moment(launchDate[1]).format('YYYY-MM-DD');
			}
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.causticExcessiveList(this.page);
			if(datalist.code == 200){
				this.spinShow = false;
			}
			this.druhList=datalist.data.list;
			this.page.totalPage = datalist.data.count;
		},
		clearLaunchDate(){
			this.launchDate = [];
			this.page.checkStartTime = "";
			this.page.checkEndTime = "";
		},
		// 类型
		async typeListClick(){
			let datalist = await this.$api.publics.typeList({'type':'check_bill_type'});
			this.typeList=datalist.data;
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		// 类型
		this.typeListClick();
		// 列表
		this.causticExcessiveListClick(false);
	}
}
</script>

