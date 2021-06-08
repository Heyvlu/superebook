const {getOne,catalog}=require('./book');
const Koa=require('koa');
const cors=require('@koa/cors');
const cache={};
function main(){
  const app=new Koa();
  app.use(cors());
  app.use(async ctx=>{
    console.log(ctx.query.url);
    if(ctx.query.url){
      ctx.body=await getOne(ctx.query.url);
    }else{
      if(cache.mulu){
        ctx.body=cache.mulu;
      }else{
        ctx.body=await catalog('https://www.xbiquge.la/13/13959/');
        cache.mulu=ctx.body;
      }
    }
  })
  app.listen(8000,'0.0.0.0');
}
main();
