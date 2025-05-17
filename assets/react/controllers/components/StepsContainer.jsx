import StepItem from "./StepItem";

export default function StepsContaienr() {
    return (
        <section className="bg-gradient-to-br from-base-200/50 to-base-100 py-24 relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="container relative mx-auto">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                            <span
                                className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-800 font-medium text-sm mb-4">HOW IT WORKS</span>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
                    <p className="mt-4 text-lg text-base-content/70">
                        Get started in minutes and unlock powerful insights from your training data
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                    {[
                        {
                            title: "Connect Your Strava",
                            description: "Securely link your Strava account to import all your activities and training history.",
                            step: "01",
                            color: "bg-gradient-to-br from-orange-400 to-red-500"
                        },
                        {
                            title: "Analyze Your Data",
                            description:
                                "Our platform automatically processes your data to generate insights and recommendations.",
                            step: "02",
                            color: "bg-gradient-to-br from-blue-400 to-indigo-500"
                        },
                        {
                            title: "Improve Your Training",
                            description: "Use the personalized insights to optimize your training and achieve your goals faster.",
                            step: "03",
                            color: "bg-gradient-to-br from-green-400 to-emerald-500"
                        },
                    ].map((step, i) => (
                        <StepItem step={step} i={i} key={i}/>
                    ))}
                </div>
            </div>
        </section>
    )
}
