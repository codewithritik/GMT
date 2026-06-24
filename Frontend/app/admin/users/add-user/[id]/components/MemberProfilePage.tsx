"use client";

import { useState } from "react";
import OverviewTab from "./tabs/overview";
import MemberTabs from "./Membertabs";
import { MemberProfilePageProps } from "@/types/member";

export default function MemberProfileTabs({ data }: { data: MemberProfilePageProps }) {
  const [activeTab, setActiveTab] = useState("Overview");

  const renderTab = () => {
    switch (activeTab) {
      case "Overview":
        return <OverviewTab data={data} />;
      // Add other tab components here as you build them:
      // case "Health": return <HealthTab />;
      // case "Emergency Contact": return <EmergencyContactTab />;
      // case "Progress Tracking": return <ProgressTrackingTab />;
      // case "Notes": return <NotesTab />;
      // case "Documents": return <DocumentsTab />;
      default:
        return (
          <p className="text-gray-500 text-sm py-4">
            {activeTab} tab — coming soon.
          </p>
        );
    }
  };

  return (
    <div className="rounded-xl border border-[#2a3044] bg-[#13161f] overflow-hidden">
      {/* Tab bar */}
      <MemberTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      <div className="p-6">{renderTab()}</div>
    </div>
  );
}