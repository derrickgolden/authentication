import { DBServicesRes, LinkTokenRes, LoginMysqlRes, 
    LoginResponse, SignupResponse } from "user/type";
import { RowDataPacket } from 'mysql2/promise';

const { pool } = require("../../mysqlSetup");

export interface StoreLinkTokenRes extends DBServicesRes{
    details?:[{
        link_tokens_id: number, user_id: number, email: string
    }]
}

const signupUser = async ( first_name: string, last_name: string, email: string, 
    remember_me: boolean, country: string, hash: string, phone: string ): Promise<SignupResponse> => {
    try {
        const connection: RowDataPacket = await pool.getConnection();

        // Check if the user already exists
        const [existingUser] = await connection.query(`
            SELECT * FROM user_details
            WHERE email = ?
        `, [email]);

        if (existingUser.length > 0) {
            connection.release();
            return { success: true, rejectInput: "email", msg: "Email already registered, please log in" };
        }

        // Insert user details
        const [insertUser] = await connection.query(`
            INSERT INTO user_details (first_name, last_name, email, remember_me, country, password, phone)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [first_name, last_name, email, remember_me, country, hash, phone]);

        const userId: number = insertUser.insertId;

        // If nonuser transfers exist, transfer funds
        const [nonuserTransfers] = await connection.query(`
            SELECT * FROM nonuser_transfers
            WHERE recipient_email = ?
        `, [email]);

        if (nonuserTransfers.length > 0) {
            await connection.beginTransaction();

            try {
                for (const nonuserTransfer of nonuserTransfers) {
                    const { transfer_id, timestamp, sender_id, recipient_email, amount } = nonuserTransfer;

                    // Insert into transfers
                    const [transferRes] = await connection.query(`
                        INSERT INTO transfers(sender_id, receiver_id, recipient_email, amount, timestamp)
                        VALUES (?, ?, ?, ?, ?)
                    `, [sender_id, userId, recipient_email, amount, timestamp]);

                    const new_transfer_id = transferRes.insertId;

                    // Update nonuser_transfers
                    await connection.query(`
                        UPDATE nonuser_transfers
                        SET status = ?, new_transfer_id = ?
                        WHERE transfer_id = ?
                    `, ["registered", new_transfer_id, transfer_id ]);
                }

                await connection.commit();
            } catch (error) {
                await connection.rollback();
                console.error('Transaction failed. Rolling back...', error);
                return {
                    success: true,
                    admin_id: userId,
                    msg: "Registration successful, but failed to transfer money. Contact Customer Care for help.",
                    details: [{ first_name, last_name, email, remember_me, country }]
                };
            } finally {
                connection.release();
            }
        } else {
            connection.release();
        }

        return {
            success: true,
            admin_id: userId,
            msg: "User Registered",
            details: [{ first_name, last_name, email, remember_me, country }]
        };
    } catch (error) {
        console.error('Error:', error.message);

        if (error.sqlMessage) {
            return { success: false, msg: error.sqlMessage };
        } else {
            return { success: false, msg: error.message };
        }
    }
};

const loginUser = async(email: string, ): Promise<LoginResponse> => {
    try {
        const connection: RowDataPacket = await pool.getConnection();

        const [res]: [Array<LoginMysqlRes>] = await connection.query(`
        SELECT user_details.*, transaction_totals.total_deposit, transaction_totals.total_withdraw, transaction_totals.balance
        FROM user_details
        LEFT JOIN transaction_totals ON user_details.user_id = transaction_totals.user_id
        WHERE email = ?
        `, [email]);

        connection.release();

        if(res.length === 1){
            const {user_id, first_name, last_name, email, remember_me, country, password, 
                total_deposit, total_withdraw, balance} = res[0]
                
            return {userAvailable: true, passwordHash: password,
                details: [{user_id, first_name, last_name, email, remember_me, country, 
                    total_deposit, total_withdraw, balance}]
            };
        }else{
            return {userAvailable: false}
        }
    } catch (error) {
        console.log(error)
        if (error.sqlMessage) {
            return {userAvailable: false,
                res:{success: false,  msg: error.sqlMessage} };
          } else {
            return {userAvailable: false,
                res:{success: false, msg: error.message }};
        }
    }
}

const resetPassword = async(password:string, email: string
                        ): Promise<DBServicesRes> =>{
    try {
        const connection: RowDataPacket = await pool.getConnection();

        const [res]: [{affectedRows: number}] = await connection.query(`
        UPDATE user_details 
        SET password = ?
        WHERE email = ?;
        `, [password, email])

        connection.release();
        
        if(res.affectedRows === 1){
            return {success: true, msg: "pasword update successful"}
        }else{
            return {success: false, msg: "password not updated, email maybe unavailable"}
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

const storeLinkToken = async( user_id: number, email: string, token: string
                        ): Promise<StoreLinkTokenRes> => {

    try {
        const connection: RowDataPacket = await pool.getConnection();

        const [res]: [{insertId: number}] = await connection.query(`
        INSERT INTO link_tokens (user_id, email, token)
        VALUES (?, ?, ?)
        `, [user_id, email, token,]);

        connection.release();

        console.log(res)
        return {success: true, msg: "",
            details: [{link_tokens_id:res.insertId, user_id, email}]
        };
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

const getLinkToken = async(token: string ): Promise<LinkTokenRes> => {
    try {
        const connection: RowDataPacket = await pool.getConnection();

        const [res]:[Array<
            {user_id: number, email: string, token: string, create_time: Date}
            >] = await connection.query(`
        SELECT * FROM link_tokens
        WHERE token = ?
        `, [token]);

        connection.release();
        
        if(res.length === 1 && token === res[0].token){
            const {user_id, email, create_time} = res[0]

            const currentDateTime = create_time;
            currentDateTime.setHours(currentDateTime.getHours() + 3);
            if(currentDateTime < new Date()){
                return {success: false, msg: "Link Expired"}
            }   
            return {success: true, email, user_id, msg: ""};
        }else{
            return {success: false, msg: "Link Invalid"}
        }
    } catch (error) {
        console.log(error)
        if (error.sqlMessage) {
            return {success: false,  msg: error.sqlMessage };
          } else {
            return {success: false, msg: error.message };
        }
    }
}

module.exports = {
    signupUser,
    loginUser,
    // loginAdmin,
    resetPassword,
    storeLinkToken,
    getLinkToken,
}