import React, {
    useState,
    useNavigate,
    useEffect,
    useContext,
    createContext,
} from "react";
import { useUser } from "@features/auth/model/useUser";
import { UserDTOType } from "shared";

export const FriendsContext = createContext(null);

export function FriendsProvider({ children }: { children?: ReactNode }) {
    const [sentRequests, setSentRequests] = useState<UserDTOType[]>([]);
    const [friends, setFriends] = useState([]);

    return (
        <div className="w-full h-full">
            <FriendsContext.Provider
                value={{ sentRequests, setSentRequests, friends, setFriends }}
            >
                <div className="w-full h-full">{children}</div>
            </FriendsContext.Provider>
        </div>
    );
}

export const useFriends = () => {
    const context = useContext(FriendsContext);
    if (!context) {
        throw new Error("useFriends must be used within a FriendsProvider");
    }
    return context;
};
