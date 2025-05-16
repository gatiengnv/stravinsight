import QuoteItem from "./QuoteItem";

export default function QuotesContainer() {
    return (
        <section className="py-20 bg-gradient-to-b from-base-100 to-orange-50/30">
            <div className="container">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                            <span
                                className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-800 font-medium text-sm mb-4">TESTIMONIALS</span>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" id={"testimonials"}>What
                        Athletes Say</h2>
                    <p className="mt-4 text-lg text-base-content/70">
                        Join thousands of athletes who have transformed their training with our platform
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            quote:
                                "The race prediction feature is incredibly accurate. It helped me set realistic goals for my marathon and nail my pacing strategy.",
                            name: "Sarah Johnson",
                            title: "Marathon Runner",
                            avatar: "/img/person/1.jpeg?height=80&width=80",
                        },
                        {
                            quote:
                                "I've been using Strava for years, but this takes my analysis to a whole new level. The heart rate zone insights have completely changed how I train.",
                            name: "Michael Chen",
                            title: "Triathlete",
                            avatar: "/img/person/2.jpeg?height=80&width=80",
                        },
                        {
                            quote:
                                "As a cycling coach, I recommend this to all my athletes. The detailed metrics and visualizations make it easy to track progress and identify areas for improvement.",
                            name: "Emma Rodriguez",
                            title: "Cycling Coach",
                            avatar: "/img/person/3.jpeg?height=80&width=80",
                        },
                    ].map((testimonial, i) => (
                        <QuoteItem i={i} testimonial={testimonial} key={i}/>
                    ))}
                </div>
            </div>
        </section>
    )
}
