"use client";

import { Drawer } from "vaul";
import type { Venue } from "@/lib/types";
import VenueDetailBody from "./VenueDetailBody";

interface VenueDrawerProps {
  venue: Venue | null;
  onClose: () => void;
}

export default function VenueDrawer({ venue, onClose }: VenueDrawerProps) {
  return (
    <Drawer.Root
      open={venue !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      shouldScaleBackground={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm" />
        <Drawer.Content
          className="lg-glass-floating fixed inset-x-0 bottom-0 z-50 mt-24 flex h-[92vh] flex-col outline-none"
          style={{
            borderTopLeftRadius: "var(--lg-r-xxl)",
            borderTopRightRadius: "var(--lg-r-xxl)",
          }}
        >
          {/* Hidden but required for a11y */}
          <Drawer.Title className="sr-only">{venue?.name ?? "Sted"}</Drawer.Title>
          <Drawer.Description className="sr-only">
            {venue?.description ?? ""}
          </Drawer.Description>

          {/* Drag handle */}
          <div className="mx-auto mt-2.5 h-1.5 w-12 shrink-0 rounded-full bg-white/[0.14]" aria-hidden />

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-8 pt-4 sm:px-6">
            {venue && (
              <div className="mx-auto max-w-2xl">
                <VenueDetailBody venue={venue} context="drawer" />
              </div>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
