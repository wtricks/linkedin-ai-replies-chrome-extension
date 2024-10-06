import { createRoot } from "react-dom/client";
import "~/assets/tailwind.css";
import App from "./App";

export default defineContentScript({
    matches: ["https://*.linkedin.com/*"],
    // cssInjectionMode: "manifest",

    main(ctx) {
        createIntegratedUi(ctx, {
            position: "inline",
            onMount: (uiContainer) => {
                const wrapper = document.createElement("div");
                uiContainer.append(wrapper);
        
                const root = createRoot(wrapper);
                root.render(<App />);

                return { root, wrapper };
            },

            onRemove: (elements) => {
                elements?.root.unmount();
                elements?.wrapper.remove();
            }
        }).mount();
    }
});
