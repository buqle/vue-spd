<template>
  <div class="condition">
    <div class="condition-row">
      <div class="condition-group">
        <label>供应商</label>
        <Select v-model="form.supplierCode" class="condition-group-ipt" clearable>
          <Option v-for="sup in suppliers" :value="sup.ctmaSupplierCode" :key="sup.ctmaSupplierCode">{{sup.ctmaSupplierName}}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>药品名称</label>
        <RemoteSelect
          :fun="handleQuery"
          :options="options"
          :loading="selectLoading"
          :optionValue="optionValue"
          :optionText="optionText"
          v-model="form.hisDrugCodeList"
          placeholder="药品名称">
        </RemoteSelect>
      </div>
      <div class="condition-group">
        <label>统计时间</label>
        <DatePicker v-model="updateDate" type="daterange" class="condition-group-ipt" placement="bottom-end" placeholder="更新时间" @on-clear="handleClear"></DatePicker>
      </div>
    </div>
    <div class="condition-row">
      <div class="condition-group">
        <label>类　型</label>
        <Select v-model="form.types" class="condition-group-ipt" clearable>
          <Option v-for="ty in types" :value="ty.value" :key="ty.value">{{ty.label}}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>生产批号</label>
        <Input v-model="form.lot" placeholder="请输入生产批号" class="condition-group-ipt"></Input>
      </div>
      <div class="condition-group">
        <label>包含拆零移库信息</label>
        <Checkbox v-model="isShow" class="condition-group-check"></Checkbox>
      </div>
    </div>
    <div class="condition-row">
      <Button size="large" type="default" icon="md-download" class="l" @click="exportData()">导出</Button>
      <Button size="large" type="default" icon="ios-search" class="r" @click="getData(true)">查询</Button>
    </div>
    <div class="condition-table">
      <Table :loading="loading" :columns="columns" :data="dataList"></Table>
    </div>
    <div class="condition-page">
      <Page :total="page.total" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getData()" show-total show-elevator />
    </div>
  </div>
</template>
<script>
  import RemoteSelect from '@/components/RemoteSelect'
  export default {
    components:{
      RemoteSelect
    },
    data () {
      return {
        page:{
          pageNo:1,
          pageSize:10,
          total:0
        },
        form: {
          supplierCode:'',
          hisDrugCodeList:'',
          secondType:'',
          lot:'',
          startTime:'',
          endTime:'',
          isShowOthersType:true
        },
        isShow:true,
        options:[],
        selectLoading:false,
        optionValue:'bigDrugCode',
        optionText:'ctmmParam',
        query:{
          paramName: '',
          queryType: 3
        },
        dataList:[],
        types:[],
        suppliers:[],
        updateDate:[],//更新时间
        loading: false,
        columns: [
          {
            type: 'index',
            title: '序号',
            width: 60,
            align: 'center'
          },
          {
            title: '类型',
            key: 'type',
            align: 'center',
            width: 168,
          },
          {
            title: '时间',
            key: 'createDate',
            align: 'center',
            width: 168,
          },
          {
            title: '单号',
            key: 'orderNo',
            align: 'center',
            width: 168,
          },
          {
            title: '通用名',
            key: 'ctmmGenericName',
            align: 'center',
            width: 224,
          },
          {
            title: '商品名',
            key: 'ctmmTradeName',
            align: 'center',
            width: 224,
          },
          {
            title: '规格',
            key: 'ctmmSpecification',
            align: 'center',
            width: 168,
          },
          {
            title: '生产厂家',
            key: 'ctmmManufacturerName',
            align: 'center',
            width: 224,
          },
          {
            title: '单位',
            key: 'unit',
            align: 'center',
            width: 112,
          },
          {
            title: '生产批号',
            key: 'lot',
            align: 'center',
            width: 168,
          },
          {
            title: '生产日期',
            key: 'productDate',
            align: 'center',
            width: 168,
          },
          {
            title: '有效期至',
            key: 'validEndDate',
            align: 'center',
            width: 168,
          },
          {
            title: '包装规格',
            key: 'packageSpecification',
            align: 'center',
            width: 168,
          },
          {
            title: '剂型',
            key: 'ctmmDosageFormDesc',
            align: 'center',
            width: 168,
          },
          {
            title: '供应商',
            key: 'supplierName',
            align: 'center',
            width: 168,
          },
          {
            title: '药品编号',
            key: 'hisDrugCode',
            align: 'center',
            width: 168,
          },
          {
            title: '批准文号',
            key: 'approvalNo',
            align: 'center',
            width: 168,
          },
          {
            title: '库存数量',
            key: 'stockNum',
            align: 'center',
            fixed: 'right',
            width: 112
          },
          {
            title: '入库数量',
            key: 'inStockNum',
            align: 'center',
            fixed: 'right',
            width: 112,
          },
          {
            title: '出库数量',
            key: 'outStockNum',
            align: 'center',
            fixed: 'right',
            width: 112,
          },
          {
            title: '结存数量',
            key: 'balanceNum',
            align: 'center',
            fixed: 'right',
            width: 112,
          }
        ],

      }
    },
    methods:{
      handleQuery(value){
        if(value !== ''){
          this.queryDrugByList(value);
        }else{
          this.options  = [];
        }
      },
      async queryDrugByList(value){
        Object.assign(this.query,{paramName:value});
        this.selectLoading = true;
        let data = await this.$api.publics.queryDrugByList({
          ...this.query
        });
        this.selectLoading = false;
        this.options = data.data;
      },
      async getType(){
        let datalist = await this.$api.publics.typeList({
          type: 'base_medicine_standing'
        });
        this.types = datalist.data;
      },
      async getSupplier(){
        let datalist = await this.$api.publics.getBasicSupplier();
        this.suppliers = datalist.data;
      },
      async getData(flag){
        let updateDate = this.updateDate;
        if(updateDate && Array.isArray(updateDate) && updateDate.length > 0 && updateDate[0] && updateDate[1]){
          this.form.startTime = this.$moment(updateDate[0]).format('YYYY-MM-DD');
          this.form.endTime = this.$moment(updateDate[1]).format('YYYY-MM-DD');
        }
        if(flag){
          this.page.pageNo = 1;
        }
        if(this.isShow){
          this.form.isShowOthersType = 1;
        }else{
          this.form.isShowOthersType = 2;
        }
        this.loading = true;
        let datalist = await this.$api.baseDrug.newDrugLedger({
          ...this.form,pageNo:this.page.pageNo,pageSize:this.page.pageSize
        });
        this.loading = false;
        let data = datalist.data;
        this.dataList = data.list;
        this.page = { total: data.count, pageNo: data.pageNo,pageSize: data.pageSize};
      },
      async exportData(exportType = 1){
        let datalist = await this.$api.baseDrug.newExport({
          ...this.form
        });
        let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
        let fileName = `${this.getCurrentDate()}药品目录.xls`;
        let objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a')
        link.download = fileName;
        link.href = objectUrl;
        link.click();
      },
      handleClear(){
        this.updateDate = [];
        this.form.startTime = "";
        this.form.endTime = "";
      }
    },
    created(){
      this.getSupplier();
      this.getType();
      this.getData();
    }
  }
</script>
<style lang="less" scoped>
 /* /deep/ .ivu-select-dropdown{
    .ivu-select-dropdown-list{
      .ivu-select-item{
        max-width:336px;
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
        word-break: break-all;
      }
    }
  }
  .condition-group-check{
    margin-left: 10px;
  }*/
</style>
