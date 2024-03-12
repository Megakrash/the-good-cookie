import LayoutLight from '@/components/layout/LayoutLight'
import SignUp from '@/components/users/signUp/SignUp'

function SignUpPage(): React.ReactNode {
  return (
    <LayoutLight title="TGC : Inscription">
      <SignUp />
    </LayoutLight>
  )
}

export default SignUpPage
