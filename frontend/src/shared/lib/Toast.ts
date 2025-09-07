import Swal from "sweetalert2";

interface AlertParamObject {
    message: string;
    place?:
        | "top"
        | "top-start"
        | "top-end"
        | "center"
        | "center-start"
        | "center-end"
        | "bottom"
        | "bottom-start"
        | "bottom-end";
    timeout?: number;
}

export class Toast {
    static message(
        params: AlertParamObject | string,
        type: "info" | "success" | "error"
    ) {
        const message = typeof params === "string" ? params : params.message;
        const place =
            typeof params === "string" ? "top-end" : params?.place || "top-end";
        const timeout =
            typeof params === "string" ? 1500 : params?.timeout || 1500;

        const base = Swal.mixin({
            toast: true,
            position: place,
            icon: type,
            title: message,
            showConfirmButton: false,
            timer: timeout,
            timerProgressBar: true,
            theme: "dark",
        });

        base.fire();
    }

    static error(params: AlertParamObject | string) {
        Toast.message(params, "error");
    }

    static success(params: AlertParamObject | string) {
        Toast.message(params, "success");
    }

    static info(params: AlertParamObject | string) {
        Toast.message(params, "info");
    }
}
