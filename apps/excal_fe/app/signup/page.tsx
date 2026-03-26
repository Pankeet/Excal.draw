import { InputBox } from "../components/input";

export default function SignUp(){
    return(
        <div className="w-screen h-screen grid place-content-center">
            <div className="bg-gray-200 rounded-xl py-12 px-16">
                <span className="lg:text-4xl md:text-2xl text-xl font-serif"><u>Sign Up</u></span>
                <div className="mt-6" >
                    <InputBox placeholder="John Doe" size="md" inputTitle="Username" type="text" />
                    <InputBox type="email" placeholder="johndoe@zohomail.com" size="md" inputTitle="Email" />
                </div>
            </div>
        </div>
    )
}