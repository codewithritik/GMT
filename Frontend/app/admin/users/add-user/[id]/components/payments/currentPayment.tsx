"use client";

import { Crown } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/SharedComponents";

import { Progress } from "radix-ui";

interface MembershipCardProps {
  planName?: string;

  pricePerMonth?: number;

  startDate?: string;

  endDate?: string;

  daysRemaining?: number;

  totalDays?: number;

  isActive?: boolean;

  isPending?: boolean;

  paying?: boolean;

  planDurationDaysState?: number | null;

  planOptions: { value: string; label: string }[];

  onRenew?: () => void;

  onUpgrade?: () => void;

  onPayNow?: () => void;
}

export default function CurrentMembershipCard({
  planName,

  pricePerMonth,

  startDate,

  endDate,

  daysRemaining,

  totalDays,

  isActive,

  isPending,

  paying,

  onRenew,

  onUpgrade,

  onPayNow,

  planDurationDaysState,
}: MembershipCardProps) {
  const progressPercent = Math.round(
    ((daysRemaining ?? 0) / (totalDays ?? 1)) * 100,
  );

  const months = Number(((pricePerMonth ?? 0) / (planDurationDaysState ?? 1)).toFixed(0));
  return (
    <Card className="w-full max-w-sm border border-[#2a3044] text-white rounded-2xl shadow-xl">
      <div className="p-0 space-y-5">
        {/* Header */}

        <div className="flex items-center gap-2">
          <div className="text-purple-400">
            <Crown size={18} strokeWidth={1.8} />
          </div>

          <span className="text-sm font-semibold text-white/90 tracking-wide">
            {isPending ? "Assigned Plan" : "Current Membership"}
          </span>
        </div>

        {/* Plan name + status */}

        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-white/80">
            {planName}
          </span>

          {isPending ? (
            <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium">
              Pending Payment
            </Badge>
          ) : isActive ? (
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium">
              Active
            </Badge>
          ) : null}
        </div>

        {/* Price */}

        <div className="-mt-2">
          <span className="text-3xl font-bold text-white">
            ₹{pricePerMonth?.toLocaleString("en-IN") ?? 0}
          </span>

          <span className="text-sm text-white/50 ml-1">
            / {months} per month
          </span>
        </div>

        {isPending ? (
          <p className="text-sm text-white/50">
            Payment has not been completed yet.
            Collect payment to activate this
            membership.
          </p>
        ) : (
          <>
            {/* Divider */}

            <div className="border-t border-white/10" />

            {/* Dates */}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-white/40 mb-1">Start Date</p>

                <p className="text-sm font-medium text-white/90">{startDate}</p>
              </div>

              <div>
                <p className="text-xs text-white/40 mb-1">End Date</p>

                <p className="text-sm font-medium text-white/90">{endDate}</p>
              </div>
            </div>

            {/* Days remaining */}

            <div className="bg-white/5 rounded-xl px-4 py-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-purple-400 font-bold text-sm">
                  {daysRemaining}
                </span>

                <span className="text-sm text-white/60">Days Remaining</span>
              </div>

              <Progress.Root
                value={progressPercent}
                className="h-1.5 bg-white/10 [&>div]:bg-purple-500"
              />
            </div>
          </>
        )}

        {/* Actions */}

        {isPending ? (
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Button
              onClick={onPayNow}
              disabled={paying}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl h-10 text-sm transition-colors">
              {paying ? "Processing..." : "Pay Now"}
            </Button>

            <Button
              onClick={onUpgrade}
              variant="outline"
              className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white bg-transparent font-semibold rounded-xl h-10 text-sm transition-colors">
              Change Plan
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Button
              onClick={onRenew}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl h-10 text-sm transition-colors">
              Renew Membership
            </Button>

            <Button
              onClick={onUpgrade}
              variant="outline"
              className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white bg-transparent font-semibold rounded-xl h-10 text-sm transition-colors">
              Upgrade Plan
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
