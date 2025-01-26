import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-templates/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") ?? "";
    const fileName = url.searchParams.get("fileName") ?? "";
    const modelName = url.searchParams.get("modelName") ?? "";

    //validate the webhook
    const id = req.headers.get("webhook-id") ?? "";
    const timestamp = req.headers.get("webhook-timestamp") ?? "";
    const webhookSignature = req.headers.get("webhook-signature") ?? "";

    const signedContent = `${id}.${timestamp}.${JSON.stringify(body)}`;
    const secret = await replicate.webhooks.default.secret.get();

    const secretBytes = Buffer.from(secret.key.split("_")[1], "base64");
    const signature = crypto
      .createHmac("sha256", secretBytes)
      .update(signedContent)
      .digest("base64");

    const expectedSignatures = webhookSignature
      .split(" ")
      .map((sig) => sig.split(",")[1]);
    const isValid = expectedSignatures.some(
      (expectedSignature) => expectedSignature === signature
    );

    if (!isValid) {
      return NextResponse.json("Invalid signature", { status: 401 });
    }

    const { data: user, error: userError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (userError || !user) {
      return NextResponse.json("User not found", { status: 401 });
    }

    const userEmail = user.user.email ?? "";
    const username = user.user.user_metadata.full_name ?? "";

    if (body.status === "succeeded") {
      const { data, error } = await resend.emails.send({
        from: "Artify AI <onboarding@resend.dev>",
        to: [userEmail],
        subject: "Model training completed!",
        react: EmailTemplate({
          username,
          message: "Your model training has been completed",
        }),
      });

      await supabaseAdmin
        .from("models")
        .update({
          training_status: body.status,
          training_time: body.metrics?.total_time ?? null,
          version: body.output?.version.split(":")[1] ?? null,
        })
        .eq("user_id", userId)
        .eq("model_name", modelName);
    } else {
      await resend.emails.send({
        from: "Artify AI <onboarding@resend.dev>",
        to: [userEmail],
        subject: `Model training ${body.status}`,
        react: EmailTemplate({
          username,
          message: `Your model training has been ${body.status}`,
        }),
      });

      await supabaseAdmin
        .from("models")
        .update({
          training_status: body.status,
        })
        .eq("user_id", userId)
        .eq("model_name", modelName);

      const { data: oldCredits, error } = await supabaseAdmin
        .from("credits")
        .select("model_training_count")
        .eq("user_id", userId)
        .single();

      if (error) throw new Error("Error getting user credits!");

      await supabaseAdmin
        .from("credits")
        .update({ model_training_count: oldCredits?.model_training_count + 1 })
        .eq("user_id", userId)
        .single();
    }
    await supabaseAdmin.storage.from("training_data").remove([`${fileName}`]);

    return NextResponse.json("Ok", { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal server error!", { status: 500 });
  }
}
