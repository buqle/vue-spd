<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>损益单号</label>
				<Input placeholder="请输入损益单号" v-model="page.causticExcessiveNo" class="condition-group-ipt"></Input>
			</div>
			 <div class="condition-group">
				<label>生成时间</label>
				<DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
			</div>
			<div class="condition-group">
				<label>部门</label>
				<Select v-model="page.deptCode" clearable class="big condition-group-ipt">
				        	<Option v-for="(dep,index) in depList" :value="dep.id" :key="index">{{dep.deptName}}</Option>
				</Select>
			</div>
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>损益类型</label>
				<Select v-model="page.causticExcessiveType" clearable class="condition-group-ipt">
				<Option v-for="exc in excessiveTypeList" :value="exc.value" :key="exc.value">{{ exc.lable}}</Option>
				</Select>
			</div>
		</div>
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" @click="exportAsPrint()">导出</Button>
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="excessiveListClick(true)">查询</Button>
	             </div>
	             <div class="sum-style">
			<h3>列表查询</h3>
			<h4 v-if="!page.deptCode">
			实际总损益金额(元)：<b>{{excessiveTotalMoney}}</b>
			</h4>
                 <h4 v-else>
                   部门实际总损益金额(元)：<b>{{excessiveTotalMoney}}</b>
                 </h4>
		</div>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="excessiveListClick(false)" show-total show-elevator />
	             </div>
	</div>
</template>
<script>
export default {
	data () {
	            return { 
	            	spinShow:true,
                excessiveTotalMoney:0,
	            	goodsName:'',
	            	goodsList:'',
	            	loading:false,
	             columns: [
	                    {
	                        type: 'index',
	                        title: '序号',
	                        align: 'center'
	                    },
	                    {
	                        title: '损益单号',
	                        key: 'causticExcessiveNo',
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
	                                            this.$router.push({path: "/purchase/statisticAnalysis/profitLoss/details", query:{id:params.row.causticExcessiveNo,pd:params.row.checkBillNo}})
	                                        }
	                                    }
	                                },params.row.causticExcessiveNo)
	                            ]);
	                        }
	                    },
	                     {
	                        title: '部门',
	                        key: 'deptName',
	                        align: 'center',
	                    },
	                    {
	                        title: '实际总库存',
	                        key: 'realTotalAmount',
	                        align: 'center'
	                    },
	                    {
	                        title: '损益总数量',
	                        key: 'excessiveTotalAmount',
	                        align: 'center'
	                    },
	                    {
	                        title: '实际总损益金额(元)',
	                        key: 'excessiveTotalMoney',
	                        align: 'center'
	                    }
	                ],
	                depList:[],
	                druhList:[],
	                sumList:{},
	                excessiveTypeList:[
		                {value:2,lable:'损'},
		                {value:1,lable:'益'}
	                ],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    causticExcessiveNo:'',
			    causticExcessiveType:'',
			    shelfTime:'',
			    startTime:'',
			    endTime:'',
			    deptCode:'',
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
        			let datalist = await this.$api.druhStorage.staticsExcessiveExportList();
			let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
			let fileName = `${this.getCurrentDate()}药品损益分析.xls`;
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
					this.page.hisDrugCode = this.goodsList[i].bigDrugCode;
				}
			}
		},
		// 列表
		async excessiveListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.excessiveList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
        let total = datalist.data.list.map((item) => item.excessiveTotalMoney);
        let totals=0;
        total.forEach(ele => {
          totals += ele;
        });
        this.excessiveTotalMoney=totals
			}
			
		},
		// 列表 统计
		async getStaticSexcessiveClick(){
			let item = {
				deptCode:this.page.deptCode,
				type:1
			 }
			let datalist = await this.$api.druhStorage.getStaticSexcessiveList(item);
			if(datalist.code == 200){
				this.sumList=datalist.data;
			}
			
		},
		// 部门
		async getDeptClick(){
			let datalist = await this.$api.publics.getDeptInfoList();
			this.depList=datalist.data;
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect);
		// 部门
		this.getDeptClick();
		// 列表
		this.excessiveListClick(false);
		// 统计
		this.getStaticSexcessiveClick();
	}
}
</script>

