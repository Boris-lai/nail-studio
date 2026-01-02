import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { appointment_id } = await req.json();

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("VITE_SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY");
  const LINE_CHANNEL_ACCESS_TOKEN = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN");

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !LINE_CHANNEL_ACCESS_TOKEN) {
    return new Response(JSON.stringify({ error: "Missing config" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // 1. Get Appointment Details
    const { data: appointment, error: appError } = await supabaseAdmin
      .from("appointments")
      .select("*")
      .eq("id", appointment_id)
      .single();

    if (appError || !appointment) throw new Error("Appointment not found");

    // 2. Get User Details (line_user_id)
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(
      appointment.user_id
    );

    if (userError || !userData.user) throw new Error("User not found");

    const lineUserId = userData.user.user_metadata?.line_user_id;

    if (!lineUserId) throw new Error("User does not have a linked LINE account");

    // 3. Send LINE Message
    const message = {
      to: lineUserId,
      messages: [
        {
          type: "text",
          text: `您好！您的預約已確認。\n\n時間: ${appointment.date} ${appointment.timeSlot}\n項目: ${appointment.style}\n\n期待您的光臨！`,
        },
      ],
    };

    const lineRes = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(message),
    });

    if (!lineRes.ok) {
      const err = await lineRes.json();
      throw new Error("LINE API Error: " + JSON.stringify(err));
    }

    // 4. Update Appointment Status to CONFIRMED (if not already)
    await supabaseAdmin
      .from("appointments")
      .update({ status: "CONFIRMED" })
      .eq("id", appointment_id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
