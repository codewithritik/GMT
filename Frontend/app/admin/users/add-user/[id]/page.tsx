'use client'

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Edit2, FileText, Heart, Users, ImageIcon } from 'lucide-react';
import {
  PageHeader,
  Card,
  LoadingButton,
} from '@/components/ui/SharedComponents';
import { useToast } from '@/components/ui/Toast';
import { getErrorMessage, opsAPI } from '@/lib/api';
import MemberProfileCard from './components/MemberProfileCard ';
import MemberProfileTabs from './components/MemberProfilePage';
import { MemberProfilePageProps } from '@/types/member';

const tabs = ['Overview', 'Health', 'Emergency Contact', 'Progress Tracking', 'Notes'] as const;

export default function MemberProfilePage() {
  const params = useParams() as { id?: string };
  const memberId = params?.id;
  const router = useRouter();
  const toast = useToast();

  const [member, setMember] = useState<MemberProfilePageProps>();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('Overview');

  useEffect(() => {
    if (!memberId) return;
    setLoading(true);
    // fetch member — fallback to listing users if single endpoint not available
    opsAPI
      .membersById(memberId)
      .then((m) => {
        setMember(m);
      })
      .catch((err) => {
        toast.error('Failed to load member', getErrorMessage(err));
      })
      .finally(() => setLoading(false));
  }, [memberId, toast]);

  const onEdit = () => {
    if (!memberId) return;
    router.push(`/admin/users/${memberId}/edit`);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* <PageHeader
         title={member ? member.fullName || 'Member Profile' : 'Member Profile'}
         subtitle={member ? `Member ID: ${member?.id ?? '-'}` : 'Loading member...'}
         action={
           <div className="flex items-center gap-2">
             <LoadingButton variant="secondary" onClick={() => router.push('/admin/users')} icon={Users}>
               Back
             </LoadingButton>
             <LoadingButton onClick={onEdit} icon={Edit2} loading={loading}>
               Edit Profile
             </LoadingButton>
           </div>
         }
       /> */}

      {member?.user?.id && <MemberProfileCard data={member} />}
      {/* <MemberProfilePage /> */}
      {member?.user?.id && <MemberProfileTabs data={member}/>}

    </div>
  );
}




//  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//  {/* Main column */}
//  <div className="lg:col-span-2 space-y-6">
//    <Card className="p-4 bg-slate-900 text-slate-100">
//      <div className="flex flex-col md:flex-row md:items-center gap-4">
//        <div className="w-28 h-28 rounded-full bg-slate-700 overflow-hidden flex-shrink-0">
//          <img
//            src={member?.avatarUrl || `/api/auth/profile/avatar?u=${memberId}`}
//            alt={member?.fullName ?? 'avatar'}
//            className="w-full h-full object-cover"
//          />
//        </div>
//        <div className="flex-1">
//          <div className="flex items-center justify-between">
//            <div>
//              <h2 className="text-2xl font-semibold text-slate-100">{member?.fullName ?? '-'}</h2>
//              <div className="text-sm text-slate-400">ID: {member?.id ?? '-'}</div>
//            </div>
//            <div className="text-right">
//              <div className={`inline-block px-3 py-1 rounded-full text-sm ${member?.memberStatus === 'active' ? 'bg-emerald-700 text-emerald-100' : 'bg-amber-600 text-amber-900'}`}>
//                {member?.memberStatus ?? 'Unknown'}
//              </div>
//              <div className="mt-2 text-sm text-slate-300">{member?.planName ?? 'No plan'}</div>
//            </div>
//          </div>
//        </div>
//      </div>
//    </Card>

//    <Card className="p-0 overflow-hidden">
//      <div className="border-b border-slate-800 bg-slate-900 px-4">
//        <nav className="flex gap-2 overflow-auto">
//          {tabs.map((t) => (
//            <button
//              key={t}
//              onClick={() => setActiveTab(t)}
//              className={`py-3 px-4 text-sm font-medium uppercase tracking-wide ${t === activeTab ? 'border-b-2 border-indigo-400 text-indigo-200' : 'text-slate-400 hover:text-slate-200'}`}
//            >
//              {t}
//            </button>
//          ))}
//        </nav>
//      </div>

