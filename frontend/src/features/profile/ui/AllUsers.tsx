import React from "react";

export function AllUsers() {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
                All Users
            </h2>
            <div className="overflow-y-auto flex-grow ">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div
                        key={item}
                        className="flex items-center p-3 border-b border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                        <div className="w-10 h-10 bg-indigo-600 rounded-full mr-3 flex items-center justify-center">
                            <span className="text-xs font-bold">U{item}</span>
                        </div>
                        <div>
                            <p className="text-sm">User {item}</p>
                            <p className="text-xs text-gray-400">
                                Last active: 2h ago
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
