"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/SharedComponents";
import { DATE_FORMAT } from "@/lib/consts";
import { MemberProfilePageProps, SingleMemberResponse } from "@/types/member";
import dayjs from "dayjs";
import {
  Camera,
  Pencil,
  MoreVertical,
  User,
  Droplets,
  CalendarDays,
} from "lucide-react";
import { useState } from "react";

const statusVariant = {
  active: "default",
  inactive: "outline",
  suspended: "destructive",
} as const;



export default function MemberProfileCard({
  data,
}: {
  data: MemberProfilePageProps;
}) {
  const { member, memberMetrics, user } = data;
  const age = dayjs().diff(dayjs(user.dob), "year").toString();

  return (
    <Card className=" px-6 py-5 border border-[#2a3044] rounded-2xl p-6 w-full">
      <div className="flex items-start gap-5">
        {/* Avatar with camera icon */}
        <div className="relative shrink-0">
          <Avatar className="h-40 w-40 rounded-xl border-2 border-[#2a3044]">
            <AvatarImage
              src={user.avatarKey || "/avatar-placeholder.jpg"}
              alt={user.fullName}
            />
            <AvatarFallback className="bg-[#2a3044] text-white text-xl rounded-xl">
              {user.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          {/* <button
            className="absolute bottom-1 right-1 bg-[#1a1f2e] border border-[#2a3044] rounded-full p-1 hover:bg-[#2a3044] transition-colors"
            aria-label="Change photo"
          >
            <Camera className="h-3 w-3 text-gray-400" />
          </button> */}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          {/* Name + Status */}
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-white text-xl font-semibold tracking-tight">
              {user.fullName}
            </h2>
            <Badge variant={statusVariant[member.memberStatus]}>
              {member.memberStatus.charAt(0).toUpperCase() + member.memberStatus.slice(1)}
            </Badge>

          </div>

          {/* data ID */}
          <p className="text-gray-400 text-sm mb-1">
            Member Code: {member.memberCode}
          </p>

          {/* Phone + Email */}
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-3 flex-wrap">
            <span>Phone: {user.phone}</span>
            <span className="text-gray-600">•</span>
            <span>Email: {user.email}</span>
          </div>

          {/* Meta pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <MetaPill icon={<User className="h-3.5 w-3.5 text-blue-400" />}>
              {user.gender}
            </MetaPill>
            <MetaPill icon={<Droplets className="h-3.5 w-3.5 text-rose-400" />}>
              {member.bloodType}
            </MetaPill>
            <MetaPill
              icon={<CalendarDays className="h-3.5 w-3.5 text-purple-400" />}>
              {dayjs(user.dob).format(DATE_FORMAT)}{" "}
              <span className="text-gray-500">({age} yrs)</span>
            </MetaPill>
          </div>
        </div>

        {/* Actions */}
        {/* <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-[#2a3044] text-gray-300 hover:bg-[#2a3044] hover:text-white gap-1.5 text-sm"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Profile
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-transparent border-[#2a3044] text-gray-400 hover:bg-[#2a3044] hover:text-white h-8 w-8"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[#1a1f2e] border-[#2a3044] text-gray-300"
            >
              <DropdownMenuItem className="hover:bg-[#2a3044] hover:text-white cursor-pointer">
                View History
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-[#2a3044] hover:text-white cursor-pointer">
                Send Message
              </DropdownMenuItem>
              <DropdownMenuItem className="text-rose-400 hover:bg-[#2a3044] hover:text-rose-300 cursor-pointer">
                Deactivate Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}
      </div>
    </Card>
  );
}

function MetaPill({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#252b3b] border border-[#2a3044] text-gray-300 text-xs px-2.5 py-1 rounded-md">
      {icon}
      {children}
    </span>
  );
}
