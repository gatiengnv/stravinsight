export default function FeatureItem({feature}) {
    return (
        <div
            className="card border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-base-100">
            <div className="card-body">
                <div
                    className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white"/>
                </div>
                <h3 className="card-title text-xl">{feature.title}</h3>
                <p className="text-base-content/70">{feature.description}</p>
                <div className="card-actions justify-end mt-4">
                    <button className="btn btn-sm btn-ghost text-primary">Learn more →
                    </button>
                </div>
            </div>
        </div>
    );
}
