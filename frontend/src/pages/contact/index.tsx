import LayoutFull from "@/components/LayoutFull";
import ContactHeader from "@/components/contact/ContactHeader";
import ContactForm from "@/components/contact/ContactForm";

const SignPage = (): React.ReactNode => {
  return (
    <LayoutFull title="TGC : Contact">
      <ContactHeader />
      <ContactForm />
    </LayoutFull>
  );
};

export default SignPage;
