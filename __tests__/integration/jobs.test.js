const request = require('supertest')
const app = require('../../app')
const Jobs = require('../../models/jobs')
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

describe("POST /jobs", function(){
    test("Create a job", async function(){
        const response = await request(app)
        .post('/jobs')
        .send({
            title: 'Backend Developer',
            salary: 80000,
            equity: 0.8,
            company_handle: TEST_DATA.curCompany.handle,
            _token: TEST_DATA.userToken
        })
        expect(response.body).toHaveProperty('title')
    })
})

describe("GET /jobs", function(){
    test("Get a list of jobs", async function(){
        const response = await request(app)
        .get('/jobs')
        .send({
            _token: TEST_DATA.userToken
        })

        expect(response.body).toHaveLength(1)
        expect(response.body[0]).toHaveProperty('title')
        
    })
    test("Search a company", async function(){
        const response = await request(app)
        .get('/jobs?search=Software')
        .send({
            _token: TEST_DATA.userToken
        })
        
        expect(response.body).toHaveLength(1)
        expect(response.body[0]).toHaveProperty('title')
    })

})

describe("GET /jobs/:id", function(){
    test("Get a single job", async function(){
        const response = await request(app)
        .get(`/jobs/${TEST_DATA.curJobID}`)
        .send({_token: `${TEST_DATA.userToken}`})
        
        expect(response.body).toHaveProperty('title')
        expect(response.body.title).toBe('Software Engineer')
    })
    test("Response if not found", async function(){
        const response = await request(app)
        .get('/jobs/234')
        .send({_token: TEST_DATA.userToken})
        expect(response.body).toEqual({message: 'Not found'})
    })
})

describe("DELETE /jobs/:handle", function(){
    test("Delete a job", async function(){
        const response = await request(app)
        .delete(`/jobs/${TEST_DATA.curJobID}`)
        .send({_token: `${TEST_DATA.userToken}`})

        expect(response.body).toEqual({message: 'Job deleted'})
    })
    test("Responds with 404 if not found", async function(){
        const response = await request(app)
        .get('/jobs/23')
        .send({_token: TEST_DATA.userToken})
        expect(response.body).toEqual({message: 'Not found'})
    })
})
