import useAlertStore from "../store/useAlertStore";
import useFormStore from "../store/useFormStore";
import { handleCheckWeb3Connection } from "./handleCheckWeb3Connection";
import { handleInputParams } from "./handleInputParams";

export const handleValidateTransactionParams = (type: string, paramCheck?: any) => {
    const { formInputs } = useFormStore.getState();
    const { showAlert } = useAlertStore.getState();
    const hasConnection = handleCheckWeb3Connection();
    const txAmount = formInputs[type];
    const isInputValid = handleInputParams(type, txAmount, showAlert, paramCheck);
    if (hasConnection && isInputValid) {
        return txAmount;
    }
    return 0;
}