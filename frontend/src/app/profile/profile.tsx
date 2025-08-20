import React, { useEffect, useNavigate, useState } from "react";
import {
    LogoutButton,
    TwoFactorAuthDisable,
    TwoFactorAuthEnable,
} from "@features/auth";
import { useUser } from "@features/auth/model/useUser";
import { FaEdit, FaUser, FaUsers } from "react-icons/fa";

import { UserStats } from "@features/user/ui/UserStats";
import { GameHistory } from "@features/user/ui/GameHistory";
import { UserPicture } from "@features/user/ui/UserPicture";
import ProfileApi from "@features/user/service/profileApi";
import { DeleteButton } from "@features/user/ui/Delete";
			

export default function ProfileCard() {

	const query = new URLSearchParams(window.location.search);
    const userId = query.get("id");
    const [edit, setEdit] = useState(false);

    const { user, loading, setUser } = useUser();
    const navigate = useNavigate();

	const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data = {
            username: e.target[0].value,
        };
        const newUser = await ProfileApi.updateUser(data);
        setEdit(false);
        setUser(newUser);
    }

	useEffect(() => {
        if (!user && !loading) navigate("/auth");
    }, [user, loading]);

    if (!user) return <div />;

	return(
			<div className="relative max-w-3xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-6 mb-8 text-white">
				<button
					className="absolute top-6 right-4 text-white p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors z-10"
					onClick={() => setEdit(!edit)}
				>
					{edit ? "Cancel" : "Edit"}
				</button>

				<div className="flex flex-col md:flex-row items-start gap-6">
					<UserPicture />
					{!edit ? (
						<div className="space-y-1">
							<h2 className="text-2xl font-bold">
								{user.username}
							</h2>
							<p className="text-white/80">ID: {user.id}</p>
							<p className="text-white/80">{user.email}</p>
						</div>
					) : (
						<form
							onSubmit={handleSubmit}
							className="w-full space-y-3 flex-1 pr-15"
						>
							<input
								type="text"
								name="username"
								value={user.username}
								defaultValue={user.username}
								className="w-full p-2 rounded bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Username"
							/>
							<button
								type="submit"
								className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors font-medium"
							>
								Save Changes
							</button>
						</form>
					)}
				</div>

				{/* 2FA Toggle */}
				<div className="mt-6">
					{user.is2FAEnabled ? (
						<TwoFactorAuthDisable />
					) : (
						<TwoFactorAuthEnable />
					)}
				</div>

				{/* Logout */}
				<div className="mt-4 flex gap-2 items-center">
					<LogoutButton />
					<DeleteButton />
				</div>
			</div>
	);
}





// import React, { useState, useNavigate } from "react";
// import {
//     LogoutButton,
//     TwoFactorAuthDisable,
//     TwoFactorAuthEnable,
// } from "@features/auth";

// import { useUser } from "@features/auth/model/useUser";


// export default function ProfileCard() {

//     const { user } = useUser();

//     if (!user || typeof user !== 'object') {
//         return (
//             <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex items-center justify-center">
//                 <div className="text-2xl">Loading...</div>
//             </div>
//         );
//     }
    

//     return (
//         <div>
//             <div className="flex flex-col items-center mb-8">
//                 <div className="relative mb-4">
//                         <img
//                             src={user.avatar}
//                             alt="User Avatar"
//                             className="w-32 h-32 rounded-full ring-4 ring-purple-500/30 shadow-2xl"
//                         />
//                         <button className="absolute border border-purple-600 bottom-0.5 right-0 bg-black text-purple-600 hover:bg-purple-600 hover:text-black rounded-full p-1 px-2 m-1 duration-100">
//                             Edit
//                         </button>
//                 </div>
//                 <div className="flex flex-row justify-center items-center gap-2 mb-4">
//                     <h1 className="text-3xl font-bold">{user.name}</h1>
//                     <LogoutButton />
//                 </div>
//             </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                     <div className="bg-white/5 rounded-lg p-4 border border-white/10">
//                         <label className="text-sm text-gray-400">User-ID</label>
//                         <div className="flex justify-between items-center">
//                             <span className="text-lg">{user.id}</span>
//                         </div>
//                     </div>
//                     <div className="bg-white/5 rounded-lg p-4 border border-white/10">
//                         <label className="text-sm text-gray-400">Name</label>
//                         <div className="flex justify-between items-center">
//                             <span className="text-lg">{user.name}</span>
//                             <button className="border rounded-full p-1 px-2 text-pink-400 hover:text-black hover:bg-pink-400 transition-colors">Edit</button>
//                         </div>
//                     </div>
//                     <div className="bg-white/5 rounded-lg p-4 border border-white/10">
//                         <label className="text-sm text-gray-400">Email</label>
//                         <div className="flex justify-between items-center">
//                             <span className="text-lg pr-3">{user.email}</span>
//                             <button className="border rounded-full p-1 px-2 text-pink-400 hover:text-black hover:bg-pink-400 transition-colors">Edit</button>
//                         </div>
//                     </div>
//                     <div className="bg-white/5 rounded-lg p-4 border border-white/10">
//                         <label className="text-sm text-gray-400">Username</label>
//                         <div className="flex justify-between items-center">
//                             <span className="text-lg pr-3">test-username</span>
//                             <button className="border rounded-full p-1 px-2 text-pink-400 hover:text-black hover:bg-pink-400 transition-colors">Edit</button>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex justify-center mb-4">
//                     {user?.is2FAEnabled ? <TwoFactorAuthDisable /> : <TwoFactorAuthEnable />}
//                 </div>
//          </div>
//     );
// }
