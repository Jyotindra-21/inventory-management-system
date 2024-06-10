import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { auth } from "@/auth"
import { UserRole } from "@prisma/client"
import { signOut } from '@/auth';
import { CircleUser, Menu, Package2, Search, User } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// export const Header = async () => {
//     const session = await auth()

//     return (
//         <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
//             <nav className="flex-col hidden gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
//                 <Link href="/inventory" className="flex items-center gap-2 text-lg font-semibold md:text-base" prefetch={false}>
//                     <Image
//                         src="/logo.png"
//                         height="70"
//                         width="70"
//                         alt="Logo"
//                     />
//                 </Link>

//                 {
//                     session?.user.role && session.user.role === UserRole.manager && (
//                         <>
//                             <Link href="/logs" className="font-bold" prefetch={false}>
//                                 Logs
//                             </Link>
//                             <Link href="/users" className="text-gray-500 dark:text-gray-400" prefetch={false}>
//                                 Users
//                             </Link>
//                         </>
//                     )
//                 }


//             </nav>
//             <div className="flex items-center w-full gap-4 md:ml-auto md:gap-2 lg:gap-4">
//                 <form className="flex-1 ml-auto sm:flex-initial">
//                     <div className="relative">
//                         <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
//                         <Input
//                             type="search"
//                             placeholder="Search products..."
//                             className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
//                         />
//                     </div>
//                 </form>
//                 <Button variant="ghost" size="icon" className="rounded-full">
//                     <img src="https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" width="32" height="32" className="rounded-full" alt="Avatar" />
//                     <span className="sr-only">Toggle user menu</span>
//                 </Button>
//                 <form
//                     action={async () => {
//                         'use server';
//                         await signOut();
//                     }}
//                 >
//                     <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
//                         <div className="hidden md:block">Sign Out</div>
//                     </button>
//                 </form>
//             </div>

//         </header>
//     )
// }


export const Header = async () => {
    const session = await auth()
    return (


        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-white z-50 px-4 md:px-6">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link
                    href="/inventory"
                    className="flex items-center gap-2 text-lg font-semibold md:text-base"
                >
                    <Image
                        src="/logo.png"
                        height={70}
                        width={70}
                        alt="Logo"
                    />

                </Link>
                {session?.user.role === UserRole.manager && (
                    <>
                        <Link
                            href="/logs"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Logs
                        </Link>
                        <Link
                            href="/users"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Users
                        </Link>
                    </>

                )}

            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link
                            href="/inventory"
                            className="flex items-center gap-2 text-lg font-semibold"
                        >
                            <Image
                                src="/logo.png"
                                height={70}
                                width={70}
                                alt="Logo"
                            />
                        </Link>
                        {session?.user.role === UserRole.manager && (
                            <>
                                <Link
                                    href="/logs"
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Logs
                                </Link>
                                <Link
                                    href="/users"
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Users
                                </Link>
                            </>
                        )}
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <form className="ml-auto flex-1 sm:flex-initial">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                        />
                    </div>
                </form>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <CircleUser className="h-5 w-5" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <form
                            action={async () => {
                                'use server';
                                await signOut();
                            }}
                        >
                            <DropdownMenuItem>

                                <button className="flex   rounded-md   text-sm font-medium  md:flex-none md:justify-start ">
                                    Sign Out
                                </button>
                            </DropdownMenuItem>
                        </form>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header >

    )
}


function Package2Icon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
            <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
            <path d="M12 3v6" />
        </svg>
    )
}


function SearchIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}