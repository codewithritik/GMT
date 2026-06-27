"use client";

import { cn } from "@/lib/utils";
import {
  Target,
  Heart,
  UserRound,
  BarChart2,
  StickyNote,
  FileText,
} from "lucide-react";

const tabs = [
  { label: "Overview", icon: Target },
  { label: "Health", icon: Heart },
  { label: "Emergency Contact", icon: UserRound },
  { label: "Progress Tracking", icon: BarChart2 },
  { label: "Notes", icon: StickyNote },
  { label: "Documents", icon: FileText },
];

interface MemberTabsProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export default function MemberTabs({ activeTab, onChange }: MemberTabsProps) {
  return (
    <div className="border-b border-[#2a3044] bg-[#10131c]">
      <nav className="flex items-center gap-1 px-2">
        {tabs.map(({ label, icon: Icon }) => {
          const isActive = activeTab === label;
          return (
            <button
              key={label}
              onClick={() => onChange(label)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors whitespace-nowrap",
                isActive ? "text-white" : "text-gray-500 hover:text-gray-300",
              )}>
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-red-500" : "text-gray-500",
                )}
              />
              {label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-500 rounded-t-full" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
