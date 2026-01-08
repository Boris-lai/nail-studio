import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get("action"); // 'init' or 'callback' or implicit from path

  // Environment variables
  const LINE_CHANNEL_ID = Deno.env.get("LINE_CHANNEL_ID");
  const LINE_CHANNEL_SECRET = Deno.env.get("LINE_CHANNEL_SECRET");
  const SUPABASE_URL =
    Deno.env.get("SUPABASE_URL") ?? Deno.env.get("VITE_SUPABASE_URL"); // Fallback
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY");

  // Hardcode to avoid dynamic origin issues
  const REDIRECT_URI =
    "https://qkgglpyddnmyhoybssye.supabase.co/functions/v1/line-auth?action=callback";

  if (
    !LINE_CHANNEL_ID ||
    !LINE_CHANNEL_SECRET ||
    !SUPABASE_URL ||
    !SUPABASE_SERVICE_ROLE_KEY
  ) {
    return new Response(
      JSON.stringify({ error: "Missing environment variables" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // Initialize Supabase Admin Client
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // --- 1. INITIALIZE LOGIN ---
  if (action === "init") {
    const state = crypto.randomUUID();
    // Scope: profile openid (and maybe others if needed)
    const scope = "profile openid";
    const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LINE_CHANNEL_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&state=${state}&scope=${scope}`;

    return Response.redirect(lineAuthUrl);
  }

  // --- 2. HANDLE CALLBACK ---
  if (action === "callback") {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code) {
      return new Response(JSON.stringify({ error: "No code provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      // Exchange code for access token
      const tokenResponse = await fetch(
        "https://api.line.me/oauth2/v2.1/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: REDIRECT_URI,
            client_id: LINE_CHANNEL_ID,
            client_secret: LINE_CHANNEL_SECRET,
          }),
        }
      );

      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok) {
        throw new Error(
          tokenData.error_description || "Failed to exchange token"
        );
      }

      const { access_token, id_token } = tokenData;

      // Get User Profile
      // Actually id_token contains sub, name, picture if decoded, but let's fetch profile to be sure
      const profileResponse = await fetch("https://api.line.me/v2/profile", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const profileData = await profileResponse.json();
      const userId = profileData.userId;
      const displayName = profileData.displayName;
      const pictureUrl = profileData.pictureUrl;

      // Check if user exists in Supabase
      // We use a dummy email: line_<userid>@line.login
      // Supabase Auth emails are case-insensitive/stored as lowercase usually, but let's be safe.
      const email = `line_${userId}@line.login`.toLowerCase();

      // Try to find user by email (or identity if we were linking)
      // Since we are using Custom Auth, we manage the user.

      let user;

      // Attempt to create user
      const { data: createdUser, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: {
            full_name: displayName,
            avatar_url: pictureUrl,
            line_user_id: userId,
            provider: "line (custom)",
          },
          password: crypto.randomUUID(), // Random password
        });

      if (createError) {
        // If error is "User already registered", we fetch the user
        // We shouldn't rely on listUsers() without arguments as it has limits.
        // We can create a client that bypasses RLS but accesses auth schema? No.
        // Sadly, getUserByEmail is not directly exposed in admin-api for some versions.
        // BUT, listUsers supports 'perPage' and 'page'.
        // However, we don't want to scan everything.

        // Strategy:
        // 1. Try to create (Done) -> Failed.
        // 2. We KNOW the user exists with this Email.
        // 3. Unfortunately, we can't get the ID easily from the error.

        // Let's try to search via listUsers but assuming small userbase for now
        // OR standard workaround: use `supabaseAdmin.from('users').select('*').eq('email', email)`
        // will NOT work because `auth` schema is protected.

        // WORKAROUND: In Edge Functions with Service Role, we CAN access auth schema if we assume direct connection?
        // No, via API it's restricted.

        // Let's try listUsers again but check handling.
        const { data: existingUsers, error: listError } =
          await supabaseAdmin.auth.admin.listUsers({
            perPage: 1000, // Try to grab more just in case
          });

        if (listError)
          throw new Error("List users failed: " + listError.message);

        // Robust email comparison
        user = existingUsers.users.find(
          (u) => u.email?.toLowerCase() === email
        );

        if (!user) {
          // Debug info
          console.log("Could not find user in list. Searched for:", email);
          console.log("Available users count:", existingUsers.users.length);
          throw new Error(
            "Could not create or find user: " + createError.message
          );
        }

        // specific update if needed (e.g. name changed)
        await supabaseAdmin.auth.admin.updateUserById(user.id, {
          user_metadata: {
            full_name: displayName,
            avatar_url: pictureUrl,
            line_user_id: userId,
            provider: "line (custom)",
          },
        });
      } else {
        user = createdUser.user;
      }

      if (!user) throw new Error("User resolution failed");

      // Generate Session Link or Tokens
      // Since we want to log the user in on the frontend, we can generate a magic link OR
      // since we know the 'password' (if we set it), we can sign in.
      // BUT, we reset password on creation. We don't know it for existing users.

      // BEST PRACTICE for generic frontends:
      // Generate a temporal OTP or Magic Link and redirect.
      // OR: create a session and pass the access_token in the redirect fragment.
      // `createSession` is available in newer APIs but effectively `signInWithPassword` works if we set password.
      // Let's use `generateLink` type `magiclink` and redirect user to that link.

      const { data: linkData, error: linkError } =
        await supabaseAdmin.auth.admin.generateLink({
          type: "magiclink",
          email: email,
          options: {
            // redirectTo: "http://localhost:5173/reservation"
            redirectTo: "https://nail-studio-six.vercel.app/reservation",
          },
        });

      if (linkError)
        throw new Error("Failed to generate login link: " + linkError.message);

      // The linkData.action_link is the magic link.
      // It normally redirects to the site's configured redirect URL.
      // We want to control where it goes: likely the root '/' or '/dashboard'.
      // We can append `?redirect_to=` to the magic link if supported, or rely on default.

      // Problem: Magic Link usually requires clicking. We want auto-login.
      // Supabase `verifyOtp` can exchange the token from the link.
      // Let's look at the link: `.../verify?token=...&type=magiclink...`

      // Alternative: Use an Impersonation (not recommended for prod safely without care)
      // OR sign a custom JWT? No, Supabase tokens are specific.

      // Let's try to return the Access Token directly via redirect if possible?
      // admin.generateLink type='magiclink' returns a URL.
      // If we redirect to that URL, verify logic on frontend runs?
      // No, the default verify handler in supabase backend sets cookie/redirects.

      // Let's redirect to the FRONTEND with the `access_token` and `refresh_token` if we can get them.
      // We can use `signInAnonymously`? No.

      // Let's use `signInWithPassword` on the server side (Edge Function) by temporarily setting a password?
      // Risky for concurrency.

      // What if we use `admin.getUserById` then manually sign JWT? Too complex.

      // Let's rely on the Magic Link redirect.
      // We redirect the browser to the `action_link`.
      // The browser hits Supabase, Supabase verifies, validates, sets session, and redirects to Site URL.
      // This is the standard flow.

      return Response.redirect(linkData.properties.action_link);

      // NOTE: We verified user identity via LINE beforehand. This is safe.
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  return new Response("Invalid action", { status: 400, headers: corsHeaders });
});
