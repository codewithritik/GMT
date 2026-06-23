import { Input, Select } from "@/components/ui/SharedComponents";
import { FieldGrid, Half, SectionDivider } from "./userFromDeatisl";
import { useForm } from "react-hook-form";
import { FormData } from "./schema";
import { ROLE_OPTIONS_OBJ, STATUS_OPTIONS } from "./contsValues";

type Errors = Record<string, { message?: string }>;
type Reg = ReturnType<ReturnType<typeof useForm<FormData>>['register']>;

interface AccountSectionProps {
    register: (name: any) => Reg;
    errors: Errors;
    roleErrors: Errors;
}

export function AccountSection({ register, errors, roleErrors }: AccountSectionProps) {
    return (
        <>
            <SectionDivider title="Account" />
            <FieldGrid>
                <div>
                    <Select
                        disabled={true}
                        label="Role"
                        options={ROLE_OPTIONS_OBJ}
                        {...register('role')}
                        error={roleErrors.role?.message}
                    />
                </div>
                <div>
                    <Select
                        label="Status"
                        options={STATUS_OPTIONS}
                        {...register('status')}
                        error={errors.status?.message}
                    />
                </div>
                <Half>
                    <Input
                        label="Temporary Password"
                        type="password"
                        placeholder="Minimum 8 characters"
                        {...register('password')}
                        error={errors.password?.message}
                        required
                    />
                </Half>
            </FieldGrid>
        </>
    );
}