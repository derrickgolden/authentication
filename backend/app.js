const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
// app.use(cors({origin: allowedDomains}))
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use("/user", adminauth);
app.use("/user/dashboard", authenticateToken, transactMoney);