import { generateImageAction, storeImage } from "@/actions/image-actions";
import { imageGenerationFormSchema } from "@/components/image-generation/configuration";
import { toast } from "sonner";
import { z } from "zod";
import { create } from "zustand";

interface GenerateState {
  loading: boolean;
  images: Array<{ url: string }>;
  error: string | null;
  generateImage: (
    values: z.infer<typeof imageGenerationFormSchema>
  ) => Promise<void>;
}

const useGeneratedStore = create<GenerateState>((set) => ({
  loading: false,
  images: [],
  error: null,

  generateImage: async (values: z.infer<typeof imageGenerationFormSchema>) => {
    set({ loading: true, error: null });

    const toastId = toast.loading("Generating image...");
    try {
      const { error, success, data } = await generateImageAction(values);
      if (!success) {
        set({ error: error, loading: false });
        return;
      }

      const dataWithUrl = data.map((url: string) => ({
        url,
        ...values,
      }));

      set({ images: dataWithUrl, loading: false });
      toast.success("Image generated successfully", { id: toastId });
      await storeImage(dataWithUrl);
      toast.success("Image stored successfully", { id: toastId });
    } catch (error) {
      console.log(error);
      set({
        error: "Failed to generate image. Please try again.",
        loading: false,
      });
    }
  },
}));

export default useGeneratedStore;
