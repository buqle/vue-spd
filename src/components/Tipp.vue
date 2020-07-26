<template>
  <Select
    v-model="model13"
    transfer
    remote
    filterable
    :remote-method="showLoc"
    :loading="loading1"
  >
    <Option v-for="(option, index) in locArr" :value="option.targetLocName" :key="index">
      <p @click="changeLoc(option)">
        {{option.targetLocName}}
      </p>

    </Option>
  </Select>
</template>

<script>
    export default {
        name: "Tipp",
      props: ['row'],
      data(){
          return{
            locArr:[],
            model13:'',
            loading1:false,
            okFeath:false
          }
      },
      methods:{
        async showLoc(e){
          let record=this.row;
         if(!this.okFeath){
           let menuListSbumit= await this.$api.pharmacy.seachAdjustLoc({
             drugCode: record.drugCode,
             goodsCode: record.goodsCode,
             id: record.id,
             lot: record.lot,
             goodsName: e
           });
           this.loading1=true
           if(menuListSbumit.code==200){
             if(menuListSbumit.data.length==0){
               this.loading1=false;
               this.$Message.error('请输入正确的货位');
               return false;
             }
             this.locArr=menuListSbumit.data;
             this.loading1=false;
           }
         }
        },
        changeLoc(item){
          console.log(item)
          this.model13=item.targetLocName
          this.$emit('on-choosed',item);
        }
      },
      watch:{
        model13(val, oldVal){
          if(!oldVal){
            this.okFeath=true
          };

        }
      }
    }
</script>

<style scoped>

</style>
