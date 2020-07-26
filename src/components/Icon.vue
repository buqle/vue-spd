<template>
  <svg class="icon" aria-hidden="true" :style="styles">
    <use :xlink:href="`#${prefix}${iconHref}`"></use>
  </svg>
</template>

<script>
    export default {
      name:'Icon',
      props: {
        prefix:{
          type:String,
          default:''
        },
        iconHref:{
          type:String
        },
        iconSize:{
          type:[String, Number],
          default:'14'
        },
        iconColor:{
          type:String,
          default:'#333333'
        }
      },
      computed: {
        styles () {
          let style = {};
          if (this.iconSize) {
            style['width'] = `${this.iconSize}px`;
            style['height'] = `${this.iconSize}px`;
          }
          if (this.iconColor) {
            style['fill'] = `${this.iconColor}`;
          }
          return style;
        }
      },
    }
</script>

<style scoped>
  .icon{

  }
</style>
