import Layout from "@/components/Layout";
import UserForm from "@/components/users/userForm/UserForm";

const SignUpPage = (): React.ReactNode => {
  return (
    <Layout title="TGC : Inscription">
      <UserForm />
    </Layout>
  );
};

export default SignUpPage;
