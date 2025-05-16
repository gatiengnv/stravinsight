import React from "react"

export default function MarketingLayout({children}) {
    return (
        <div className="min-h-screen bg-base-100" data-theme="light">
            {children}
        </div>
    )
}
