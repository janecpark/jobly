const request = require('supertest')
const app = require('../../app')
const Company = require('../../models/companies')
const{
    TEST_DATA, beforeHook, afterHook, afterEachHook
} = require('./config')

beforeEach(async function(){
    await beforeHook(TEST_DATA)
});

afterEach(async function(){
    await afterEachHook()
});

afterAll(async function(){
    await afterHook()
});

describe("POST /companies", function(){
    test("Create a company", async function(){
        const response = await request(app)
        .post('/companies')
        .send({
            handle: 'samsung',
            name: 'Samsung',
            num_employees: 10000,
            description: 'Tech comp',
            logo_url: 'samsung.come',
            _token: TEST_DATA.userToken
        })
        expect(response.body).toHaveProperty('name')
    })
})

describe("GET /companies", function(){
    test("Get a list of companies", async function(){
        const response = await request(app)
        .get('/companies')
        .send({
            _token: TEST_DATA.userToken
        })

        expect(response.body).toHaveLength(1)
        expect(response.body[0]).toHaveProperty('name')
        
    })
    test("Search a company", async function(){
        const response = await request(app)
        .get('/companies?search=apple')
        .send({
            _token: TEST_DATA.userToken
        })
        
        expect(response.body).toHaveLength(1)
        expect(response.body[0]).toHaveProperty('name')
    })

   
})

describe("GET /companies/:handle", function(){
    test("Get a single company", async function(){
        const response = await request(app)
        .get(`/companies/${TEST_DATA.curCompany.handle}`)
        .send({_token: `${TEST_DATA.userToken}`})
        
        expect(response.body).toHaveProperty('handle')
        expect(response.body.handle).toBe('apple')
    })
    test("Responds with 404 if not found", async function(){
        const response = await request(app)
        .get('/companies/random')
        .send({_token: TEST_DATA.userToken})
        expect(response.body).toEqual({message: 'Company not found', status: 404})
    })
})

describe("DELETE /companies/:handle", function(){
    test("Delete company", async function(){
        const response = await request(app)
        .delete(`/companies/${TEST_DATA.curCompany.handle}`)
        .send({_token: `${TEST_DATA.userToken}`})

        expect(response.body).toEqual({message: 'Company deleted'})
    })
    test("Responds with 404 if not found", async function(){
        const response = await request(app)
        .get('/companies/random')
        .send({_token: TEST_DATA.userToken})
        expect(response.body).toEqual({message: 'Company not found', status: 404})
    })
})
