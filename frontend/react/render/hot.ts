import React, { IS_DEVELOPMENT } from "..";

const container = document.getElementById("root")!;

async function renderApp(clearCache = true) {
    const { default: Root } = await import("../../src/app/root");

    // unmount everything
    for (const component of Array.from(React.components.values())) {
        component.onUnmount();
    }

    const root = React.createElement(Root);
    React.render(root, container);
    if (IS_DEVELOPMENT || true) {
        console.log(React.components)
    }
}

if (import.meta.webpackHot) {
    import.meta.webpackHot.accept("../../src/app/root", async () => {
        console.log("[HMR] Reloading App module...");
        await renderApp();
    });
}

// TODO: Handle popstate event properly, by re-rendering the current route
window.addEventListener("popstate", async () => {
    console.log("[HMR] Reloading App module...");
    React.setNavigating(true);
    await renderApp(false);
    React.setNavigating(false);
});

renderApp();
