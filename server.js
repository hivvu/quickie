const express = require('express')
var port = 3000;
const router = express.Router();
const screenshot = require('./src/js/screenshot')
const cors = require('cors')
const fs = require('fs');
const path = require('path');

const app = express()

app.use(cors())

app.use(express.static('.'));
app.use(express.static('src'));

app.use(express.json({limit: '50mb'})); // for parsing application/json
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // for parsing application/x-www-form-urlencoded

router.post('/save', (request, response) => {
  let data = request.body;

  var d = new Date();
  var curYear = d.getFullYear();
  var curMonth = d.getMonth()+1;
  var dateDir = curYear + '-' + curMonth;

  var uniqueId =  Math.random().toString(36).substr(2, 9);

  var dir = 'archive';
  var finalPath = dir + '/' + dateDir;
  
  // Creates the folder and subfolder
  fs.mkdir(finalPath, { recursive: true }, (err) => {
    if (err) throw err;
  });

  var obj = {
    'month': curMonth,
    'year': curYear, 
    'filename': 'quickie-' + uniqueId
  }

  fs.writeFileSync(finalPath + '/quickie-' + uniqueId + '.json', JSON.stringify(data));

  const quickie = new Promise((resolve, reject) => {
    screenshot
      .quickie(obj)
      .then(data => {
        resolve(data)
        console.info('Screenshot taken');
      })
      .catch(err => reject('Screenshot failed'))
  })

  Promise.all([quickie])
    .then(data => {
      return response.status(200).send(data)
    })
    .catch(err => response.status(500).send(err))

})

app.use("/", router);

router.get('/',(req, res) => {
  res.sendFile("index.html", { root: 'src' });
});

router.get('/preview',(req, res) => {
  res.sendFile("preview.html", { root: 'src' });
});

// router.get('/archive',(req, res) => {
//   res.sendFile("archive.html", { root: 'src' });
// });

// router.get('/read-archive',(req, res) => {
//   var dir = require('node-dir');
//   var allFiles;

//   // dir.readFiles(__dirname + '/archive',
//   //   function(err, content, next) {
//   //       if (err) throw err;
        
//   //       console.log();

//   //       // console.log('content:', content);  // get content of files
//   //       next();
//   //   },
//   //   function(err, files){
//   //       if (err) throw err;
                
//   //       allFiles = JSON.stringify(files.reverse());
//   //       console.log('finished reading files:\n', allFiles); // get filepath 
//   //   });  


//     // dir.files(__dirname + '/archive', function(err, files) {
//     //     if (err) throw err;
        
//     //     allFiles = JSON.stringify(files.reverse());
//     //     console.log(files);
//     // });

    
//     //GET FOLDERS
//     const testFolder = __dirname + '/archive';
//     const fs = require('fs');

//     fs.readdirSync(testFolder).forEach(file => {
//       console.log(file);
//     });

//     return res.status(200).send(allFiles)
// });


app.listen(3000,() => {
  console.log('server up and running at port: %s', port);
})