//      <div className="p-4 bg-slate-900 text-slate-100">
//        {loading ? (
//          <div className="py-12 text-center text-slate-400">Loading...</div>
//        ) : (
//          <>
//            {activeTab === 'Overview' && (
//              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                <div>
//                  <h3 className="text-sm text-slate-400">Date of Birth</h3>
//                  <div className="text-lg">{member?.dob ?? '-'}</div>
//                </div>
//                <div>
//                  <h3 className="text-sm text-slate-400">Blood Group</h3>
//                  <div className="text-lg">{member?.bloodType ?? '-'}</div>
//                </div>
//                <div>
//                  <h3 className="text-sm text-slate-400">Occupation</h3>
//                  <div className="text-lg">{member?.occupation ?? '-'}</div>
//                </div>
//                <div className="md:col-span-2">
//                  <h3 className="text-sm text-slate-400">Address</h3>
//                  <div className="text-lg">{member?.address ?? '-'}</div>
//                </div>
//                <div>
//                  <h3 className="text-sm text-slate-400">Fitness Goal</h3>
//                  <div className="text-lg">{member?.fitnessGoals ?? '-'}</div>
//                </div>
//                <div>
//                  <h3 className="text-sm text-slate-400">Preferred Workout Time</h3>
//                  <div className="text-lg">{member?.preferredWorkoutTime ?? '-'}</div>
//                </div>
//              </div>
//            )}

//            {activeTab === 'Health' && (
//              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                <div>
//                  <h3 className="text-sm text-slate-400">Height</h3>
//                  <div className="text-lg">{member?.heightCm ? `${member.heightCm} cm` : '-'}</div>
//                </div>
//                <div>
//                  <h3 className="text-sm text-slate-400">Current Weight</h3>
//                  <div className="text-lg">{member?.currentWeightKg ? `${member.currentWeightKg} kg` : '-'}</div>
//                </div>
//                <div>
//                  <h3 className="text-sm text-slate-400">Target Weight</h3>
//                  <div className="text-lg">{member?.targetWeightKg ? `${member.targetWeightKg} kg` : '-'}</div>
//                </div>
//                <div>
//                  <h3 className="text-sm text-slate-400">BMI</h3>
//                  <div className="text-lg">{member?.bmi ?? '-'}</div>
//                </div>
//                <div className="md:col-span-2">
//                  <h3 className="text-sm text-slate-400">Medical Conditions</h3>
//                  <div className="text-lg">{member?.medicalConditions ?? '-'}</div>
//                </div>
//                <div className="md:col-span-2">
//                  <h3 className="text-sm text-slate-400">Allergies</h3>
//                  <div className="text-lg">{member?.allergies ?? '-'}</div>
//                </div>
//                <div className="md:col-span-2">
//                  <h3 className="text-sm text-slate-400">Injuries / Medications</h3>
//                  <div className="text-lg">{member?.injuries ?? '-'}</div>
//                  <div className="text-lg">{member?.medications ?? ''}</div>
//                </div>
//              </div>
//            )}

//            {activeTab === 'Emergency Contact' && (
//              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                <div>
//                  <h3 className="text-sm text-slate-400">Name</h3>
//                  <div className="text-lg">{member?.emergencyName ?? '-'}</div>
//                </div>
//                <div>
//                  <h3 className="text-sm text-slate-400">Phone</h3>
//                  <div className="text-lg">{member?.emergencyPhone ?? '-'}</div>
//                </div>
//                <div>
//                  <h3 className="text-sm text-slate-400">Relationship</h3>
//                  <div className="text-lg">{member?.emergencyRelation ?? '-'}</div>
//                </div>
//              </div>
//            )}

