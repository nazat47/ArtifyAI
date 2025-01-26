"use client";
import React from "react";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import useGeneratedStore from "@/store/use-generated-store";

const GeneratedImages = () => {
  const { images, loading } = useGeneratedStore();

  if (images.length === 0) {
    return (
      <Card className="max-w-2xl bg-muted w-full">
        <CardContent className="flex aspect-square items-center justify-center p-6">
          <span className="text-2xl text-muted-foreground">
            No images generated
          </span>
        </CardContent>
      </Card>
    );
  }
  return (
    <Carousel className="w-full max-w-2xl">
      <CarouselContent>
        {images.map((image, i) => (
          <CarouselItem key={i}>
            <div className="relative flex items-center justify-center rounded-lg overflow-hidden aspect-square">
              <Image
                src={image.url}
                alt={"Generated Images"}
                fill
                className="object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default GeneratedImages;
