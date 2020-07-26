<template>
  <div class="container">
    <Card :bordered="false" dis-hover class="card-item info-item">
      <p slot="title">基本信息</p>
      <p slot="extra" class="btn-style">
        <Button type="default" icon="md-checkmark" @click.native="handleSubmit()">保存</Button>
      </p>
      <Row :gutter="20">
        <Col span="8" v-for="(item,index) in basicInfo" :key="index">
          <span>{{ item.name }}：</span>
          <span>{{ item.value }}</span>
        </Col>
      </Row>
    </Card>
    <Collapse v-model="collapse.a" class="card-item">
      <Panel name="1">
        <span>单位信息</span>
        <Row slot="content">
          <Table :columns="columns" :data="listTransforsVo"></Table>
        </Row>
      </Panel>
    </Collapse>
    <Collapse v-model="collapse.b" class="card-item info-item">
      <Panel name="1">
        <span>价格</span>
        <Row slot="content">
          <Form class="form-container" label-position="left" ref="ruleValidate" :model="detailInfo" :rules="ruleValidate">
            <Row>
              <Col span="8" v-for="(item,index) in priceInfo" :key="index">
                <FormItem v-if="item.type == 'radio'" :label="item.name" prop="purchaseType">
                  <RadioGroup v-model="detailInfo.purchaseType">
                    <Radio :label="1">零库存</Radio>
                    <Radio :label="2">自采</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem v-else :label="item.name">
                  <span>{{item.value}}</span>
                </FormItem>
              </Col>
            </Row>
          </Form>
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
        ruleValidate:{
          purchaseType:[
            { required: true, type:'number',message: '请选择采购方式', trigger: 'change' }
          ]
        },
        collapse:{a:'1', b:'1', c:'1'},
        id:'',
        hisDrugCode:'',
        detailInfo:{},
        listTransforsVo:[],
        columns: [
          {
            type: 'index',
            title: '序号',
            align: 'center',
            width: 80
          },
          {
            title: '单位属性',
            key: 'sort',
            align: 'center',
            render: (h, params) => {
              switch (params.row.sort) {
                case 1:
                  return h('span', '整包装单位');
                  break;
                case 2:
                  return h('span', '包装规格');
                  break;
                case 3:
                  return h('span', '最小发药单位');
                  break;
                case 4:
                  return h('span', '补货单位');
                  break;
                default:
                  return "";
              }
            }
          },
          {
            title: '单位名称',
            key: 'bigUnit',
            align: 'center'

          },
          {
            title: '转化系数',
            key: 'conversionRate',
            align: 'center'

          },
          {
            title: '基础单位',
            key: 'smallUit',
            align: 'center'
          }
        ],
        basicInfo:[],//基本信息
        priceInfo:[],//价格信息
        drugInfo:[],//药品信息
      }
    },
    methods: {
      handleSubmit(){
        Modal.confirm({
          title: '确认',
          content: '<p>确认保存吗？</p>',
          onOk: () => {
            this.$refs['ruleValidate'].validate((valid) => {
              if (valid) {
                this.saveData();
              }else{
                Message.error('请选择采购方式！');
              }
            });
          },
          onCancel: () => {}
        });
      },
      async saveData(){
        let saveInfo = await this.$api.purchase.updateSupplierRefPrice({
          id:this.id,
          purchaseType: this.detailInfo.purchaseType
        });
        if(saveInfo.code == 200){
          Message.success('保存成功！');
          this.$router.push({path: "/sys/drugDirectory/supplierDrugs"})
        }else{
          Message.error('保存失败！');
        }
      },
      async getData(id = this.id,hisDrugCode = this.hisDrugCode){
        let data = await this.$api.purchase.getMedicineInfo({
          id,hisDrugCode
        });
        this.detailInfo = data.data;
        let {listTransforsVo} = data.data;
        //单位信息
        listTransforsVo.push({
          sort: 4,
          bigUnit: data.data.replanUnit
        });
        this.listTransforsVo = data.data.listTransforsVo;
        this.setInfoList();
      },
      setInfoList(){
        let info = this.detailInfo;
        const basicInfo = [
          {name:'药品名称',value:info.ctmmTradeName?info.ctmmTradeName:''},
          {name:'别名',value:info.ctmmAnotherName?info.ctmmAnotherName:''},
          {name:'包装规格',value:info.packageSpecification?info.packageSpecification:''},
          {name:'剂型',value:info.ctmmDosageFormDesc?info.ctmmDosageFormDesc:''},
          {name:'生产厂家',value:info.ctmmManufacturerName?info.ctmmManufacturerName:''},
          {name:'批准文号',value:info.approvalNo?info.approvalNo:''},
          {name:'药品编码',value:info.hisDrugCode?info.hisDrugCode:''},
          {name:'状态',value:info.statusName?info.statusName:''},
        ];
        const priceInfo = [
          {name:'价格',value:info.drugPrice?info.drugPrice.toFixed(4):''},
          {name:'供应商',value:info.supplierName?info.supplierName:''},
          {name:'采购方式',value:info.purchaseType?info.purchaseType:'',type:'radio'}
        ];
        const drugInfo = [
          {name:'药品名称',value:info.ctmmDesc?info.ctmmDesc:''},
          {name:'药品剂量',value:info.ctmmDosage?info.ctmmDosage:''},
          {name:'药学分类描述',value:info.ctphdmiCategoryDesc?info.ctphdmiCategoryDesc:''},
          {name:'管制分类描述',value:info.ctphdmiRegulatoryClassDesc?info.ctphdmiRegulatoryClassDesc:''},
          {name:'危重药物标志',value:info.ctmmCriticalCareMedicine?info.ctmmCriticalCareMedicine:''},
          {name:'抗菌药物标志',value:info.ctmmAntibacterialsign?info.ctmmAntibacterialsign:''},
          {name:'国家基本药物标记',value:info.ctmmEssentialMedicine?info.ctmmEssentialMedicine:''},
          {name:'贵重标记',value:info.ctmmValuableSign?info.ctmmValuableSign==="1"?'Y':'N':''},
          {name:'皮试标志',value:info.ctmmSkintestSign?info.ctmmSkintestSign=="1"?'Y':'N':''},
          {name:'冷藏标识',value:info.refrigerateType?info.refrigerateType=="1"?'Y':'N':''},
          {name:'停用标记',value:info.ctmmStatusCode?info.ctmmStatusCode=="1"?'Y':'N':''}
        ];
        this.basicInfo = basicInfo;
        this.priceInfo = priceInfo;
        this.drugInfo = drugInfo;
      }
    },
    created(){
      this.id = this.$route.query.id;
      this.hisDrugCode = this.$route.query.hisDrugCode;
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

