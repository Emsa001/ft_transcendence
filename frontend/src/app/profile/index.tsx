import React from "react";
import { ContactInfo } from "@features/profile/ui/ContactInfo";
import { UserInfo } from "@features/profile/ui/UserInfo";
import { Stats } from "@features/profile/ui/Stats";
import { Friends } from "@features/profile/ui/Friends";
import { AllUsers } from "@features/profile/ui/AllUsers";

export const Profile = () => {
    return (
        <div className="w-full h-full flex flex-col lg:items-center lg:justify-center pt-20 pb-10 z-10 relative overflow-y-auto ">
            <div className=" text-gray-100 px-4  w-full max-w-7xl">
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="bg-gray-800 rounded-lg p-6 shadow-lg w-full md:w-1/3 flex items-center justify-center">
                        <UserInfo />
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 shadow-lg w-full md:w-2/3 flex items-center justify-center">
                        <ContactInfo />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="bg-gray-800 rounded-lg p-6 shadow-lg w-full md:w-1/3 flex items-center justify-center">
                        <Stats />
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 w-full md:w-2/3">
                        <div className="bg-gray-800 rounded-lg p-6 shadow-lg w-full md:w-1/2 flex flex-col">
                            <Friends />
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6 shadow-lg w-full md:w-1/2 flex flex-col">
                            <AllUsers />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
