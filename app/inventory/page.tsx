import { getInventories } from "@/actions/fetchData";
import { auth } from "@/auth";
import { Header } from "@/components/Header";
import { InventoryComponents } from "@/components/InventoryComponents";


export default async function Inventory() {
    const session = await auth()
    const username = session?.user.name
    const role = session?.user.role
    const inventories = await getInventories()
    return (
        <>
            <Header />
            <div className="flex flex-col w-full min-h-screen">
                <div className="flex flex-col w-full min-h-screen just">
                    <InventoryComponents role={role} username={username} inventories={inventories} />
                </div>

            </div>
        </>
    );
}
