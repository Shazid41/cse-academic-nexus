export function friendlyFirebaseError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("auth/invalid-credential")) {
    return "Account not found or password is wrong. Create an account first, reset password, or use Google login.";
  }

  if (message.includes("auth/user-not-found")) {
    return "No account found with this email. Please create an account first.";
  }

  if (message.includes("auth/wrong-password")) {
    return "Password is incorrect. Try again or use Forgot password.";
  }

  if (message.includes("auth/email-already-in-use")) {
    return "This email already has an account. Please sign in instead.";
  }

  if (message.includes("auth/operation-not-allowed")) {
    return "This login method is not enabled in Firebase Authentication.";
  }

  if (message.includes("auth/unauthorized-domain")) {
    return "This domain is not authorized in Firebase. Add shazid41.github.io in Authentication authorized domains.";
  }

  if (message.includes("permission-denied") || message.includes("Missing or insufficient permissions")) {
    return "Firebase permission denied. Publish the Firestore rules from this project.";
  }

  return message.replace("Firebase: Error ", "Firebase: ");
}
