User สมัครใน frontend
-> frontend POST /auth/register (frontend/src/app/(auth)/register/page.tsx + frontend/src/lib/api.ts)
-> backend SignUp ไป Cognito (backend/src/routes/auth.route.ts -> backend/src/controllers/auth.controller.ts -> backend/src/services/cognito.service.ts)
-> Cognito ส่ง email code (AWS Cognito User Pool)

User ใส่ code
-> frontend POST /auth/verify-email (frontend/src/app/(auth)/verify-email/page.tsx + frontend/src/lib/api.ts)
-> backend ConfirmSignUp ไป Cognito (backend/src/routes/auth.route.ts -> backend/src/controllers/auth.controller.ts -> backend/src/services/cognito.service.ts)

User login
-> frontend POST /auth/login (frontend/src/app/(auth)/login/page.tsx + frontend/src/lib/api.ts)
-> backend InitiateAuth ไป Cognito (backend/src/routes/auth.route.ts -> backend/src/controllers/auth.controller.ts -> backend/src/services/cognito.service.ts)
-> Cognito คืน tokens (AWS Cognito User Pool)
-> backend set HttpOnly cookies (backend/src/controllers/auth.controller.ts)
-> backend sync user ลง MongoDB (backend/src/controllers/auth.controller.ts + backend/src/models/user.model.ts)

เปิดหน้าเว็บใหม่
-> AuthProvider เรียก /auth/me (frontend/src/lib/auth-context.tsx + frontend/src/lib/api.ts)
-> backend verify idToken จาก cookie (backend/src/routes/auth.route.ts -> backend/src/controllers/auth.controller.ts)
-> frontend รู้ว่า user login อยู่ (frontend/src/lib/auth-context.tsx)

เรียก route ที่ต้อง login
-> browser แนบ accessToken cookie (frontend/src/lib/api.ts)
-> authMiddleware verify token (backend/src/middleware/auth.middleware.ts)
-> controller ใช้ req.user.cognitoSub ทำงานต่อ (backend/src/controllers/*.controller.ts)

logout
-> frontend POST /auth/logout (frontend/src/lib/auth-context.tsx + frontend/src/lib/api.ts)
-> backend GlobalSignOut + clear cookie (backend/src/routes/auth.route.ts -> backend/src/controllers/auth.controller.ts -> backend/src/services/cognito.service.ts)
-> frontend user = null (frontend/src/lib/auth-context.tsx)