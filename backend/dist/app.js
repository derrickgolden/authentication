"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require('dotenv').config();
const auth_1 = __importDefault(require("./user/routes/auth"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// app.use(cors({origin: allowedDomains}))
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.status(200).send("hello world");
});
app.use("/user", auth_1.default);
// app.use("/user/dashboard", authenticateToken, transactMoney);
app.listen(process.env.SEVERPORT, () => {
    console.log("Listening to port ", process.env.SEVERPORT);
});
//# sourceMappingURL=app.js.map