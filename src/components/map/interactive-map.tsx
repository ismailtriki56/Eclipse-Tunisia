"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { destinations, Destination } from "@/data/destinations";
import { circumstancesFor } from "@/lib/eclipse/destinations";
import { pathData } from "@/data/eclipse-path-2027.coordinates";
import { getImage } from "@/data/images";
import { cn } from "@/lib/cn";
import {
  Search,
  Info,
  Plus,
  ZoomIn,
  ZoomOut,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

export type FilterCategory =
  | "all"
  | "total"
  | "partial"
  | "desert"
  | "coast"
  | "cultural";

interface InteractiveMapProps {
  initialSlug?: string;
  className?: string;
  showSidebar?: boolean;
  onSelectDestination?: (dest: Destination) => void;
}

// Compute NASA path geometry once at module level using project coordinates
function getPathCoordinates() {
  const northFeature = pathData.find((f) => f.properties.id === "northern-limit");
  const southFeature = pathData.find((f) => f.properties.id === "southern-limit");
  const centerFeature = pathData.find((f) => f.properties.id === "central-line");

  const minLon = 4.5;
  const maxLon = 14.5;

  // Leaflet uses [latitude, longitude]
  const northLatLngs: [number, number][] = (
    (northFeature?.geometry.coordinates as [number, number][]) || []
  )
    .filter(([lon]) => lon >= minLon && lon <= maxLon)
    .map(([lon, lat]) => [lat, lon]);

  const southLatLngs: [number, number][] = (
    (southFeature?.geometry.coordinates as [number, number][]) || []
  )
    .filter(([lon]) => lon >= minLon && lon <= maxLon)
    .map(([lon, lat]) => [lat, lon]);

  const centerLatLngs: [number, number][] = (
    (centerFeature?.geometry.coordinates as [number, number][]) || []
  )
    .filter(([lon]) => lon >= minLon && lon <= maxLon)
    .map(([lon, lat]) => [lat, lon]);

  // Polygon boundary: northern limit forward, southern limit backward
  const bandPolygon: [number, number][] = [
    ...northLatLngs,
    ...[...southLatLngs].reverse(),
  ];

  return { bandPolygon, northLatLngs, southLatLngs, centerLatLngs };
}

const { bandPolygon, northLatLngs, southLatLngs, centerLatLngs } =
  getPathCoordinates();

export function InteractiveMap({
  initialSlug = "tozeur",
  className,
  showSidebar = true,
  onSelectDestination,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layersRef = useRef<{ [key: string]: any }>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersGroupRef = useRef<any>(null);
  const initializedRef = useRef(false);
  const tileLoadCountRef = useRef(0);
  const tileErrorCountRef = useRef(0);
  const openPopupAfterRenderRef = useRef(false);

  const [selectedSlug, setSelectedSlug] = useState<string>(initialSlug);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mapReady, setMapReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  // Layer Toggles
  const [showTotalityBand, setShowTotalityBand] = useState(true);
  const [showCenterLine, setShowCenterLine] = useState(true);
  const [showLimitLines, setShowLimitLines] = useState(true);

  // Pre-calculate verified circumstances for all destinations
  const destinationsData = useMemo(() => {
    return destinations.map((d) => {
      const circ = circumstancesFor(d);
      const isTotal = circ.visibility === "total";
      const durationSeconds = circ.centralDurationSeconds ?? 0;
      const minutes = Math.floor(durationSeconds / 60);
      const seconds = Math.round(durationSeconds % 60);
      const formattedDuration = isTotal
        ? `${minutes}m ${seconds.toString().padStart(2, "0")}s`
        : `${(circ.obscuration * 100).toFixed(0)}% partial`;

      let categoryTag: "desert" | "coast" | "cultural" = "desert";
      if (
        ["gabes", "djerba", "sousse", "mahdia", "sidi-bou-said"].includes(d.slug)
      ) {
        categoryTag = "coast";
      } else if (
        ["el-jem", "kairouan", "carthage", "tunis", "matmata"].includes(d.slug)
      ) {
        categoryTag = "cultural";
      }

      return {
        ...d,
        circumstances: circ,
        isTotal,
        formattedDuration,
        categoryTag,
      };
    });
  }, []);

  const filteredDestinations = useMemo(() => {
    return destinationsData.filter((d) => {
      if (activeFilter === "total" && !d.isTotal) return false;
      if (activeFilter === "partial" && d.isTotal) return false;
      if (activeFilter === "desert" && d.categoryTag !== "desert") return false;
      if (activeFilter === "coast" && d.categoryTag !== "coast") return false;
      if (activeFilter === "cultural" && d.categoryTag !== "cultural")
        return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.region.toLowerCase().includes(q) ||
          d.summary.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [destinationsData, activeFilter, searchQuery]);

  const selectedDestination = useMemo(() => {
    return (
      destinationsData.find((d) => d.slug === selectedSlug) ||
      destinationsData[0]
    );
  }, [selectedSlug, destinationsData]);

  // Select destination and smoothly fly map
  const selectDestination = useCallback(
    (dest: Destination, openPopup = true) => {
      openPopupAfterRenderRef.current = openPopup;
      setSelectedSlug(dest.slug);
      if (onSelectDestination) {
        onSelectDestination(dest);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([dest.latitude, dest.longitude], 8.5, {
          duration: 1.2,
        });

        if (openPopup && markersGroupRef.current) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          markersGroupRef.current.eachLayer((layer: any) => {
            if (layer.destinationSlug === dest.slug) {
              layer.openPopup();
            }
          });
        }
      }
    },
    [onSelectDestination]
  );

  // Initialize Leaflet 2D Map with rock-solid lifecycle and OSM tiles
  useEffect(() => {
    // Prevent multiple initializations in React 19 / StrictMode
    if (initializedRef.current && mapInstanceRef.current) {
      return;
    }

    let isMounted = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any = null;
    let initTimer: ReturnType<typeof setTimeout> | null = null;
    let tileTimer: ReturnType<typeof setTimeout> | null = null;
    const container = mapContainerRef.current;

    setLoadError(null);
    setMapReady(false);
    tileLoadCountRef.current = 0;
    tileErrorCountRef.current = 0;

    async function initMap() {
      if (!container || !isMounted) return;

      try {
        const leafletModule = await import("leaflet");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const L = ((leafletModule as any).default || leafletModule) as any;
        if (!isMounted || !mapContainerRef.current) return;

        // Clean any existing Leaflet instances or leftover DOM state
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.remove();
          } catch (e) {
            console.warn("Cleanup previous map instance:", e);
          }
          mapInstanceRef.current = null;
        }

        // Prevent "Map container is already initialized" crash
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((container as any)._leaflet_id) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          delete (container as any)._leaflet_id;
        }

        // Initialize map centered on central Tunisia (34.0° N, 9.5° E)
        map = L.map(container, {
          center: [34.0, 9.5],
          zoom: 6.5,
          minZoom: 5,
          maxZoom: 14,
          zoomControl: false,
          attributionControl: true,
        });

        // OpenStreetMap standard raster tiles
        const osmTiles = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 18,
            subdomains: ["a", "b", "c"],
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
          }
        );

        // Only leave the loading state once a real tile has rendered. If every
        // tile request fails (blocked network, tile provider outage, CSP), show
        // a visible error and retry instead of leaving a blank map or spinner.
        osmTiles.on("tileload", () => {
          tileLoadCountRef.current += 1;
          if (tileTimer) {
            clearTimeout(tileTimer);
            tileTimer = null;
          }
          if (isMounted) {
            setMapReady(true);
            setLoadError(null);
          }
        });

        osmTiles.on("tileerror", () => {
          tileErrorCountRef.current += 1;
        });

        osmTiles.addTo(map);

        tileTimer = setTimeout(() => {
          if (!isMounted || tileLoadCountRef.current > 0) return;
          setLoadError(
            "OpenStreetMap tiles could not be loaded. Check your internet connection and retry. The destination list below still works."
          );
          setMapReady(true);
        }, 10000);

        // Totality Band (Shaded Polygon)
        const bandLayer = L.polygon(bandPolygon, {
          color: "#c9932d",
          weight: 2,
          fillColor: "#e9b64d",
          fillOpacity: 0.28,
          dashArray: "4, 4",
        }).addTo(map);
        layersRef.current.band = bandLayer;

        // Center Line (Maximum Duration Polyline)
        const centerLineLayer = L.polyline(centerLatLngs, {
          color: "#0d1826",
          weight: 3.5,
          opacity: 0.95,
        }).addTo(map);
        layersRef.current.centerLine = centerLineLayer;

        // Northern & Southern Limits
        const northLine = L.polyline(northLatLngs, {
          color: "#c9932d",
          weight: 2,
          dashArray: "5, 4",
          opacity: 0.85,
        });
        const southLine = L.polyline(southLatLngs, {
          color: "#c9932d",
          weight: 2,
          dashArray: "5, 4",
          opacity: 0.85,
        });
        const limitsGroup = L.layerGroup([northLine, southLine]).addTo(map);
        layersRef.current.limits = limitsGroup;

        // Marker Group for Destinations
        const markersGroup = L.layerGroup().addTo(map);
        markersGroupRef.current = markersGroup;

        mapInstanceRef.current = map;
        initializedRef.current = true;
        if (initTimer) {
          clearTimeout(initTimer);
          initTimer = null;
        }

        // Trigger resize calculation to prevent grey/blank canvas tiles
        setTimeout(() => {
          if (map && isMounted) {
            map.invalidateSize();
          }
        }, 150);

        setTimeout(() => {
          if (map && isMounted) {
            map.invalidateSize();
          }
        }, 450);
      } catch (err: unknown) {
        console.error("Map initialization failed:", err);
        const msg =
          err instanceof Error
            ? err.message
            : "Could not initialize map canvas";
        if (initTimer) {
          clearTimeout(initTimer);
          initTimer = null;
        }
        if (isMounted) {
          setLoadError(msg);
          // Still dismiss loading spinner so user is never stuck
          setMapReady(true);
        }
      }
    }

    // Watchdog: if Leaflet itself never initialises, surface an error instead
    // of leaving the loading spinner on screen forever.
    initTimer = setTimeout(() => {
      if (isMounted && !mapInstanceRef.current) {
        setLoadError(
          "The map engine did not finish loading. Check your connection and retry. The destination list below still works."
        );
        setMapReady(true);
      }
    }, 8000);

    initMap();

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      isMounted = false;
      initializedRef.current = false;
      if (initTimer) clearTimeout(initTimer);
      if (tileTimer) clearTimeout(tileTimer);
      window.removeEventListener("resize", handleResize);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn("Cleanup on unmount:", e);
        }
        mapInstanceRef.current = null;
      }
      markersGroupRef.current = null;
      layersRef.current = {};
      if (container) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (container as any)._leaflet_id;
      }
    };
  }, [retryKey]);

  // Update Markers whenever filtered destinations or selection change
  useEffect(() => {
    async function updateMarkers() {
      if (!mapReady || !markersGroupRef.current) return;
      const leafletModule = await import("leaflet");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = ((leafletModule as any).default || leafletModule) as any;

      markersGroupRef.current.clearLayers();

      destinationsData.forEach((dest) => {
        const isSelected = dest.slug === selectedSlug;
        const isVisible =
          filteredDestinations.findIndex((d) => d.slug === dest.slug) !== -1;

        if (!isVisible) return;

        // Custom HTML DivIcon for maximum visual clarity
        const iconHtml = `
          <div class="relative group cursor-pointer" style="transform: translate(-50%, -50%);">
            ${
              dest.isTotal
                ? `<div class="absolute -inset-1.5 rounded-full bg-amber-400 opacity-60 animate-ping"></div>`
                : ""
            }
            <div class="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-md text-xs font-semibold border transition-transform duration-200 hover:scale-110 ${
              isSelected
                ? "bg-[#0d1826] text-[#fbf9f4] border-[#e9b64d] ring-2 ring-[#e9b64d] scale-105 z-30"
                : dest.isTotal
                ? "bg-[#ffffff] text-[#16202b] border-[#e9b64d] z-20"
                : "bg-[#fbf9f4] text-[#5d6b78] border-[#e3e6e9] z-10"
            }">
              <span class="w-2 h-2 rounded-full shrink-0 ${
                dest.isTotal ? "bg-[#e9b64d]" : "bg-[#5d6b78]"
              }"></span>
              <span class="whitespace-nowrap font-medium">${dest.name}</span>
              ${
                dest.isTotal
                  ? `<span class="text-[0.65rem] text-[#c9932d] font-mono">${dest.formattedDuration}</span>`
                  : ""
              }
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "custom-eclipse-pin",
          iconSize: [120, 32],
          iconAnchor: [60, 16],
        });

        const marker = L.marker([dest.latitude, dest.longitude], {
          icon: customIcon,
        });

        // Attach slug for programmatic lookups
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (marker as any).destinationSlug = dest.slug;

        // Detailed popup content with astronomical data
        const popupContent = `
          <div class="p-1 max-w-[240px] font-sans">
            <div class="flex items-center justify-between gap-2 border-b border-gray-200 pb-1.5">
              <span class="text-[0.65rem] font-bold uppercase tracking-wider text-amber-600">${
                dest.region
              }</span>
              <span class="text-[0.7rem] font-bold px-1.5 py-0.5 rounded ${
                dest.isTotal
                  ? "bg-amber-100 text-amber-900"
                  : "bg-gray-100 text-gray-700"
              }">${
          dest.isTotal ? "Totality " + dest.formattedDuration : "Partial Eclipse"
        }</span>
            </div>
            <h4 class="mt-1 font-semibold text-base text-gray-900">${dest.name}</h4>
            <p class="mt-1 text-xs text-gray-600 leading-snug line-clamp-2">${
              dest.summary
            }</p>
            <div class="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
              <span class="text-gray-500">Max: <strong>${
                dest.circumstances.localTimes.maximum ?? "11:05"
              }</strong> · Alt: <strong>${dest.circumstances.sunAltitude.toFixed(0)}°</strong></span>
              <a href="/destinations/${dest.slug}" class="text-indigo-900 font-semibold hover:underline">Details &rarr;</a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          closeButton: true,
          offset: [0, -10],
        });

        marker.on("click", () => {
          openPopupAfterRenderRef.current = true;
          setSelectedSlug(dest.slug);
          if (onSelectDestination) {
            onSelectDestination(dest);
          }
        });

        marker.addTo(markersGroupRef.current);

        // Selection rebuilds the marker layer, which closes any popup the
        // marker just opened. Re-open it once the new marker is on the map.
        if (openPopupAfterRenderRef.current && isSelected) {
          marker.openPopup();
        }
      });

      openPopupAfterRenderRef.current = false;
    }

    updateMarkers();
  }, [
    mapReady,
    filteredDestinations,
    destinationsData,
    selectedSlug,
    onSelectDestination,
  ]);

  // Sync Layer Visibility Toggles
  useEffect(() => {
    if (!mapReady) return;

    if (layersRef.current.band) {
      if (showTotalityBand) {
        layersRef.current.band.setStyle({ opacity: 1, fillOpacity: 0.28 });
      } else {
        layersRef.current.band.setStyle({ opacity: 0, fillOpacity: 0 });
      }
    }

    if (layersRef.current.centerLine) {
      if (showCenterLine) {
        layersRef.current.centerLine.setStyle({ opacity: 0.95 });
      } else {
        layersRef.current.centerLine.setStyle({ opacity: 0 });
      }
    }

    if (layersRef.current.limits) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      layersRef.current.limits.eachLayer((l: any) => {
        l.setStyle({ opacity: showLimitLines ? 0.85 : 0 });
      });
    }
  }, [mapReady, showTotalityBand, showCenterLine, showLimitLines]);

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([34.0, 9.5], 6.5, { duration: 1 });
    }
  };

  const zoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleRetry = () => {
    initializedRef.current = false;
    tileLoadCountRef.current = 0;
    tileErrorCountRef.current = 0;
    setLoadError(null);
    setMapReady(false);
    setRetryKey((k) => k + 1);
  };

  const asset = selectedDestination
    ? getImage(selectedDestination.imageKey)
    : null;

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-card lg:flex-row",
        className
      )}
    >
      {/* Map Viewport Area with Guaranteed Height */}
      <div className="relative min-h-[500px] h-[580px] flex-1">
        {/* Actual Map Canvas Container with inline style guarantee */}
        <div
          ref={mapContainerRef}
          style={{ height: "580px", minHeight: "500px", width: "100%" }}
          className="h-full w-full bg-[#f4ece1]"
        />

        {/* Loading Spinner with automatic dismissal */}
        {!mapReady && !loadError ? (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-sand/85 backdrop-blur-xs">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-navy border-t-gold" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-navy">
              Loading 2027 Eclipse Geospatial Map...
            </p>
            <p className="mt-1 text-[0.7rem] text-muted">
              Rendering OpenStreetMap tiles and NASA Besselian coordinates
            </p>
          </div>
        ) : null}

        {/* Error Fallback with non-blocking retry */}
        {loadError ? (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-sand/90 p-6 text-center">
            <AlertTriangle className="h-10 w-10 text-danger" />
            <h3 className="mt-3 font-display text-lg font-semibold text-ink">
              Interactive Map Notice
            </h3>
            <p className="mt-1 max-w-md text-xs text-muted leading-relaxed">
              {loadError}. You can still browse and select all viewing destinations
              from the list below.
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-ivory hover:bg-navy-800 transition-colors shadow-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry Loading Map</span>
            </button>
          </div>
        ) : null}

        {/* Top Controls Overlay */}
        <div className="absolute left-4 top-4 z-[400] flex flex-wrap items-center gap-2">
          {/* Layer Controls Dropdown/Pills */}
          <div className="flex items-center gap-1 rounded-full border border-line/80 bg-paper/95 p-1 shadow-md backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setShowTotalityBand((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                showTotalityBand
                  ? "bg-gold text-navy shadow-xs"
                  : "text-muted hover:text-ink"
              )}
              title="Toggle Path of Totality Band"
            >
              <span className="h-2 w-2 rounded-full bg-navy/80" />
              <span>Totality Band</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCenterLine((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                showCenterLine
                  ? "bg-navy text-ivory shadow-xs"
                  : "text-muted hover:text-ink"
              )}
              title="Toggle Center Line of Maximum Eclipse"
            >
              <span className="h-0.5 w-3 bg-gold" />
              <span>Center Line</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLimitLines((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                showLimitLines
                  ? "bg-navy text-ivory shadow-xs"
                  : "text-muted hover:text-ink"
              )}
              title="Toggle Northern & Southern Limits"
            >
              <span className="h-0.5 w-3 border-t border-dashed border-gold" />
              <span className="hidden sm:inline">Limits</span>
            </button>
          </div>

          {/* Reset Zoom Button */}
          <button
            type="button"
            onClick={resetView}
            className="flex items-center gap-1.5 rounded-full border border-line bg-paper/95 px-3 py-1.5 text-xs font-semibold text-navy shadow-md backdrop-blur-sm hover:bg-sand transition-colors"
            title="Reset map view to whole of Tunisia"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset Tunisia</span>
          </button>
        </div>

        {/* Custom Zoom Controls (Top Right) */}
        <div className="absolute right-4 top-4 z-[400] flex flex-col gap-1 rounded-xl border border-line bg-paper/95 p-1 shadow-md backdrop-blur-sm">
          <button
            type="button"
            onClick={zoomIn}
            className="rounded-lg p-1.5 text-navy hover:bg-sand transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={zoomOut}
            className="rounded-lg p-1.5 text-navy hover:bg-sand transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
        </div>

        {/* Legend Overlay (Bottom Left) */}
        <div className="pointer-events-none absolute bottom-4 left-4 z-[400] hidden rounded-xl border border-line/80 bg-paper/95 p-3 text-xs shadow-md backdrop-blur-sm sm:block">
          <p className="font-semibold text-ink flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-gold-600" />
            <span>NASA 2027 Eclipse Path Guide</span>
          </p>
          <div className="mt-2 space-y-1.5 text-muted">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-5 rounded-full bg-[#0d1826]" />
              <span>Center Line (Longest Totality Duration)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-5 rounded-xs border border-gold-600 border-dashed bg-gold/30" />
              <span>Totality Path (100% Umbra Coverage)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gold ring-2 ring-gold/40" />
              <span>Totality Destination (Up to 4m 37s)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-muted" />
              <span>Partial Eclipse Destination (&lt;100%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar List and Active Destination Inspection */}
      {showSidebar ? (
        <div className="flex w-full flex-col border-t border-line bg-ivory lg:w-96 lg:border-l lg:border-t-0">
          {/* Header & Filter Search Toolbar */}
          <div className="border-b border-line p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">
                  Viewing Destinations
                </h3>
                <p className="text-xs text-muted">
                  Click a city to inspect circumstances & fly map
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-gold-600 bg-gold/15 px-2.5 py-1 rounded-full">
                {filteredDestinations.length} places
              </span>
            </div>

            {/* Quick Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search city, oasis, or region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-line bg-paper pl-9 pr-3 py-1.5 text-xs text-ink placeholder:text-muted focus:border-navy focus:outline-none"
              />
            </div>

            {/* Totality & Category Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: "all", label: "All" },
                { id: "total", label: "Totality" },
                { id: "partial", label: "Partial" },
                { id: "desert", label: "Desert" },
                { id: "coast", label: "Coast" },
                { id: "cultural", label: "Cultural" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id as FilterCategory)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
                    activeFilter === tab.id
                      ? "bg-navy text-ivory shadow-xs"
                      : "bg-paper text-muted border border-line hover:text-navy hover:bg-sand"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Destination Card Banner */}
          {selectedDestination && asset ? (
            <div className="border-b border-line bg-paper p-4">
              <div className="relative h-32 w-full overflow-hidden rounded-xl bg-sand">
                <Image
                  src={asset.url}
                  alt={asset.alt}
                  fill
                  sizes="360px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                  <div>
                    <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-gold">
                      {selectedDestination.region}
                    </span>
                    <h4 className="font-display text-base font-semibold text-ivory">
                      {selectedDestination.name}
                    </h4>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-semibold shadow-xs",
                      selectedDestination.isTotal
                        ? "bg-gold text-navy"
                        : "bg-paper/90 text-navy"
                    )}
                  >
                    {selectedDestination.formattedDuration}
                  </span>
                </div>
              </div>

              {/* Quick Circumstances */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-sand/50 p-2">
                  <p className="text-[0.65rem] text-muted uppercase">Max Time</p>
                  <p className="mt-0.5 font-mono font-medium text-ink">
                    {selectedDestination.circumstances.localTimes.maximum ?? "—"}
                  </p>
                </div>
                <div className="rounded-lg bg-sand/50 p-2">
                  <p className="text-[0.65rem] text-muted uppercase">Sun Altitude</p>
                  <p className="mt-0.5 font-mono font-medium text-ink">
                    {selectedDestination.circumstances.sunAltitude.toFixed(0)}°
                  </p>
                </div>
                <div className="rounded-lg bg-sand/50 p-2">
                  <p className="text-[0.65rem] text-muted uppercase">Magnitude</p>
                  <p className="mt-0.5 font-mono font-medium text-ink">
                    {selectedDestination.circumstances.magnitude.toFixed(3)}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Link
                  href={`/destinations/${selectedDestination.slug}`}
                  className="flex-1 rounded-lg bg-navy py-2 text-center text-xs font-semibold text-ivory hover:bg-navy-800 transition-colors"
                >
                  View Details & Guide
                </Link>
                <Link
                  href={`/plan?addDest=${selectedDestination.slug}`}
                  className="flex items-center justify-center gap-1 rounded-lg border border-line bg-paper px-3 py-2 text-xs font-semibold text-navy hover:bg-sand transition-colors"
                  title="Add to Itinerary"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Plan</span>
                </Link>
              </div>
            </div>
          ) : null}

          {/* Scrollable Destination List */}
          <div className="max-h-72 flex-1 overflow-y-auto divide-y divide-line lg:max-h-none">
            {filteredDestinations.map((dest) => {
              const isSelected = dest.slug === selectedSlug;
              return (
                <button
                  key={dest.slug}
                  type="button"
                  onClick={() => selectDestination(dest)}
                  className={cn(
                    "w-full text-left p-3.5 flex items-center justify-between transition-colors",
                    isSelected ? "bg-sand/60" : "hover:bg-sand/30"
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                        dest.isTotal ? "bg-gold" : "bg-muted"
                      )}
                    />
                    <div>
                      <p className="text-sm font-medium text-ink">{dest.name}</p>
                      <p className="text-xs text-muted">{dest.region}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={cn(
                        "inline-block rounded-md px-2 py-0.5 font-mono text-xs",
                        dest.isTotal
                          ? "bg-gold/15 text-gold-600 font-semibold"
                          : "bg-black/5 text-muted"
                      )}
                    >
                      {dest.formattedDuration}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
