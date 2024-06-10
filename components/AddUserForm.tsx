"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RegisterSchema } from "@/schemas";
import { startTransition, useState, useTransition } from "react";
import { CreateUser } from "@/actions/user";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { UserRole } from "@prisma/client"
export function AddUserForm({ setToastMessage }: any) {
    const [isPending, startTransition] = useTransition();
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({resolver: zodResolver(RegisterSchema),
                 defaultValues: {
            username: "",
            password: "",
            role: "" as UserRole, // Default role
        }
    });

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
        setToastMessage({ success: "", error: "" });

        startTransition(() => {
            CreateUser(values)
                .then((data) => {
                    reset();
                    if (data.success) {
                        setToastMessage({ success: data.success, error: "" });
                    } else {
                        setToastMessage({ success: "", error: data.error });
                    }
                });
        });
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="mx-auto max-w-sm mt-6 mb-20">
                    <CardHeader><CardTitle className="text-3xl">Add User</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input disabled={isPending} id="username" {...register("username")} placeholder="johndoe" required />
                            <p className="text-destructive text-sm">{errors.username?.message}</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" disabled={isPending} type="password" {...register("password")} placeholder="*" required />
                            <p className="text-destructive text-sm">{errors.password?.message}</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Controller
                                name="role"
                                control={control}

                                render={({ field }) => (
                                    <Select {...field} onValueChange={field.onChange} disabled={isPending}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger><SelectContent>
                                            <SelectGroup>

                                                <SelectItem value="manager">Manager</SelectItem>
                                                <SelectItem value="fitter">Fitter</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <p className="text-destructive text-sm">{errors.role?.message}</p>
                        </div>
                        <Button type="submit" disabled={isPending} className="w-full">
                            Create
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </>
    );
}
