const db = require('../db');
const ExpressError = require('../helpers/expressError');
const sqlPartial = require('../helpers/partialUpdate');

class Job{
    static async findJob(data){
        let base = ('SELECT id, title, company_handle FROM jobs ')

        let where = [];
        let queryVal = [];

        if(data.search){
            where.push('WHERE title ILIKE $1')
            queryVal.push(`%${data.search}%`)
        }
        if(+data.min_salary){
            where.push('WHERE salary >= $1')
            queryVal.push(+data.min_salary)
        }
        if(+data.min_equity){
            where.push('WHERE salary >= $1')
            queryVal.push(+data.min_equity)
        }

        let query = (base + where)
        const res = await db.query(query, queryVal)
        return res.rows;
    }
    static async postJob(data){
        const res = await db.query(`
        INSERT INTO jobs
        (title, salary, equity, company_handle)
        VALUES($1, $2, $3, $4)
        RETURNING id, title, salary, equity, company_handle`,
        [data.title, data.salary, data.equity, data.company_handle])
        
        return res.rows[0]

    }
    static async findSingleJob(data){
        const res = await db.query(`
        SELECT * FROM jobs
        WHERE id=$1`, [data])
        if(!res.rows[0]){
            return new ExpressError('Not found')
        }
        return res.rows[0]
    }
    static async deleteJob(data){
        const res = await db.query(`
        DELETE FROM jobs
        where id=$1
        RETURNING id`,[data])
        if(!res.rows[0]){
            throw {message: 'No jobs found' }
        }
    }
    static async updateJob(id, data){
        let { query, value } = sqlPartial('jobs', data, 'id', id)
        const result = await db.query(query, value)
        if(!result.rows[0]){
            throw new ExpressError('Job not found', 404)
        }
        return result.rows[0]
    }
}

module.exports = Job;