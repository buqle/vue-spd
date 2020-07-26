<template>
  <div class="condition">
    <div class="condition-row">
      <div class="condition-group">
        <label>订单状态</label>
        <Select v-model="page.isReplenishment" clearable class="big condition-group-ipt">
                  <Option v-for="sta in stateList" :value="sta.value" :key="sta.value">{{ sta.label }}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>订单类型</label>
        <Select v-model="page.purchaseType" clearable class="big condition-group-ipt">
              <Option v-for="type in typeList" :value="type.value" :key="type.value">{{ type.label}}</Option>
          </Select>
      </div>
      <div class="condition-group">
        <label>供应商</label>
        <Select v-model="page.supplierCode" clearable class="big condition-group-ipt">
              <Option v-for="sup in supplierList" :value="sup.ctmaSupplierCode" :key="sup.ctmaSupplierCode">{{ sup.ctmaSupplierName}}</Option>
          </Select>
      </div>  
    </div>
    <div class="condition-row">
      <div class="condition-group">
        <label>采购订单</label>
        <Input placeholder="请输入订单编号" v-model="page.orderCode" class="condition-group-ipt"></Input>
      </div>
      <div class="condition-group">
        <label>日期范围</label>
         <DatePicker type="daterange" v-model="launchDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-clear="clearLaunchDate"></DatePicker>
      </div>
      <div class="condition-group">
        <label>部　门</label>
        <Select v-model="page.deptCode" clearable class="big condition-group-ipt">
                  <Option v-for="dep in DeptList" :value="dep.id" :key="dep.id">{{ dep.deptName }}</Option>
        </Select>
      </div>
    </div>
    <div class="condition-row">
    <div class="condition-group">
        <label>药品名称</label>
        <Select
                      v-model="goodsName"
                      filterable
                      clearable
                      remote
                      placeholder="请选择药品名称"
                      :remote-method="queryDrugByListClick"
                      :loading="loading" @on-change="goodsClick(goodsName)" class="big condition-group-ipt" @on-clear="clearGoodDate">
                      <Option v-for="(option, index) in goodsList" :value="option.ctmmParam" :key="index">{{option.ctmmParam}}</Option>
                  </Select>
      </div>
    </div>
   <div class="condition-row mb15">
    <Button type="default" size="large" @click="createReplenishmentListClick()">生成补货计划</Button>
    <Button type="default" size="large" @click="exportDifferenceListClick()">导出</Button>
    <Button size="large" type="default" icon="ios-search" class="r" @click="findDifferenceListClick(true)">查询</Button>
   </div>
    <div class="demo-spin-container">
                 <Table :columns="columns" :data="druhList" style="width: 100%" @on-selection-change="handleSelectionChange"></Table>
                 <Spin size="large" fix v-if="spinShow"></Spin>
               </div>
               <div class="r mt15">
                <Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="findDifferenceListClick(false)" show-total show-elevator />
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
                        type: 'selection',
                        align: 'center',
                        width:'100',
                        fixed:'left',
                      },
                      {
                          type: 'index',
                          title: '序号',
                          align: 'center',
                          width:'60',
                          fixed:'left',
                      },
                      {
                          title: '订货日期',
                          key: 'sendDate',
                          align: 'center',
                          fixed:'left',
                          width:'100'
                      },
                      {
                          title: '采购订单',
                          key: 'orderCode',
                          align: 'center',
                          width:'150'
                      },
                      {
                          title: '供应商',
                          key: 'supplierName',
                          align: 'center',
                          width:'150',
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
                          title: '药品名称',
                          key: 'ctmmDesc',
                          align: 'center',
                          width:'150',
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
                          　　　　　　}, params.row.ctmmDesc),
                          　　　　　　h('div', {
                          　　　　　　　　slot: 'content',
                          　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                          　　　　　　},params.row.ctmmDesc)
                          　　　　])
                          　　])
                          }
                      },
                      {
                          title: '规格',
                          key: 'ctmmSpecification',
                          align: 'center',
                          width:'150',
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
                          　　　　　　}, params.row.ctmmSpecification),
                          　　　　　　h('div', {
                          　　　　　　　　slot: 'content',
                          　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                          　　　　　　},params.row.ctmmSpecification)
                          　　　　])
                          　　])
                          }
                      },
                      {
                          title: '单位',
                          key: 'unit',
                          align: 'center',
                          width:'80'
                      },
                      {
                          title: '生产厂家',
                          key: 'ctmmManufacturerName',
                          align: 'center',
                          width:'150',
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
                          title: '订货数量',
                          key: 'demandQuantity',
                          align: 'center',
                          width:'100',
                      },
                      {
                          title: '实到数量',
                          key: 'distributeQuantity',
                          align: 'center',
                          width:'100'
                      },
                      {
                          title: '缺货数量',
                          key: 'differenceQuantity',
                          align: 'center',
                          fixed:'right',
                          width:'100',
                      },
                      {
                          title: '补货数量',
                          key: 'replenishmentQuantity',
                          align: 'center',
                          fixed:'right',
                          width:'100',
                          render: (h, params) => {
                                return h('InputNumber', {
                                        props: {
                                              min:1,
                                              max:this.druhList[params.index].differenceQuantity,
                                              type: 'text',
                                              value: this.druhList[params.index].differenceQuantity,
                                        },
                                        on: { 
                                                'on-change':(event)=>{
                                                this.druhList[params.index].replenishmentQuantity = event;
                                                }
                                        },
                                });
                          }
                      },
                      {
                          title: '类型',
                          key: 'purchaseTypeName',
                          align: 'center',
                          fixed:'right',
                          width:'100',
                      },
                      {
                          title: '状态',
                          key: 'isReplenishmentName',
                          align: 'center',
                          fixed:'right',
                          width:'100'
                      },
                  ],
                  loading:false,
                  goodsName:'',
                  goodsList:[],
                  supplierList:[],
                  typeList:[
                          {value: "1", label: "零库存"},
                          {value: "2", label: "自采"} 
                  ],
                  DeptList:[],
                  stateList:[
                          {value: "1", label: "新欠品单"},
                          {value: "2", label: "已补计划"}
                  ],   
                  druhList:[],
                  launchDate:[],
                  page:{
                    pageNo:1,
                    pageSize:10,
                    totalPage:0,
                    supplierCode:'',
                    purchaseType:'',
                    isReplenishment:'1',
                    deptCode:'',
                    orderCode:'',
                    startTime:'',
                    endTime:'',
                    hisDrugCode:'',
                  }, 
                  backGoodsList:[],
              }
  },
  methods:{
    // 导出
    async exportDifferenceListClick(){
      let datalist = await this.$api.druhStorage.exportDifferenceList();
      let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
      let fileName = `${this.getCurrentDate()}配送缺货表.xls`;
      let objectUrl = URL.createObjectURL(blob); 
      const link = document.createElement('a')
      link.download = fileName;
      link.href = objectUrl;
      link.click();

      // let objectUrl = URL.createObjectURL(blob); 
      // // window.location.href = objectUrl;
      // window.open(objectUrl);
    },
    handleSelectionChange(selection) {
      this.backGoodsList = [];
      // this.backGoodsList = selection;
      for (let i = 0; i < selection.length; i++) {
        let item = {
            id: selection[i].id,
            bigDrugCode: selection[i].bigDrugCode,
            demandQuantity: selection[i].replenishmentQuantity,
            drugCode: selection[i].drugCode,
            drugPrice:selection[i].drugPrice,
            hisDrugCode:selection[i].hisDrugCode,
            supplierCode:selection[i].supplierCode
        }
         this.backGoodsList.push(item);
        } 
    },
    // 生成补货计划
    async createReplenishmentListClick(flag){
      if(this.backGoodsList.length == 0){
            this.$Message.error('请勾选药品!');
            return
      }
       if(!this.page.deptCode){
            this.$Message.error('请选择部门!');
            return
      }
       let item = {
            auditStatus: 2,
            deptCode: this.page.deptCode,
            list: this.backGoodsList,
            planType:1,
            purchaseType:1
      }
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.createReplenishmentList(item); 
      this.spinShow = false;
      this.backGoodsList = [];
      this.page.hisDrugCode = '';
      this.findDifferenceListClick(true);
    },
    clearLaunchDate(){
      this.launchDate = [];
      this.page.startTime = "";
      this.page.endTime = "";
    },
    clearGoodDate(){
      this.page.hisDrugCode = '';
    },
    // 列表
    async findDifferenceListClick(flag){
      let launchDate = this.launchDate;
        if(launchDate && Array.isArray(launchDate) && launchDate.length > 0 && launchDate[0] && launchDate[1]){
          this.page.startTime = this.$moment(launchDate[0]).format('YYYY-MM-DD');
          this.page.endTime = this.$moment(launchDate[1]).format('YYYY-MM-DD');
        }
      if(flag){
        this.page.pageNo = 1;
      }
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.findDifferenceList(this.page); 
      this.spinShow = false;
      this.druhList=datalist.data.list;
      this.druhList.forEach((item,index)=>{
          this.druhList[index].replenishmentQuantity = this.druhList[index].differenceQuantity
      })
      this.page.totalPage = datalist.data.count;
    },
    // 供应商
    async supplierAllListClick(){
      let datalist = await this.$api.publics.supplierAllList();
      this.supplierList=datalist.data;
    }, 
    // 来源部门
    async getSysDeptByModuleListClick(){
      let datalist = await this.$api.publics.getSysDeptByModuleList({'deptType':3});
      this.DeptList=datalist.data;
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
      this.findDifferenceListClick();
    }
  },
  created(){
    // console.log(this.$store.state.currentSelect);
    // 供应商
    this.supplierAllListClick();
    // 来源部门
    this.getSysDeptByModuleListClick();
    // 列表
    this.findDifferenceListClick(false);
  }
}
</script>

