import LayoutFull from '@/components/layout/LayoutFull';
import SignIn from '@/components/users/signin/SignIn';

function SignUpPage(): React.ReactNode {
  return (
    <LayoutFull title="TGC : Connexion">
      <SignIn />
    </LayoutFull>
  );
}

export default SignUpPage;
