"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const toJson_1 = require("./plugins/toJson");
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        private: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: (value) => {
            if (!validator_1.default.isEmail(value))
                throw new Error("Please insert correct email");
        },
    },
    // phone: {
    //   type: String,
    //   unique: true,
    //   required: true,
    // },
    location: {
        type: String,
    },
    plan: {
        type: String,
        enum: ["free", "premium"],
        default: "free",
    },
    settings: {
        defaultRestaurant: mongoose_1.default.Types.ObjectId,
    },
    verified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    statics: {
        isEmailTaken: function (email) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield this.findOne({ email });
                return !!user;
            });
        },
        isUserNameTaken: function (username) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield this.findOne({ username });
                return !!user;
            });
        },
        isPhoneTaken: function (phone) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield this.findOne({ phone });
                return !!user;
            });
        },
    },
    methods: {
        isPasswordMatch: function (password) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = this;
                return bcrypt_1.default.compareSync(password, user.password);
            });
        },
    },
});
userSchema.plugin(toJson_1.toJSON);
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified("password")) {
            user.password = yield bcrypt_1.default.hash(user.password, 8);
        }
        next();
    });
});
// userSchema.statics.isEmailTaken = async function (email: string) {
//   const user = this.findOne({ email });
//   return !!user;
// };
exports.User = mongoose_1.default.model("User", userSchema);
