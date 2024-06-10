// "use client"
// import { CardWrapper } from "./card-wrapper"
// import { useForm } from 'react-hook-form'
// import { zodResolver } from "@hookform/resolvers/zod"
// import * as z from 'zod'
// import {
//     Form,
//     FormControl,
//     FormItem,
//     FormLabel,
//     FormMessage,
//     FormField
// } from '@/components/ui/form'
// import { LoginSchema } from "@/schemas"
// import { Input } from "@/components/ui/input"
// import { Button } from "../ui/button"
// import { FormError } from "../form-error"
// import { FormSuccess } from "../form-success"
// import { useState, useTransition } from "react"
// import { register } from "@/actions/register"

// export const RegisterForm = () => {
//     const [isPending, startTransition] = useTransition()
//     const [error, setError] = useState<string | undefined>("")
//     const [success, setSuccess] = useState<string | undefined>("")

//     const form = useForm<z.infer<typeof LoginSchema>>({
//         resolver: zodResolver(LoginSchema),
//         defaultValues: {
//             username: "",
//             password: "",

//         },

//     })

//     const onSubmit = (values: z.infer<typeof LoginSchema>) => {
//         setError("")
//         setSuccess("")
//         startTransition(() => {
//             register(values)
//                 .then((data) => {
//                     setError(data.error)
//                     setSuccess(data.success)
//                 })

//         })

//     }

//     return (
//         <CardWrapper headerLabel="Create an account" >
//             <Form {...form}>
//                 <form
//                     onSubmit={form.handleSubmit(onSubmit)}
//                     className="space-y-6"
//                     method="POST"
//                 >
//                     <div className="space-y-4">
//                         <FormField
//                             control={form.control}
//                             name="username"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>name</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             {...field}
//                                             placeholder="John Doe"
//                                             type="text"
//                                             disabled={isPending}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="password"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Password</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             disabled={isPending}
//                                             {...field}
//                                             placeholder="******"
//                                             type="password"
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>

//                     <FormSuccess message={success} />
//                     <FormError message={error} />

//                     <Button className="h-full w-full" disabled={isPending} type="submit">Create an account </Button>

//                 </form>
//             </Form>
//         </CardWrapper>
//     )
// }