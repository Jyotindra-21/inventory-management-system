import { Header } from "@/components/Header";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { getUsers } from "@/actions/fetchData";
import { UsersComponents } from "@/components/UsersComponents";
export default async function UserManagement() {
    const session = await auth()
    const AllUsers = await getUsers()
    if (session?.user.role) {
        if (session.user.role === UserRole.fitter) {
            return redirect("/inventory")
        }
    }
    return (
        <>
            <Header />
            <UsersComponents AllUsers={AllUsers}  />
        </>
    );
}

