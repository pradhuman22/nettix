import { auth } from "./auth";
import { createAuthClient } from "better-auth/react";
import {
  emailOTPClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>({
      user: {
        bio: {
          type: "string",
          required: false,
        },
        contact: {
          type: "string",
          required: false,
        },
      },
    }),
    emailOTPClient(),
  ],
});
