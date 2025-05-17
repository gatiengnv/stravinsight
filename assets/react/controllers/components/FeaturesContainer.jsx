import {BarChart2, Clock, Compass, Heart, MapPin, Zap} from "lucide-react";
import FeatureItem from "./FeatureItem";

export default function FeaturesContainer() {
    return (

        <section className="py-20 relative overflow-hidden">
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="container relative mx-auto">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                            <span
                                className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-800 font-medium text-sm mb-4">FEATURES</span>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" id={"features"}>Powerful
                        Features for Athletes</h2>
                    <p className="mt-4 text-lg text-base-content/70">
                        Everything you need to analyze, track, and improve your performance
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            title: "Advanced Analytics",
                            description:
                                "Deep dive into your performance data with advanced metrics and visualizations that go beyond what Strava offers.",
                            icon: BarChart2,
                            color: "from-orange-400 to-red-500"
                        },
                        {
                            title: "Training Predictions",
                            description:
                                "Get accurate race time predictions based on your training history and performance trends.",
                            icon: Clock,
                            color: "from-blue-400 to-indigo-500"
                        },
                        {
                            title: "Interactive Maps",
                            description:
                                "Visualize your activities with detailed heatmaps and route analysis to discover new training grounds.",
                            icon: MapPin,
                            color: "from-green-400 to-emerald-500"
                        },
                        {
                            title: "Performance Tracking",
                            description:
                                "Track your progress over time with customizable metrics and goals tailored to your training plan.",
                            icon: Zap,
                            color: "from-yellow-400 to-amber-500"
                        },
                        {
                            title: "Heart Rate Analysis",
                            description:
                                "Understand your cardiovascular fitness with detailed heart rate zone analysis and trends.",
                            icon: Heart,
                            color: "from-pink-400 to-rose-500"
                        },
                        {
                            title: "Route Discovery",
                            description:
                                "Discover popular routes in your area and get recommendations based on your preferences.",
                            icon: Compass,
                            color: "from-purple-400 to-violet-500"
                        },
                    ].map((feature, i) => (
                        <FeatureItem key={i} feature={feature}/>
                    ))}
                </div>
            </div>
        </section>
    );
}
