import { Strategy as GitHubStrategy } from 'passport-github2';
import { VerifyCallback } from 'passport-oauth2';
import { PassportStrategy } from '../../interfaces/index';

const githubStrategy: GitHubStrategy = new GitHubStrategy(
    //remember the whole env thing for clientid and clientsecret
    
    {
        clientID: "",
        clientSecret: "",
        callbackURL: "",
        passReqToCallback: true,
    },
    
    async (req: Express.Request, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {
        console.log(profile);
    },
);

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;
