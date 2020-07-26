<template>
  <div class="condition">
    <div class="condition-row">
      <div class="condition-group">
        <label>名称</label>
        <Input v-model="form.ctmmDesc" placeholder="请输入名称" class="condition-group-ipt"></Input>
      </div>
      <div class="condition-group">
        <label>状态</label>
        <Select v-model="form.ctmmStatusCode" class="condition-group-ipt">
          <Option value=''>全部</Option>
          <Option value='0'>启用</Option>
          <Option value='1'>停用</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>更新时间</label>
        <DatePicker v-model="updateDate" type="daterange" class="condition-group-ipt" placement="bottom-end" placeholder="更新时间" @on-clear="handleClear"></DatePicker>
      </div>
    </div>
    <div class="condition-row">
      <div class="condition-group">
        <label>剂型</label>
        <Input v-model="form.ctmmDosageFormDesc" placeholder="请输入剂型" class="condition-group-ipt"></Input>
      </div>
      <div class="condition-group">
        <label>是否报告药</label>
        <Select v-model="form.medDrugType" class="condition-group-ipt" style="margin-left: 0">
          <Option value=''>全部</Option>
          <Option value='2'>是</Option>
          <Option value='1'>否</Option>
        </Select>
      </div>
    </div>
    <div class="condition-row">
      <Button size="large" type="default" icon="md-download" class="l" @click="exportData()">导出</Button>
      <Button size="large" type="default" icon="ios-search" class="r" @click="getData(true)">查询</Button>
    </div>
    <div class="condition-table">
      <Table :loading="loading" :columns="columns" :data="drugList"></Table>
    </div>
    <div class="condition-page">
      <Page :total="page.total" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getData()" show-total show-elevator />
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        page:{
          pageNo:1,
          pageSize:10,
          total:0
        },
        form: {
          ctmmDesc: '',//名称
          ctmmDosageFormDesc: '',//剂型
          ctmmStatusCode: '',//状态
          medDrugType:'',//是否报告药
          startTime:'',
          endTime:''
        },
        updateDate:[],//更新时间
        loading: false,
        columns: [
          {
            type: 'index',
            title: '序号',
            align: 'center'
          },
          {
            title: '药品名称',
            key: 'ctmmTradeName',
            align: 'center',
            render: (h, params) => {
              return h('span', {
                style: {color:'#0681f4',cursor:'pointer'},
                on: {
                  click: () => {
                    this.$router.push({path: "/sys/drugDirectory/directory/detail", query:{hisDrugCode:params.row.hisDrugCode}})
                  }
                }
              },params.row.ctmmTradeName);
            }
          },
          {
            title: '剂型',
            key: 'ctmmDosageFormDesc',
            align: 'center'

          },
          {
            title: '包装规格',
            key: 'packageSpecification',
            align: 'center'

          },
          {
            title: '批准文号',
            key: 'approvalNo',
            align: 'center'
          },
          {
            title: '生产厂家',
            key: 'ctmmManufacturerName',
            align: 'center'
          },
          {
            title: '是否报告药',
            key: 'drugTypeName',
            align: 'center'
          },
          {
            title: '状态',
            key: 'ctmmStatusCode',
            align: 'center',
            render: (h, params) => {
              return h('Badge',{
                props: {
                  status: params.row.ctmmStatusCode == "0" ? "success" :"error",
                  text: params.row.ctmmStatusCode == "0" ? "启用" :"停用"
                }
              });
            }
          }
        ],
        drugList:[],
      }
    },
    methods:{
      async getData(flag){
        let updateDate = this.updateDate;
        if(updateDate && Array.isArray(updateDate) && updateDate.length > 0 && updateDate[0] && updateDate[1]){
          this.form.startTime = this.$moment(updateDate[0]).format('YYYY-MM-DD');
          this.form.endTime = this.$moment(updateDate[1]).format('YYYY-MM-DD');
        }
        if(flag){
          this.page.pageNo = 1;
        }
        this.loading = true;
        let datalist = await this.$api.purchase.drugList({
          ...this.form,pageNo:this.page.pageNo,pageSize:this.page.pageSize
        });
        this.loading = false;
        let data = datalist.data;
        this.drugList = data.list;
        this.page = { total: data.count, pageNo: data.pageNo,pageSize: data.pageSize};
      },
      async exportData(exportType = 1){
        let datalist = await this.$api.purchase.exportDrugList({
          exportType,...this.form
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
        this.startTime = "";
        this.endTime = "";
      }
    },
    created(){
      this.getData();
    }
  }
</script>
