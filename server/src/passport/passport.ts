import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../model/User'; // Mongoose User modell importja

export const configurePassport = (passport: PassportStatic): PassportStatic => {

    // Felhasználó szerializálása (session-be mentés)
    passport.serializeUser((user: Express.User, done) => {
        console.log('user is serialized.');
        done(null, (user as any)._id); // Mongoose modellek esetén az _id mentése
    });

    // Felhasználó deszerializálása (session-ből visszaállítás)
    passport.deserializeUser(async (id: string, done) => {
        try {
            const user = await User.findById(id); // Mongoose keresés
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        } catch (error) {
            done(error, false);
        }
    });

    // Local stratégia konfigurálása
    passport.use(
        'local',
        new LocalStrategy(
            { usernameField: 'username', passwordField: 'password' }, // Field mapping
            async (userName, password, done) => {
                try {
                    console.log(userName ,password);
                    const user = await User.findOne({ userName });
                    if (!user) {
                        return done(null, false, { message: 'Incorrect username or password.'});
                    }
                    user.comparePassword(password, (error, isMatch) => {
                        if (error || !isMatch) {
                            console.log(error);
                            return done(null , false, { message: 'Incorrect username or password.' });
                        }
                        return done(null, user);
                    });
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    return passport;
};
