import AvatarItem from "./AvatarItem";
import {ArrowRight} from "lucide-react";

export default function AvatarContainer() {
    return (
        <section
            className="bg-gradient-to-r from-orange-500 to-primary py-24 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-pattern opacity-10"></div>
            <div className="container relative mx-auto">
                <div className="mx-auto max-w-3xl text-center">
                            <span
                                className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium text-sm mb-4">READY TO START</span>
                    <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Ready to Transform Your
                        Training?</h2>
                    <p className="mt-6 text-xl opacity-90 max-w-2xl mx-auto">
                        Join athletes who are taking their performance to the next level with our
                        advanced
                        analytics platform.
                    </p>
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <button
                            className="btn btn-lg bg-white text-primary hover:bg-white/90 border-none shadow-xl hover:shadow-white/20 transform hover:-translate-y-1 transition-all"
                            onClick={() => {
                                document.location.href = "/connect/strava"
                            }}
                        >
                            Get Started Now
                            <ArrowRight className="h-5 w-5 ml-1"/>
                        </button>
                        <button
                            className="btn btn-lg bg-transparent border-2 border-white/80 text-white hover:bg-white/10 transform hover:-translate-y-1 transition-all"
                            onClick={() => {
                                document.location.href = "/connect/strava"
                            }}>
                            Learn More
                        </button>
                    </div>
                    <div className="mt-12 flex items-center justify-center gap-4">
                        <div className="flex -space-x-3">
                            {[...Array(4)].map((_, i) => (
                                <AvatarItem key={i} i={i}/>
                            ))}
                        </div>
                        <p className="text-sm font-medium">Join athletes already using our platform</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
