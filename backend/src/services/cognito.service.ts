import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    ConfirmSignUpCommand,
    InitiateAuthCommand,
    GlobalSignOutCommand,
    ResendConfirmationCodeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import crypto from "node:crypto";

const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
});

const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;

function assertCognitoEnv() { //Check if anything missing
    if (!process.env.AWS_REGION) {
        throw new Error("AWS_REGION is missing");
    }

    if (!CLIENT_ID) {
        throw new Error("COGNITO_CLIENT_ID is missing");
    }

    if (!CLIENT_SECRET) {
        throw new Error("COGNITO_CLIENT_SECRET is missing");
    }
}

//ทำ SecretHash
/*
    HMAC_SHA256(username + clientId, clientSecret)
    แล้วแปลงเป็น base64
*/
function computeSecretHash(username: string): string {
    assertCognitoEnv();

    return crypto
        .createHmac("sha256", CLIENT_SECRET!)
        .update(username + CLIENT_ID!)
        .digest("base64");
}

//Regiser user เข้า Cognito แล้ว Cognito จะส่ง verification code ไป email
export async function cognitoSignUp(params: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}) {
    assertCognitoEnv();

    await client.send(
        new SignUpCommand({
            ClientId: CLIENT_ID!,
            SecretHash: computeSecretHash(params.email),
            Username: params.email,
            Password: params.password,
            UserAttributes: [
                { Name: "email", Value: params.email },
                { Name: "given_name", Value: params.firstName },
                { Name: "family_name", Value: params.lastName },
            ]
        })  
    );
}

//ใช้ยืนยัน code จาก email
export async function cognitoConfirmSignUp(email: string, code: string) {
    assertCognitoEnv();

    await client.send(
        new ConfirmSignUpCommand({
            ClientId: CLIENT_ID!,
            SecretHash: computeSecretHash(email),
            Username: email,
            ConfirmationCode: code,
        })
    );
}

{/* Login */}

export type CognitoTokens = {
    accessToken: string;
    idToken: string;
    refreshToken: string;
};

export type RefreshedCognitoTokens = {
    accessToken: string;
    idToken: string;
};

export async function cognitoLogin(
    email: string,
    password: string
): Promise<CognitoTokens> {
    assertCognitoEnv();

    const response = await client.send(
        new InitiateAuthCommand({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: CLIENT_ID!,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
                SECRET_HASH: computeSecretHash(email),
            },
        })
    );

    const result = response.AuthenticationResult;

    if (!result?.AccessToken || !result.IdToken || !result.RefreshToken) {
        throw new Error("Cognito login did not return tokens");
    }

    return {
        accessToken: result.AccessToken,
        idToken: result.IdToken,
        refreshToken: result.RefreshToken,
    };
}

export async function cognitoRefreshTokens(
    email: string,
    refreshToken: string
): Promise<RefreshedCognitoTokens> {
    assertCognitoEnv();

    const response = await client.send(
        new InitiateAuthCommand({
            AuthFlow: "REFRESH_TOKEN_AUTH",
            ClientId: CLIENT_ID!,
            AuthParameters: {
                REFRESH_TOKEN: refreshToken,
                SECRET_HASH: computeSecretHash(email),
            },
        })
    );

    const result = response.AuthenticationResult;

    if (!result?.AccessToken || !result.IdToken) {
        throw new Error("Cognito refresh did not return tokens");
    }

    return {
        accessToken: result.AccessToken,
        idToken: result.IdToken,
    };
}

{/* Logout */}

export async function cognitoGlobalSignOut(accessToken: string) {
    await client.send(
        new GlobalSignOutCommand({
            AccessToken: accessToken,
        })
    );
}

export async function cognitoResendConfirmationCode(email: string) {
    assertCognitoEnv();

    await client.send(
        new ResendConfirmationCodeCommand({
            ClientId: CLIENT_ID!,
            SecretHash: computeSecretHash(email),
            Username: email,
        })
    );
}