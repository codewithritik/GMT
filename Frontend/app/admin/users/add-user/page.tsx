'use client'

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
import { ROLE_OPTIONS_OBJ, STATUS_OPTIONS } from '../componets/contsValues';
import { BasicInfoSection } from '../componets/BasicDeatils';
import { FormData, schema } from '../componets/schema';
import { AccountSection } from '../componets/AccountSection';
import { DATE_FORMAT, ROLE_OPTIONS } from '@/lib/consts';
import { AvatarPicker } from '../componets/AvatarPicker';
import dayjs from 'dayjs';


// ─── Sub-Components ───────────────────────────────────────────────────────────

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminUsersNewPage() {
    const router = useRouter();
    const toast = useToast();
    const [planOptions, setPlanOptions] = useState<{ value: string; label: string }[]>([]);
    const [trainerOptions, setTrainerOptions] = useState<{ value: string; label: string }[]>([]);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarError, setAvatarError] = useState<string | undefined>();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            role: 'member',
            status: 'active',
            name: '',
            email: '',
            phone: '',
            dateOfBirth: '',
            gender: 'male',
            subscriptionPlanId: '',
            dateOfJoining: dayjs().format(DATE_FORMAT),
            assignedTrainerId: ''
        },
    });

    const role = watch('role');

    useEffect(() => {
        Promise.all([
            opsAPI.plans({ includeInactive: true }),
            opsAPI.trainers(),
        ])
            .then(([plans, trainers]) => {
                const options = (plans ?? [])
                    .filter((plan: any) => plan?.id && plan?.name && plan?.isActive)
                    .map((plan: any) => {
                        let price = Number(plan.price).toFixed(0);
                        return {
                            value: String(plan.id),
                            label: `₹${price} / ${plan.name} `,
                        }
                    });
                setPlanOptions(options);
                setTrainerOptions(
                    (trainers ?? [])
                        .filter((t: { id?: string; fullName?: string }) => t?.id && t?.fullName)
                        .map((t: { id: string; fullName: string }) => ({
                            value: t.id,
                            label: t.fullName,
                        })),
                );
            })
            .catch((err) => toast.error('Failed to load form options', getErrorMessage(err)));
    }, [toast]);

    const onSubmit = async (data: FormData) => {
        try {
            console.log('data', data);
            if (data.role !== 'member') {
                toast.error('Invalid role', 'This page only supports creating members.');
                return;
            }

            if (avatarFile && !['image/jpeg', 'image/png', 'image/webp'].includes(avatarFile.type)) {
                setAvatarError('Only JPEG, PNG or WebP images are allowed');
                return;
            }
            setAvatarError(undefined);

            const created = await opsAPI.createUser({
                ...data,
                role: 'member',
                fullName: data.name.trim(),
                email: data.email || "",
                phone: data.phone || undefined,
                dob: data.dateOfBirth || undefined,
                gender: data.gender,
                joinDate: data.dateOfJoining || undefined,
                assignedTrainerId: data.assignedTrainerId || undefined,
                subscriptionPlanId: data.subscriptionPlanId || undefined
              
            });
            
            console.log('this is created', created);

            if (avatarFile && created?.id) {
                await opsAPI.uploadUserAvatar(created.id, avatarFile);
            }

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
                title="Add User"
                subtitle="Create a new user for GymSphere"
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
            <form onSubmit={handleSubmit(onSubmit, (invalid) => console.log('validation failed', invalid))} className="space-y-2">

                    {/* Account section is shown first so Role selector is at top */}
                    {/* <AccountSection
                        register={register as any}
                        errors={e}
                        roleErrors={e}
                    /> */}
                    <div className='flex gap-8'>
                        <div className="pt-2">
                            <AvatarPicker
                                value={avatarFile}
                                onChange={(file) => {
                                    setAvatarFile(file);
                                    setAvatarError(undefined);
                                }}
                                onInvalidType={() => setAvatarError('Only JPEG, PNG or WebP images are allowed')}
                                error={avatarError}
                            />
                        </div>

                        {/* Basic info — shared across roles */}
                        <BasicInfoSection register={register as any} errors={e} />
                    </div>




                    {/* Role-specific sections */}

                    <MemberDetailsSection
                        register={register as any}
                        errors={e}
                        planOptions={planOptions}
                        trainerOptions={trainerOptions}
                        role={ROLE_OPTIONS.member}
                    />


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
                            Create User
                        </LoadingButton>
                    </div>

                </form>
            </Card>
        </div>
    );
}