import { Alert, AlertDescription } from '@/Components/ui/alert';
export const FlashMessage: React.FC<{
    type: "success" | "error";
    message: string;
}> = ({ type, message }) => (
    <Alert className={`p-4 rounded-lg mb-4  border-0 ${
        type === "success"
            ? "bg-green-100 border-green-400 text-green-700"
            : "bg-red-100 border-red-400 text-red-700"
    }`}
>
        <AlertDescription >{message}</AlertDescription>
    </Alert>

);
