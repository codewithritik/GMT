"use client";

import dayjs from "dayjs";

import { History } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Card } from "@/components/ui/SharedComponents";

export interface PaymentRecord {
    id: string;

    memberId?: string;

    amount: string | number;

    paymentMethod: string;

    paymentDate: string;

    status: string;

    receiptNumber: string | null;

    planName: string | null;
}

function formatMethod(method: string) {
    return method.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusBadgeClass(status: string) {
    switch (status) {
        case "completed":
            return "bg-green-500/20 text-green-400 border-green-500/30";
        case "pending":
            return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
        case "failed":
            return "bg-red-500/20 text-red-400 border-red-500/30";
        default:
            return "bg-white/10 text-white/60 border-white/20";
    }
}

export default function PaymentHistoryCard({
    payments,
}: {
    payments: PaymentRecord[];
}) {
    return (
        <Card className="w-full max-w-sm border border-[#2a3044] text-white rounded-2xl shadow-xl">
            <div className="p-0 space-y-4">
                <div className="flex items-center gap-2">
                    <div className="text-purple-400">
                        <History size={18} strokeWidth={1.8} />
                    </div>

                    <span className="text-sm font-semibold text-white/90 tracking-wide">
                        Payment History
                    </span>
                </div>

                {payments.length === 0 ? (
                    <p className="text-sm text-white/50 py-2">
                        No previous payments recorded.
                    </p>
                ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                        {payments.map((payment) => (
                            <div
                                key={payment.id}
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-white/90 truncate">
                                            {payment.planName ?? "Membership"}
                                        </p>

                                        <p className="text-xs text-white/40 mt-0.5">
                                            {dayjs(payment.paymentDate).format(
                                                "DD MMM YYYY",
                                            )}
                                        </p>
                                    </div>

                                    <Badge
                                        className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium border ${statusBadgeClass(payment.status)}`}>
                                        {payment.status.replace(/_/g, " ")}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-lg font-bold text-white">
                                        ₹
                                        {Number(
                                            payment.amount ?? 0,
                                        ).toLocaleString("en-IN")}
                                    </span>

                                    <span className="text-white/50">
                                        {formatMethod(payment.paymentMethod)}
                                    </span>
                                </div>

                                {payment.receiptNumber ? (
                                    <p className="text-[11px] text-white/35">
                                        Receipt: {payment.receiptNumber}
                                    </p>
                                ) : null}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}
