'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import {
    PageHeader,
    Card,
    LoadingButton
} from '@/components/ui/SharedComponents';
import { useToast } from '@/components/ui/Toast';
import { getErrorMessage, opsAPI } from '@/lib/api';
import { MemberDetailsSection } from '../componets/MembersDeatils';
import { STATUS_OPTIONS } from '../componets/contsValues';
import { BasicInfoSection } from '../componets/BasicDeatils';
import { Errors, FormData, Reg, schema } from '../componets/schema';
import { AccountSection } from '../componets/AccountSection';
import { FieldGrid, Half, SectionDivider } from '../componets/userFromDeatisl';
import { Input } from '@/components/ui/SharedComponents';
import { ROLE_OPTIONS } from '@/lib/consts';


interface TrainerDetailsSectionProps {
    register: (name: any) => Reg;
    errors: Errors;
}

function TrainerDetailsSection({ register, errors }: TrainerDetailsSectionProps) {
    return (
        <>
            <SectionDivider title="Trainer Details" />
            <FieldGrid>
                <Input
                    label="Date of Joining"
                    type="date"
                    placeholder="e.g. 2026-01-01"
                    {...register('dateOfJoining')}
                    error={errors.dateOfJoining?.message}
                />
                <Input
                    label="Designation"
                    placeholder="e.g. Personal Trainer"
                    {...register('designation')}
                    error={errors.designation?.message}
                />



                <Half>
                    <Input
                        label="Specialization"
                        placeholder="e.g. Strength & Conditioning"
                        {...register('specialization')}
                        error={errors.specialization?.message}
                    />
                </Half>
            </FieldGrid>
        </>
    );
}



// ─── Sub-Components ───────────────────────────────────────────────────────────

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminUsersNewPage() {
    const router = useRouter();
    const toast = useToast();
    const [planOptions, setPlanOptions] = useState<{ value: string; label: string }[]>([]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            role: 'trainer',
            status: 'active',
            name: '',
            email: '',
            phone: '',
            password: '',
            dateOfBirth: '',
            designation: '',
            specialization: '',
            address: '',
            emergencyName: '',
            emergencyPhone: '',
            emergencyRelation: '',
            bloodGroup: '',
            dateOfJoining: '',
        },
    });

    const role = watch('role');

    useEffect(() => {
        opsAPI.plans({ includeInactive: true })
            .then((rows) => {
                const options = (rows ?? [])
                    .filter((plan: any) => plan?.id && plan?.name)
                    .map((plan: any) => ({
                        value: String(plan.id),
                        label: plan.isActive === false ? `${plan.name} (inactive)` : plan.name,
                    }));
                setPlanOptions(options);
            })
            .catch((err) => toast.error('Failed to load membership plans', getErrorMessage(err)));
    }, [toast]);

    const onSubmit = async (data: FormData) => {
        try {
            const base = {
                fullName: data.name.trim(),
                email: data.email.trim(),
                role: data.role,
                status: data.status,
                password: data.password,
                phone: data.phone?.trim() || undefined,
            };


            await opsAPI.createUser({
                ...base,
                role: 'trainer'
            });


            toast.success('User Added', `${data.name} has been added successfully`);
            router.push('/admin/users');
        } catch (err) {
            toast.error('Error', getErrorMessage(err));
        }
    };

    // Cast errors for role-specific fields
    const e = errors as Record<string, { message?: string }>;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Add Trainer"
                subtitle="Create a new trainer for GymSphere"
                action={
                    <LoadingButton
                        variant="secondary"
                        icon={ArrowLeft}
                        onClick={() => router.push('/admin/users')}
                    >
                        Back to Users
                    </LoadingButton>
                }
            />

            <Card className="w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">

                    {/* Account section is shown first so Role selector is at top */}
                    <AccountSection
                        register={register as any}
                        errors={e}
                        roleErrors={e}
                    />

                    {/* Basic info — shared across roles */}
                    <BasicInfoSection register={register as any} errors={e} />


                    <MemberDetailsSection
                        register={register as any}
                        errors={e}
                        planOptions={planOptions}
                        role={ROLE_OPTIONS.trainer}
                    />

                    <TrainerDetailsSection register={register as any} errors={e} />

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-6">
                        <LoadingButton
                            variant="secondary"
                            type="button"
                            onClick={() => router.push('/admin/users')}
                        >
                            Cancel
                        </LoadingButton>
                        <LoadingButton loading={isSubmitting} type="submit" icon={Save}>
                            Create Trainer
                        </LoadingButton>
                    </div>

                </form>
            </Card>
        </div>
    );
}