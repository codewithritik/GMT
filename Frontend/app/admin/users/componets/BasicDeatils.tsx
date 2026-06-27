import { Input, Select } from "@/components/ui/SharedComponents";
import { FieldGrid, Half, SectionDivider } from "./userFromDeatisl";
import { Errors, Reg } from "./schema";
import { BLOOD_GROUP_OPTIONS, GENDER_OPTIONS } from "./contsValues";

interface BasicInfoSectionProps {
  register: (name: any) => Reg;
  errors: Errors;
}

export function BasicInfoSection({ register, errors }: BasicInfoSectionProps) {
  return (
    <div className="w-full">
      <SectionDivider title="Basic Information" />
      <FieldGrid>
        <Half>
          <Input
            label="Phone *"
            placeholder="+91 98765 43210"
            {...register("phone")}
            error={errors.phone?.message}
          />
        </Half>
        <Half>
          <Input
            label="Full Name *"
            placeholder="Enter full name"
            {...register("name")}
            error={errors.name?.message}
          />
        </Half>
        <Half>
          <Input
            label="Email"
            type="email"
            placeholder="user@example.com"
            {...register("email")}
            error={errors.email?.message}
          />
        </Half>

        <Half>
          <Input
            label="Date of Birth *"
            type="date"
            {...register("dateOfBirth")}
            error={errors.dateOfBirth?.message}
          />
        </Half>

        <Half>
          <Select
            label="Gender"
            options={GENDER_OPTIONS}
            {...register("gender")}
            error={errors.gender?.message}
          />
        </Half>
      </FieldGrid>
    </div>
  );
}
