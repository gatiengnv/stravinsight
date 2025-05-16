import {ArrowRight} from "lucide-react";

export default function StepItem({step, i}) {
    return (
        <div key={i}
             className="relative transform hover:-translate-y-2 transition-all duration-300">
            <div className="absolute -left-4 top-0 text-8xl font-bold text-base-content/5">
                {step.step}
            </div>
            <div className="card relative z-10 h-full border-none bg-base-100 shadow-xl">
                <div className="card-body">
                    <div
                        className={`h-2 w-16 rounded-full mb-4 ${step.color.replace('bg-gradient-to-br', 'bg-gradient-to-r')}`}></div>
                    <h3 className="card-title text-2xl">{step.title}</h3>
                    <p className="text-base-content/70">{step.description}</p>
                    <div className="card-actions mt-4">
                        <button className="btn btn-circle btn-sm btn-primary">
                            <ArrowRight className="h-4 w-4"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
