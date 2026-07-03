import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { dbPool } from "db";

export const auth = betterAuth({
  database: dbPool,

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "student",
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "pending",
      },
      needPasswordChange: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      isDeleted: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
    },
  },
  
  plugins: [jwt()],
  
  session: {
    cookieCache: {
      enabled: true, 
      strategy: "jwt",
      maxAge: 5 * 24 * 60 * 60, // 5 days
    },
  },
});