<template>
	<div class="condition">
		<h3 class="f16 green-h3 mb10">库存信息</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList" style="width:100%"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getMedHisBackListClick()" show-total show-elevator />
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
	                        align: 'center',
	                    },
	                    {
	                        title: '退药单号',
	                        key: 'backno',
	                        align: 'center',
	                        render: (h, params) => {
	                            return h('div', [
	                                h('div', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {color:'blue',cursor:'pointer'},
	                                    on: {
	                                        click: () => {
	                                            // this.show(params.row.guid)
	                                            // this.$router.replace('/warehousingAcceptanceDetail/'+params.row.ctmaSupplierName) 
	                                            this.$router.push({path: "/purchase/statisticAnalysis/statisticsTraceability/details", query:{'id':params.row.backno}})
	                                        }
	                                    }
	                                },params.row.backno)
	                            ]);
	                        }
	                    },
	                    {
	                        title: '退药类型',
	                        key: 'ordertype',
	                        align: 'center',
	                    },
	                    {
	                        title: '科室操作人',
	                        key: 'username',
	                        align: 'center'
	                    },
	                    {
	                        title: '部门操作人',
	                        key: 'operationUserName',
	                        align: 'center'
	                    },
	                    {
	                        title: '操作时间',
	                        key: 'backdate',
	                        align: 'center'
	                    },
	                    {
	                        title: '品规数',
	                        key: 'drugtotal',
	                        align: 'center'
	                    },
	                    {
	                        title: '单据状态',
	                        key: 'orderStatus',
	                        align: 'center'
	                    }
	                ],
	                druhList:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    startTime:'',
			    endTime:'',
			    backDeptCode:'',
			    deptCode:'',
			    type:0
		    }
	            }
	},
	methods:{
		// 列表
		async getMedHisBackListClick(){
			this.spinShow = true;
			this.page.startTime = this.$router.history.current.query.startTime;
			this.page.endTime = this.$router.history.current.query.endTime;
			this.page.backDeptCode = this.$router.history.current.query.backDeptCode;
			this.page.deptCode = this.$router.history.current.query.deptCode;
			let datalist = await this.$api.druhStorage.getMedHisBackList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
			}
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect);
		// 列表
		this.getMedHisBackListClick();
	}
}
</script>

