<template>
  <div class="container">
    <Card :bordered="false" dis-hover class="card-item info-item">
      <p slot="title">基本信息</p>
      <Row :gutter="20">
        <Col span="8" v-for="(item,index) in basicInfo" :key="index">
          <span>{{ item.name }}：</span>
          <span>{{ item.value }}</span>
        </Col>
      </Row>
    </Card>
    <Collapse v-model="collapse.a" class="card-item info-item">
      <Panel name="1">
        <span>使用单位</span>
        <Row :gutter="20" slot="content">
          <Col span="12" v-for="(item,index) in useUnit" :key="index">
            <span>{{ item.name }}：</span>
            <span>{{ item.value }}</span>
          </Col>
        </Row>
      </Panel>
    </Collapse>
    <Collapse v-model="collapse.b" class="card-item info-item">
      <Panel name="1">
        <span>库存基数</span>
        <Row :gutter="20" slot="content">
          <Col span="8" v-for="(item,index) in storageBase" :key="index">
            <span>{{ item.name }}：</span>
            <span>{{ item.value }}</span>
          </Col>
        </Row>
      </Panel>
    </Collapse>
    <Collapse v-model="collapse.c" class="card-item info-item">
      <Panel name="1">
        <span>药品信息</span>
        <Row :gutter="20" slot="content">
          <Col span="8" v-for="(item,index) in drugInfo" :key="index">
            <span>{{ item.name }}：</span>
            <span>{{ item.value }}</span>
          </Col>
        </Row>
      </Panel>
    </Collapse>
  </div>
</template>
<script>
  import { Message,Modal } from 'iView';
  import { difference } from 'lodash';
  export default {
    data () {
      return {
        collapse:{a:'1', b:'1', c:'1'},
        id:'',
        bigDrugCode:'',
        drugCode:'',
        detailInfo:{},
        basicInfo:[],//基本信息
        useUnit:[//使用单位
          {name:'最小发药单位',value:''},
          {name:'包装规格',value:''},
          {name:'整包装单位',value:''},
          {name:'补货单位',value:''}
        ],
        storageBase:[],//库存基数
        drugInfo:[],//药品信息
      }
    },
    methods: {
      async getUnit(bigDrugCode = this.bigDrugCode){
        let data = await this.$api.baseDrug.getHisMedicineTransfor({
          bigDrugCode
        });
        let d = data.data;
        d.forEach(item => {
          if(item.sort === 1) {
            this.useUnit[2].value = this.unitTransform(item);
          };
          if(item.sort === 2) {
            this.useUnit[1].value = this.unitTransform(item);
          };
          if(item.sort === 3) {
            this.useUnit[0].value = this.unitTransform(item);
          };
        });
      },
      unitTransform(unitList) {
        let {bigUnit, conversionRate, smallUit} = unitList;
        return `${bigUnit} = ${conversionRate} ${smallUit}`;
      },
      async getData(bigDrugCode = this.bigDrugCode,drugCode = this.drugCode){
        let data = await this.$api.baseDrug.getHisMedicineInfo({
          bigDrugCode,drugCode
        });
        this.detailInfo = data.data;
        this.setInfoList();
      },
      setInfoList(){
        let info = this.detailInfo;
        const basicInfo = [
          {name:'通用名',value:info.ctmmGenericName?info.ctmmGenericName:''},
          {name:'商品名',value:info.ctmmTradeName?info.ctmmTradeName:''},
          {name:'别名',value:info.ctmmAnotherName?info.ctmmAnotherName:''},
          {name:'规格',value:info.ctmmSpecification?info.ctmmSpecification:''},
          {name:'包装规格',value:info.packageSpecification?info.packageSpecification:''},
          {name:'剂型',value:info.ctmmDosageFormDesc?info.ctmmDosageFormDesc:''},
          {name:'生产厂家',value:info.ctmmManufacturerName?info.ctmmManufacturerName:''},
          {name:'批准文号',value:info.approvalNo?info.approvalNo:''},
          {name:'药品编码',value:info.hisDrugCode?info.hisDrugCode:''},
          {name:'状态',value:info.ctmmStatusCode?info.ctmmStatusCode==="1"?'停用':'启用':''},
        ];
        const storageBase = [{
          name:'库存基数',value:info.stockBase?info.stockBase:0
        }];
        const drugInfo = [
          {name:'药品名称',value:info.ctmmDesc?info.ctmmDesc:''},
          {name:'药品剂量',value:info.ctphdmiDosageUnitDesc?info.ctphdmiDosageUnitDesc:''},
          {name:'药学分类描述',value:info.ctphdmiCategoryDesc?info.ctphdmiCategoryDesc:''},
          {name:'管制分类描述',value:info.ctphdmiRegulatoryClassDesc?info.ctphdmiRegulatoryClassDesc:''},
          {name:'危重药物标志',value:info.ctmmCriticalCareMedicine?info.ctmmCriticalCareMedicine:''},
          {name:'抗菌药物标志',value:info.ctmmAntibacterialsign?info.ctmmAntibacterialsign:''},
          {name:'国家基本药物标记',value:info.ctmmEssentialMedicine?info.ctmmEssentialMedicine:''},
          {name:'贵重标记',value:info.ctmmValuableSign?info.ctmmValuableSign==="1"?'Y':'N':''},
          {name:'皮试标志',value:info.ctmmSkintestSign?info.ctmmSkintestSign==="1"?'Y':'N':''},
          {name:'冷藏标识',value:info.refrigerateType?info.refrigerateType==="1"?'Y':'N':''},
          {name:'停用标记',value:info.ctmmStatusCode?info.ctmmStatusCode==="1"?'Y':'N':''}
        ]
        this.useUnit[3].value  = info.replanUnit?info.replanUnit:'';
        this.basicInfo = basicInfo;
        this.storageBase = storageBase;
        this.drugInfo = drugInfo;
      }
    },
    created(){
      this.id = this.$route.query.id;
      this.bigDrugCode = this.$route.query.bigDrugCode;
      this.drugCode = this.$route.query.drugCode;
      this.getUnit();
      this.getData();
    },
  }
</script>
<style lang="less" scoped>
  .container{
    background-color: #f5f7f9;
    .card-item{
      margin-bottom:10px;
      .customUnit{
        display: inline-block;
        width: 97%;
        .customUnit-button{
          float: right;
          margin-top: 6px;
        }
      }
    }
    /deep/.ivu-collapse{
      border: none;
      background-color: #fff;
      border-radius: 0px;
      .ivu-collapse-item{
        .ivu-collapse-header {
          height: 48px;
          line-height: 48px;
          color: #17233d;
          font-size: 14px;
          font-weight: 700;
          border-bottom: 1px solid #fff;
          width: 100%;
          i{
            margin-right: 0;
          }
        }
        .ivu-collapse-content-box{
          padding-top: 0;
        }
      }
    }
    /deep/.ivu-input-number{
      width: 100%;
    }
    .info-item{
      .ivu-col {
        margin-bottom:10px;
        font-size: 14px;
      }
    }
  }
</style>

