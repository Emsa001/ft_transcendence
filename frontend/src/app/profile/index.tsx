import React, { useEffect, useNavigate, useState } from "react";
import {
    LogoutButton,
    TwoFactorAuthDisable,
    TwoFactorAuthEnable,
} from "@features/auth";
import { useUser } from "@features/auth/model/useUser";
import { FaEdit, FaUser, FaUsers } from "react-icons/fa";
import Friends  from "./friends";
import ProfileCard from "./profile";

import { UserStats } from "@features/user/ui/UserStats";
import { GameHistory } from "@features/user/ui/GameHistory";
import { UserPicture } from "@features/user/ui/UserPicture";
import ProfileApi from "@features/user/service/profileApi";
import { DeleteButton } from "@features/user/ui/Delete";

export const Profile = () => {
    // Just for test - get user ID from URL query params to see their stats
    const query = new URLSearchParams(window.location.search);
    const userId = query.get("id");
    const [edit, setEdit] = useState(false);

    const { user, loading, setUser } = useUser();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data = {
            username: e.target[0].value,
        };
        const newUser = await ProfileApi.updateUser(data);
        setEdit(false);
        setUser(newUser);
    };

    useEffect(() => {
        if (!user && !loading) navigate("/auth");
    }, [user, loading]);

    if (!user) return <div />;

    return (
        <div className="min-h-screen w-full p-6 flex flex-col items-center justify-center">
        
		{/* profile nav bar */}
			<div className="text-white bg-white/5 rounded-xl p-1 border border-white/10">
				<button
				className="p-2 size-lg "
				onClick={setActiveTab.bind(null, "profile")}
				>Profile
				</button>

				<button
				className="p-2 size-lg"
				onClick={setActiveTab.bind(null, "friends")}
				>Friends
				</button>

				<button
				className="p-2 size-lg"
				onClick={setActiveTab.bind(null, "stats")}
				>Stats
				</button>

				<button
				className="p-2 size-lg"
				onClick={setActiveTab.bind(null, "history")}
				>History
				</button>
			</div>

		{/* cards */}
			<div className="">
				{/* Profile Card */}
				{activeTab === "profile" && (
					<ProfileCard />
				)}

				{/* Stats */}
				{activeTab === "stats" && (
					<UserStats userId={userId || user.id} />
				)}

				{/* Game History */}
				{activeTab === "history" && (
					<GameHistory userId={userId || user.id} />
				)}

				{/* friends page */}
				{activeTab === "friends" && (
					<Friends />
				)}
			</div>

        </div>
    );
};