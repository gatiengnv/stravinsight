import FeaturesContainer from "../../components/FeaturesContainer";
import FaqContainer from "../../components/FaqContainer";
import QuotesContainer from "../../components/QuotesContainer";
import Header from "../../components/Header";
import StepsContainer from "../../components/StepsContainer";
import Footer from "../../components/Footer";
import AvatarContainer from "../../components/AvatarContainer";
import PremiumBanner from "../../components/PremiumBanner";
import Pricing from "../../components/Pricing";
export default function LandingPage({isLoggedIn, price, premiumMode}) {
    const isPremiumMode = premiumMode === true || premiumMode === "true";
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-base-100 to-base-200/30">
            <Header isLoggedIn={isLoggedIn} isPremiumMode={isPremiumMode}/>
            <main className="flex-1">
                <PremiumBanner/>
                <FeaturesContainer/>
                <StepsContainer/>
                <QuotesContainer/>
                <FaqContainer/>
                {isPremiumMode && (<Pricing price={price}/>)}
                <AvatarContainer/>
            </main>
            <Footer/>
        </div>
    );
}
