import React from "react";

export function Friends() {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
                Friends
            </h2>
            <div className="grid grid-cols-3 gap-4 mt-2 flex-grow">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-indigo-600 rounded-full mb-2 flex items-center justify-center">
                            <span className="text-xs font-bold">F{item}</span>
                        </div>
                        <span className="text-xs">Friend {item}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
