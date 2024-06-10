"use client";
import { Button } from "@/components/ui/button";
import { useEdgeStore } from "@/lib/edgestore";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { AddProductSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { AddProducts } from "@/actions/product";
import { UserRole } from "@prisma/client";

export const AddProduct = ({ username, setToastMessage }: any) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File>();
    const { edgestore } = useEdgeStore();
    const [image, setImage] = useState<string | undefined>("");
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
        reset,
    } = useForm<z.infer<typeof AddProductSchema>>({
        resolver: zodResolver(AddProductSchema),
        defaultValues: {
            name: "",
            image: "",
            stock: 0,
            minStock: 0,
        },
    });

    const onSubmit = async (data: z.infer<typeof AddProductSchema>) => {
        setToastMessage({ success: "", error: "" });
        setLoading(true);

        try {
            if (file) {
                const res = await edgestore.publicFiles.upload({
                    file,
                    onProgressChange: (progress) => {
                        console.log(progress);
                    },
                });
                setImage(res.url);
                setValue("image", res.url); // Update the image URL in React Hook Form

                // Now you can proceed with adding the product
                const updatedData = getValues();
                console.log(updatedData);
                const result: any = await AddProducts(updatedData, username, UserRole.manager);
                console.log(result);

                if (result.success) {
                    setToastMessage({ success: result.success, error: "" });
                    reset(); // Reset the form after successful submission
                    setOpen(false);
                } else {
                    setToastMessage({ success: "", error: result.error });
                }
            } else {
                // Handle case where no file is selected
                setToastMessage({ success: "", error: "Please select a file" });
            }
        } catch (error: any) {
            setToastMessage({ success: "", error: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="ml-aut">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>Add Product</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <DialogHeader>
                                <DialogTitle>Add Product</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        disabled={loading}
                                        {...register("name")}
                                        id="name"
                                        className="col-span-3"
                                    />
                                </div>
                                <p className="text-destructive text-center">{errors.name?.message}</p>
                                <input type="hidden" {...register("image")} value={image} />
                                <p className="text-destructive text-center">{errors.image?.message}</p>

                                <div className="grid grid-cols-4 items-center">
                                    <Label htmlFor="picture" className="text-right mr-3">Picture</Label>
                                    <Input
                                        onChange={(e) => {
                                            setFile(e.target.files?.[0]);
                                        }}
                                        id="picture"
                                        className="col-span-3"
                                        type="file"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="stock" className="text-right">
                                        Stock
                                    </Label>
                                    <Input
                                        {...register("stock")}
                                        disabled={loading}
                                        id="stock"
                                        className="col-span-3"
                                        type="number"
                                        min={1}
                                    />
                                </div>
                                <p className="text-destructive text-center">{errors.stock?.message}</p>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="minStock" className="text-right">
                                        Minimum Stock
                                    </Label>
                                    <Input
                                        {...register("minStock")}
                                        disabled={loading}
                                        id="minStock"
                                        className="col-span-3"
                                        type="number"
                                        min={1}
                                    />
                                </div>
                                <p>Note: Stock should be greater than Minimum Stock</p>
                                <p className="text-destructive text-center">{errors.minStock?.message}</p>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={loading}>Add Product</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
};
