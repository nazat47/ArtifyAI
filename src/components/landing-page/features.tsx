import Image from "next/image";
import AnimatedGradientText from "../ui/animated-gradient-text";
import { cn } from "@/lib/utils";
import dashboardImage from "../../../public/dashboard-img.png";

const Features = () => {
  return (
    <section
      id="features"
      className="w-full bg-muted py-32 flex flex-col items-center justify-center"
    >
      <div className="container px-6 xs:px-8 sm:px-0 sm:mx-8 lg:mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 relative bg-muted">
        <div className="col-span-full space-y-4">
          <AnimatedGradientText className="ml-0 bg-background backdrop-blur-0">
            <span
              className={cn(
                `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
              )}
            >
              Features
            </span>
          </AnimatedGradientText>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold">
            Unlock Unlimited Possibilities with Pictoria AI
          </h2>
          <p className="text-base text-muted-foreground lg:max-w-[75%]">
            Our platform offers a wide range of features designed to enhance
            your image creation experience. From easy-to-use editing tools to
            powerful AI-powered image generation, we have everything you need to
            bring your ideas to life.
          </p>
        </div>
        {/* <div className="flex flex-col items-start justify-start order-2 lg:order-1">
          {featureList.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-2 sm:gap-4 rounded-lg py-8 lg:p-12"
            >
              <span className="p-0 sm:p-2 rounded-md text-foreground sm:text-background bg-muted sm:bg-foreground">
                {feature.icon}
              </span>
              <div>
                <h3 className="text-xl sm:text-2xl font-medium">{feature.title}</h3>
                <p className="text-sm xs:text-base text-muted-foreground pt-2">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div> */}
        <div
          className={cn(
            "h-fit lg:sticky top-32 pl-16 pt-16 rounded-lg border border-r-gray-300 border-b-gray-300 animate-gradient bg-gradient-to-r from-[#627FAB] via-[#895480] to-[#627FAB] bg-[length:var(--bg-size)_100%] [--bg-size:400%] order-1 lg:order-2"
          )}
        >
          <Image
            src={dashboardImage}
            alt="features"
            className="w-full h-auto rounded-tl-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
