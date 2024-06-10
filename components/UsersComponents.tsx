"use client"

import { useState } from "react";
import { AddUserForm } from "./AddUserForm"
import { UsersTable } from "./UsersTable"
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";

export const UsersComponents = ({ AllUsers }: any) => {
    const [toastMessage, setToastMessage] = useState({
        error: "",
        success: "",
    });
    return (
        <>
            {toastMessage.success && <FormSuccess message={toastMessage.success} />}
            {toastMessage.error && <FormError message={toastMessage.error} />}
            <AddUserForm setToastMessage={setToastMessage} />
            <div className="text-center mt-5">
                <h2 className="text-3xl font-semibold">Users</h2>
                <UsersTable users={AllUsers} setToastMessage={setToastMessage} />
            </div>
        </>
    )
}