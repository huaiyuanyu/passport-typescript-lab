import { Strategy as GitHubStrategy } from 'passport-github2';
import { VerifyCallback } from 'passport-oauth2';
import { PassportStrategy } from '../../interfaces/index';
import { addGitHubUserToDatabase } from '../../controllers/userController';

import * as dotenv from "dotenv";
dotenv.config();

const githubStrategy: GitHubStrategy = new GitHubStrategy(
    //remember the whole env thing for clientid and clientsecret
    //
    
    {
        clientID: process.env.CLIENT_ID || "",
        clientSecret: process.env.CLIENT_SECRET || "",
        callbackURL: "http://localhost:8000/auth/github/callback",
        passReqToCallback: true,
    },
    
    async (req: Express.Request, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {
        console.log("async works!")
        console.log(profile.username);
        console.log(accessToken)
        addGitHubUserToDatabase(profile);
        done(null, profile);
    },
);

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;
