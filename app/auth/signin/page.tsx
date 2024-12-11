'use client'

import { signIn } from "next-auth/react";
import { useRef } from "react";

type Props = {
    searchParams?: Record<"callbackUrl" | "error", string>;
  };

export default function SignIn(props: Props) {

    const email = useRef("");
    const password = useRef("");

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await signIn("credentials", {
                email: email.current,
                password: password.current,
                redirect: true,
                callbackUrl: props.searchParams?.callbackUrl ?? "/",
            });
        } catch (error) {
            console.log(error);
        }
  };

    return (
        <div>
            Sign In

            <form action="" method="POST" onSubmit={onSubmit}>
                <input type="email" name="email" id="email" placeholder="email" onChange={(e) => email.current = e.target.value} />
                <input type="password" name="password" id="password" placeholder="password" onChange={(e) => password.current = e.target.value} />  

                <button type="submit">Sign In</button>
            </form>
        </div>
    )
}