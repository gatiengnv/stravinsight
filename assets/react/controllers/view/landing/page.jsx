import FeaturesContainer from "../../components/FeaturesContainer";
import FaqContainer from "../../components/FaqContainer";
import QuotesContainer from "../../components/QuotesContainer";
import Header from "../../components/Header";
import StepsContainer from "../../components/StepsContainer";
import Footer from "../../components/Footer";
import AvatarContainer from "../../components/AvatarContainer";
import Banner from "../../components/Banner";

export default function LandingPage({isLoggedIn}) {
    console.log(isLoggedIn);
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-base-100 to-base-200/30">
            <Header isLoggedIn={isLoggedIn}/>
            <main className="flex-1">
                <Banner/>
                <FeaturesContainer/>
                <StepsContainer/>
                <QuotesContainer/>
                <FaqContainer/>
                <AvatarContainer/>
            </main>
            <Footer/>
        </div>
    );
}
