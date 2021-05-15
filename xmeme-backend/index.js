let express = require('express')
var morgan = require('morgan')
let cors = require('cors')
let bodyParser = require('body-parser')
let isUrl = require('is-url')
let isImgUrl = require('is-image-url')
const dotenv = require('dotenv')
const { Client } = require('pg');


dotenv.config()
let app = express()
app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json());

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

app.get('/', (_, res) => {
    console.log(res)
    res.status(200).send('Hello from the xmeme backend!')
    console.log('Get Request executed successfully.')
})

app.get('/memes', (_, res) => {
    // query to list 100 recently posted memes 
    client.query('SELECT * FROM records ORDER BY id DESC LIMIT 100;', (err, rec) => {
        if(err) throw err
        res.status(200).json(rec.rows)
    });
    console.log('Get Request executed successfully.')
})

app.post('/memes', (req, res) => {
    console.log('Data received - ', req.body)
    let x = req.body.hasOwnProperty('name') && req.body.hasOwnProperty('url') && req.body.hasOwnProperty('caption')
    if(x == false) {
        // the request does not contain the required fields
        res.status(400).json({error: 'The request does not contain the required fields'})
    } else {
        req.body.name = req.body.name.trim()
        req.body.url = req.body.url.trim()
        req.body.caption = req.body.caption.trim()
        let y = !(req.body.name == '' || req.body.url == '' || req.body.caption == '')
        if(y == true) {
            if(isUrl(req.body.url) && isImgUrl(req.body.url)) {
                // query to check if the meme has already been posted
                client.query(`SELECT * FROM records WHERE name = '${req.body.name}' AND url = '${req.body.url}' AND caption = '${req.body.caption}';`, (err, rec) => {
                    if(err) throw err
                    if(rec.rowCount > 0) {
                        // If the meme has already been posted, reject the request
                        res.status(409).json({error: 'The meme has already been posted'})
                        console.log('This meme exists in the records already.')
                    } else {
                        // insert the meme content into the database
                        client.query(`INSERT INTO records (name, url, caption) VALUES ('${req.body.name}', '${req.body.url}', '${req.body.caption}') RETURNING id;`, (ierr, irec) => {
                            if(ierr) throw ierr
                            res.status(201).json(irec.rows[0])
                        })
                        console.log('Stored successfully.')
                    }
                })
            } else
                res.status(400).json({error: 'The image URL is invalid'}) // invalid image url
        }else 
            res.status(400).json({error: 'Request parameters are empty'}) // invalid request parameters - one of which is empty
    }
})

app.get('/memes/:id', (req, res) => {
    // query to get a meme by id
    let isNumeric = k => /[0-9]+/.test(k)
    if(isNumeric(req.params.id))  client.query(`SELECT * FROM records WHERE id = ${req.params.id};`, (err, rec) => {
        if(err) throw err
        // send resource NotFound error when meme of specified id doesn't exist
        rec.rowCount > 0 ? res.status(200).json(rec.rows[0]) : res.status(404).json({error: `Meme with requested id #${req.params.id} does not exist`})
        console.log('Get Request with specified id executed successfully.')
    }) 
    else  res.status(400).json({error: 'The id parameter is unclear'}) // Bad request
})

app.patch('/memes/:id', (req, res) => {
    let x = req.body.hasOwnProperty('url') && req.body.hasOwnProperty('caption')
    let isNumeric = k => /[0-9]+/.test(k)
    if(x == true && isNumeric(req.params.id)) {
        req.body.url = req.body.url.trim()
        req.body.caption = req.body.caption.trim()
        let y = !(req.body.url == '' || req.body.caption == '')
        if(y == true && isUrl(req.body.url) && isImgUrl(req.body.url)) {
            // query to get the name of the person 
            client.query(`SELECT name FROM records WHERE id = ${req.params.id};`, (uerr, urec) => {
                if(uerr) throw uerr
                if(urec.rowCount > 0) {
                    let name = urec.rows[0].name
                    // check for existing duplicate post
                    client.query(`SELECT id FROM records WHERE name = '${name}' AND url = '${req.body.url}' AND caption = '${req.body.caption}';`, (oerr, orec) => {
                        if(oerr) throw oerr
                        if(orec.rowCount > 0) {
                            // trying to duplicate the meme
                            res.status(409).json({error: `This duplicates a meme with id #${rec.rows[0].id}`})
                        } else {
                            // query to update the record of specified id
                            client.query(`UPDATE records SET url = '${req.body.url}', caption = '${req.body.caption}' WHERE id = ${req.params.id} RETURNING id;`, (err, rec) => {
                                if(err) throw err
                                rec.rowCount > 0 ? res.status(200).json(rec.rows[0]) : res.sendStatus(404)
                                console.log('Patch Request executed successfully.')
                            })
                        }
                    })
                } else 
                    res.status(400).json({error: `Meme with requested id #${req.params.id} does not exist`}) // Bad Request
            })
        } else
            res.status(400).json({error: 'Request parameters are empty or the image url is invalid'})
    } else 
        res.status(400).json({error: 'The request does not contain the required fields or the id parameter is unclear'})
})

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`XMeme backend running on ${process.env.PORT} ...`)
})
