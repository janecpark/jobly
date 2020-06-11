const db = require('../db');
const ExpressError = require('../helpers/expressError')
const sqlPartial = require('../helpers/partialUpdate');

class Company {
    static async findComp(data){
        
        let baseQuery = 'SELECT name, description, logo_url FROM companies '
        let where = [];
        let queryVal = [];

        if(+data.min_employees > +data.max_employees){
            throw ExpressError("Minimum employees must be smaller than maximum", 400)
        }

        if(data.search){
            where.push('WHERE name ILIKE $1')
            queryVal.push(`%${data.search}%`)
        }
        if(data.min_employees){
            where.push('WHERE num_employees >= $1')
            queryVal.push(+data.min_employees)
        }
        if(data.max_employees){
            where.push('WHERE num_employees <= $1')
            queryVal.push(+data.max_employees)
        }

        let query = (baseQuery + where)
        
        const res = await db.query(query, queryVal)
        
        return res.rows;
    }
    static async singleComp(data){
        const res = await db.query(`
        SELECT name, description, logo_url
        FROM companies
        WHERE handle=$1`, [data])
        return res.rows[0];
    }

    static async create(data){
        const res = await db.query(`
        INSERT INTO companies
            (handle,
            name,
            num_employees,
            description,
            logo_url)
            VALUES($1, $2, $3, $4, $5)
            RETURNING
            name, description, logo_url`,
            [data.handle, data.name, data.num_employees,
            data.description, data.logo_url])
        
        return res.rows[0]
        
    }
    static async deleteComp(handle){
        const res = await db.query(`
        DELETE FROM companies
        WHERE handle=$1
        RETURNING handle
        `,[handle])

        if(res.rows.length === 0){
            throw { message: `No company with the handle ${handle}`}
        }
        return res.rows[0]
    }
    static async updateComp(handle, data){
        let { query, values } = sqlPartial('companies', data, 'handle', handle)
        const result = await db.query(query, values)
        if(!result.rows[0]){
            throw new ExpressError("Company not found", 404)
        }
        return result.rows[0];
    }
   
}

module.exports = Company;