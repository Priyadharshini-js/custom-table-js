const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const port = 3000;


const names = [
    'Abi',
    'Sudha',
    'Janu',
    'Vels',
    'Mani',
    'Gowri',
    'Ganu',
    'Ram',
    'Rithee',
    'Hari',
    'Gowtham',
    'Selva',
    'Siva',
    'Vinoth',
    'Vidhya',
    'Hema',
    'Ramya',
    'Viji',
    'Latha',
    'Aravindh',
    'Arun',
    'Ashok',
    'Adshya',
    'Basma',
    'Renee',
    'Shifna',
    'Pavi',
    'Shveta',
    'Binu',
    'Aslin',
    'Alice',
    'Christina',
    'Tina',
    'Veni'
]

function generateUsers(count = 200) {

    const users = [];

    for (let i = 0; i < count; i++) {
        const randomName = names[Math.floor(Math.random() * names.length)]
        //console.log("aa", randomName)

        users.push({
            id: i + 1,
            age: Math.floor(Math.random() * (80 - 18)),
            rollNo: Math.floor(Math.random() * 201),
            name: randomName
        })
        //console.log(users)
    }
    return users;
}

app.get('/users', (req, res) => {
    const users = generateUsers(200);
    // const users = [];
    // console.log('hey', users)
    res.json(users)
});

app.listen(port, () => {
    console.log(`server listening on port, ${port}`)
});