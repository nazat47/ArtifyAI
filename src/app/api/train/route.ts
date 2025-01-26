import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const WEBHOOK_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://d278-103-197-153-35.ngrok-free.app";

const validateUserCredits = async (userId: string) => {
  const { data: userCredits, error } = await supabaseAdmin
    .from("credits")
    .select("*")
    .eq("user_id", userId)
    .single();
    
  if (error) throw new Error("Error getting user credits!");

  const credits = userCredits?.model_training_count ?? 0;
  if (credits <= 0) {
    throw new Error("No credits left for training");
  }
  return credits;
};

export async function POST(req: NextRequest) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error("Replicate token is not set");
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const input = {
      fileKey: formData.get("fileKey") as string,
      gender: formData.get("gender") as string,
      modelName: formData.get("modelName") as string,
    };

    if (!input.fileKey || !input.modelName) {
      return NextResponse.json(
        {
          error: "Missing required files!",
        },
        { status: 400 }
      );
    }

    const oldCredits = await validateUserCredits(user?.id);

    const filename = input.fileKey.replace("training_data/", "");
    const { data: fileUrl } = await supabaseAdmin.storage
      .from("training_data")
      .createSignedUrl(filename, 3600);

    if (!fileUrl?.signedUrl) {
      throw new Error("Failed to get the file url");
    }

    const hardware = await replicate.hardware.list();

    const modelId = `${user.id}_${Date.now()}_${input.modelName
      .toLowerCase()
      .replaceAll(" ", "-")}`;

    await replicate.models.create("nazat47", modelId, {
      visibility: "private",
      hardware: "gpu-a100-large",
    });

    const training = await replicate.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      "e440909d3512c31646ee2e0c7d6f6f4923224863a6a10c494606e79fb5844497",
      {
        destination: `nazat47/${modelId}`,
        input: {
          steps: 1200,
          resolution: "1024",
          input_images: fileUrl.signedUrl,
          trigger_word: "nazx",
        },
        webhook: `${WEBHOOK_URL}/api/webhooks/training?userId=${
          user.id
        }&modelName=${encodeURIComponent(
          input.modelName
        )}&fileName=${encodeURIComponent(filename)}`,
        webhook_events_filter: ["completed"],
      }
    );

    await supabaseAdmin.from("models").insert({
      model_id: modelId,
      user_id: user.id,
      gender: input.gender,
      model_name: input.modelName,
      training_status: training.status,
      trigger_word: "nazx",
      training_steps: 1200,
      training_id: training.id,
    });

    await supabaseAdmin
      .from("credits")
      .update({ model_training_count: oldCredits - 1 })
      .eq("user_id", user?.id);

    return NextResponse.json(
      {
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to start training!";
    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
