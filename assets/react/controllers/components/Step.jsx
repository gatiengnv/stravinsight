import React from "react";

export default function Step({title, description, children}) {
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <p className="mb-4">{description}</p>

            {children}
        </div>
    )
}
