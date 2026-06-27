"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import dayjs from "dayjs";

import { Loader2 } from "lucide-react";

import { useToast } from "@/components/ui/Toast";

import { LoadingButton, Modal, Select } from "@/components/ui/SharedComponents";

import { getErrorMessage, opsAPI } from "@/lib/api";

import CurrentMembershipCard from "./currentPayment";

import PaymentHistoryCard, { type PaymentRecord } from "./paymentHistory";

interface MemberSubscription {
    id: string;

    memberId: string;

    planId: string;

    planName: string | null;

    status: string;

    startDate: string;

    endDate: string;

    pricePaid: string | number | null;
}

interface Plan {
    id: string;

    name: string;

    price: number | string;

    durationDays?: number;

    durationValue?: number;
}

function planDurationDays(plan: Plan | undefined): number | null {
    if (!plan) return null;

    const days = Number(plan.durationDays ?? plan.durationValue ?? 0);

    return days > 0 ? days : null;
}

export default function Payments({
    memberId,

    memberPlanId,

    onPlanChanged,
}: {
    memberId: string;

    memberPlanId: string;

    onPlanChanged?: () => void;
}) {
    const toast = useToast();

    const [loading, setLoading] = useState(true);

    const [paying, setPaying] = useState(false);

    const [upgrading, setUpgrading] = useState(false);

    const [upgradeOpen, setUpgradeOpen] = useState(false);

    const [upgradePlanId, setUpgradePlanId] = useState("");

    const [subscription, setSubscription] = useState<MemberSubscription | null>(
        null,
    );

    const [assignedPlanId, setAssignedPlanId] = useState<string | null>(null);

    const [planPrice, setPlanPrice] = useState<number | null>(null);

    const [planDurationDaysState, setPlanDurationDaysState] = useState<
        number | null
    >(null);

    const [planName, setPlanName] = useState<string | null>(null);

    const [planOptions, setPlanOptions] = useState<
        { value: string; label: string }[]
    >([]);

    const [plans, setPlans] = useState<Plan[]>([]);

    const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);

    const loadData = useCallback(() => {
        if (!memberId) return Promise.resolve();

        setLoading(true);

        return Promise.all([
            opsAPI.allSubscriptions(),

            opsAPI.plans({ includeInactive: true }),

            opsAPI.allPayments(),
        ])

            .then(([subs, plansList, paymentsList]) => {
                const memberSubs = (subs ?? []).filter(
                    (s: MemberSubscription) => s.memberId === memberId,
                ) as MemberSubscription[];

                const active =
                    memberSubs.find((s) =>
                        ["active", "grace_period"].includes(s.status),
                    ) ??
                    memberSubs.find((s) => s.status === "pending_payment") ??
                    memberSubs[0] ??
                    null;

                setSubscription(active);

                setPlans(plansList ?? []);

                const subscriptionPlanId = memberPlanId ?? active?.planId ?? null;

                setAssignedPlanId(subscriptionPlanId);

                const options = (plansList ?? []).map((p: Plan) => ({
                    value: p.id,

                    label: `${p.name} — ₹${Number(p.price ?? 0).toLocaleString("en-IN")}`,
                }));

                setPlanOptions(options);

                if (subscriptionPlanId) {
                    const plan = (plansList ?? []).find(
                        (p: Plan) => p.id === subscriptionPlanId,
                    );

                    setPlanName(plan?.name ?? active?.planName ?? null);

                    setPlanPrice(plan ? Number(plan.price ?? 0) : null);

                    setPlanDurationDaysState(planDurationDays(plan));
                } else {
                    setPlanName(null);

                    setPlanPrice(null);

                    setPlanDurationDaysState(null);
                }

                const memberPayments = ((paymentsList ?? []) as PaymentRecord[])
                    .filter((p) => p.memberId === memberId)
                    .sort(
                        (a, b) =>
                            dayjs(b.paymentDate).valueOf() -
                            dayjs(a.paymentDate).valueOf(),
                    );

                setPaymentHistory(memberPayments);
            })

            .catch(() => {
                setSubscription(null);

                setAssignedPlanId(null);

                setPlanName(null);

                setPlanPrice(null);

                setPlanDurationDaysState(null);

                setPaymentHistory([]);
            })

            .finally(() => setLoading(false));
    }, [memberId, memberPlanId]);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    const currentPlanId =
        assignedPlanId ?? subscription?.planId ?? memberPlanId ?? "";

    const isPendingMode =
        subscription?.status === "pending_payment" ||
        (!subscription && Boolean(assignedPlanId));

    const selectablePlanOptions = useMemo(
        () => planOptions.filter((o) => o.value !== currentPlanId),

        [planOptions, currentPlanId],
    );

    const openPlanModal = () => {
        setUpgradePlanId("");

        setUpgradeOpen(true);
    };

    const applyPlanLocally = (planId: string) => {
        const plan = plans.find((p) => p.id === planId);

        setAssignedPlanId(planId);

        setPlanName(plan?.name ?? null);

        setPlanPrice(plan ? Number(plan.price ?? 0) : null);

        setPlanDurationDaysState(planDurationDays(plan));
    };

    const handleUpgrade = async () => {
        if (!upgradePlanId) {
            toast.error("Validation error", "Please select a plan.");

            return;
        }

        if (upgradePlanId === currentPlanId) {
            toast.error("Validation error", "Please choose a different plan.");

            return;
        }

        setUpgrading(true);

        try {
            await opsAPI.updateMemberSubscriptionPlan(memberId, upgradePlanId);

            applyPlanLocally(upgradePlanId);

            setUpgradeOpen(false);

            toast.success(
                "Plan updated",
                "Member subscription plan has been changed.",
            );

            onPlanChanged?.();

            await loadData();
        } catch (err) {
            toast.error("Update failed", getErrorMessage(err));
        } finally {
            setUpgrading(false);
        }
    };

    const cardProps = useMemo(() => {
        const isPendingSubscription = subscription?.status === "pending_payment";

        const isPendingWithoutSub =
            !subscription && Boolean(assignedPlanId) && Boolean(planName);

        if (!subscription && !isPendingWithoutSub) return null;

        if (isPendingSubscription || isPendingWithoutSub) {
            const planId = subscription?.planId ?? assignedPlanId;

            if (!planId) return null;

            return {
                mode: "pending" as const,

                planId,

                planName: subscription?.planName ?? planName ?? "—",

                pricePerMonth: planPrice ?? Number(subscription?.pricePaid ?? 0),

                planDurationDaysState,
            };
        }

        const start = dayjs(subscription!.startDate);

        const end = dayjs(subscription!.endDate);

        const totalDays =
            planDurationDaysState && planDurationDaysState > 0
                ? planDurationDaysState
                : Math.max(1, end.diff(start, "day"));

        const daysRemaining = Math.max(0, end.diff(dayjs(), "day"));

        const isActive = ["active", "grace_period"].includes(subscription!.status);

        return {
            mode: "active" as const,

            planName: subscription!.planName ?? planName ?? "—",

            pricePerMonth: planPrice ?? Number(subscription!.pricePaid ?? 0),

            startDate: start.format("DD MMM YYYY"),

            endDate: end.format("DD MMM YYYY"),

            daysRemaining,

            totalDays,

            isActive,

            planDurationDaysState,
        };
    }, [
        subscription,
        assignedPlanId,
        planName,
        planPrice,
        planDurationDaysState,
    ]);

    const handlePayNow = async (planId: string) => {
        setPaying(true);

        try {
            await opsAPI.simulatePayment({
                memberId,

                planId,

                paymentMethod: "cash",
            });

            toast.success("Payment recorded", "Membership is now active.");

            await loadData();

            onPlanChanged?.();
        } catch (err) {
            toast.error("Payment failed", getErrorMessage(err));
        } finally {
            setPaying(false);
        }
    };

    const planModal = (
        <Modal
            isOpen={upgradeOpen}
            onClose={() => setUpgradeOpen(false)}
            title={isPendingMode ? "Change Plan" : "Upgrade Plan"}
            description="Select a new plan for this member">
            <div className="space-y-4">
                <Select
                    label="Select New Plan"
                    options={selectablePlanOptions}
                    value={upgradePlanId}
                    onChange={(e) => setUpgradePlanId(e.target.value)}
                    placeholder="Choose a plan"
                />

                <p className="text-xs text-zinc-500">
                    This updates the member&apos;s assigned plan only. Payment and
                    subscription dates are unchanged.
                </p>

                <div className="flex justify-end gap-3 pt-2">
                    <LoadingButton
                        variant="secondary"
                        onClick={() => setUpgradeOpen(false)}
                        disabled={upgrading}>
                        Cancel
                    </LoadingButton>

                    <LoadingButton
                        onClick={() => void handleUpgrade()}
                        loading={upgrading}>
                        {isPendingMode ? "Change Plan" : "Upgrade Plan"}
                    </LoadingButton>
                </div>
            </div>
        </Modal>
    );

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-white/50" size={24} />
            </div>
        );
    }

    if (!cardProps) {
        return (
            <div className="flex flex-col gap-6 w-full">
                <p className="text-sm text-white/50 py-4 text-center">
                    No membership found.
                </p>

                <PaymentHistoryCard payments={paymentHistory} />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            {cardProps.mode === "pending" ? <CurrentMembershipCard
                planName={cardProps.planName}
                pricePerMonth={cardProps.pricePerMonth}
                isPending
                paying={paying}
                onPayNow={() => void handlePayNow(cardProps.planId)}
                onUpgrade={openPlanModal}
                planDurationDaysState={cardProps.planDurationDaysState}
                planOptions={planOptions}
            /> : <CurrentMembershipCard
                planName={cardProps.planName}
                pricePerMonth={cardProps.pricePerMonth}
                startDate={cardProps.startDate}
                endDate={cardProps.endDate}
                daysRemaining={cardProps.daysRemaining}
                totalDays={cardProps.totalDays}
                isActive={cardProps.isActive}
                planDurationDaysState={cardProps.planDurationDaysState}
                onRenew={() => console.log("Renew")}
                onUpgrade={openPlanModal}
                planOptions={planOptions}
            />}

            <PaymentHistoryCard payments={paymentHistory} />

            {planModal}
        </div>
    );
}
