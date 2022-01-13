const {getOne,catalog}=require('./book');
const Koa=require('koa');
const cors=require('@koa/cors');
const cache={};
function main(){
  const app=new Koa();
  app.use(cors());
  app.use(async ctx=>{
    console.log(ctx.query.url);
    if(ctx.query.url&&ctx.query.chapter){
      ctx.body=await getOne(ctx.query.url);
    }else if(!ctx.query.url){
      ctx.body=cache.mulu;
    }else{
      ctx.body=await catalog(ctx.query.url);
      cache.mulu=ctx.body;
    }
  })
  app.listen(8000,'0.0.0.0');
}
main();
