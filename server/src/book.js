const axios = require("axios");
const cheerio = require("cheerio");

async function getOne(url) {
  const { data } = await axios.get(url);
  const html = cheerio.load(data);
  let characters = html("#content").html();
  characters = characters
    .replace(/&nbsp;/g, " ")
    .replace(/<br>/g, "")
    .replace(/<p>.+<\/p>/g, "");
  return characters;
}
async function catalog(url) {
  const { data: datalog } = await axios.get(url);
  const htmlLog = cheerio.load(datalog);
  const everyLink = htmlLog("#list").find("a");
  const collection = {};
  Array.from(everyLink).forEach((a) => {
    collection[a.children[0].data] = "https://www.xbiquge.la" + a.attribs.href;
  });
  return collection;
}

module.exports={getOne,catalog};

// function sleep(num) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, num);
//   });
// }
// async function book(url) {
//   const a = await catalog(url);
//   const keys = Object.keys(a);
//   let done = 0;
//   let doing=0;
//   const allPromise=[];

//   for (let i = 0; i < keys.length; i++) {

//     if(doing>=2){
//       await Promise.all(allPromise);
//       done+=doing;
//       doing=0;
//       console.log((done/keys.length).toFixed(2)+'%');
//     }
//     const zhangPromise=getOne(a[keys[i]]).then(zhengwen=>{
//       a[keys[i]]=zhengwen;
//     });
//     await sleep(200);
//     allPromise.push(zhangPromise);
//     doing++;
    

//     // console.log((done / keys.length).toFixed(2) + "%");
//     // await sleep(20);
//   }
//   return a;
// }
// book("https://www.xbiquge.la/13/13959/").then((a) => {
//   fs.writeFileSync("./book.txt", JSON.stringify(a));
// });
