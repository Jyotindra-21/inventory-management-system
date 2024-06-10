
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { startTransition, useState, useTransition } from "react"
import { db } from "@/lib/db"
import { addStock, removeStock } from "@/actions/update"

export function StockButton({ id, title, operation, variant = "", isPending, setToastMessage, username, role }: any) {
    const [open, setOpen] = useState(false);
    const [stock, setStock] = useState(1)
    const [loading, setLoading] = useState(false)
    const [isLoading, startTransition] = useTransition()
    const updateInventory = async () => {
        setToastMessage({ success: "", error: "" })
        if (operation === "add") {
            setLoading(true)
            startTransition(() => {
                addStock(id, stock, username, role)
                    .then((data) => {
                        if (data.success) {
                            setToastMessage({ success: data.success, error: "" })
                            setOpen(false);

                        }
                        else {
                            setToastMessage({ success: "", error: data.error })
                            setOpen(false);

                        }
                    })
                setLoading(false)
            })


        }
        else if (operation === "remove") {

            setLoading(true)
            startTransition(() => {
                removeStock(id, stock, username, role)
                    .then((data) => {
                        if (data.success) {
                            setToastMessage({ success: data.success, error: "" })
                            setOpen(false);
                        }
                        else {
                            setToastMessage({ success: "", error: data.error })
                            setOpen(false);

                        }
                    })
                setLoading(false)
            })

        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={variant} size="sm" disabled={isPending}>{title}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Make changes to inventory. Click save when you are done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quantity" className="text-right">
                            Quantity
                        </Label>
                        <Input
                            id="quantity"
                            defaultValue="1"
                            type="number"
                            min="1"
                            onChange={(e) => setStock(Number(e.target.value))}
                            required
                            className="col-span-3"
                            disabled={loading}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={updateInventory} disabled={isLoading}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
