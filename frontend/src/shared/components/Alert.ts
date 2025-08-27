import Swal from "sweetalert2";


interface AlertParamObject {
    message: string;
    place?: "top" | "top-start" | "top-end" | "center" | "center-start" | "center-end" | "bottom" | "bottom-start" | "bottom-end";
}

export class Alert {

    static message(params: AlertParamObject | string, type: "info" | "success" | "error") {
        const message = typeof params === "string" ? params : params?.message;
        const place = typeof params === "string" ? "top-end" : params?.place;

        Swal.fire({
            position: place,
            icon: type,
            title: message,
            showConfirmButton: false,
            timer: 1500,
        });
    }

    static error(params: AlertParamObject | string) {
        Alert.message(params, "error");
    }

    static success(params: AlertParamObject | string) {
        Alert.message(params, "success");
    }
}
