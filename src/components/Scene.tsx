import { PassFrontArtwork } from "@/components/PassArtwork";
import { cn } from "@/utils/cn";

/**
 * Approved pass rendered as a standalone designed object.
 * Contextual appliance composites were deliberately removed: final placement
 * imagery will be created only after physical scale and surface tests exist.
 */
export function PassObject({
  className,
  stack = 0,
  tilt = -2,
}: {
  className?: string;
  stack?: number;
  tilt?: number;
}) {
  return (
    <div className={cn("relative", className)} style={{ transform: `rotate(${tilt}deg)` }}>
      {Array.from({ length: stack }).map((_, index) => {
        const distance = stack - index;
        return (
          <div
            key={index}
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              transform: `translate(${distance * 3}px, ${distance * 5}px) rotate(${distance * 0.5}deg)`,
              filter: `brightness(${1 - distance * 0.045})`,
            }}
          >
            <PassFrontArtwork className="block h-auto w-full" />
          </div>
        );
      })}
      <div className="relative stack-shadow">
        <PassFrontArtwork className="block h-auto w-full" />
      </div>
    </div>
  );
}
