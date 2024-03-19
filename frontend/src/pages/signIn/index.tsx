import LayoutFull from '@/components/layout/LayoutFull';
import SignIn from '@/components/users/signIn/SignIn';

function SignUpPage(): React.ReactNode {
  return (
    <LayoutFull title="TGC : Connexion">
      <SignIn />
    </LayoutFull>
  );
}

export default SignUpPage;
