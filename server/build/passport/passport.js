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
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurePassport = void 0;
const passport_local_1 = require("passport-local");
const User_1 = require("../model/User"); // Mongoose User modell importja
const configurePassport = (passport) => {
    // Felhasználó szerializálása (session-be mentés)
    passport.serializeUser((user, done) => {
        console.log('user is serialized.');
        done(null, user._id); // Mongoose modellek esetén az _id mentése
    });
    // Felhasználó deszerializálása (session-ből visszaállítás)
    passport.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.User.findById(id); // Mongoose keresés
            if (user) {
                done(null, user);
            }
            else {
                done(null, false);
            }
        }
        catch (error) {
            done(error, false);
        }
    }));
    // Local stratégia konfigurálása
    passport.use('local', new passport_local_1.Strategy({ usernameField: 'username', passwordField: 'password' }, // Field mapping
    (userName, password, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(userName, password);
            const user = yield User_1.User.findOne({ userName });
            if (!user) {
                return done(null, false, { message: 'Incorrect username or password.' });
            }
            user.comparePassword(password, (error, isMatch) => {
                if (error || !isMatch) {
                    console.log(error);
                    return done(null, false, { message: 'Incorrect username or password.' });
                }
                return done(null, user);
            });
        }
        catch (error) {
            return done(error);
        }
    })));
    return passport;
};
exports.configurePassport = configurePassport;
//# sourceMappingURL=passport.js.map