// process.env.NODE_ENV === "test";
const request = require("supertest");
const app = require("../../app");
const User = require("../../models/users");
const {
    TEST_DATA, beforeHook, afterHook, afterEachHook
} = require('./config')

beforeEach(async function(){
    await beforeHook(TEST_DATA);
});

afterEach(async function(){
    await afterEachHook()
});

afterAll(async function(){
    await afterHook()
});

describe("GET /users", function(){
    test("Gets a list of users", async function(){
        const response = await request(app)
            .get('/users')
            .send({_token: `${TEST_DATA.userToken}`})
            
        expect(response.body.users).toHaveLength(1);
        expect(response.body.users[0]).toHaveProperty('username')
    })
})

describe("GET /users/:username", function(){
    test("Get a single user", async function(){
        const response = await request(app)
            .get(`/users/${TEST_DATA.curUser}`)
            .send({_token: `${TEST_DATA.userToken}`})
            
            expect(response.body.user).toHaveProperty('username')
            expect(response.body.user.username).toBe('test')
    })
    test("Responds with 404 if user not found", async function(){
        const response = await request(app)
        .get('/users/random')
        .send({_token: `${TEST_DATA.userToken}`})

        expect(response.statusCode).toEqual(404)
    })

})

describe("POST /users", function(){
    test("Create a new user", async function(){
        const response = await request(app)
        .post('/users')
        .send({
            username: 'testing',
            password: 'secret',
            first_name: 'Pam',
            last_name: 'Smith',
            email: 'email@email.com',
            photo_url: 'google.com',
            is_admin: false
        })
        
        expect(response.body).toHaveProperty('token')
        const checkDB = await User.getUser('testing')
        expect(checkDB.username).toBe('testing')        
    })


    test("Prevents duplicate username", async function(){
        const response = await request(app)
        .post('/users')
        .send({
            username: 'test',
            password: 'secret',
            first_name: 'Pam',
            last_name: 'Smith',
            email: 'test123@test.com',
            photo_url: 'google.com',
            is_admin: false
        })
        
        expect(response.statusCode).toEqual(400);      
    })
})


describe("DELETE /:username", function(){
    test("Delete a user", async function(){
        const response = await request(app)
        .delete(`/users/${TEST_DATA.curUser}`)
        .send({_token: `${TEST_DATA.userToken}`})
        
        expect(response.body).toEqual({message: `${TEST_DATA.curUser} deleted`})
    })     
    
    test("Prevent deleting another user", async function(){
        const response = await request(app)
        .delete(`/users/random`)
        .send({_token: `${TEST_DATA.userToken}`})

        expect(response.statusCode).toBe(401)
        
    })
})


