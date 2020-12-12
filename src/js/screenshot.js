const puppeteer = require('puppeteer')

const quickie = async (data) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  
  await page.setViewport({ width: 1080, height: 1080 });
  await page.goto('http://localhost:3000/preview?data='+JSON.stringify(data))
    
  const image = await page.screenshot({
    fullPage: true,
    type: "jpeg",
    quality: 100,
  });

  var imgArr = {
    title: data.filename + '.jpg',
    link: 'data:image/jpg;base64,' + image.toString("base64")
  };

  await page.close();

  return imgArr;
} 

module.exports.quickie = quickie
