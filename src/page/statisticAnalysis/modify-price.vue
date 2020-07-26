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
			                :loading="loading" class="condition-group-ipt" @on-change="goodsClick(goodsName)">
			                <Option v-for="(option, index) in goodsList" :value="option.ctmmParam" :key="index">{{option.ctmmParam}}</Option>
			            </Select>
			</div>
			<div class="condition-group">
				<label>单号</label>
				<Input placeholder="请输入单号" v-model="page.updatePriceNo" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>统计时间</label>
				 <DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
			</div> 
		</div>
	             <div class="condition-row">
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="getPriceStaticListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getPriceStaticListClick(false)" show-total show-elevator />
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
	                        align: 'center'
	                    },
	                    {
	                        title: '药品名称',
	                        key: 'ctmmGenericName',
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
	                                            this.$router.push({path: "/purchase/statisticAnalysis/modifyPrice/details", query:{id:params.row.id,updatePriceNo:params.row.updatePriceNo}})
	                                        }
	                                    }
	                                },params.row.ctmmGenericName)
	                            ]);
	                        }
	                    },
	                    {
	                        title: '调价单号',
	                        key: 'updatePriceNo',
	                        align: 'center'
	                    },
	                    {
	                        title: '调价时间',
	                        key: 'fromDate',
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
	                DeptList:[],
	                druhList:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    shelfTime:'',
			    startDate:'',
			    endDate:'',
			    hisDrugCodeList:[],
			    updatePriceNo:''
		    }, 
	            }
	},
	methods:{
		getDateStartEnd(){
			let startdate = new Date(this.page.shelfTime[0]);
			let year = startdate.getFullYear();
			let month = startdate.getMonth() + 1;
			let data = startdate.getDate();
			this.page.startDate = year + '-' + month + '-' + data;

			var enddata = new Date(this.page.shelfTime[1]);
			let year1 = enddata.getFullYear();
			let month1 = enddata.getMonth() + 1;
			let data1 = enddata.getDate();
			this.page.endDate = year1 + '-' + month1 + '-' + data1;
			if(!this.page.shelfTime[0]){
				this.page.startDate = '';
				this.page.endDate = '';
			}
		},
		// 列表
		async getPriceStaticListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getPriceStaticList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
				this.page.hisDrugCodeList = [];
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
					this.page.hisDrugCodeList.push(this.goodsList[i].bigDrugCode);
				}
			}
			this.getOrderExecuteDetailListClick();
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect);
		// 列表
		this.getPriceStaticListClick(false);
	}
}
</script>

