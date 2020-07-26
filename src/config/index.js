var config ={
    env:process.env
}
const NODE_ENV=process.env.NODE_ENV;
import dev from "./dev.js";
import prod from "./prod.js";

if(NODE_ENV=='development'){
    config=Object.assign({},config,dev);
}else{
    config=Object.assign({},config,prod);
}

export default  config;
