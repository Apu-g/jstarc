
"use client";

import { useState } from "react";
import { Toast } from "sonner";
import { Users, UserPlus, Shield, Star, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function TeamManager() {
    const [members, setMembers] = useState([
        { id: 1, name: "Master Nilesh", role: "Master", rank: "7th Dan", image: "https://randomuser.me/api/portraits/men/32.jpg" },
        { id: 2, name: "Master Jai", role: "Master", rank: "6th Dan", image: "https://randomuser.me/api/portraits/men/44.jpg" },
        { id: 3, name: "John Doe", role: "Instructor", rank: "3rd Dan", image: "https://randomuser.me/api/portraits/men/86.jpg" },
    ]);

    const handleDelete = (id) => {
        setMembers(members.filter(m => m.id !== id));
        toast.success("Member removed");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Team Manager</h1>
                    <p className="text-slate-500">Manage Masters, Instructors, and Team Members.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm shadow-blue-200">
                    <UserPlus size={20} />
                    Add Member
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                    <div key={member.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                        <div className="relative mb-4">
                            <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full object-cover border-4 border-slate-50" />
                            {member.role === "Master" && (
                                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 p-1.5 rounded-full border-2 border-white" title="Master">
                                    <Star size={14} fill="currentColor" />
                                </div>
                            )}
                        </div>

                        <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                        <p className="text-sm text-blue-600 font-medium mb-1">{member.rank}</p>
                        <span className="text-xs text-slate-400 px-2 py-1 bg-slate-50 rounded-full mb-4">{member.role}</span>

                        <div className="flex gap-2 w-full mt-auto">
                            <button className="flex-1 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors font-medium text-sm border border-slate-200">
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(member.id)}
                                className="flex-1 py-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors font-medium text-sm border border-slate-200"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}

                {/* Empty State / Add New Placeholder */}
                <button className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all group h-full min-h-[250px]">
                    <div className="p-4 bg-slate-50 rounded-full mb-4 group-hover:bg-white transition-colors">
                        <UserPlus size={32} />
                    </div>
                    <span className="font-medium">Add New Member</span>
                </button>
            </div>
        </div>
    );
}
