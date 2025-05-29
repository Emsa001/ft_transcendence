export {};

declare global {
    namespace google {
        interface CredentialResponse {
            credential: string;
            select_by: string;
            clientId: string;
        }

        interface User {
            id: string;
            name: string;
            email: string;
            picture: string;
        }

        interface PromptMomentNotification {
            isDisplayMoment(): boolean;
            isNotDisplayed(): boolean;
            getNotDisplayedReason(): string;
            isSkippedMoment(): boolean;
            getSkippedReason(): string;
            isDismissedMoment(): boolean;
            getDismissedReason(): string;
        }

        interface IdConfiguration {
            client_id: string;
            callback: (response: CredentialResponse) => void;
            auto_select?: boolean;
            login_uri?: string;
            native_callback?: Function;
            cancel_on_tap_outside?: boolean;
            prompt_parent_id?: string;
            nonce?: string;
            context?: string;
        }

        function initialize(config: IdConfiguration): void;
        function prompt(momentListener?: (notification: PromptMomentNotification) => void): void;
        function renderButton(
            parent: HTMLElement,
            options: {
                theme?: "outline" | "filled_blue" | "filled_black";
                size?: "small" | "medium" | "large";
                text?: "signin_with" | "signup_with" | "continue_with" | "sign_in_with";
                shape?: "rectangular" | "pill" | "circle" | "square";
                logo_alignment?: "left" | "center";
                width?: string | number;
                locale?: string;
            }
        ): void;
    }

    interface Window {
        google: {
            accounts: {
                id: typeof google.accounts.id;
            };
        };
    }
}
