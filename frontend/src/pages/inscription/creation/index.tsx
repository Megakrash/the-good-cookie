import LayoutLight from "@/components/LayoutLight";
import UserForm from "@/components/users/userForm/UserForm";

const SignUpPage = (): React.ReactNode => {
  return (
    <LayoutLight title="TGC : Inscription">
      <UserForm />
    </LayoutLight>
  );
};

export default SignUpPage;
