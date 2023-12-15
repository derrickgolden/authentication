const { pool } = require("./mysqlSetup");

const signupUser = async (first_name, last_name, email, remember_me, country, hash, phone) => {
    try {
        const connection = await pool.getConnection();

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

        const userId = insertUser.insertId;

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

const loginUser = async(email, ) => {
    try {
        const connection = await pool.getConnection();

        const [res] = await connection.query(`
        SELECT user_details.*, transaction_totals.total_deposit, transaction_totals.total_withdraw, transaction_totals.balance
        FROM user_details
        LEFT JOIN transaction_totals ON user_details.user_id = transaction_totals.user_id
        WHERE email = ?
        `, [email]);

        connection.release();
        console.log(res);
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
            console.error('Error:', error.message);
            return {userAvailable: false,
                res:{success: false, msg: error.message }};
        }
    }
}

const loginAdmin = async(email, ) => {
    try {
        const connection = await pool.getConnection();

        const [res] = await connection.query(`
        SELECT * FROM admin_details
        WHERE email = ?
        `, [email]);

        connection.release();
        console.log(res);
        if(res.length === 1){
            const {admin_id, first_name, last_name, email, password, balance} = res[0]
                
            return {userAvailable: true, passwordHash: password,
                details: [{admin_id, first_name, last_name, email, balance}]
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
            console.error('Error:', error.message);
            return {userAvailable: false,
                res:{success: false, msg: error.message }};
        }
    }
}

const resetPassword = async(password, email) =>{
    try {
        const connection = await pool.getConnection();

        const [res] = await connection.query(`
        UPDATE user_details 
        SET password = ?
        WHERE email = ?;
        `, [password, email])

        connection.release();

        console.log("response", res)

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

const storeLinkToken = async(user_id, email, token,) => {

    try {
        const connection = await pool.getConnection();

        const [res] = await connection.query(`
        INSERT INTO link_tokens (user_id, email, token)
        VALUES (?, ?, ?)
        `, [user_id, email, token,]);

        connection.release();

        console.log(res)
        return {success: true, 
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

const getLinkToken = async(token ) => {
    try {
        const connection = await pool.getConnection();

        const [res] = await connection.query(`
        SELECT * FROM link_tokens
        WHERE token = ?
        `, [token]);

        connection.release();
        
        const {user_id, email, token: storedToken, create_time} = res[0]
        console.log(res);
        if(res.length === 1 && token === storedToken){
            const currentDateTime = create_time;
            currentDateTime.setHours(currentDateTime.getHours() + 3);
            if(currentDateTime < new Date()){
                return {success: false, msg: "Link Expired"}
            }   
            return {success: true, email, user_id};
        }else{
            return {success: false, msg: "Link Invalid"}
        }
    } catch (error) {
        console.log(error)
        if (error.sqlMessage) {
            return {userAvailable: false,
                res:{success: false,  msg: error.sqlMessage} };
          } else {
            console.error('Error:', error.message);
            return {userAvailable: false,
                res:{success: false, msg: error.message }};
        }
    }
}

module.exports = {
    signupUser,
    loginUser,
    loginAdmin,
    resetPassword,
    storeLinkToken,
    getLinkToken,
}