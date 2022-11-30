const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lnoy20s.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })

async function run() {
    try {

        const subjectCollection = client.db('serviceReview').collection('subjects')
        const reviewCollection = client.db('serviceReview').collection('review')
        const usersCollection = client.db('serviceReview').collection('users')

        app.get('/3subjects', async (req, res) => {
            const query = {}
            const cursor = subjectCollection.find(query);
            const subjects = await cursor.limit(3).toArray()
            res.send(subjects);
        });
        app.get('/courses', async (req, res) => {
            const query = {}
            const cursor = subjectCollection.find(query);
            const courses = await cursor.toArray()
            res.send(courses);
        });

        app.get('/course/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const course = await subjectCollection.findOne(query);
            res.send(course);
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);

        });

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(filter);
            res.send(result);
        })

        // app.get('/reviews', async (req, res) => {
        //     const query = {};
        //     const review = await reviewCollection.find(query).toArray();
        //     res.send(review)
        // })

        app.get('/reviews', async (req, res) => {
            // const email = req.params.email;
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            // const email = req.decoded.email;

            // if (email !== decodedEmail) {
            //     return res.status(403).send({ message: 'forbidden access' });
            // }

            // const query = { email: user.emeil };
            const reviews = await reviewCollection.find(query).toArray();
            res.send(reviews);
        })

        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users)
        })
    }

    finally {

    }
}

run().catch(err => console.error(err))




app.get('/', (req, res) => {
    res.send('service review server is running')
})

app.listen(port, () => {
    console.log(`service review server running on ${port}`);
})