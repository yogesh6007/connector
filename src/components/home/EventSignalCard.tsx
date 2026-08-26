import React from "react";
import { CommunityEvent } from "@/types";
import { Calendar, Users, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EventSignalCardProps {
  event: CommunityEvent;
}

export function EventSignalCard({ event }: EventSignalCardProps) {
  return (
    <div className="rounded-xl bg-[#0E121A] border border-[#1E2532] p-4 flex flex-col justify-between hover:border-[#2B3547] transition-all space-y-3">
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            {event.type}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {event.attendeeCount} Peers RSVP'd
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-100">{event.title}</h3>

        <div className="space-y-1 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{event.dateTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{event.location}</span>
          </div>
        </div>

        {/* Known Attendees Avatars */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex -space-x-1.5 overflow-hidden">
            {event.knownAttendees.map((att, i) => (
              <img
                key={i}
                src={att.avatar}
                alt={att.name}
                className="inline-block h-5 w-5 rounded-full ring-2 ring-[#0E121A] object-cover"
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {event.knownAttendees.map((a) => a.name.split(" ")[0]).join(", ")} attending
          </span>
        </div>

        {/* Relevance Reason */}
        <p className="text-xs text-slate-300 bg-[#141924] p-2.5 rounded-lg border border-[#1E2636] leading-relaxed">
          {event.relevanceReason}
        </p>
      </div>

      <div className="pt-2 border-t border-[#1A212E]">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => alert(`RSVP confirmed for "${event.title}"! Calendar invite dispatched.`)}
        >
          1-Click RSVP & Sync
        </Button>
      </div>
    </div>
  );
}
