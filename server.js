const express = require('express')
const scraper = require('./src/js/screenshot')
const cors = require('cors')

const app = express()

app.use(cors())

app.get('/', (req, res) => {
  const quickie = new Promise((resolve, reject) => {
    scraper
      .quickie()
      .then(data => {
        resolve(data)
      })
      .catch(err => reject('Screenshot failed'))
  })

  Promise.all([quickie])
    .then(data => {
      return res.status(200).send(data)
    })
    .catch(err => res.status(500).send(err))

})

app.listen(process.env.PORT || 3000)