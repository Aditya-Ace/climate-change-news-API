const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()
const PORT = process.env.PORT || 5000

const newspapers = [
  {
    name: 'cityam',
    address:
      'https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/',
    base: ''
  },
  {
    name: 'thetimes',
    address: 'https://www.thetimes.co.uk/environment/climate-change',
    base: ''
  },
  {
    name: 'guardian',
    address: 'https://www.theguardian.com/environment/climate-crisis',
    base: ''
  },
  {
    name: 'telegraph',
    address: 'https://www.telegraph.co.uk/climate-change',
    base: 'https://www.telegraph.co.uk'
  },
  {
    name: 'nyt',
    address: 'https://www.nytimes.com/international/section/climate',
    base: ''
  },
  {
    name: 'latimes',
    address: 'https://www.latimes.com/environment',
    base: ''
  },
  {
    name: 'smh',
    address: 'https://www.smh.com.au/environment/climate-change',
    base: 'https://www.smh.com.au'
  },
  {
    name: 'un',
    address: 'https://www.un.org/climatechange',
    base: ''
  },
  {
    name: 'bbc',
    address: 'https://www.bbc.co.uk/news/science_and_environment',
    base: 'https://www.bbc.co.uk'
  },
  {
    name: 'es',
    address: 'https://www.standard.co.uk/topic/climate-change',
    base: 'https://www.standard.co.uk'
  },
  {
    name: 'sun',
    address: 'https://www.thesun.co.uk/topic/climate-change-environment/',
    base: ''
  },
  {
    name: 'dm',
    address:
      'https://www.dailymail.co.uk/news/climate_change_global_warming/index.html',
    base: ''
  },
  {
    name: 'nyp',
    address: 'https://nypost.com/tag/climate-change/',
    base: ''
  }
]

const articles = []

const getArticles = async () => {
  newspapers.forEach(async (newspaper) => {
    try {
      const { data } = await axios.get(newspaper.address)
      const $ = cheerio.load(data)
      $('a:contains("climate")', data).each(function () {
        const title = $(this).text()
        const url = $(this).attr('href')
        const source = newspaper.name
        articles.push({ title, url: newspaper.base + url, source })
      })
    } catch (error) {
      console.error
    }
  })
}
getArticles()

app.get('/', (req, res) =>
  res
    .status(200)
    .send('<h3>Welcome to the climate change news API!</h3> <p>Dev: Aditya</p>')
)

app.get('/climatechangenews', (req, res) => res.status(200).send(articles))

app.get('/climatechangenews/:newspapername', async (req, res) => {
  try {
    const specificArticle = []
    const newsPaperName = req.params.newspapername
    const newsPaper = newspapers.find(
      (newspaper) => newspaper.name === newsPaperName
    )
    const { data } = await axios.get(newsPaper.address)
    const $ = cheerio.load(data)

    $('a:contains("climate")', data).each(function () {
      const title = $(this).text()
      const url = $(this).attr('href')
      const source = newsPaper.name
      specificArticle.push({ title, url: newsPaper.base + url, source })
    })
    res.status(200).send(specificArticle)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
