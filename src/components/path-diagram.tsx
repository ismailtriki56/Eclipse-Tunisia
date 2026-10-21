import { pathLine } from "@/data/eclipse-path-2027";
import { destinations } from "@/data/destinations";
import { cn } from "@/lib/cn";

const WINDOW = {
  minLongitude: 6.0,
  maxLongitude: 14.2,
  minLatitude: 31.6,
  maxLatitude: 37.4,
};

const WIDTH = 620;
const HEIGHT = 620;
const PADDING = 34;

/**
 * Simple equirectangular projection, corrected for latitude so that the
 * shape of the country is not stretched.
 */
function project(longitude: number, latitude: number) {
  const midLatitude = (WINDOW.minLatitude + WINDOW.maxLatitude) / 2;
  const scaleX =
    Math.cos((midLatitude * Math.PI) / 180) *
    (WINDOW.maxLongitude - WINDOW.minLongitude);
  const scaleY = WINDOW.maxLatitude - WINDOW.minLatitude;

  const x =
    PADDING +
    ((longitude - WINDOW.minLongitude) / scaleX) *
      (WIDTH - PADDING * 2);
  const y =
    HEIGHT -
    PADDING -
    ((latitude - WINDOW.minLatitude) / scaleY) * (HEIGHT - PADDING * 2);
  return [x, y] as const;
}

function pathFor(id: "northern-limit" | "central-line" | "southern-limit") {
  const line = pathLine(id);
  return line.geometry.coordinates
    .filter(
      ([longitude]) =>
        longitude >= WINDOW.minLongitude - 0.6 &&
        longitude <= WINDOW.maxLongitude + 0.6,
    )
    .map(([longitude, latitude]) => {
      const [x, y] = project(longitude, latitude);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

/**
 * A schematic of the path of totality across Tunisia, drawn from the
 * published NASA path data.
 */
export function PathDiagram({
  className,
  showCities = true,
}: {
  className?: string;
  showCities?: boolean;
}) {
  const north = pathFor("northern-limit");
  const centre = pathFor("central-line");
  const south = pathFor("southern-limit");

  const cityPoints = destinations
    .filter(
      (destination) =>
        destination.longitude >= WINDOW.minLongitude &&
        destination.longitude <= WINDOW.maxLongitude &&
        destination.latitude >= WINDOW.minLatitude &&
        destination.latitude <= WINDOW.maxLatitude,
    )
    .map((destination) => {
      const [x, y] = project(destination.longitude, destination.latitude);
      return { name: destination.name, x, y };
    });

  return (
    <figure className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Schematic of the path of totality across Tunisia, showing the northern limit, the centre line and the southern limit, with the location of each destination."
      >
        <defs>
          <linearGradient id="totality-band" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e9b64d" stopOpacity="0.42" />
            <stop offset="50%" stopColor="#e9b64d" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#e9b64d" stopOpacity="0.42" />
          </linearGradient>
        </defs>

        <rect
          x={PADDING}
          y={PADDING}
          width={WIDTH - PADDING * 2}
          height={HEIGHT - PADDING * 2}
          rx={14}
          fill="#efe6d6"
        />

        <polygon
          points={`${north} ${south
            .split(" ")
            .reverse()
            .join(" ")}`}
          fill="url(#totality-band)"
        />

        <polyline
          points={north}
          fill="none"
          stroke="#c9932d"
          strokeWidth={1.5}
          strokeDasharray="7 5"
          strokeLinecap="round"
        />
        <polyline
          points={south}
          fill="none"
          stroke="#c9932d"
          strokeWidth={1.5}
          strokeDasharray="7 5"
          strokeLinecap="round"
        />
        <polyline
          points={centre}
          fill="none"
          stroke="#0d1826"
          strokeWidth={2.5}
          strokeLinecap="round"
        />

        {showCities
          ? cityPoints.map((point) => (
              <g key={point.name}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={4.5}
                  fill="#0d1826"
                  stroke="#fbf9f4"
                  strokeWidth={1.5}
                />
                <text
                  x={point.x + 9}
                  y={point.y + 4}
                  className="fill-navy"
                  style={{ fontSize: 13, fontWeight: 500 }}
                >
                  {point.name}
                </text>
              </g>
            ))
          : null}
      </svg>

      <figcaption className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="h-0.5 w-6 bg-navy" />
          Centre line of totality
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="h-0.5 w-6 border-t border-dashed border-gold-600"
          />
          Northern and southern limits
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="h-2.5 w-6 rounded-sm bg-gold/30" />
          Band of totality
        </span>
      </figcaption>
    </figure>
  );
}
