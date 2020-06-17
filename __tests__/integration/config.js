const bcrypt = require('bcrypt');
const app = require('../../app')
const db = require('../../db')
const jwt = require('jsonwebtoken')
const request = require('supertest')

const TEST_DATA = {};

async function beforeHook(TEST_DATA){
    // const hashedPassword = await bcrypt.hash("secret", 1);
    // await db.query(`
    // INSERT INTO users
    // (username, password, first_name, last_name, email, photo_url, is_admin)
    // VALUES ('test', $1, 'Jane', 'Doe', 'test@test.com', 'someurl.com', true)
    // RETURNING *`,[hashedPassword]);
    
    const response = await request(app)
        .post('/users')
        .send({
            username: 'test',
            password: 'secret',
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'test@test.com',
            photo_url: 'google.com',
            is_admin: true
        })



    TEST_DATA.userToken = response.body.token;
    TEST_DATA.curUser = jwt.decode(TEST_DATA.userToken).username;
    // let res = jwt.decode(TEST_DATA.userToken)
    // console.log(res);
    
    const result = await db.query(`
    INSERT INTO companies
    (handle, name, num_employees, description, logo_url)
    VALUES('apple', 'Apple Inc', '20000', 'Tech', 'apple.com')
    RETURNING *`)

    TEST_DATA.curCompany = result.rows[0];
    

    const job = await db.query(`
    INSERT INTO jobs
    (title, salary, equity, company_handle)
    VALUES('Software Engineer', '100000', '0.5', $1)
    RETURNING *`,[TEST_DATA.curCompany.handle])
    
    TEST_DATA.curJobID = job.rows[0].id;
}

async function afterEachHook(){
    try{

        await db.query("DELETE from users")
        await db.query("DELETE from companies")
        await db.query("DELETE from jobs")
    }catch(err){
        console.log(error);
        
    }
}

async function afterHook(){
    await db.end()
}

module.exports = {
    TEST_DATA,
    beforeHook,
    afterEachHook,
    afterHook
}