//            {activeTab === 'Progress Tracking' && (
//              <div className="space-y-4">
//                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                  <div>
//                    <h3 className="text-sm text-slate-400">Weight History</h3>
//                    <div className="text-lg">
//                      {(member?.weightHistory ?? []).length ? (
//                        <ul className="list-disc ml-5">
//                          {member.weightHistory.map((w: any, i: number) => (
//                            <li key={i}>{w.date} — {w.weightKg} kg</li>
//                          ))}
//                        </ul>
//                      ) : (
//                        '-'
//                      )}
//                    </div>
//                  </div>
//                  <div>
//                    <h3 className="text-sm text-slate-400">Body Measurements</h3>
//                    <div className="text-lg">
//                      {(member?.measurements ?? []).length ? (
//                        <ul className="list-disc ml-5">
//                          {member.measurements.map((m: any, i: number) => (
//                            <li key={i}>{m.label}: {m.value}{m.unit ? ` ${m.unit}` : ''}</li>
//                          ))}
//                        </ul>
//                      ) : ('-')}
//                    </div>
//                  </div>
//                </div>

//                <div>
//                  <h3 className="text-sm text-slate-400">Progress Photos</h3>
//                  <div className="grid grid-cols-3 gap-2 mt-2">
//                    {(member?.progressPhotos ?? []).length ? (
//                      member.progressPhotos.map((p: string, i: number) => (
//                        <img key={i} src={p} alt={`progress-${i}`} className="w-full h-28 object-cover rounded" />
//                      ))
//                    ) : (
//                      <div className="text-slate-400">No photos</div>
//                    )}
//                  </div>
//                </div>
//              </div>
//            )}

//            {activeTab === 'Notes' && (
//              <div className="space-y-4">
//                <div>
//                  <h3 className="text-sm text-slate-400">Rich Notes</h3>
//                  <div className="prose prose-invert max-w-none bg-slate-800 p-3 rounded">
//                    <div dangerouslySetInnerHTML={{ __html: member?.notesHtml ?? '<em>No notes</em>' }} />
//                  </div>
//                </div>

//                <div>
//                  <h3 className="text-sm text-slate-400">Activity Timeline</h3>
//                  <ul className="space-y-2 mt-2">
//                    {(member?.activityTimeline ?? []).length ? (
//                      member.activityTimeline.map((a: any, i: number) => (
//                        <li key={i} className="text-sm text-slate-300">
//                          <div className="text-slate-400">{a.date}</div>
//                          <div>{a.text}</div>
//                        </li>
//                      ))
//                    ) : (
//                      <li className="text-slate-400">No recent activity</li>
//                    )}
//                  </ul>
//                </div>
//              </div>
//            )}
//          </>
//        )}
//      </div>
//    </Card>
//  </div>

//  {/* Right sidebar */}
//  <aside className="space-y-4">
//    <Card className="p-4 bg-slate-900 text-slate-100">
//      <h4 className="text-sm text-slate-400">Membership Summary</h4>
//      <div className="mt-3 space-y-2">
//        <div className="flex justify-between text-sm text-slate-300">
//          <span>Plan</span>
//          <span>{member?.planName ?? '-'}</span>
//        </div>
//        <div className="flex justify-between text-sm text-slate-300">
//          <span>Start</span>
//          <span>{member?.joinDate ?? '-'}</span>
//        </div>
//        <div className="flex justify-between text-sm text-slate-300">
//          <span>Expires</span>
//          <span>{member?.planExpiry ?? '-'}</span>
//        </div>
//        <div className="flex justify-between text-sm text-slate-300">
//          <span>Status</span>
//          <span>{member?.memberStatus ?? '-'}</span>
//        </div>
//      </div>
//    </Card>

//    <Card className="p-4 bg-slate-900 text-slate-100">
//      <h4 className="text-sm text-slate-400">Payment Summary</h4>
//      <div className="mt-3 space-y-2 text-sm text-slate-300">
//        <div className="flex justify-between">
//          <span>Last Payment</span>
//          <span>{member?.lastPaymentDate ?? '-'}</span>
//        </div>
//        <div className="flex justify-between">
//          <span>Amount</span>
//          <span>{member?.lastPaymentAmount ? `₹${member.lastPaymentAmount}` : '-'}</span>
//        </div>
//        <div className="flex justify-between">
//          <span>Due</span>
//          <span>{member?.outstandingBalance ? `₹${member.outstandingBalance}` : '₹0'}</span>
//        </div>
//      </div>
//    </Card>
//  </aside>
// </div>