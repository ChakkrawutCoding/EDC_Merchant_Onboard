User สมัครใน frontend
-> frontend POST /auth/register
-> backend SignUp ไป Cognito
-> Cognito ส่ง email code

User ใส่ code
-> frontend POST /auth/verify-email
-> backend ConfirmSignUp ไป Cognito

User login
-> frontend POST /auth/login
-> backend InitiateAuth ไป Cognito
-> Cognito คืน tokens
-> backend set HttpOnly cookies
-> backend sync user ลง MongoDB

เปิดหน้าเว็บใหม่
-> AuthProvider เรียก /auth/me
-> backend verify idToken จาก cookie
-> frontend รู้ว่า user login อยู่

เรียก route ที่ต้อง login
-> browser แนบ accessToken cookie
-> authMiddleware verify token
-> controller ใช้ req.user.cognitoSub ทำงานต่อ

logout
-> frontend POST /auth/logout
-> backend GlobalSignOut + clear cookie
-> frontend user = null