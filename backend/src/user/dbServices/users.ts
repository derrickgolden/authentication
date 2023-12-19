const { pool } = require("../../mysqlSetup");
import { RowDataPacket } from 'mysql2/promise';
import { DBServicesRes } from 'user/type';

export interface UserDetailsRes extends DBServicesRes{
    details?: Array<{}>
}

const getUserDetailsByemail = async( email: string): Promise<UserDetailsRes> =>{
    try {
        const connection: RowDataPacket = await pool.getConnection();

        const [res]: [Array<{}>] = await connection.query(`
        SELECT * from user_details 
        WHERE email = ?;
        `, [email])

        connection.release();

        if(res.length){
            return {success: true, details: res, msg: ""}
        }else{
            return {success: false, msg: "email unavaible"}
        }
    } catch (error) {
        console.log(error)

        if (error.sqlMessage) {
            return { success: false, msg: error.sqlMessage };
          } else {
            console.error('Error:', error.message);
            return { success: false, msg: error.message };
          }
    }
}
const getUserEmailById = async( user_id: number ) =>{
    try {
        const connection = await pool.getConnection();

        const [res] = await connection.query(`
        SELECT first_name, last_name, email from user_details 
        WHERE user_id = ?;
        `, [user_id])

        connection.release();

        if(res.length){
            return {success: true, ...res[0]}
        }else{
            return {success: false, msg: "email unavaible"}
        }
    } catch (error) {
        console.log(error)

        if (error.sqlMessage) {
            return { success: false, msg: error.sqlMessage };
          } else {
            console.error('Error:', error.message);
            return { success: false, msg: error.message };
          }
    }
}
const getUserDetailsByid = async( user_id: number) =>{
    try {
        const connection = await pool.getConnection();

        const [res] = await connection.query(`
            SELECT user_details.*, transaction_totals.total_deposit, transaction_totals.total_withdraw, transaction_totals.balance
            FROM user_details
            LEFT JOIN transaction_totals ON user_details.user_id = transaction_totals.user_id
            WHERE user_details.user_id= ?
        `, [user_id])

        connection.release();

        console.log("user_details response", res)

        if(res.length){
            return {success: true, details: res}
        }else{
            return {success: false, msg: "User_id unavaible"}
        }
    } catch (error) {
        console.log(error)

        if (error.sqlMessage) {
            return { success: false, msg: error.sqlMessage };
          } else {
            console.error('Error:', error.message);
            return { success: false, msg: error.message };
          }
    }
}

module.exports ={
    getUserDetailsByemail,
    getUserDetailsByid,
    getUserEmailById
}