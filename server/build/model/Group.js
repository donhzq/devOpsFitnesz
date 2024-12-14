"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const GroupSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    trainer: { type: String, required: true },
    limit: { type: Number, required: true },
    users: { type: [String], reqired: false },
    quaue: { type: [String], reqired: false }
});
exports.Group = mongoose_1.default.model('Group', GroupSchema);
//# sourceMappingURL=Group.js.map