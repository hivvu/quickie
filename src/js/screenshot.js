const puppeteer = require('puppeteer')

const quickie = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(
    'https://www.wasd.pt/quickie2'
  )

  const image = await page.screenshot({fullPage : true});

  var imgArr = {
        title: "quickie",
        link: 'data:image/jpg;base64,' + image.toString("base64")
      };

  await browser.close();

  return imgArr;
} 

module.exports.quickie = quickie
