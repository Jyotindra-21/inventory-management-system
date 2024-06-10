"use client"

import { updateUserPassword } from "@/actions/user"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useTransition } from "react"

export function ChangePasswordDialog({ isPending, id, setToastMessage }: any) {
    const [isLoading, startTransition] = useTransition()
    const [password, setPassword] = useState("")
    const [open, setOpen] = useState(false)
    const updatePassword = async () => {
        setToastMessage({ success: "", error: "" })

        startTransition(() => {
            updateUserPassword(id, password)
                .then((data) => {
                    if (data.success) {
                        setOpen(false);
                        setToastMessage({ success: data.success, error: "" })

                    }
                    else {
                        setToastMessage({ success: "", error: data.error })
                    }
                })
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={isPending}>Change Password</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>

                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            disabled={isLoading}
                            onChange={(e) => setPassword(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={isLoading} onClick={updatePassword}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
