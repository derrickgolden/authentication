
// router.post('/loginadmin', async (req: Request, res: Response) =>{
//     const { email, password}: PersonDetails = req.body;
//     console.log(req.body)

//     const response = await loginAdmin(email);
//     const { passwordHash, userAvailable, details } = response;

//     console.log(response);
//     try {
//         if(!userAvailable){
//             return res.status(200).send({success: false, msg: "Email not registered", details: response});
//         }
//         console.log(details)

//         const match = await bcrypt.compare(password, passwordHash);
//         if(match) {
//             // Create a JWT token
//             const {admin_id, first_name, last_name, email} = details;
//             const expiresInDays = 1;

//             const { token, exp_date } = await generateAuthToken(
//                 admin_id, first_name, last_name, email, expiresInDays
//             );
            
//             return res.status(200).send({success: true, token, msg: "Admin Found", details}) ;
            
//         }else{
//             return res.status(200).send({success: false, msg: "Incorrect Password"});
//         }
//     } catch (error) {
//         console.log(error)
//         return res.status(404).send({success: false, msg: error.message})
//     }

// });
