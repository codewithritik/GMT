"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Edit2, FileText, Heart, Users, ImageIcon } from "lucide-react";
import {
  PageHeader,
  Card,
  LoadingButton,
} from "@/components/ui/SharedComponents";
import { useToast } from "@/components/ui/Toast";
import { getErrorMessage, opsAPI } from "@/lib/api";
import MemberProfileCard from "./components/MemberProfileCard ";
import MemberProfileTabs from "./components/MemberProfilePage";
import { MemberProfilePageProps } from "@/types/member";
import Payments from "./components/payments/Payments";

const tabs = [
  "Overview",
  "Health",
  "Emergency Contact",
  "Progress Tracking",
  "Notes",
] as const;

export default function MemberProfilePage() {
  const params = useParams() as { id?: string };
  const memberId = params?.id;
  const router = useRouter();
  const toast = useToast();

  const [data, setData] = useState<MemberProfilePageProps>();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Overview");

  useEffect(() => {
    if (!memberId) return;
    setLoading(true);
    // fetch member — fallback to listing users if single endpoint not available
    opsAPI
      .membersById(memberId)
      .then((m) => {
        setData(m);
      })
      .catch((err) => {
        toast.error("Failed to load member", getErrorMessage(err));
      })
      .finally(() => setLoading(false));
  }, [memberId, toast]);

  const onEdit = () => {
    if (!memberId) return;
    router.push(`/admin/users/${memberId}/edit`);
  };

  const refreshMember = () => {
    if (!memberId) return;
    opsAPI
      .membersById(memberId)
      .then((m) => setData(m))
      .catch((err) =>
        toast.error("Failed to refresh member", getErrorMessage(err)),
      );
  };

  if (!data) return <div>Loading...</div>;
  return (
    <div className="flex gap-8 w-full  max-sm:flex-col ">
      <div className="w-[75%]  max-sm:w-full flex flex-col gap-8">
        {data.user?.id && <MemberProfileCard data={data} />}
        {/* <MemberProfilePage /> */}
        {data?.user?.id && (
          <MemberProfileTabs data={data} memberId={memberId ?? ""} />
        )}
      </div>
      <div className="w-[25%]  max-sm:w-full">
        {data?.user?.id && (
          <Payments
            memberId={data.user.id}
            memberPlanId={data.member.subscriptionPlanId ?? ""}
            onPlanChanged={refreshMember}
          />
        )}
      </div>
    </div>
  );
}
