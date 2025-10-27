import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserService } from '../user/user.service';
import { JWTService } from './application/jwt.service';


export function configurePassport(userService: UserService, jwtService: JWTService) {
  // Google Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    scope: ['profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google profile:', profile);

      // Ищем пользователя по googleId
      let user = await userService.findByGoogleId(profile.id);
      
      if (!user) {
        // Ищем по email
        user = await userService.findByEmail(profile.emails?.[0]?.value || '');
        
        if (!user) {
          // Создаем нового пользователя
          user = await userService.createWithGoogle({
            name: profile.displayName,
            email: profile.emails?.[0]?.value || '',
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value
          });
        } else {
          // Обновляем существующего пользователя с googleId
          user = await userService.update(user.id, {
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value
          });
        }
      }

      return done(null, user);
    } catch (error) {
      console.error('Passport Google strategy error:', error);
      return done(error as Error, undefined);
    }
  }));

  // Сериализация пользователя
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Десериализация пользователя
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await userService.getById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  return passport;
}