import { CheckCircledIcon } from "@radix-ui/react-icons";

interface FormSuccessProps {
    message?: String;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
    if (!message) return
    return (
        <div className="bg-emerald-500/15 p-3 rounded-md flex items-center text-sm text-emerald-500 gap-x-2">
            <CheckCircledIcon className="h-4 w-4 " />
            <p>{message}</p>
        </div>
    )
}