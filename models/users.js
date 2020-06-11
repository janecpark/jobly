const db = require('../db')
const ExpressError = require('../helpers/expressError')
const sqlPartial = require('../helpers/partialUpdate')

class User{
    static async create(data){
        const result = await db.query(`
        INSERT INTO users
        (username, password, first_name, last_name, email, photo_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING username, first_name, last_name, email, photo_url
        `,[data.username, data.password, data.first_name, data.last_name, data.email, data.photo_url])
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
}

module.exports = User;