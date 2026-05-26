import HeaderHero from "@/components/HeaderHero";
import ServicesAbout from "@/components/ServicesAbout";
import CallbackReviews from "@/components/CallbackReviews";
import FaqContactsFooter from "@/components/FaqContactsFooter";

export default function Index() {
  return (
    <div className="font-opensans">
      <HeaderHero />
      <ServicesAbout />
      <CallbackReviews />
      <FaqContactsFooter />
    </div>
  );
}
