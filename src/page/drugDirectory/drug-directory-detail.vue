<template>
  <div class="container">
    <Card :bordered="false" class="card-item info-item">
      <p slot="title">基本信息</p>
      <p slot="extra" class="btn-style">
        <Button type="default" icon="md-checkmark" @click.native="handleSubmit('formValidate')">保存</Button>
      </p>
      <Row :gutter="20">
        <Col span="8">
          <span>药品名称：</span>
          <span>{{ detailInfo.ctmmTradeName ? detailInfo.ctmmTradeName: ''}}</span>
        </Col>
        <Col span="8">
          <span>别名：</span>
          <span>{{ detailInfo.ctmmAnotherName ? detailInfo.ctmmAnotherName: ''}}</span>
        </Col>
        <Col span="8">
          <span>包装规格：</span>
          <span>{{ detailInfo.packageSpecification ? detailInfo.packageSpecification: ''}}</span>
        </Col>
        <Col span="8">
          <span>剂型：</span>
          <span>{{ detailInfo.ctmmDosageFormDesc ? detailInfo.ctmmDosageFormDesc: ''}}</span>
        </Col>
        <Col span="8">
          <span>生产厂家：</span>
          <span>{{ detailInfo.ctmmManufacturerName ? detailInfo.ctmmManufacturerName: ''}}</span>
        </Col>
        <Col span="8">
          <span>批准文号：</span>
          <span>{{ detailInfo.approvalNo ? detailInfo.approvalNo: ''}}</span>
        </Col>
        <Col span="8">
          <span>状态：</span>
          <span>{{ detailInfo.statusName ? detailInfo.statusName: ''}}</span>
        </Col>
        <Col span="8">
          <span>药品编码：</span>
          <span>{{ detailInfo.hisDrugCode ? detailInfo.hisDrugCode: ''}}</span>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" class="card-item">
      <p slot="title">单位信息</p>
      <Row>
        <Table :columns="columns" :data="detailInfo.listTransforsVo"></Table>
      </Row>
    </Card>
    <Card :bordered="false" class="card-item">
      <p slot="title">报告药标识</p>
      <Form class="form-container" label-position="left" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <Row>
          <Col span="8">
            <FormItem label="是否报告药" prop="medDrugType">
              <RadioGroup v-model="formValidate.medDrugType">
                <Radio :label="2">是</Radio>
                <Radio :label="1">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="是否贵重" prop="ctmmValuableSign">
              <RadioGroup v-model="formValidate.ctmmValuableSign">
                <Radio label="Y">是</Radio>
                <Radio label="N">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="是否高危" prop="ctmmCriticalCareMedicine">
              <RadioGroup v-model="formValidate.ctmmCriticalCareMedicine">
                <Radio label="Y">是</Radio>
                <Radio label="N">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="存储条件" prop="storageCondition">
              <RadioGroup v-model="formValidate.storageCondition">
                <Radio :label="1">常温</Radio>
                <Radio :label="2">阴凉</Radio>
                <Radio :label="3">冷库</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="毒麻标识" prop="poisonHemp">
              <RadioGroup v-model="formValidate.poisonHemp">
                <Radio :label="2">是</Radio>
                <Radio :label="1">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card :bordered="false" class="card-item info-item">
      <p slot="title">药品信息</p>
      <Row :gutter="20">
        <Col span="8">
          <span>药品名称：</span>
          <span>{{ detailInfo.ctmmDesc ? detailInfo.ctmmDesc: ''}}</span>
        </Col>
        <Col span="8">
          <span>药品剂量：</span>
          <span>{{ detailInfo.ctphdmiDosageUnitDesc ? detailInfo.ctphdmiDosageUnitDesc: ''}}</span>
        </Col>
        <Col span="8">
          <span>药学分类描述：</span>
          <span>{{ detailInfo.ctphdmiCategoryDesc ? detailInfo.ctphdmiCategoryDesc: ''}}</span>
        </Col>
        <Col span="8">
          <span>管制分类描述：</span>
          <span>{{ detailInfo.ctphdmiRegulatoryClassDesc ? detailInfo.ctphdmiRegulatoryClassDesc: ''}}</span>
        </Col>
        <Col span="8">
          <span>抗菌药物标志：</span>
          <span>{{ detailInfo.ctmmAntibacterialsign ? detailInfo.ctmmAntibacterialsign: ''}}</span>
        </Col>
        <Col span="8">
          <span>国家基本药物标记：</span>
          <span>{{ detailInfo.ctmmEssentialMedicine ? detailInfo.ctmmEssentialMedicine: ''}}</span>
        </Col>
        <Col span="8">
          <span>皮试标志：</span>
          <span>{{ detailInfo.ctmmSkintestSign ? detailInfo.ctmmSkintestSign: ''}}</span>
        </Col>
        <Col span="8">
          <span>停用标记：</span>
          <span>{{ detailInfo.ctmmStatusCode ? detailInfo.ctmmStatusCode: ''}}</span>
        </Col>
      </Row>
    </Card>

  </div>
</template>
<script>
  import { Message } from 'iView';
  export default {
    data () {
      return {
        formValidate:{
          hisDrugCode:0,
          medDrugType:0,
          ctmmCriticalCareMedicine:'',
          ctmmValuableSign:'',
          storageCondition:0,
          poisonHemp:0
        },
        ruleValidate:{
          medDrugType:[
            { required: true, type:'number',message: '请选择是否报告药', trigger: 'change' }
          ],
          ctmmCriticalCareMedicine:[
            { required: true, message: '请选择是否贵重', trigger: 'change' }
          ],
          ctmmValuableSign:[
            { required: true, message: '请选择是否高危', trigger: 'change' }
          ],
          storageCondition:[
            { required: true, type:'number',message: '请选择存储条件', trigger: 'change' }
          ],
          poisonHemp:[
            { required: true, type:'number',message: '请选择毒麻标识', trigger: 'change' }
          ]
        },
        hisDrugCode:'',
        detailInfo:{},
        columns: [
          {
            type: 'index',
            title: '序号',
            align: 'center'
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

      }
    },
    methods: {
      async getDrugListDetail(hisDrugCode = this.hisDrugCode){
        let data = await this.$api.purchase.drugListDetail({
          hisDrugCode
        });
        this.detailInfo  = data.data;
        this.formValidate = {
          hisDrugCode,
          medDrugType:this.detailInfo.medDrugType,
          ctmmCriticalCareMedicine:this.detailInfo.ctmmCriticalCareMedicine,
          ctmmValuableSign:this.detailInfo.ctmmValuableSign,
          storageCondition:this.detailInfo.storageCondition,
          poisonHemp:this.detailInfo.poisonHemp
        }
      },
      handleSubmit(name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.saveData();
          } else {
            Message.error('请输入必填值！');
          }
        })
      },
      async saveData(){
        let saveInfo = await this.$api.purchase.saveDrugListDetail(this.formValidate);
        if(saveInfo.code == 200){
          Message.success('保存成功！');
          this.getDrugListDetail();
        }else{
          Message.error('保存失败！');
        }
      }
    },
    created(){
      this.hisDrugCode = this.$route.query.hisDrugCode;
      this.getDrugListDetail();
    },
  }
</script>
<style lang="less" scoped>
  .container{
    .card-item{
      margin-bottom:10px;
    }
    .info-item{
      .ivu-col {
        margin-bottom:10px;
        font-size: 14px;
      }
    }
  }
</style>

