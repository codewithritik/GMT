"use client";

import { useState } from "react";
import OverviewTab from "./tabs/overview";
import HealthTab from "./tabs/health";
import MemberTabs from "./Membertabs";
import { MemberProfilePageProps } from "@/types/member";
import EmergencyTab from "./tabs/emergency";
import DocumentsTab from "./tabs/documentsTab";
import { Card } from "@/components/ui/SharedComponents";

export default function MemberProfileTabs({
  data,
  memberId,
}: {
  data: MemberProfilePageProps;
  memberId: string;
}) {
  const [activeTab, setActiveTab] = useState("Overview");

  const renderTab = () => {
    switch (activeTab) {
      case "Overview":
        return <OverviewTab data={data} />;
      case "Health":
        return <HealthTab data={data} />;
      case "Emergency Contact":
        return <EmergencyTab data={data} />;
      // case "Progress Tracking": return <ProgressTrackingTab />;
      // case "Notes": return <NotesTab />;
      case "Documents":
        return <DocumentsTab memberId={memberId} />;
      default:
        return (
          <p className="text-gray-500 text-sm py-4">
            {activeTab} tab — coming soon.
          </p>
        );
    }
  };

  return (
    <Card className="rounded-xl border border-[#2a3044] overflow-hidden">
      {/* Tab bar */}
      <MemberTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      <div className="p-6">{renderTab()}</div>
    </Card>
  );
}
