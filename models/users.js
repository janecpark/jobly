const db = require('../db')
const ExpressError = require('../helpers/expressError')
const sqlPartial = require('../helpers/partialUpdate')
const bcrypt = require('bcrypt')

const BCRYPT_WORK_FACTOR = 10;

class User{
    static async create(data){
        const dupCheck = await db.query(`
        SELECT username
        FROM users
        WHERE username=$1`,[data.username])
        if(dupCheck.rows[0]){
            throw new ExpressError(
                'Username exists already', 400
            )
        }

        const result = await db.query(`
        INSERT INTO users
        (username, password, first_name, last_name, email, photo_url, is_admin)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING username, first_name, last_name, email, photo_url, is_admin
        `,[data.username, data.password, data.first_name, data.last_name, data.email, data.photo_url, data.is_admin])
        return result.rows[0]
    }

    static async getAllUser(){
        const result = await db.query(`
        SELECT username, first_name, last_name, email
        FROM users`)
        return result.rows
    }
    static async getUser(data){
        const result = await db.query(`
        SELECT username, first_name, last_name, email
        FROM users
        WHERE username=$1`,[data])
        if(!result.rows[0]){
            throw new ExpressError("User not found", 404)
        }
        return result.rows[0]
    }
    static async updateUser(username, data){
        let { query, value } = sqlPartial('users', data, 'username', username)
        const result = await db.query(query, value)
        if(!result.rows[0]){
            throw new ExpressError('User not found', 404)
        }
        return result.rows[0]
    }
    static async deleteUser(username){
        const result = await db.query(`
        DELETE FROM users
        WHERE username=$1
        RETURNING username`,[username])
        if(!result.rows[0]){
            throw new ExpressError('User not found', 404)
        }
        return result.rows[0]
    }
    
    static async authenticate(data){
        const result = await db.query(`
        SELECT *
        FROM users
        WHERE username=$1`,[data.username])

        const user = result.rows[0];
        if(user){
            const res = await bcrypt.compare(data.password, user.password)
            if(res){
                return user;
            }
        }
        throw ExpressError("Invalid Password", 401)
    }
}

module.exports = User;