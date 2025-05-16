export default function Footer() {
    return (
        <footer className="footer p-10 bg-base-200 text-base-content flex flex-wrap justify-around">
            <div>
                <a href="/" className="flex items-center gap-3 mb-4">
                    <img src="/img/icon.png" alt="Strava" className="h-8 w-8 drop-shadow-md"/>
                    <span
                        className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">StravInsight</span>
                </a>
                <p className="max-w-xs text-sm opacity-70">Transform your training data into actionable insights to
                    improve your performance</p>
            </div>
            <div>
                <span className="footer-title opacity-70">Product</span>
                <a className="link link-hover hover:text-primary transition-colors" href={"#features"}>Features</a>
                <a className="link link-hover hover:text-primary transition-colors" href={"#faq"}>FAQ</a>
                <a className="link link-hover hover:text-primary transition-colors"
                   href={"#testimonials"}>Testimonials</a>
            </div>
            <div>
                <span className="footer-title opacity-70">Legal</span>
                <a className="link link-hover hover:text-primary transition-colors" href={"/terms-of-use"}>Terms of
                    Use</a>
                <a className="link link-hover hover:text-primary transition-colors" href={"/privacy-policy"}>Privacy
                    Policy</a>
                <a className="link link-hover hover:text-primary transition-colors" href={"/legal-notice    "}>Legal
                    Notice</a>
            </div>
        </footer>
    )
}
