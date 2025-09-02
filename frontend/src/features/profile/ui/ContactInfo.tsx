import React from "react";

export function ContactInfo() {
    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
                Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-gray-400">Email</p>
                    <p>john.doe@example.com</p>
                </div>
                <div>
                    <p className="text-gray-400">Phone</p>
                    <p>+1 (555) 123-4567</p>
                </div>
                <div>
                    <p className="text-gray-400">Location</p>
                    <p>San Francisco, CA</p>
                </div>
                <div>
                    <p className="text-gray-400">Website</p>
                    <p className="text-indigo-400">johndoe.dev</p>
                </div>
            </div>
        </div>
    );
}
