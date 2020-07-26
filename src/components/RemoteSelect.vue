<template>
  <Select filterable
          remote
          clearable
          :remote-method="fun"
          :loading="loading"
          :value="selectValue"
          :class="cls"
          :placeholder="placeholder"
          @on-change="setSelectValue">
    <Option v-for="(item,index) in options" :value='item[optionValue]' :key="index">{{item[optionText]}}</Option>
  </Select>
</template>

<script>
  export default {
    name:'RemoteSelect',
    model: {
      prop: 'selectValue',
      event: 'setSelectValue'
    },
    props: {
      fun: {
        type: Function,
        default: () => () => {}
      },
      options:{
        type: Array,
        default: () => {return []}
      },
      loading:{
        type:Boolean,
        default:false
      },
      selectValue:{
        type:[String, Number],
        default:''
      },
      cls:{
        type:String,
        default:'condition-group-ipt'
      },
      optionValue:{
        type:String,
        default:''
      },
      optionText:{
        type:String,
        default:''
      },
      placeholder:{
        type:String,
        default:''
      }
    },
    data(){
      return{
      }
    },
    methods:{
      setSelectValue(e){
        this.$emit('setSelectValue', e)
      }
    }
  }
</script>

<style scoped lang="less">

</style>


<!--<template>
  <Select filterable
          remote
          clearable
          :remote-method="fun"
          :loading="loading"
          v-model="currentValue">
    <Option v-for="(item,index) in options" :value='item[optionValue]' :key="index">{{item[optionText]}}</Option>
  </Select>
</template>

<script>
  export default {
    name:'RemoteSelect',
    props: {
      fun: {
        type: Function,
        default: () => () => {}
      },
      options:{
        type: Array,
        default: () => {return []}
      },
      loading:{
        type:Boolean,
        default:false
      },
      selectValue:{
        type:[String, Number],
        default:''
      },
      optionValue:{
        type:String,
        default:''
      },
      optionText:{
        type:String,
        default:''
      }
    },
    data(){
      return{
        currentValue:'',
      }
    },
    created() {
      this.setValue();
    },
    methods:{
      setValue(){
        this.currentValue = this.selectValue;
      }
    },
    watch:{
      'currentValue': {
        deep: true,
        handler (newVal, oldVal) {
          this.$emit('setSelectValue', newVal)
        }
      },
    },
    computed: {

    }
  }
</script>

<style scoped lang="less">

</style>-->
