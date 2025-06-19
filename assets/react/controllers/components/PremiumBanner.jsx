import {ArrowRight} from "lucide-react";

export default function PremiumBanner() {
    return (
        <section
            className="relative overflow-hidden bg-gradient-to-b from-orange-50 via-orange-100/30 to-base-100 py-24 md:py-36 mx-auto">
            <div className="absolute top-0 left-0 w-full h-full">
                <div
                    className="absolute opacity-20 -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary to-orange-300 rounded-full blur-3xl"></div>
                <div
                    className="absolute opacity-10 top-60 -left-20 w-72 h-72 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl"></div>
            </div>

            <div className="container relative flex flex-col items-center text-center mx-auto">
                        <span
                            className="bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-sm font-semibold mb-8 shadow-sm animate-pulse">Optimize Your Training</span>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                    Elevate Your <span className="text-primary drop-shadow-lg relative">
                                Training
                                <span className="absolute bottom-0 left-0 w-full h-2 bg-primary/30 rounded-full"></span>
                            </span>
                </h1>
                <p className="mt-6 max-w-2xl text-lg text-base-content/90 md:text-xl font-medium leading-relaxed">
                    Advanced analytics and insights for serious athletes. Transform your Strava data into
                    actionable training intelligence.
                </p>
                <div className="mt-8 w-48 animate-bounce">
                    <img alt={"Logo"} src={"img/strava.png"} className="drop-shadow-xl"/>
                </div>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <button
                        className="btn btn-primary btn-lg shadow-xl hover:shadow-primary/50 transform hover:-translate-y-1 transition-all"
                        onClick={() => {
                            document.location.href = "/connect/strava"
                        }}>
                        Get Started For Free
                        <ArrowRight className="h-5 w-5 ml-1 animate-pulse"/>
                    </button>
                    <button
                        className="btn glass btn-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transform hover:-translate-y-1 transition-all">
                        View Demo
                    </button>
                </div>
                <div
                    className="mt-16 w-full max-w-5xl overflow-hidden rounded-2xl border shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
                    <div className="relative aspect-[16/9]">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: "url('/img/dashboard.png')",
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                        <div className="absolute bottom-8 left-8 right-8 flex flex-col items-start gap-4">
                            <h3 className="text-2xl font-bold text-white drop-shadow-md">Comprehensive
                                Dashboard</h3>
                            <p className="text-white/90 drop-shadow-md">
                                Get a complete overview of your training progress and performance metrics
                            </p>
                            <a className="btn btn-sm btn-primary mt-2">Discover More</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
