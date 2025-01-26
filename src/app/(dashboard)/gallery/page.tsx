import { getImages } from "@/actions/image-actions";
import GalleryComponent from "@/components/gallery/gallery-component";
import React from "react";

const Gallery = async () => {
  const { data: images } = await getImages();

  return (
    <section className="container mx-auto">
      <h1 className="text-3xl font-semibold mb-2">My Images</h1>
      <p className="text-muted-foreground mb-6">
        Here you can see all the images you generated. Click on the image to
        view details.
      </p>
      <GalleryComponent images={images || []} />
    </section>
  );
};

export default Gallery;
