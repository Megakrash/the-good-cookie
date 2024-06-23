import LayoutFull from "@/components/layout/LayoutFull";
import SignUp from "@/components/users/signup/SignUp";

function SignUpPage(): React.ReactNode {
  return (
    <LayoutFull title="TGC : Inscription">
      <SignUp />
    </LayoutFull>
  );
}

export default SignUpPage;
