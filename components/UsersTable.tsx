"use client"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ChangePasswordDialog } from "@/components/ChangePassDialog";
import { Button } from "@/components/ui/button";
import { startTransition, useState, useTransition } from "react";
import { deleteUser } from "@/actions/delete";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";


export const UsersTable = ({ users, setToastMessage }: any) => {
    const [isPending, startTransition] = useTransition()
    const removeUser = async (id: string) => {
        setToastMessage({ success: "", error: "" });

        startTransition(() => {
            deleteUser(id)
                .then((data: any) => {
                    if (data.success) {
                        setToastMessage({ success: data.success, error: "" });
                    }
                    else {
                        setToastMessage({ success: "", error: data.error });
                    }
                })
        })
    }

    return (
        <div className="border rounded-lg shadow-sm m-5 text-left">

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user: any, index: number) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>{index}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell><ChangePasswordDialog setToastMessage={setToastMessage} id={user.id} isPending={isPending} /><Button className="ml-3" disabled={isPending} onClick={async () => { removeUser(user.id) }} variant='destructive' size="sm">Delete</Button></TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>)
}