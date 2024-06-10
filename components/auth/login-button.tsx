"use client"
import { useRouter } from "next/navigation";
interface LoginButtonProps{
    children: React.ReactNode;
    mode?: "model"|"redirect";
    asChild?: boolean;
}

export const LoginButton = ({
    children,
    mode="redirect",
    asChild
}:LoginButtonProps)=>{

    const router = useRouter();


    const onClick = ()=>{
        router.push("/auth/login")
    }

    if(mode === "model"){
        return(
            <span>
                TODO: Impelement a model
            </span>
        )
    }
    return(
        <span className="cursor-pointer" onClick={onClick}>
            {children}
        </span>
    )
}