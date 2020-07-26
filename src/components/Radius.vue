<template>
    <div class="radius-warp">
     <div v-if="ondisabled"  class="button" style="background: #c0c0c0">{{iconText}}</div>
     <div flexcont @click="upDate" :class="`button${buttonSize}`" class="button" flexcont v-else>
       <svg class="icon" aria-hidden="true" :class="`icon-${iconSize}`" v-if="iconSize">
         <use :xlink:href="`#${iconHref}`"></use>
       </svg>
       <span>{{iconText}}</span>
     </div>
    </div>
</template>

<script>
    export default {
        props:['iconHref','iconText','iconSize','buttonSize','ondisabled'],
        data(){
          return{
            isCute:false,
          }
        },
        methods:{
          async upDate(){
            if(this.isCute){
              return false;
            }
            this.isCute=true;
            await  this.$emit('upButton')
            this.isCute=false;
          },

        }
    }
</script>

<style scoped>
  .radius-warp{margin-bottom: 14px;}
  .radius-warp .button{
    border-radius: 6px;background:#4fa1a4;text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
    -webkit-box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
    padding: 6px 16px;
    color: #fff;
    align-items: center;font-size: 14px;cursor: pointer;font-weight: 500;justify-content: center;
  }
  .radius-warp .button.button6{padding: 0px 6px;}
  svg{fill: aliceblue;}
  .radius-warp .button.button0{background:#f18913;}
  .radius-warp .button.button1{background: #f57c00;}
  .icon.icon-20{width: 20px;height: 20px;}
  .icon.icon-16{width: 16px;height: 16px;}
</style>
