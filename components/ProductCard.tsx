import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useEdgeStore } from "@/lib/edgestore";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { StockButton } from "./StockButton";
import { UserRole } from "@prisma/client";
import { useState, useTransition } from "react";
import { deleteInventory } from "@/actions/delete";
import { AddProductSchema, EditProductSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { editProducts } from "@/actions/product";
import { getInventoryById } from "@/actions/fetchData";

export function ProductCard({ inventories, role, username, setToastMessage }: any) {
    const { edgestore } = useEdgeStore();
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File>();
    const [image, setImage] = useState<string | undefined>("");
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
        reset,
    } = useForm<z.infer<typeof EditProductSchema>>({
        resolver: zodResolver(EditProductSchema),
        defaultValues: {
            id: "",
            name: "",
            stock: 0,
            minStock: 0,
            image: ""
        }
    });

    const fetchInventory = async (id: string) => {
        setLoading(true);
        try {
            for (const inventory of inventories) {
                if (inventory.id === id) {
                    setValue("id", inventory.id);
                    setValue("name", inventory.name);
                    setValue("stock", inventory.stock);
                    setValue("minStock", inventory.minStock);
                    setValue("image", inventory.image);
                }
            }
            setLoading(false);
        } catch (error: any) {
            console.log("error", error.message);
            setLoading(false);
        }
        finally {
            setOpen(false);
        }
    };
    const onSubmit = async () => {
        const fileInput = document.getElementById("picture") as HTMLInputElement;
        const files = fileInput?.files;

        const image = getValues("image");

        setToastMessage({ success: "", error: "" });
        setLoading(true);
        try {
            let imageUrl = image;

            // Check if the file input has files selected
            if (files && files.length > 0) {
                const file = files[0];
                const res = await edgestore.publicFiles.upload({
                    file,
                    onProgressChange: (progress) => {
                        console.log(progress);
                    },
                });
                imageUrl = res.url;
                setImage(imageUrl);
            } else if (!image) {
                // Use inventory image if no file is selected and no image in form data
                imageUrl = inventories.find((inv: any) => inv.id === getValues("id"))?.image || "";
            }

            setValue("image", imageUrl); // Update the image URL in React Hook Form

            const updatedData = getValues();
            console.log(`Updated data after file upload: ${JSON.stringify(updatedData)}`);
            const result = await editProducts(updatedData, username, role);
            if (result.success) {
                setToastMessage({ success: result.success, error: "" });
                reset();
            } else {
                setToastMessage({ success: "", error: result.error });

            }
        } catch (error: any) {
            setToastMessage({ success: "", error: error.message });
        } finally {
            setLoading(false);
            setOpen(false); // Close the dialog after successful update

        }
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setValue("image", reader.result as string);
                console.log(`File selected: ${file.name}`);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeInventory = async (id: string) => {
        setToastMessage({ success: "", error: "" });
        setLoading(true);

        startTransition(() => {
            deleteInventory(id, username, role)
                .then((data: any) => {
                    if (data.success) {
                        setToastMessage({ success: data.success, error: "" });
                    } else {
                        setToastMessage({ success: "", error: data.error });
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        });
    };

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
                {inventories && inventories.length > 0 ? (
                    inventories.map((inventory: any, index: number) => (
                        <form key={index} onSubmit={handleSubmit(onSubmit)}>
                            <Card>
                                <CardContent className="grid gap-4 place-items-center ">
                                    <img
                                        src={inventory.image}
                                        width={300}
                                        height={300}
                                        alt="Product Image"
                                        className="aspect-square mt-5 rounded-md object-cover border-2 border-sm"
                                    />
                                </CardContent>
                                <CardContent>
                                    <div className="grid gap-1">
                                        <h3 className="font-semibold text-lg mt-1">{inventory.name}</h3>
                                        <div className="flex items-center justify-between mt-1">
                                            <div>
                                                <span className="font-medium">In Stock:</span> {inventory.stock}
                                            </div>
                                            <div>
                                                <span className="font-medium">Min Stock:</span> {inventory.minStock}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 mb-3">
                                        <Dialog open={open} onOpenChange={setOpen}>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline" onClick={async () => { fetchInventory(inventory.id); setOpen(true); }} disabled={loading}>
                                                    Edit Product
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Edit Product</DialogTitle>
                                                </DialogHeader>
                                                <input
                                                    id="id"
                                                    type="hidden"
                                                    {...register("id")}
                                                    defaultValue={inventory.id}
                                                    className="col-span-3"
                                                />
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">Name</Label>
                                                        <Input
                                                            id="name"
                                                            {...register("name")}
                                                            disabled={loading}
                                                            defaultValue={inventory.name}
                                                            className="col-span-3"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center">
                                                        <Label htmlFor="picture" className="text-right mr-3">Picture</Label>
                                                        <Input
                                                            id="picture"
                                                            className="col-span-3"
                                                            type="file"
                                                            disabled={loading}
                                                            onChange={handleFileChange}
                                                        />
                                                    </div>
                                                    <input type="hidden" {...register("image")} defaultValue={inventory.image} />
                                                    <p className="text-destructive text-center">{errors.image?.message}</p>
                                                    <p className="text-destructive text-center">{errors.name?.message}</p>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="stock" className="text-right">Stock</Label>
                                                        <Input
                                                            id="stock"
                                                            defaultValue={inventory.stock}
                                                            className="col-span-3"
                                                            type="number"
                                                            {...register("stock")}
                                                            disabled={loading}
                                                            min="1"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="minStock" className="text-right">Minimum Stock</Label>
                                                        <Input
                                                            id="minStock"
                                                            defaultValue={inventory.minStock}
                                                            className="col-span-3"
                                                            type="number"
                                                            {...register("minStock")}
                                                            disabled={loading}
                                                            min="1"
                                                        />
                                                    </div>
                                                </div>
                                                <p>Note:  Stock should be greater than Minimum Stock</p>

                                                <DialogFooter>

                                                    <Button variant="destructive" onClick={async () => { removeInventory(inventory.id); }} size="sm" disabled={loading}>Delete Product</Button>
                                                    <Button type="submit" onClick={onSubmit} disabled={loading}>Update Product</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    <div className="flex gap-2 mt-4 mb-1 justify-between">
                                        <StockButton title="Add Stock" role={role} username={username} id={inventory.id} setToastMessage={setToastMessage} operation="add" isPending={loading} />
                                        <StockButton title="Remove Stock" role={role} username={username} id={inventory.id} setToastMessage={setToastMessage} variant="destructive" isPending={loading} operation="remove" />
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    ))
                ) : (
                    <div className="text-center mt-5">
                        <h2 className="text-3xl text-center font-semibold">No Inventory</h2>
                    </div>
                )}
            </div>
        </>
    );
}
