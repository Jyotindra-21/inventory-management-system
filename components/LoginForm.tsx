'use client';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from './ui/button';
import { startTransition, useState } from "react";
import { login } from "@/actions/login";
import { LoginSchema } from "@/schemas";


export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    })
    const [error, setError] = useState<string | undefined>("")
    const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
        setError("")
        startTransition(() => {
            login(data)
                .then((data) => {
                    setError(data.error)
                })
        })

    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className={`mb-3 text-2xl`}>
                    Please log in to continue.
                </h1>
                <div className="w-full">
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="username"
                        >
                            Username
                        </label>
                        <div className="relative">
                            <input
                                {...register("username")}

                            />
                            <p className="text-destructive text-sm">{errors.username?.message}</p>
                        </div>
                    </div>


                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                {...register("password")}

                            />
                        </div>
                        <p className="text-destructive text-sm">{errors.password?.message}</p>

                    </div>
                </div>
                <Button className="mt-4 w-full" >
                    Log in
                </Button>
                <div className="flex items-center justify-center mt-5">
                    <p className="text-destructive text-sm">{error}</p>
                </div>

            </div>
        </form>
    );
}

