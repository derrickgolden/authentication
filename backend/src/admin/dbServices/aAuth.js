
// const loginAdmin = async(email, ) => {
//     try {
//         const connection = await pool.getConnection();

//         const [res] = await connection.query(`
//         SELECT * FROM admin_details
//         WHERE email = ?
//         `, [email]);

//         connection.release();
//         console.log(res);
//         if(res.length === 1){
//             const {admin_id, first_name, last_name, email, password, balance} = res[0]
                
//             return {userAvailable: true, passwordHash: password,
//                 details: [{admin_id, first_name, last_name, email, balance}]
//             };
//         }else{
//             return {userAvailable: false}
//         }
//     } catch (error) {
//         console.log(error)
//         if (error.sqlMessage) {
//             return {userAvailable: false,
//                 res:{success: false,  msg: error.sqlMessage} };
//           } else {
//             console.error('Error:', error.message);
//             return {userAvailable: false,
//                 res:{success: false, msg: error.message }};
//         }
//     }
// }