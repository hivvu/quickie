const fs = require('fs');
const puppeteer = require('puppeteer')

const process = async (req, res) => {

  // let data = req.body;

  // var d = new Date();
  // var curYear = d.getFullYear();
  // var curMonth = d.getMonth() + 1;
  // var dateDir = curYear + '-' + curMonth;

  // var uniqueId = Math.random().toString(36).substr(2, 9);

  // var dir = 'archive';
  // var finalPath = dir + '/' + dateDir;

  // // Creates the folder and subfolder
  // fs.mkdir(finalPath, { recursive: true }, (err) => {
  //   if (err) throw err;
  // });

  // var obj = {
  //   'month': curMonth,
  //   'year': curYear,
  //   'filename': 'quickie-' + uniqueId
  // }

  // Adds the created unique id to json object
  // data.id = uniqueId;

  // fs.writeFileSync(finalPath + '/quickie-' + uniqueId + '.json', JSON.stringify(data));

  // quickie = new Promise((resolve, reject) => {
  //   takeScreenshot(obj)
  //     .then(data => {
  //       resolve(data)
  //       console.info('[info] Screenshot taken');
  //     })
  //     .catch(err => reject('Screenshot failed'))
  // })


  const quickie = new Promise((resolve, reject) => {
    takeScreenshot(req.params.id)
      .then(data => {
        resolve(data)
        console.info('[info] Screenshot taken');
      })
      .catch(err => reject('Screenshot failed: ' + err))
  })

  Promise.all([quickie])
    .then(data => {
      return res.status(200).send(data)
    })
    .catch(err => res.status(500).send(err))
}


const takeScreenshot = async (data) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()

// console.log(data);

  await page.setViewport({ width: 1080, height: 1080 });
  await page.goto('http://localhost:3000/preview/id/' + data);

  const image = await page.screenshot({
    fullPage: true,
    type: "jpeg",
    quality: 100,
  });

  var imgArr = {
    title: 'quickie-' + data + '.jpg',
    link: 'data:image/jpg;base64,' + image.toString("base64")
  };

  await page.close();

  return imgArr;
}

module.exports = { 'takeScreenshot': takeScreenshot, 'process': process };
