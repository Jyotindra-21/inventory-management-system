"use client";

import { AddProduct } from "@/components/AddProduct";
import { ProductCard } from "@/components/ProductCard";
import { UserRole } from "@prisma/client";
import { useEffect, useState } from "react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
export const InventoryComponents = ({ role, username, inventories }: any) => {
    const [toastMessage, setToastMessage] = useState({
        error: "",
        success: "",
    });



    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            {toastMessage.success && <FormSuccess message={toastMessage.success} />}
            {toastMessage.error && <FormError message={toastMessage.error} />}
            <div className="flex items-center">
                <h1 className="font-semibold text-lg md:text-2xl">Inventory</h1>
            </div>

            {role && role === UserRole.manager && (
                <AddProduct setToastMessage={setToastMessage} username={username} />
            )}
            <ProductCard
                role={role}
                username={username}
                setToastMessage={setToastMessage}
                inventories={inventories}
            />
        </main>
    );
};