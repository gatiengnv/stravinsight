import FaqItem from "./FaqItem";

export default function FaqContainer() {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute -top-40 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="container relative mx-auto">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                            <span
                                className="inline-block px-4 py-1 rounded-full bg-purple-100 text-purple-800 font-medium text-sm mb-4">FREQUENTLY ASKED QUESTIONS</span>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" id={"faq"}>Frequently Asked
                        Questions</h2>
                    <p className="mt-4 text-lg text-base-content/70">Find answers to common questions about our
                        platform</p>
                </div>
                <div className="mx-auto grid max-w-4xl gap-6">
                    {[
                        {
                            question: "How do I connect my Strava account?",
                            answer:
                                "Simply sign up for an account and click on the 'Connect with Strava' button. You'll be redirected to Strava to authorize the connection, and then your data will automatically sync with our platform.",
                        },
                        {
                            question: "Is my Strava data secure?",
                            answer:
                                "Yes, we take data security seriously. We only access the data you authorize, and we never share your personal information with third parties. All data is encrypted and stored securely.",
                        },
                        {
                            question: "How often is my Strava data synced?",
                            answer:
                                "Your data is synced automatically whenever you log in to our platform. You can also manually sync your data at any time by clicking the 'Sync Now' button in your account settings.",
                        },
                        {
                            question: "Do you offer a free trial?",
                            answer:
                                "No, the app is completely free to use. We believe in providing value without any cost, so you can enjoy all features without any limitations.",
                        },
                        {
                            question: "Is there a limit to how many activities I can analyze?",
                            answer:
                                "No, you can analyze all your Strava activities without any limitations. Our platform is designed to handle your entire training history.",
                        },
                    ].map((faq, i) => (
                        <FaqItem key={i} i={i} faq={faq}/>
                    ))}
                </div>
            </div>
        </section>
    )
}
