import { Header } from "@/components/Header";
import { UserRole } from "@prisma/client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getLogs } from "@/actions/fetchData";
import { LogsTable } from "@/components/LogsTable";



export default async function Logs() {
    const session = await auth()
    if (session?.user.role) {
        if (session.user.role === UserRole.fitter) {
            return redirect("/inventory")
        }
    }

    const logs = await getLogs();

    return (
        <>
            <Header />
            <LogsTable logs={logs} />
        </>
    );
}
