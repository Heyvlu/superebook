const axios = require('axios')
const cheerio = require('cheerio')
const qs = require('qs')

// 获取具体的章节
async function getOne(url, count = 0) {
  try {
    const { data } = await axios.get(url)
    const html = cheerio.load(data)
    let characters = html('#content').html()
    characters = characters
      .replace(/&nbsp;/g, ' ')
      .replace(/<br>/g, '')
      .replace(/<p>.+<\/p>/g, '')
    return characters
  } catch (e) {
    if (e.code === 'ECONNRESET') {
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          if (count > 5) {
            reject(e)
          }
          resolve(await getOne(url, count + 1))
        }, 500)
      })
    }
  }
}

// 获取目录
async function catalog(url, count = 0) {
  try {
    const { data: datalog } = await axios.get(url)
    const htmlLog = cheerio.load(datalog)
    //  小说图片
    const img = htmlLog('#fmimg').html()
    const $ = cheerio.load(img)
    let NovelImg = $('img').attr('src')
    const everyLink = htmlLog('#list').find('a')
    const collection = {}
    Array.from(everyLink).forEach((a) => {
      collection[a.children[0].data] = 'https://www.xbiquge.la' + a.attribs.href
    })
    // console.log(collection);
    return [collection, NovelImg]
  } catch (e) {
    if (e.code === 'ECONNRESET') {
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          if (count > 5) {
            reject(e)
          }
          resolve(await catalog(url, count + 1))
        }, 500)
      })
    }
  }
}

// 获取小说名和目录连接
async function getCatalogue(url, count = 0) {
  try {
    const { data } = await axios.post(url.url, qs.stringify(url.data))
    // console.log(data);
    const html = cheerio.load(data)
    let a = html('.even').html()
    // console.log(a);
    let $ = cheerio.load(a)
    let name = $('a').text()
    let href = $('a').attr('href')
    // console.log(name,href);
    return [name, href]
  } catch (e) {
    if (e.code === 'ECONNRESET') {
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          if (count > 5) {
            reject(e)
          }
          resolve(await getCatalogue(url, count + 1))
        }, 500)
      })
    }
  }
}

module.exports = { getOne, catalog, getCatalogue }
