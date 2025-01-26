"use client";
import { Tables } from "@datatypes.types";
import Image from "next/image";
import React, { useState } from "react";
import ImageDialog from "./image-dialog";

type ImageProps = {
  url: string | undefined;
} & Tables<"generated_images">;

interface GalleryProps {
  images: ImageProps[];
}

const GalleryComponent = ({ images }: GalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<ImageProps | null>(null);

  if (images.length === 0) {
    <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
      No Images found!
    </div>;
  }
  return (
    <section className="container mx-auto py-8">
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {images.map((image, i) => (
          <div key={i}>
            <div
              onClick={() => setSelectedImage(image)}
              className="relative group overflow-hidden cursor-pointer transition-transform"
            >
              <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-70 rounded">
                <div className="flex items-center justify-center h-full">
                  <p className="text-primary-foreground text-lg font-semibold">
                    View Details
                  </p>
                </div>
              </div>
              <Image
                src={image.url || ""}
                alt={image.prompt || ""}
                width={image.width || 0}
                height={image.height || 0}
                className="object-cover rounded"
              />
            </div>
          </div>
        ))}
      </div>
      {selectedImage && (
        <ImageDialog
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </section>
  );
};

export default GalleryComponent;
