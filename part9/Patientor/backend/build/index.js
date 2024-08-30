"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const diagonoses_1 = __importDefault(require("./routes/diagonoses"));
const patients_1 = __importDefault(require("./routes/patients"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/diagnoses', diagonoses_1.default);
app.use('/api/patients', patients_1.default);
app.get('/api/ping', (_req, resp) => {
    resp.json({ message: 'pong' });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
