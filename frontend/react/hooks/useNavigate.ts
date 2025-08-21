export const useNavigateHook = () => {
    const navigate = (path: string, ...states: any) => {
        if (window.location.pathname === path && states.length === 0) return;
        console.log("Navigating to:", path, " | window.location.pathname:", window.location.pathname, " | with states:", states);
        window.history.pushState(states, "", path);
        window.dispatchEvent(new Event("popstate"));
        setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 0);
    };

    return navigate;
}