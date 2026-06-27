import { Input, Select, Textarea } from "@/components/ui/SharedComponents";
import { FieldGrid, Half, SectionDivider } from "./userFromDeatisl";
import {
  BLOOD_GROUP_OPTIONS,
  FITNESS_GOAL_OPTIONS,
  GENDER_OPTIONS,
} from "./contsValues";
import { Errors, Reg } from "./schema";
import { ROLE_OPTIONS as ROLE_OPTIONS_VALUES } from "@/lib/consts";

interface MemberDetailsSectionProps {
  register: (name: any) => Reg;
  errors: Errors;
  planOptions: { value: string; label: string }[];
  trainerOptions?: { value: string; label: string }[];
  role: keyof typeof ROLE_OPTIONS_VALUES;
}

export function MemberDetailsSection({
  register,
  errors,
  planOptions,
  trainerOptions = [],
  role,
}: MemberDetailsSectionProps) {
  return (
    <>
      {/* Personal */}
      {/* <FieldGrid>
                <Half>
                    <Input
                        label="Address"
                        placeholder="City, Area"
                        {...register('address')}
                        error={errors.address?.message}
                    />
                </Half>
            </FieldGrid> */}

      {role === ROLE_OPTIONS_VALUES.member && (
        <>
          {/* Membership */}
          <SectionDivider title="Membership" />
          <FieldGrid>
            <Half>
              <Select
                label="Membership Plan"
                options={planOptions}
                placeholder={
                  planOptions.length ? "Select a plan" : "No plans available"
                }
                {...register("subscriptionPlanId")}
                error={errors.subscriptionPlanId?.message}
              />
            </Half>
            <div>
              <Input
                label="Date of Joining"
                type="date"
                {...register("dateOfJoining")}
                error={errors.dateOfJoining?.message}
              />
            </div>
            <div>
              <Select
                label="Assigned Trainer"
                options={trainerOptions}
                placeholder={
                  trainerOptions.length
                    ? "Select a trainer"
                    : "No trainers available"
                }
                {...register("assignedTrainerId")}
                error={errors.assignedTrainerId?.message}
              />
            </div>
          </FieldGrid>

          {/* Health */}
          {/* <SectionDivider title="Health Information" />
                    <FieldGrid>
                        <div>
                            <Select
                                label="Fitness Goal"
                                options={FITNESS_GOAL_OPTIONS}
                                {...register('fitnessGoal')}
                                error={errors.fitnessGoal?.message}
                            />
                        </div>
                        <Half>
                            <Textarea
                                label="Medical Conditions"
                                placeholder="e.g. Diabetes, High BP, Heart condition..."
                                {...register('medicalConditions')}
                                error={errors.medicalConditions?.message}
                            />
                        </Half>
                        <Half>
                            <Textarea
                                label="Existing Injuries"
                                placeholder="e.g. Lower back pain, knee injury..."
                                {...register('injuries')}
                                error={errors.injuries?.message}
                            />
                        </Half>
                    </FieldGrid> */}
        </>
      )}

      {/* Emergency Contact */}
      {/* <SectionDivider title="Emergency Contact" />
            <FieldGrid>
                <Half>
                    <Input
                        label="Emergency Name"
                        {...register('emergencyName')}
                        error={errors.emergencyName?.message}
                    />
                </Half>
                <div>
                    <Input
                        label="Emergency Phone"
                        {...register('emergencyPhone')}
                        error={errors.emergencyPhone?.message}
                    />
                </div>
                <div>
                    <Input
                        label="Relation"
                        placeholder="e.g. Father, Spouse"
                        {...register('emergencyRelation')}
                        error={errors.emergencyRelation?.message}
                    />
                </div>
            </FieldGrid> */}
    </>
  );
}
